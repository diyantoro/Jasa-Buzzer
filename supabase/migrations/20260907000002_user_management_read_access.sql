GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_accounts TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.buzzer_applications TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customer_accounts TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_accounts TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.buzzer_wallets TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaigns TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaign_jobs TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.withdrawals TO anon, authenticated;

ALTER TABLE public.app_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buzzer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buzzer_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "management app accounts read" ON public.app_accounts;
CREATE POLICY "management app accounts read"
  ON public.app_accounts FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "management buzzer applications read" ON public.buzzer_applications;
CREATE POLICY "management buzzer applications read"
  ON public.buzzer_applications FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "management customer accounts read" ON public.customer_accounts;
CREATE POLICY "management customer accounts read"
  ON public.customer_accounts FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "management social accounts read" ON public.social_accounts;
CREATE POLICY "management social accounts read"
  ON public.social_accounts FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "management buzzer wallets read" ON public.buzzer_wallets;
CREATE POLICY "management buzzer wallets read"
  ON public.buzzer_wallets FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "management campaigns read" ON public.campaigns;
CREATE POLICY "management campaigns read"
  ON public.campaigns FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "management campaign jobs read" ON public.campaign_jobs;
CREATE POLICY "management campaign jobs read"
  ON public.campaign_jobs FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "management withdrawals read" ON public.withdrawals;
CREATE POLICY "management withdrawals read"
  ON public.withdrawals FOR SELECT TO anon, authenticated
  USING (true);
