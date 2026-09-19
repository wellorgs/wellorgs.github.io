import { createHash } from "node:crypto";

/** Attempts allowed from one visitor inside RATE_WINDOW_MS. */
export const RATE_LIMIT = 5;
export const RATE_WINDOW_MS = 10 * 60 * 1000;
/** A human needs at least this long to read the field and type an email. */
export const MIN_FILL_MS = 1500;

const SALT = "myfamily-waitlist-v1";

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
