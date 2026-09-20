DELETE FROM public.feature_votes WHERE voter_key = 'v_testcurl123456';

UPDATE public.feature_idea_seed SET seed_votes = CASE seed_votes
  WHEN 1284 THEN 85 WHEN 967 THEN 73 WHEN 842 THEN 68 WHEN 611 THEN 59 WHEN 574 THEN 52
  WHEN 498 THEN 46 WHEN 421 THEN 38 WHEN 356 THEN 31 WHEN 298 THEN 24 WHEN 247 THEN 17
  ELSE LEAST(seed_votes, 90) END
WHERE seed_votes > 99;

UPDATE public.feature_ideas i
SET votes = COALESCE((SELECT s.seed_votes FROM public.feature_idea_seed s WHERE s.idea_id = i.id), 0)
          + (SELECT count(*) FROM public.feature_votes v WHERE v.idea_id = i.id);