-- Run once in the Supabase SQL Editor (after setup.sql).
-- The website writes signups through its server (service role), so the public key must NOT be able to insert directly.
-- Without this, anyone holding the public key could bypass the form's checks and spam the table.

DROP POLICY IF EXISTS "Anyone can join the waitlist" ON public.waitlist_signups;
REVOKE INSERT ON public.waitlist_signups FROM anon, authenticated;

-- Belt and braces: shape checks on new rows (NOT VALID = existing rows are left alone).
ALTER TABLE public.waitlist_signups
  ADD CONSTRAINT waitlist_signups_name_len CHECK (name IS NULL OR char_length(name) BETWEEN 2 AND 80) NOT VALID,
  ADD CONSTRAINT waitlist_signups_phone_fmt CHECK (phone IS NULL OR phone ~ '^\+[0-9]{8,15}$') NOT VALID,
  ADD CONSTRAINT waitlist_signups_email_len CHECK (char_length(email) <= 254) NOT VALID;
