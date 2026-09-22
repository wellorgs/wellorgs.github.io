-- Run once in the Supabase SQL Editor: adds the "which link brought them in" column
-- the site now fills in on every new signup. Existing rows are left blank.
alter table public.waitlist_signups add column if not exists source text;
