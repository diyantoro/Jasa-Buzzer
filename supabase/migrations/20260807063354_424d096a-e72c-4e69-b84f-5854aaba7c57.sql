CREATE TABLE public.campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  customer_email text NOT NULL,
  customer_name text NOT NULL,
  platform text NOT NULL,
  brief text NOT NULL DEFAULT '',
  budget numeric NOT NULL DEFAULT 0,
  payout_per_buzzer numeric NOT NULL DEFAULT 0,
  slots integer NOT NULL DEFAULT 1,
  deadline text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Aktif',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.campaign_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid,
  campaign_title text NOT NULL,
  platform text NOT NULL,
  buzzer_email text,
  buzzer_name text,
  payout numeric NOT NULL DEFAULT 0,
  deadline text NOT NULL DEFAULT '',
  brief text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Tersedia',
  proof_url text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.campaign_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid,
  from_role text NOT NULL,
  from_name text NOT NULL,
  from_email text NOT NULL,
  to_email text NOT NULL,
  body text NOT NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_no text NOT NULL,
  customer_name text NOT NULL,
  customer_email text,
  campaign_name text NOT NULL,
  campaign_type text NOT NULL,
  method text NOT NULL DEFAULT 'Transfer',
  amount numeric NOT NULL DEFAULT 0,
  buzzer_cost numeric NOT NULL DEFAULT 0,
  fee numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Pending',
  note text,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buzzer_name text NOT NULL,
  buzzer_email text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  method text NOT NULL DEFAULT 'Transfer',
  account_no text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Menunggu',
  proof_url text,
  admin_note text,
  requested_at timestamptz NOT NULL DEFAULT now(),
  approved_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.buzzer_wallets (
  buzzer_email text PRIMARY KEY,
  buzzer_name text NOT NULL,
  balance numeric NOT NULL DEFAULT 0,
  pending_balance numeric NOT NULL DEFAULT 0,
  platform text,
  followers integer NOT NULL DEFAULT 0,
  rating numeric NOT NULL DEFAULT 5,
  campaigns_completed integer NOT NULL DEFAULT 0,
  online boolean NOT NULL DEFAULT false,
  avatar_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.customer_accounts (
  email text PRIMARY KEY,
  name text NOT NULL,
  avatar_url text,
  active boolean NOT NULL DEFAULT true,
  campaigns_count integer NOT NULL DEFAULT 0,
  active_campaigns integer NOT NULL DEFAULT 0,
  total_spent numeric NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.finance_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  title text NOT NULL,
  description text,
  amount numeric,
  ref_table text,
  ref_id text,
  link text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.finance_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  title text NOT NULL,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaigns, public.campaign_jobs, public.campaign_messages, public.payments, public.withdrawals, public.buzzer_wallets, public.customer_accounts, public.finance_activity, public.finance_notifications TO anon, authenticated;
GRANT ALL ON public.campaigns, public.campaign_jobs, public.campaign_messages, public.payments, public.withdrawals, public.buzzer_wallets, public.customer_accounts, public.finance_activity, public.finance_notifications TO service_role;

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buzzer_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "demo_all" ON public.campaigns FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "demo_all" ON public.campaign_jobs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "demo_all" ON public.campaign_messages FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "demo_all" ON public.payments FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "demo_all" ON public.withdrawals FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "demo_all" ON public.buzzer_wallets FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "demo_all" ON public.customer_accounts FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "demo_all" ON public.finance_activity FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "demo_all" ON public.finance_notifications FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.campaigns, public.campaign_jobs, public.campaign_messages, public.payments, public.withdrawals, public.buzzer_wallets, public.customer_accounts, public.finance_activity, public.finance_notifications;
