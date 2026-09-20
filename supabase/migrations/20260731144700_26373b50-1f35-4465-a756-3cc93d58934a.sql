CREATE TABLE public.feature_ideas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  detail text NOT NULL,
  category text NOT NULL CHECK (category IN ('Care','Health','AI','Family','Safety')),
  status text NOT NULL DEFAULT 'exploring' CHECK (status IN ('planned','exploring','in-progress','shipped')),
  author text NOT NULL DEFAULT 'Anonymous',
  votes integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.feature_votes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id uuid NOT NULL REFERENCES public.feature_ideas(id) ON DELETE CASCADE,
  voter_key text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (idea_id, voter_key)
);

CREATE INDEX feature_votes_idea_idx ON public.feature_votes (idea_id);

GRANT SELECT, INSERT ON public.feature_ideas TO anon, authenticated;
GRANT ALL ON public.feature_ideas TO service_role;
GRANT SELECT, INSERT ON public.feature_votes TO anon, authenticated;
GRANT ALL ON public.feature_votes TO service_role;

ALTER TABLE public.feature_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read ideas" ON public.feature_ideas FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can submit an idea" ON public.feature_ideas FOR INSERT TO anon, authenticated WITH CHECK (char_length(title) BETWEEN 4 AND 120 AND char_length(detail) BETWEEN 4 AND 600 AND votes = 0);
CREATE POLICY "Anyone can read votes" ON public.feature_votes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can vote once" ON public.feature_votes FOR INSERT TO anon, authenticated WITH CHECK (char_length(voter_key) BETWEEN 8 AND 64);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_feature_ideas_updated_at BEFORE UPDATE ON public.feature_ideas
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.sync_feature_idea_votes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.feature_ideas
  SET votes = (SELECT count(*) FROM public.feature_votes v WHERE v.idea_id = NEW.idea_id) + COALESCE((SELECT seed_votes FROM public.feature_idea_seed s WHERE s.idea_id = NEW.idea_id), 0)
  WHERE id = NEW.idea_id;
  RETURN NEW;
END;
$$;

CREATE TABLE public.feature_idea_seed (
  idea_id uuid NOT NULL PRIMARY KEY REFERENCES public.feature_ideas(id) ON DELETE CASCADE,
  seed_votes integer NOT NULL DEFAULT 0
);
GRANT SELECT ON public.feature_idea_seed TO anon, authenticated;
GRANT ALL ON public.feature_idea_seed TO service_role;
ALTER TABLE public.feature_idea_seed ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read seed counts" ON public.feature_idea_seed FOR SELECT TO anon, authenticated USING (true);

CREATE TRIGGER sync_votes_after_insert AFTER INSERT ON public.feature_votes
FOR EACH ROW EXECUTE FUNCTION public.sync_feature_idea_votes();

INSERT INTO public.feature_ideas (slug, title, detail, category, status, author, votes) VALUES
('fall-detection-with-automatic-sos-1','Fall detection with automatic SOS','If mum falls and can''t reach her phone, the app should detect it and start the emergency countdown on its own.','Safety','in-progress','Arjun M.',1284),
('pill-box-photo-scan-to-build-the-schedule-2','Pill box photo scan to build the schedule','Point the camera at the strip or prescription and let the app fill in name, dose and timing automatically.','Care','planned','Priya S.',967),
('voice-reminders-in-my-parent-s-own-language-3','Voice reminders in my parent''s own language','Spoken reminders in Tamil, Marathi and Bengali — reading English text is the biggest barrier for my dad.','AI','in-progress','Deepa R.',842),
('shared-sibling-notes-on-each-parent-4','Shared sibling notes on each parent','So my brother and I don''t repeat the same doctor question twice. A simple shared timeline of notes.','Family','exploring','Nikhil T.',611),
('blood-pressure-cuff-glucometer-sync-5','Blood pressure cuff & glucometer sync','Auto-import readings instead of typing them in every morning.','Health','planned','Meera K.',574),
('one-tap-video-call-with-a-huge-button-6','One-tap video call with a huge button','A single giant tile per family member on the parent home screen. No menus, no contact list.','Family','shipped','Sanjay P.',498),
('weekly-wellness-summary-sent-to-whatsapp-7','Weekly wellness summary sent to WhatsApp','A short Sunday digest: meds taken, steps, sleep, anything that needs attention.','Health','exploring','Ritu A.',421),
('caregiver-helper-access-with-limited-permissions-8','Caregiver / helper access with limited permissions','Our day nurse should be able to mark medicines as given without seeing private family messages.','Care','planned','Farhan Q.',356),
('ai-companion-that-just-chats-when-she-s-lonely-9','AI companion that just chats when she''s lonely','Not tasks — conversation. Ask about her day, remember what she said yesterday.','AI','exploring','Lakshmi V.',298),
('appointment-prep-checklist-with-what-to-carry-10','Appointment prep checklist with what to carry','Reports, fasting instructions, insurance card — as a tick list before leaving home.','Care','shipped','Kabir N.',247);

INSERT INTO public.feature_idea_seed (idea_id, seed_votes)
SELECT id, votes FROM public.feature_ideas;