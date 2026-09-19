import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/** Escape a value for CSV (RFC 4180) and neutralise spreadsheet formula injection. */
function csvCell(value: string | null | undefined) {
  let v = value ?? "";
  if (/^[=+\-@\t\r]/.test(v)) v = `'${v}`;
  return `"${v.replace(/"/g, '""')}"`;
}

export const exportWaitlistCsv = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ passcode: z.string().min(1).max(200) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { createHash, timingSafeEqual } = await import("node:crypto");
    const expected = process.env["WAITLIST_ADMIN_PASSCODE"];
    if (!expected) throw new Error("Export is not configured.");

    const a = createHash("sha256").update(data.passcode, "utf8").digest();
    const b = createHash("sha256").update(expected, "utf8").digest();
    if (!timingSafeEqual(a, b)) {
      return { ok: false as const };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("waitlist_signups")
      .select("name, email, phone, flagged, created_at")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[waitlist] export failed", error);
      throw new Error("Could not read signups. Please try again.");
    }

    const header = ["Name", "Email", "Phone", "Flagged", "Joined at"];
    const lines = [header.map(csvCell).join(",")];
    for (const row of rows ?? []) {
      lines.push(
        [
          csvCell(row.name),
          csvCell(row.email),
          csvCell(row.phone),
          csvCell(row.flagged ? "yes" : ""),
          csvCell(row.created_at),
        ].join(","),
      );
    }

    return { ok: true as const, csv: lines.join("\r\n"), count: rows?.length ?? 0 };
  });
