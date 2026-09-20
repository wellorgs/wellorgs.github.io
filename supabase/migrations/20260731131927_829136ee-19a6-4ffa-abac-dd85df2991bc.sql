CREATE TABLE public.waitlist_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX waitlist_attempts_ip_hash_created_at_idx
  ON public.waitlist_attempts (ip_hash, created_at DESC);

GRANT ALL ON public.waitlist_attempts TO service_role;

ALTER TABLE public.waitlist_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No client access to waitlist attempts"
  ON public.waitlist_attempts
  FOR SELECT
  TO authenticated
  USING (false);

ALTER TABLE public.waitlist_signups
  ADD COLUMN IF NOT EXISTS flagged boolean NOT NULL DEFAULT false;