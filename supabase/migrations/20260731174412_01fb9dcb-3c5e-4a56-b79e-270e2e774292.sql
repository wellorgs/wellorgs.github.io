DELETE FROM public.feature_votes WHERE created_at > now() - interval '2 hours';

UPDATE public.feature_ideas i
SET votes = COALESCE((SELECT s.seed_votes FROM public.feature_idea_seed s WHERE s.idea_id = i.id), 0)
          + (SELECT count(*) FROM public.feature_votes v WHERE v.idea_id = i.id);