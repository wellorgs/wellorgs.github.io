import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const voterKey = z.string().trim().min(8).max(64);

/** Returns this anonymous browser key's votes: idea id -> 1 (up) or -1 (down). */
export const getMyVotes = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ voterKey }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("feature_votes")
      .select("idea_id,value")
      .eq("voter_key", data.voterKey);

    if (error) {
      console.error("[board] votes lookup failed", error);
      return { votes: {} as Record<string, number> };
    }
    return {
      votes: Object.fromEntries((rows ?? []).map((r) => [r.idea_id as string, Number(r.value)])) as Record<string, number>,
    };
  });

/** Sets, changes (1 / -1) or removes (0) this browser's vote on one idea. */
export const setVote = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({ ideaId: z.string().uuid(), voterKey, value: z.union([z.literal(1), z.literal(-1), z.literal(0)]) })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const votes = supabaseAdmin.from("feature_votes");
    const { error } =
      data.value === 0
        ? await votes.delete().eq("idea_id", data.ideaId).eq("voter_key", data.voterKey)
        : await votes.upsert(
            { idea_id: data.ideaId, voter_key: data.voterKey, value: data.value },
            { onConflict: "idea_id,voter_key" },
          );
    if (error) {
      console.error("[board] vote failed", error);
      throw new Error("vote failed");
    }
    return { ok: true };
  });
