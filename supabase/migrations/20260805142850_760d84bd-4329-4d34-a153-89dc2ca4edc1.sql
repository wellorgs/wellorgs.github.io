UPDATE public.feature_ideas SET author='James O.' WHERE slug='fall-detection-with-automatic-sos-1';
UPDATE public.feature_ideas SET author='Sofia R.' WHERE slug='shared-sibling-notes-on-each-parent-4';
UPDATE public.feature_ideas SET author='David L.' WHERE slug='one-tap-video-call-with-a-huge-button-6';
UPDATE public.feature_ideas SET author='Amara N.' WHERE slug='weekly-wellness-summary-sent-to-whatsapp-7';
UPDATE public.feature_ideas SET author='Thomas W.' WHERE slug='appointment-prep-checklist-with-what-to-carry-10';
UPDATE public.feature_ideas SET author='Elena M.' WHERE slug='blood-pressure-cuff-glucometer-sync-5';

INSERT INTO public.feature_ideas (slug, title, detail, category, status, author, votes, created_at) VALUES
('time-zone-aware-alerts-for-family-abroad-11','Time zone aware alerts for family abroad','I am in New Jersey and my parents are in Pune. Alerts should know my local time, stay quiet for routine updates at 3am, and still ring loudly for a real emergency.','Family','in-progress','Rohan K.',71,now() - interval '4 days'),
('pay-for-a-parent-plan-in-usd-aed-or-gbp-12','Pay for a parent plan in USD, AED or GBP','I live in Dubai and pay for my mother in Chennai. Let me pay in my own currency and keep the parent side free of any payment screen.','Care','planned','Ananya S.',63,now() - interval '9 days'),
('local-care-manager-visit-when-we-cannot-fly-down-13','Local care manager visit when we cannot fly down','A named person near my parents who can check in, go to a hospital visit and call me after. Flying down for every scare is not possible.','Care','exploring','Vikram J.',57,now() - interval '12 days');