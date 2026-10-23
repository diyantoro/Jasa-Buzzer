CREATE TABLE public.social_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buzzer_email text NOT NULL,
  buzzer_name text NOT NULL DEFAULT '',
  platform text NOT NULL,
  username text NOT NULL,
  account_name text NOT NULL DEFAULT '',
  profile_url text NOT NULL DEFAULT '',
  followers integer NOT NULL DEFAULT 0,
  following_count integer NOT NULL DEFAULT 0,
  posts integer NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  photo_url text,
  verification text NOT NULL DEFAULT 'Menunggu',
  rejection_note text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT social_accounts_unique_handle UNIQUE (buzzer_email, platform, username)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_accounts TO anon, authenticated;
GRANT ALL ON public.social_accounts TO service_role;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "demo_all" ON public.social_accounts FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER update_social_accounts_updated_at
BEFORE UPDATE ON public.social_accounts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX social_accounts_buzzer_email_idx ON public.social_accounts (buzzer_email);

CREATE TABLE public.buzzer_levels (
  name text PRIMARY KEY,
  sort_order integer NOT NULL DEFAULT 0,
  min_followers bigint NOT NULL DEFAULT 0,
  max_followers bigint,
  payout_per_job numeric NOT NULL DEFAULT 0,
  emoji text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.buzzer_levels TO anon, authenticated;
GRANT ALL ON public.buzzer_levels TO service_role;
ALTER TABLE public.buzzer_levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "buzzer_levels_read" ON public.buzzer_levels FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "buzzer_levels_write" ON public.buzzer_levels FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER update_buzzer_levels_updated_at
BEFORE UPDATE ON public.buzzer_levels
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.buzzer_levels (name, sort_order, min_followers, max_followers, payout_per_job, emoji) VALUES
  ('Bronze',   1, 0,       10000,  25000,  '🥉'),
  ('Silver',   2, 10001,   50000,  60000,  '🥈'),
  ('Gold',     3, 50001,   100000, 150000, '🥇'),
  ('Platinum', 4, 100001,  500000, 400000, '💎'),
  ('Diamond',  5, 500001,  NULL,   1000000,'👑');

ALTER TABLE public.buzzer_wallets
  ADD COLUMN IF NOT EXISTS level text,
  ADD COLUMN IF NOT EXISTS verified_followers integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS level_assigned_at timestamptz;