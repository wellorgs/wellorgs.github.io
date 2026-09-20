import { createFileRoute } from "@tanstack/react-router";

// Read-only CSV feed for Google Sheets: =IMPORTDATA("https://assistyai.in/api/waitlist.csv?key=<WAITLIST_SHEET_KEY>")
// Sheets cannot send headers, so the key rides in the URL. It is a separate secret from the admin passcode
// (rotate it in Cloudflare if the sheet is ever shared). Wrong keys get a 404 and are locked out after 5 misses.
export const Route = createFileRoute("/api/waitlist.csv")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const notFound = () => new Response("Not found", { status: 404, headers: { "cache-control": "no-store" } });
        const expected = process.env["WAITLIST_SHEET_KEY"];
        if (!expected || expected.length < 16) return notFound();

        const { createHash, timingSafeEqual } = await import("node:crypto");
        const { clientIpFrom, hashIp, isLockedOut, waitlistCsv } = await import("../lib/waitlist.server");
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const lockKey = `sheet:${hashIp(clientIpFrom(request.headers))}`;
        if (await isLockedOut(supabaseAdmin, lockKey)) return plain("Too many wrong keys. Try again in 15 minutes.", 429);

        const given = new URL(request.url).searchParams.get("key") ?? "";
        const a = createHash("sha256").update(given, "utf8").digest();
        const b = createHash("sha256").update(expected, "utf8").digest();
        if (!timingSafeEqual(a, b)) {
          await supabaseAdmin.from("waitlist_attempts").insert({ ip_hash: lockKey });
          return notFound();
        }

        const { data: rows, error } = await supabaseAdmin
          .from("waitlist_signups")
          .select("name, email, phone, flagged, created_at")
          .order("created_at", { ascending: true });
        if (error) return new Response("Error", { status: 500, headers: { "cache-control": "no-store" } });

        return new Response(waitlistCsv(rows ?? []), {
          headers: {
            "content-type": "text/csv; charset=utf-8",
            "cache-control": "no-store",
            "x-robots-tag": "noindex, nofollow",
          },
        });
      },
    },
  },
});
