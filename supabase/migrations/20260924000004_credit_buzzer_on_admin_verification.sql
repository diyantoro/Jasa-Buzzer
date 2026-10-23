CREATE OR REPLACE FUNCTION public.credit_buzzer_after_job_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  snapshot_buzzer_amount numeric := GREATEST(COALESCE(NEW.buzzer_amount, NEW.payout, 0), 0);
  snapshot_admin_amount numeric := GREATEST(COALESCE(NEW.admin_amount, NEW.gross_price - snapshot_buzzer_amount, 0), 0);
BEGIN
  IF NEW.buzzer_email IS NOT NULL
     AND (
       (NEW.admin_verified_at IS NOT NULL AND OLD.admin_verified_at IS NULL)
       OR (NEW.status = 'Selesai' AND OLD.status IS DISTINCT FROM 'Selesai')
     )
     AND NOT EXISTS (
       SELECT 1 FROM public.finance_activity
       WHERE ref_table = 'campaign_jobs' AND ref_id = NEW.id::text AND type = 'buzzer'
     ) THEN
    INSERT INTO public.buzzer_wallets (buzzer_email, buzzer_name, balance, pending_balance, updated_at)
    VALUES (lower(trim(NEW.buzzer_email)), COALESCE(NEW.buzzer_name, NEW.buzzer_email), snapshot_buzzer_amount, 0, now())
    ON CONFLICT (buzzer_email) DO UPDATE SET
      balance = public.buzzer_wallets.balance + EXCLUDED.balance,
      updated_at = now();

    INSERT INTO public.finance_activity (type, title, description, amount, ref_table, ref_id)
    VALUES ('buzzer', 'Payout Buzzer', NEW.campaign_title || ' - payout buzzer disetujui admin', snapshot_buzzer_amount, 'campaign_jobs', NEW.id::text);

    IF snapshot_admin_amount > 0 THEN
      INSERT INTO public.finance_activity (type, title, description, amount, ref_table, ref_id)
      VALUES ('admin', 'Komisi Admin', NEW.campaign_title || ' - komisi admin dari pengerjaan yang diverifikasi', snapshot_admin_amount, 'campaign_jobs', NEW.id::text);
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS credit_buzzer_after_job_approval ON public.campaign_jobs;
CREATE TRIGGER credit_buzzer_after_job_approval
AFTER UPDATE OF admin_verified_at, status ON public.campaign_jobs
FOR EACH ROW EXECUTE FUNCTION public.credit_buzzer_after_job_approval();

DO $$
DECLARE
  job_row public.campaign_jobs%ROWTYPE;
  buzzer_amount numeric;
  admin_amount numeric;
BEGIN
  FOR job_row IN
    SELECT * FROM public.campaign_jobs
    WHERE (admin_verified_at IS NOT NULL OR status = 'Selesai') AND buzzer_email IS NOT NULL
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM public.finance_activity
      WHERE ref_table = 'campaign_jobs' AND ref_id = job_row.id::text AND type = 'buzzer'
    ) THEN
      buzzer_amount := GREATEST(COALESCE(job_row.buzzer_amount, job_row.payout, 0), 0);
      admin_amount := GREATEST(COALESCE(job_row.admin_amount, job_row.gross_price - buzzer_amount, 0), 0);
      INSERT INTO public.buzzer_wallets (buzzer_email, buzzer_name, balance, pending_balance, updated_at)
      VALUES (lower(trim(job_row.buzzer_email)), COALESCE(job_row.buzzer_name, job_row.buzzer_email), buzzer_amount, 0, now())
      ON CONFLICT (buzzer_email) DO UPDATE SET balance = public.buzzer_wallets.balance + EXCLUDED.balance, updated_at = now();
      INSERT INTO public.finance_activity (type, title, description, amount, ref_table, ref_id)
      VALUES ('buzzer', 'Payout Buzzer', job_row.campaign_title || ' - payout buzzer disetujui admin', buzzer_amount, 'campaign_jobs', job_row.id::text);
      IF admin_amount > 0 THEN
        INSERT INTO public.finance_activity (type, title, description, amount, ref_table, ref_id)
        VALUES ('admin', 'Komisi Admin', job_row.campaign_title || ' - komisi admin dari pengerjaan yang diverifikasi', admin_amount, 'campaign_jobs', job_row.id::text);
      END IF;
    END IF;
  END LOOP;
END;
$$;
