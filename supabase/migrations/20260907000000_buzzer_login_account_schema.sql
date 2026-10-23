ALTER TABLE public.app_accounts
  ADD COLUMN IF NOT EXISTS password_hash text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS industry text,
  ADD COLUMN IF NOT EXISTS username text,
  ADD COLUMN IF NOT EXISTS platform text,
  ADD COLUMN IF NOT EXISTS followers integer,
  ADD COLUMN IF NOT EXISTS avatar_url text;

CREATE UNIQUE INDEX IF NOT EXISTS app_accounts_email_lower_idx
  ON public.app_accounts (lower(email));

GRANT SELECT, INSERT, UPDATE ON public.app_accounts TO anon, authenticated;
GRANT ALL ON public.app_accounts TO service_role;

ALTER TABLE public.app_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service role only" ON public.app_accounts;
DROP POLICY IF EXISTS "app accounts registration and login" ON public.app_accounts;

CREATE POLICY "app accounts registration and login"
  ON public.app_accounts
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
