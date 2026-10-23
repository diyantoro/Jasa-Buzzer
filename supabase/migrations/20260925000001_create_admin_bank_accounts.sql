CREATE TABLE IF NOT EXISTS public.admin_bank_accounts (
  id text PRIMARY KEY,
  bank_name text NOT NULL,
  account_number text NOT NULL,
  account_holder text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_bank_accounts TO anon, authenticated;
GRANT ALL ON public.admin_bank_accounts TO service_role;

ALTER TABLE public.admin_bank_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_all_admin_bank_accounts" ON public.admin_bank_accounts;
CREATE POLICY "allow_all_admin_bank_accounts" ON public.admin_bank_accounts
FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Seed initial admin bank accounts
INSERT INTO public.admin_bank_accounts (id, bank_name, account_number, account_holder, is_active)
VALUES
  ('bank-bca-default', 'BCA', '8830192831', 'PT BuzzConnect Indonesia', true),
  ('bank-bri-default', 'BRI', '020601002345501', 'PT BuzzConnect Indonesia', true),
  ('bank-mandiri-default', 'Mandiri', '1370019283741', 'PT BuzzConnect Indonesia', true),
  ('bank-bni-default', 'BNI', '0928374615', 'PT BuzzConnect Indonesia', true)
ON CONFLICT (id) DO NOTHING;

NOTIFY pgrst, 'reload schema';
