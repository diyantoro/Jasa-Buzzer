GRANT SELECT, INSERT ON public.app_accounts TO anon, authenticated;

DROP POLICY IF EXISTS "service role only" ON public.app_accounts;
DROP POLICY IF EXISTS "app accounts registration and login" ON public.app_accounts;

CREATE POLICY "app accounts registration and login"
  ON public.app_accounts
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);