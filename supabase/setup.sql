-- Assisty AI website: final schema (paste into Supabase SQL Editor and Run once).
-- Schema only. No seed data. Feature categories are Assisty's own.

-- Waitlist ---------------------------------------------------------------
CREATE TABLE public.waitlist_signups (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  name text,
  phone text,
  plan text,
  source text,
  flagged boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.waitlist_signups TO anon, authenticated;
GRANT ALL ON public.waitlist_signups TO service_role;
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can join the waitlist" ON public.waitlist_signups
  FOR INSERT TO anon, authenticated
  WITH CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 254);

CREATE TABLE public.waitlist_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX waitlist_attempts_ip_hash_created_at_idx ON public.waitlist_attempts (ip_hash, created_at DESC);
GRANT ALL ON public.waitlist_attempts TO service_role;
ALTER TABLE public.waitlist_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No client access to waitlist attempts" ON public.waitlist_attempts
  FOR SELECT TO authenticated USING (false);

-- Feature board ----------------------------------------------------------
CREATE TABLE public.feature_ideas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  detail text NOT NULL,
  category text NOT NULL CHECK (category IN ('Calls','Summaries','Escalation','Languages','Integrations')),
  status text NOT NULL DEFAULT 'exploring' CHECK (status IN ('planned','exploring','in-progress','shipped')),
  author text NOT NULL DEFAULT 'Anonymous',
  votes integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.feature_votes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id uuid NOT NULL REFERENCES public.feature_ideas(id) ON DELETE CASCADE,
  voter_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (idea_id, voter_key)
);
CREATE INDEX feature_votes_idea_idx ON public.feature_votes (idea_id);

CREATE TABLE public.feature_idea_seed (
  idea_id uuid NOT NULL PRIMARY KEY REFERENCES public.feature_ideas(id) ON DELETE CASCADE,
  seed_votes integer NOT NULL DEFAULT 0
);

GRANT SELECT, INSERT ON public.feature_ideas TO anon, authenticated;
GRANT ALL ON public.feature_ideas TO service_role;
GRANT INSERT ON public.feature_votes TO anon, authenticated;
GRANT ALL ON public.feature_votes TO service_role;
GRANT SELECT ON public.feature_idea_seed TO anon, authenticated;
GRANT ALL ON public.feature_idea_seed TO service_role;

ALTER TABLE public.feature_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_idea_seed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read ideas" ON public.feature_ideas FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can submit an idea" ON public.feature_ideas FOR INSERT TO anon, authenticated
  WITH CHECK (char_length(title) BETWEEN 4 AND 120 AND char_length(detail) BETWEEN 4 AND 600 AND votes = 0);
CREATE POLICY "Anyone can vote once" ON public.feature_votes FOR INSERT TO anon, authenticated
  WITH CHECK (char_length(voter_key) BETWEEN 8 AND 64);
CREATE POLICY "Anyone can read seed counts" ON public.feature_idea_seed FOR SELECT TO anon, authenticated USING (true);

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER update_feature_ideas_updated_at BEFORE UPDATE ON public.feature_ideas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE FUNCTION public.sync_feature_idea_votes() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.feature_ideas
  SET votes = (SELECT count(*) FROM public.feature_votes v WHERE v.idea_id = NEW.idea_id)
            + COALESCE((SELECT seed_votes FROM public.feature_idea_seed s WHERE s.idea_id = NEW.idea_id), 0)
  WHERE id = NEW.idea_id;
  RETURN NEW;
END;
$$;
CREATE TRIGGER sync_votes_after_insert AFTER INSERT ON public.feature_votes
  FOR EACH ROW EXECUTE FUNCTION public.sync_feature_idea_votes();

REVOKE ALL ON FUNCTION public.sync_feature_idea_votes() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

ALTER TABLE public.feature_ideas REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.feature_ideas;
