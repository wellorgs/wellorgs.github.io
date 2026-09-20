DROP POLICY IF EXISTS "Anyone can read votes" ON public.feature_votes;
REVOKE SELECT ON public.feature_votes FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_my_votes(_voter_key text)
RETURNS TABLE (idea_id uuid)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT fv.idea_id
  FROM public.feature_votes fv
  WHERE char_length(_voter_key) BETWEEN 8 AND 64
    AND fv.voter_key = _voter_key
$$;

GRANT EXECUTE ON FUNCTION public.get_my_votes(text) TO anon, authenticated;