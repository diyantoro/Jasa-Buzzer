-- =====================================================================
-- Migration: 20261116000009_financial_ledger.sql
-- Buku besar keuangan (append-only financial ledger).
--
-- Menyediakan jejak audit finansial immutable:
--   * Setiap arus uang tercatat sebagai transaksi terpisah.
--   * Saldo buzzer dan admin dapat direkonstruksi dari ledger.
--   * Akses dibatasi ketat: hanya service_role, tertutup total untuk
--     anon dan authenticated.
--   * Pencegahan pencatatan ganda melalui partial unique index pada
--     (entry_type, ref_table, ref_id).
-- =====================================================================
BEGIN;

-- ---------------------------------------------------------------------
-- 1. Tabel Buku Besar
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.financial_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_type text NOT NULL CHECK (
    entry_type IN (
      'customer_payment',
      'buzzer_payout',
      'admin_commission',
      'buzzer_withdrawal',
      'admin_withdrawal',
      'manual_adjustment'
    )
  ),
  account_type text NOT NULL CHECK (account_type IN ('platform', 'admin', 'buzzer')),
  account_identifier text NOT NULL,
  amount numeric NOT NULL CHECK (amount >= 0),
  direction text NOT NULL CHECK (direction IN ('credit', 'debit')),
  ref_table text NOT NULL DEFAULT '',
  ref_id text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_financial_ledger_ref UNIQUE (entry_type, ref_table, ref_id)
);

-- Indeks performa & audit
CREATE INDEX IF NOT EXISTS idx_financial_ledger_account
  ON public.financial_ledger (account_identifier, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_financial_ledger_ref
  ON public.financial_ledger (ref_table, ref_id);
CREATE INDEX IF NOT EXISTS idx_financial_ledger_entry_type
  ON public.financial_ledger (entry_type, created_at DESC);

-- ---------------------------------------------------------------------
-- 2. Keamanan: RLS & Privileges (Hanya service_role)
-- ---------------------------------------------------------------------
ALTER TABLE public.financial_ledger ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.financial_ledger FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.financial_ledger TO service_role;

DROP POLICY IF EXISTS "service_role_all_financial_ledger" ON public.financial_ledger;
CREATE POLICY "service_role_all_financial_ledger"
  ON public.financial_ledger
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------------
-- 3. Triggers Otomatis Buku Besar
-- ---------------------------------------------------------------------

-- A. Pembayaran customer yang berhasil
CREATE OR REPLACE FUNCTION public.ledger_record_customer_payment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IN ('Berhasil', 'Lunas')
     AND (TG_OP = 'INSERT' OR OLD.status NOT IN ('Berhasil', 'Lunas')) THEN
    INSERT INTO public.financial_ledger (
      entry_type, account_type, account_identifier, amount, direction,
      ref_table, ref_id, description
    ) VALUES (
      'customer_payment',
      'platform',
      'platform',
      COALESCE(NEW.amount, 0),
      'credit',
      'payments',
      NEW.id::text,
      'Pemasukan pembayaran customer (' || COALESCE(NEW.invoice_no, '') || ')'
    ) ON CONFLICT (entry_type, ref_table, ref_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ledger_customer_payment ON public.payments;
CREATE TRIGGER trg_ledger_customer_payment
AFTER INSERT OR UPDATE OF status ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.ledger_record_customer_payment();

-- B. Payout buzzer & komisi admin dari job selesai
CREATE OR REPLACE FUNCTION public.ledger_record_job_completion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_buzzer_amount numeric;
  v_admin_amount numeric;
BEGIN
  IF (NEW.status = 'Selesai' OR NEW.admin_verified_at IS NOT NULL)
     AND (TG_OP = 'INSERT' OR (OLD.status IS DISTINCT FROM 'Selesai' AND OLD.admin_verified_at IS NULL)) THEN
    
    v_buzzer_amount := GREATEST(COALESCE(NEW.buzzer_amount, NEW.payout, 0), 0);
    v_admin_amount := GREATEST(COALESCE(NEW.admin_amount, GREATEST(COALESCE(NEW.gross_price, 0) - v_buzzer_amount, 0)), 0);

    IF v_buzzer_amount > 0 AND NEW.buzzer_email IS NOT NULL AND trim(NEW.buzzer_email) <> '' THEN
      INSERT INTO public.financial_ledger (
        entry_type, account_type, account_identifier, amount, direction,
        ref_table, ref_id, description
      ) VALUES (
        'buzzer_payout',
        'buzzer',
        lower(trim(NEW.buzzer_email)),
        v_buzzer_amount,
        'credit',
        'campaign_jobs',
        NEW.id::text,
        'Pendapatan job buzzer (' || COALESCE(NEW.campaign_title, '') || ')'
      ) ON CONFLICT (entry_type, ref_table, ref_id) DO NOTHING;
    END IF;

    IF v_admin_amount > 0 THEN
      INSERT INTO public.financial_ledger (
        entry_type, account_type, account_identifier, amount, direction,
        ref_table, ref_id, description
      ) VALUES (
        'admin_commission',
        'admin',
        'admin',
        v_admin_amount,
        'credit',
        'campaign_jobs',
        NEW.id::text,
        'Komisi admin dari job (' || COALESCE(NEW.campaign_title, '') || ')'
      ) ON CONFLICT (entry_type, ref_table, ref_id) DO NOTHING;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ledger_job_completion ON public.campaign_jobs;
CREATE TRIGGER trg_ledger_job_completion
AFTER INSERT OR UPDATE OF status, admin_verified_at ON public.campaign_jobs
FOR EACH ROW EXECUTE FUNCTION public.ledger_record_job_completion();

-- C. Pencairan buzzer (withdrawal) yang disetujui/berhasil
CREATE OR REPLACE FUNCTION public.ledger_record_buzzer_withdrawal()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'Berhasil'
     AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'Berhasil') THEN
    INSERT INTO public.financial_ledger (
      entry_type, account_type, account_identifier, amount, direction,
      ref_table, ref_id, description
    ) VALUES (
      'buzzer_withdrawal',
      'buzzer',
      lower(trim(NEW.buzzer_email)),
      COALESCE(NEW.amount, 0),
      'debit',
      'withdrawals',
      NEW.id::text,
      'Pencairan dana buzzer (' || COALESCE(NEW.method, '') || ' ke ' || COALESCE(NEW.account_no, '') || ')'
    ) ON CONFLICT (entry_type, ref_table, ref_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ledger_buzzer_withdrawal ON public.withdrawals;
CREATE TRIGGER trg_ledger_buzzer_withdrawal
AFTER INSERT OR UPDATE OF status ON public.withdrawals
FOR EACH ROW EXECUTE FUNCTION public.ledger_record_buzzer_withdrawal();

-- D. Penarikan admin (admin_withdrawals)
CREATE OR REPLACE FUNCTION public.ledger_record_admin_withdrawal()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'Berhasil'
     AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'Berhasil') THEN
    INSERT INTO public.financial_ledger (
      entry_type, account_type, account_identifier, amount, direction,
      ref_table, ref_id, description
    ) VALUES (
      'admin_withdrawal',
      'admin',
      'admin',
      COALESCE(NEW.amount, 0),
      'debit',
      'admin_withdrawals',
      NEW.id::text,
      'Penarikan profit admin (' || COALESCE(NEW.method, '') || ')'
    ) ON CONFLICT (entry_type, ref_table, ref_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ledger_admin_withdrawal ON public.admin_withdrawals;
CREATE TRIGGER trg_ledger_admin_withdrawal
AFTER INSERT OR UPDATE OF status ON public.admin_withdrawals
FOR EACH ROW EXECUTE FUNCTION public.ledger_record_admin_withdrawal();

-- ---------------------------------------------------------------------
-- 4. Backfill Transaksi Masa Lalu (Idempoten)
-- ---------------------------------------------------------------------
-- Pembayaran settled
INSERT INTO public.financial_ledger (
  entry_type, account_type, account_identifier, amount, direction,
  ref_table, ref_id, description, created_at
)
SELECT
  'customer_payment',
  'platform',
  'platform',
  amount,
  'credit',
  'payments',
  id::text,
  'Pemasukan pembayaran customer (' || invoice_no || ')',
  COALESCE(paid_at, created_at)
FROM public.payments
WHERE status IN ('Berhasil', 'Lunas')
ON CONFLICT (entry_type, ref_table, ref_id) DO NOTHING;

-- Job selesai (buzzer)
INSERT INTO public.financial_ledger (
  entry_type, account_type, account_identifier, amount, direction,
  ref_table, ref_id, description, created_at
)
SELECT
  'buzzer_payout',
  'buzzer',
  lower(trim(buzzer_email)),
  GREATEST(COALESCE(buzzer_amount, payout, 0), 0),
  'credit',
  'campaign_jobs',
  id::text,
  'Pendapatan job buzzer (' || campaign_title || ')',
  COALESCE(admin_verified_at, updated_at, created_at)
FROM public.campaign_jobs
WHERE (status = 'Selesai' OR admin_verified_at IS NOT NULL)
  AND buzzer_email IS NOT NULL AND trim(buzzer_email) <> ''
  AND GREATEST(COALESCE(buzzer_amount, payout, 0), 0) > 0
ON CONFLICT (entry_type, ref_table, ref_id) DO NOTHING;

-- Job selesai (komisi admin)
INSERT INTO public.financial_ledger (
  entry_type, account_type, account_identifier, amount, direction,
  ref_table, ref_id, description, created_at
)
SELECT
  'admin_commission',
  'admin',
  'admin',
  GREATEST(COALESCE(admin_amount, GREATEST(COALESCE(gross_price, 0) - GREATEST(COALESCE(buzzer_amount, payout, 0), 0), 0)), 0),
  'credit',
  'campaign_jobs',
  id::text,
  'Komisi admin dari job (' || campaign_title || ')',
  COALESCE(admin_verified_at, updated_at, created_at)
FROM public.campaign_jobs
WHERE (status = 'Selesai' OR admin_verified_at IS NOT NULL)
  AND GREATEST(COALESCE(admin_amount, GREATEST(COALESCE(gross_price, 0) - GREATEST(COALESCE(buzzer_amount, payout, 0), 0), 0)), 0) > 0
ON CONFLICT (entry_type, ref_table, ref_id) DO NOTHING;

-- Pencairan buzzer
INSERT INTO public.financial_ledger (
  entry_type, account_type, account_identifier, amount, direction,
  ref_table, ref_id, description, created_at
)
SELECT
  'buzzer_withdrawal',
  'buzzer',
  lower(trim(buzzer_email)),
  amount,
  'debit',
  'withdrawals',
  id::text,
  'Pencairan dana buzzer (' || method || ' ke ' || account_no || ')',
  COALESCE(completed_at, approved_at, created_at)
FROM public.withdrawals
WHERE status = 'Berhasil'
ON CONFLICT (entry_type, ref_table, ref_id) DO NOTHING;

-- Penarikan admin
INSERT INTO public.financial_ledger (
  entry_type, account_type, account_identifier, amount, direction,
  ref_table, ref_id, description, created_at
)
SELECT
  'admin_withdrawal',
  'admin',
  'admin',
  amount,
  'debit',
  'admin_withdrawals',
  id::text,
  'Penarikan profit admin (' || method || ')',
  created_at
FROM public.admin_withdrawals
WHERE status = 'Berhasil'
ON CONFLICT (entry_type, ref_table, ref_id) DO NOTHING;

COMMIT;
