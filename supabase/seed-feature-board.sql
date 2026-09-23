-- Seeds the public feature board with the 12 curated roadmap ideas.
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
  ('send-new-leads-to-my-crm-12', 'Send new leads to my CRM', 'Push caller details and the reason for the call into the tools I already use.', 'Integrations', 'exploring', 'Assisty team', 0)
ON CONFLICT (slug) DO NOTHING;
