-- Migration: 20261007203000_create_admin_withdrawals.sql
-- Create table for recording admin withdrawals (cairkan dana admin)

CREATE TABLE IF NOT EXISTS public.admin_withdrawals (
  id text PRIMARY KEY,
  amount numeric NOT NULL,
  method text NOT NULL,
  provider text,
  account_no text,
  status text NOT NULL DEFAULT 'Berhasil',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.admin_withdrawals TO anon, authenticated, service_role;

ALTER TABLE public.admin_withdrawals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_all_admin_withdrawals" ON public.admin_withdrawals;
CREATE POLICY "allow_all_admin_withdrawals" ON public.admin_withdrawals
FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

NOTIFY pgrst, 'reload schema';
