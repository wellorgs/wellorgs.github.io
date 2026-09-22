import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const exportWaitlistCsv = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ passcode: z.string().min(1).max(200) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { createHash, timingSafeEqual } = await import("node:crypto");
    const expected = process.env["WAITLIST_ADMIN_PASSCODE"];
    if (!expected) throw new Error("Export is not configured.");

    // Lock out repeated wrong guesses: 5 failures per IP per 15 minutes (reuses the waitlist_attempts table).
    const { getRequestHeader } = await import("@tanstack/react-start/server");
    const { clientIpFrom, hashIp, isLockedOut, waitlistCsv } = await import("./waitlist.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const headers = new Headers();
    for (const name of ["cf-connecting-ip", "x-real-ip", "x-forwarded-for"] as const) {
      const value = getRequestHeader(name as never);
      if (value) headers.set(name, value);
    }
    const key = `admin:${hashIp(clientIpFrom(headers))}`;
    if (await isLockedOut(supabaseAdmin, key)) throw new Error("Too many attempts. Try again in 15 minutes.");

    const a = createHash("sha256").update(data.passcode, "utf8").digest();
    const b = createHash("sha256").update(expected, "utf8").digest();
    if (!timingSafeEqual(a, b)) {
      await supabaseAdmin.from("waitlist_attempts").insert({ ip_hash: key });
      return { ok: false as const };
    }

    const { data: rows, error } = await supabaseAdmin
      .from("waitlist_signups")
      .select("name, email, phone, source, flagged, created_at")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[waitlist] export failed", error);
      throw new Error("Could not read signups. Please try again.");
    }

    return { ok: true as const, csv: waitlistCsv(rows ?? []), count: rows?.length ?? 0 };
  });
