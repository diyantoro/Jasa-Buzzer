-- Migration: 20261001120000_create_admin_wallet_and_sync.sql
-- Create admin_wallet table for persistent storage of admin balance & revenue,
-- ensuring admin earnings never decrease due to client query limits or pagination.

CREATE TABLE IF NOT EXISTS public.admin_wallet (
  id text PRIMARY KEY DEFAULT 'primary',
  balance numeric NOT NULL DEFAULT 0, -- Keuntungan / komisi admin dari job selesai
  total_revenue numeric NOT NULL DEFAULT 0, -- Total omset kotor dari job yang dikerjakan buzzer
  total_buzzer_payout numeric NOT NULL DEFAULT 0, -- Total bagian buzzer dari job selesai
  total_incoming numeric NOT NULL DEFAULT 0, -- Total pembayaran customer yang berhasil/lunas
  completed_jobs_count integer NOT NULL DEFAULT 0, -- Jumlah job yang sudah selesai
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_wallet TO anon, authenticated;
GRANT ALL ON public.admin_wallet TO service_role;

ALTER TABLE public.admin_wallet ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_all_admin_wallet" ON public.admin_wallet;
CREATE POLICY "allow_all_admin_wallet" ON public.admin_wallet
FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Function to recalculate / sync admin wallet from all completed jobs and settled payments
CREATE OR REPLACE FUNCTION public.recalculate_admin_wallet()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_revenue numeric := 0;
  v_admin_profit numeric := 0;
  v_buzzer_payout numeric := 0;
  v_completed_count integer := 0;
  v_incoming numeric := 0;
  job_row record;
  v_gross numeric;
  v_buzzer numeric;
  v_admin numeric;
BEGIN
  -- Sum all completed jobs from campaign_jobs without any limit
  FOR job_row IN
    SELECT gross_price, payout, buzzer_amount, admin_amount
    FROM public.campaign_jobs
    WHERE status = 'Selesai' OR admin_verified_at IS NOT NULL
  LOOP
    v_gross := GREATEST(COALESCE(job_row.gross_price, 0), 0);
    v_buzzer := GREATEST(COALESCE(job_row.buzzer_amount, job_row.payout, 0), 0);
    IF job_row.admin_amount IS NOT NULL AND job_row.admin_amount > 0 THEN
      v_admin := job_row.admin_amount;
    ELSE
      v_admin := GREATEST(v_gross - v_buzzer, 0);
    END IF;

    v_total_revenue := v_total_revenue + v_gross;
    v_admin_profit := v_admin_profit + v_admin;
    v_buzzer_payout := v_buzzer_payout + v_buzzer;
    v_completed_count := v_completed_count + 1;
  END LOOP;

  -- Sum incoming customer payments that are settled
  SELECT COALESCE(SUM(amount), 0) INTO v_incoming
  FROM public.payments
  WHERE status IN ('Berhasil', 'Lunas');

  INSERT INTO public.admin_wallet (id, balance, total_revenue, total_buzzer_payout, total_incoming, completed_jobs_count, updated_at)
  VALUES ('primary', v_admin_profit, v_total_revenue, v_buzzer_payout, v_incoming, v_completed_count, now())
  ON CONFLICT (id) DO UPDATE SET
    balance = EXCLUDED.balance,
    total_revenue = EXCLUDED.total_revenue,
    total_buzzer_payout = EXCLUDED.total_buzzer_payout,
    total_incoming = EXCLUDED.total_incoming,
    completed_jobs_count = EXCLUDED.completed_jobs_count,
    updated_at = now();
END;
$$;

-- Trigger to recalculate admin wallet whenever job completion or payment changes
CREATE OR REPLACE FUNCTION public.sync_admin_wallet_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.recalculate_admin_wallet();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_sync_admin_wallet_on_jobs ON public.campaign_jobs;
CREATE TRIGGER trigger_sync_admin_wallet_on_jobs
AFTER INSERT OR UPDATE OF status, admin_verified_at, gross_price, payout, buzzer_amount, admin_amount OR DELETE
ON public.campaign_jobs
FOR EACH STATEMENT
EXECUTE FUNCTION public.sync_admin_wallet_trigger();

DROP TRIGGER IF EXISTS trigger_sync_admin_wallet_on_payments ON public.payments;
CREATE TRIGGER trigger_sync_admin_wallet_on_payments
AFTER INSERT OR UPDATE OF status, amount OR DELETE
ON public.payments
FOR EACH STATEMENT
EXECUTE FUNCTION public.sync_admin_wallet_trigger();

-- Initial execution
SELECT public.recalculate_admin_wallet();

NOTIFY pgrst, 'reload schema';
