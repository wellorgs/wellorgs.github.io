import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email()
  .max(254)
  .regex(/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i, "Invalid email address");

export const joinWaitlist = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        email: emailSchema,
        name: z.string().trim().min(1, "Name is required").max(80),
        phone: z.string().trim().max(30).optional().default(""),
        /** Optional: which pricing plan the visitor clicked before joining. */
        plan: z.string().trim().max(40).optional().default(""),
        /** Optional: first-touch attribution, e.g. "linkedin/social" or "referral:google.com". */
        source: z.string().trim().max(80).optional().default(""),
        /** Honeypot — must stay empty. */
        company: z.string().max(100).optional().default(""),
        /** Milliseconds between form render and submit. */
        elapsedMs: z.number().int().min(0).max(86_400_000).optional().default(0),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { getRequestHeader } = await import("@tanstack/react-start/server");
    const {
      clientIpFrom,
      hashIp,
      isDisposableEmail,
      looksSuspicious,
      MIN_FILL_MS,
      RATE_LIMIT,
      RATE_WINDOW_MS,
    } = await import("./waitlist.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1. Honeypot + too-fast submission: pretend success, store nothing.
    if (data.company.trim() !== "" || data.elapsedMs < MIN_FILL_MS) {
      return { email: data.email, alreadyJoined: false };
    }

    // 2. Disposable-domain block.
    if (isDisposableEmail(data.email)) {
      throw new Error("Please use a permanent email address.");
    }

    // 2b. Only accept real, verified mailbox domains.
    const { checkEmailDomain } = await import("./email-domains");
    const domainCheck = checkEmailDomain(data.email);
    if (!domainCheck.ok) {
      throw new Error(domainCheck.message);
    }


    // 2c. Name and phone must look real.
    const { cleanName, cleanPhone } = await import("./waitlist-validation");
    const name = cleanName(data.name);
    if (!name) throw new Error("INPUT:Please enter your name in English letters.");
    let phone = "";
    if (data.phone) {
      const p = cleanPhone(data.phone);
      if (!p) throw new Error("INPUT:Please enter a valid phone number, or leave it blank.");
      phone = p;
    }

    // 3. Per-IP rate limit.
    const headers = new Headers();
    for (const name of ["cf-connecting-ip", "x-real-ip", "x-forwarded-for"] as const) {
      const value = getRequestHeader(name as never);
      if (value) headers.set(name, value);
    }
    const ipHash = hashIp(clientIpFrom(headers));
    const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();

    const { count } = await supabaseAdmin
      .from("waitlist_attempts")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since);

    if ((count ?? 0) >= RATE_LIMIT) {
      throw new Error("Too many attempts. Please try again in a few minutes.");
    }

    await supabaseAdmin.from("waitlist_attempts").insert({ ip_hash: ipHash });
    // Opportunistic cleanup of old attempt rows.
    await supabaseAdmin
      .from("waitlist_attempts")
      .delete()
      .lt("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    // 3b. The email domain must be able to receive mail.
    const { domainCanReceiveMail } = await import("./waitlist.server");
    if (!(await domainCanReceiveMail(data.email.split("@")[1] ?? ""))) {
      throw new Error("INPUT:That email domain cannot receive mail. Please check the address.");
    }

    // 4. Save (unique index handles duplicates).
    const flagged = looksSuspicious(data.email);
    const row = { email: data.email, name, phone: phone || null, plan: data.plan || null, flagged };
    let { error } = await supabaseAdmin.from("waitlist_signups").insert({ ...row, source: data.source || null });
    // ponytail: the "source" column may not exist yet on older deployments (run supabase/add-source-column.sql).
    // Retry without it once so a missing migration never breaks a real signup.
    if (error?.code === "PGRST204") {
      ({ error } = await supabaseAdmin.from("waitlist_signups").insert(row));
    }

    // 23505 = unique violation: already on the list, treat as success
    if (error && error.code !== "23505") {
      console.error("[waitlist] insert failed", error);
      throw new Error("Could not save your email. Please try again.");
    }

    if (!error) {
      const { appendToSheet } = await import("./waitlist.server");
      await appendToSheet({ name, email: data.email, phone, plan: data.plan, source: data.source, flagged });
    }

    return { email: data.email, alreadyJoined: Boolean(error) };
  });

export const checkWaitlist = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ email: emailSchema }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("waitlist_signups")
      .select("email")
      .eq("email", data.email)
      .maybeSingle();

    if (error) {
      console.error("[waitlist] check failed", error);
      return { joined: false };
    }
    return { joined: Boolean(row) };
  });
