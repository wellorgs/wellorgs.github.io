import { createHash } from "node:crypto";

/** Attempts allowed from one visitor inside RATE_WINDOW_MS. */
export const RATE_LIMIT = 5;
export const RATE_WINDOW_MS = 10 * 60 * 1000;
/** A human needs at least this long to read the field and type an email. */
export const MIN_FILL_MS = 1500;

const SALT = "assistyai-waitlist-v1";

export function hashIp(ip: string) {
  return createHash("sha256").update(`${SALT}:${ip}`).digest("hex");
}

/** Best-effort client IP from proxy headers. */
export function clientIpFrom(headers: Headers) {
  const candidates = [
    headers.get("cf-connecting-ip"),
    headers.get("x-real-ip"),
    headers.get("x-forwarded-for")?.split(",")[0],
  ];
  return candidates.find((v) => v && v.trim())?.trim() ?? "unknown";
}

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  "temp-mail.org",
  "yopmail.com",
  "trashmail.com",
  "sharklasers.com",
  "getnada.com",
  "dispostable.com",
  "fakeinbox.com",
  "throwawaymail.com",
  "maildrop.cc",
  "mailnesia.com",
  "spam4.me",
]);

export function isDisposableEmail(email: string) {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  return DISPOSABLE_DOMAINS.has(domain);
}

/** Obvious bot patterns that get silently accepted but flagged. */
export function looksSuspicious(email: string) {
  const local = email.split("@")[0] ?? "";
  return (
    /(https?:|<|>|\s)/.test(email) ||
    local.length > 40 ||
    /(.)\1{6,}/.test(local) ||
    /\d{8,}/.test(local)
  );
}

/**
 * True if the domain can receive mail (has an MX or A record). Uses Cloudflare DNS-over-HTTPS.
 * Fails open on network errors so a DNS hiccup never blocks a real signup.
 * ponytail: proves the domain exists, not that the mailbox does; real proof needs a confirmation email.
 */
export async function domainCanReceiveMail(domain: string): Promise<boolean> {
  try {
    for (const [type, code] of [["MX", 15], ["A", 1]] as const) {
      const res = await fetch(
        `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`,
        { headers: { accept: "application/dns-json" }, signal: AbortSignal.timeout(2500) },
      );
      if (!res.ok) return true;
      const json = (await res.json()) as { Status: number; Answer?: { type: number }[] };
      if (json.Status === 3) return false; // NXDOMAIN
      if (json.Answer?.some((a) => a.type === code)) return true;
    }
    return false;
  } catch {
    return true;
  }
}

/** Escape a value for CSV (RFC 4180) and neutralise spreadsheet formula injection. */
function csvCell(value: string | null | undefined) {
  let v = value ?? "";
  if (/^[=+\-@\t\r]/.test(v)) v = `'${v}`;
  return `"${v.replace(/"/g, '""')}"`;
}

type SignupRow = { name: string | null; email: string; phone: string | null; flagged: boolean | null; created_at: string };

export function waitlistCsv(rows: SignupRow[]) {
  const lines = [["Name", "Email", "Phone", "Flagged", "Joined at"].map(csvCell).join(",")];
  for (const r of rows) {
    lines.push([csvCell(r.name), csvCell(r.email), csvCell(r.phone), csvCell(r.flagged ? "yes" : ""), csvCell(r.created_at)].join(","));
  }
  return lines.join("\r\n");
}

/** Failed-guess lockout shared by the admin export and the Sheets feed: 5 misses per IP per 15 minutes. */
export async function isLockedOut(
  admin: typeof import("@/integrations/supabase/client.server").supabaseAdmin,
  key: string,
) {
  const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const { count } = await admin
    .from("waitlist_attempts")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", key)
    .gte("created_at", since);
  return (count ?? 0) >= 5;
}

/**
 * Append a new signup to the Google Sheet via its Apps Script web app (see supabase/../docs in README).
 * Never throws and never delays a signup for long: a Sheets failure must not lose or block the waitlist entry
 * (the row is already safe in Supabase).
 */
export async function appendToSheet(row: { name: string; email: string; phone: string; plan: string; flagged: boolean }) {
  const url = process.env["WAITLIST_SHEETS_URL"];
  const token = process.env["WAITLIST_SHEETS_TOKEN"];
  if (!url || !token) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: JSON.stringify({ token, at: new Date().toISOString(), ...row }),
      signal: AbortSignal.timeout(4000),
    });
  } catch (error) {
    console.error("[waitlist] sheet append failed", error);
  }
}
