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

-- ---------------------------------------------------------------------------
-- Seeds the public feature board with the 26 curated roadmap ideas.
-- Run once in the Supabase SQL editor (project cgojypyldzcfigshrtrx). Safe to re-run: existing slugs are skipped.
-- Slugs match requestSlug() in src/lib/feature-requests.ts so the detail pages line up.

INSERT INTO public.feature_ideas (slug, title, detail, category, status, author, votes) VALUES
  ('let-callers-book-a-time-with-me-1', 'Let callers book a time with me', 'Assisty offers the caller a slot from my calendar and sends me the confirmation with the summary.', 'Calls', 'exploring', 'Assisty team', 0),
  ('transfer-the-live-call-to-me-2', 'Transfer the live call to me', 'If a caller says they need me personally, Assisty rings me and hands the call over without dropping it.', 'Calls', 'planned', 'Assisty team', 0),
  ('spam-and-sales-call-filtering-3', 'Spam and sales call filtering', 'Recognise cold sales calls and spam, end them politely, and keep them out of my summaries.', 'Calls', 'planned', 'Assisty team', 0),
  ('greeting-in-my-own-voice-4', 'Greeting in my own voice', 'Let me record a short greeting so callers hear me first, then Assisty takes over.', 'Calls', 'exploring', 'Assisty team', 0),
  ('searchable-call-history-5', 'Searchable call history', 'Search past calls by name, number or what was said, and jump straight to the recording.', 'Summaries', 'planned', 'Assisty team', 0),
  ('shared-inbox-for-a-front-desk-6', 'Shared inbox for a front desk', 'A clinic or office team should see the same call summaries and mark them handled.', 'Summaries', 'exploring', 'Assisty team', 0),
  ('summaries-on-whatsapp-too-7', 'Summaries on WhatsApp too', 'A short WhatsApp message after each call, in addition to the app push notification.', 'Summaries', 'in-progress', 'Assisty team', 0),
  ('quiet-hours-for-escalation-8', 'Quiet hours for escalation', 'Set hours when only my priority contacts can reach me by phone, and everything else waits for the summary.', 'Escalation', 'exploring', 'Assisty team', 0),
  ('different-priority-lists-by-number-9', 'Different priority lists by number', 'Family on my personal line, key clients on my business line, each with their own retry rules.', 'Escalation', 'exploring', 'Assisty team', 0),
  ('more-regional-languages-and-dialects-10', 'More regional languages and dialects', 'Better handling of mixed speech like Hinglish, and the smaller regional languages my callers use.', 'Languages', 'in-progress', 'Assisty team', 0),
  ('calendar-check-before-answering-11', 'Calendar check before answering', 'Assisty checks my calendar so it can say when I am free to call back.', 'Integrations', 'exploring', 'Assisty team', 0),
  ('send-new-leads-to-my-crm-12', 'Send new leads to my CRM', 'Push caller details and the reason for the call into the tools I already use.', 'Integrations', 'exploring', 'Assisty team', 0),
  ('take-orders-and-bookings-by-phone-13', 'Take orders and bookings by phone', 'Assisty collects the details for an order or booking and sends me a ready-to-confirm summary.', 'Calls', 'exploring', 'Assisty team', 0),
  ('different-greeting-for-each-number-14', 'Different greeting for each number', 'A different opening line for my clinic line, my personal line and my business line.', 'Calls', 'planned', 'Assisty team', 0),
  ('warm-handover-with-call-context-15', 'Warm handover with call context', 'When I take over a live call, Assisty first tells me who it is and why they called.', 'Calls', 'exploring', 'Assisty team', 0),
  ('daily-digest-of-missed-calls-16', 'Daily digest of missed calls', 'One short message each evening with every call I missed, sorted by what needs a reply.', 'Summaries', 'planned', 'Assisty team', 0),
  ('follow-up-reminders-from-calls-17', 'Follow-up reminders from calls', 'If a caller asks for a callback, Assisty adds a reminder for me with the details.', 'Summaries', 'exploring', 'Assisty team', 0),
  ('tag-and-sort-calls-by-topic-18', 'Tag and sort calls by topic', 'Calls labelled as billing, appointment, sales or support, so I can filter my call list.', 'Summaries', 'exploring', 'Assisty team', 0),
  ('always-reach-me-for-certain-words-19', 'Always reach me for certain words', 'Tell Assisty names and keywords that should always get through to me straight away.', 'Escalation', 'planned', 'Assisty team', 0),
  ('repeat-caller-alert-20', 'Repeat-caller alert', 'If the same number calls several times in a row, treat it as more urgent.', 'Escalation', 'exploring', 'Assisty team', 0),
  ('backup-contact-in-an-emergency-21', 'Backup contact in an emergency', 'If I can''t be reached in an emergency, Assisty tries a second person I choose.', 'Escalation', 'planned', 'Assisty team', 0),
  ('choose-my-summary-language-22', 'Choose my summary language', 'Get every summary in my own language, whatever language the caller spoke.', 'Languages', 'in-progress', 'Assisty team', 0),
  ('better-with-indian-names-and-places-23', 'Better with Indian names and places', 'Handle names, addresses and landmarks spoken aloud in different accents more accurately.', 'Languages', 'exploring', 'Assisty team', 0),
  ('summaries-to-email-or-slack-24', 'Summaries to email or Slack', 'Send each call summary to my email or a Slack channel as well as the app.', 'Integrations', 'exploring', 'Assisty team', 0),
  ('whatsapp-confirmation-to-the-caller-25', 'WhatsApp confirmation to the caller', 'After a call, send the caller a short confirmation message on WhatsApp.', 'Integrations', 'exploring', 'Assisty team', 0),
  ('zapier-and-webhooks-26', 'Zapier and webhooks', 'Trigger my own automations from every call, without writing code.', 'Integrations', 'exploring', 'Assisty team', 0)
ON CONFLICT (slug) DO NOTHING;
