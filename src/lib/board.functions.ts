import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/** Returns the idea ids this anonymous browser key has voted for. */
export const getMyVotes = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ voterKey: z.string().trim().min(8).max(64) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("feature_votes")
      .select("idea_id")
      .eq("voter_key", data.voterKey);

    if (error) {
      console.error("[board] votes lookup failed", error);
      return { votedIds: [] as string[] };
    }
    return { votedIds: (rows ?? []).map((r) => r.idea_id as string) };
  });
