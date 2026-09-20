REVOKE ALL ON FUNCTION public.sync_feature_idea_votes() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- get_my_votes stays callable (the public feature board needs it), but it must
-- never be usable to enumerate other people's voter keys.
REVOKE ALL ON FUNCTION public.get_my_votes(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_my_votes(text) TO anon, authenticated;