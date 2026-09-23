-- Feature board v2: upvotes AND downvotes, changeable/removable votes.
-- Run once in the Supabase SQL editor (project cgojypyldzcfigshrtrx), BEFORE using the new board code.
-- Votes now go through a server function (service role), so direct anonymous inserts are switched off.

ALTER TABLE public.feature_votes
  ADD COLUMN IF NOT EXISTS value smallint NOT NULL DEFAULT 1 CHECK (value IN (-1, 1));

CREATE OR REPLACE FUNCTION public.sync_feature_idea_votes() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  target uuid := COALESCE(NEW.idea_id, OLD.idea_id);
BEGIN
  UPDATE public.feature_ideas
  SET votes = COALESCE((SELECT sum(v.value) FROM public.feature_votes v WHERE v.idea_id = target), 0)
            + COALESCE((SELECT s.seed_votes FROM public.feature_idea_seed s WHERE s.idea_id = target), 0)
  WHERE id = target;
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS sync_votes_after_insert ON public.feature_votes;
DROP TRIGGER IF EXISTS sync_votes_after_change ON public.feature_votes;
CREATE TRIGGER sync_votes_after_change AFTER INSERT OR UPDATE OR DELETE ON public.feature_votes
  FOR EACH ROW EXECUTE FUNCTION public.sync_feature_idea_votes();

REVOKE ALL ON FUNCTION public.sync_feature_idea_votes() FROM PUBLIC, anon, authenticated;

-- Votes are written only by the server function.
DROP POLICY IF EXISTS "Anyone can vote once" ON public.feature_votes;
REVOKE INSERT, UPDATE, DELETE ON public.feature_votes FROM anon, authenticated;
