import { createFileRoute } from "@tanstack/react-router";

// Config check: which waitlist env vars exist at runtime (booleans only, never values).
export const Route = createFileRoute("/api/waitlist.csv")({
  server: {
    handlers: {
      GET: async () => {
        const has = (k: string) => Boolean(process.env[k]);
        return Response.json(
          {
            SUPABASE_SERVICE_ROLE_KEY: has("SUPABASE_SERVICE_ROLE_KEY"),
            WAITLIST_ADMIN_PASSCODE: has("WAITLIST_ADMIN_PASSCODE"),
            WAITLIST_SHEETS_URL: has("WAITLIST_SHEETS_URL"),
            WAITLIST_SHEETS_TOKEN: has("WAITLIST_SHEETS_TOKEN"),
          },
          { headers: { "cache-control": "no-store" } },
        );
      },
    },
  },
});
