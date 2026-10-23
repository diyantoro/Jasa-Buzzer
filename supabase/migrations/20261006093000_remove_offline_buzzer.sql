-- Migration: 20261006093000_remove_offline_buzzer.sql
-- Description: Menghapus fitur, fungsi RPC, trigger, kolom khusus, dan katalog pesanan buzzer offline.
--              Semua fitur online buzzer tetap 100% aktif dan berjalan normal.

-- 1. Hapus fungsi RPC khusus Offline Buzzer
DROP FUNCTION IF EXISTS public.create_customer_offline_payment_campaign;
DROP FUNCTION IF EXISTS public.update_offline_campaign_payout;
DROP FUNCTION IF EXISTS public.confirm_offline_attendance;
DROP FUNCTION IF EXISTS public.checkin_offline_job;
DROP FUNCTION IF EXISTS public.checkout_offline_job;

-- 2. Bersihkan data pesanan & katalog offline yang tersisa
DELETE FROM public.catalog_packages WHERE catalog_id IN (
  SELECT id FROM public.service_catalogs WHERE lower(platform) = 'offline'
);
DELETE FROM public.service_catalogs WHERE lower(platform) = 'offline';
DELETE FROM public.payments WHERE lower(campaign_type) = 'offline';
DELETE FROM public.campaign_jobs WHERE lower(platform) = 'offline';
DELETE FROM public.campaigns WHERE lower(platform) = 'offline';

-- 3. Hapus kolom khusus event & presensi offline
ALTER TABLE public.campaign_jobs
  DROP COLUMN IF EXISTS attendance_status,
  DROP COLUMN IF EXISTS attendance_confirmed_at,
  DROP COLUMN IF EXISTS checkin_at,
  DROP COLUMN IF EXISTS checkout_at,
  DROP COLUMN IF EXISTS activity_note,
  DROP COLUMN IF EXISTS location_name,
  DROP COLUMN IF EXISTS event_date,
  DROP COLUMN IF EXISTS event_time;

ALTER TABLE public.service_catalogs
  DROP COLUMN IF EXISTS payout_per_buzzer;

-- 4. Kembalikan approve_campaign_payment ke versi standar online
CREATE OR REPLACE FUNCTION public.approve_campaign_payment(p_payment_id uuid, p_admin_email text DEFAULT 'admin')
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_payment public.payments%ROWTYPE;
  target_campaign public.campaigns%ROWTYPE;
  slot_index integer;
  slot_count integer;
  gross_amount numeric;
  base_amount numeric;
  remainder numeric;
BEGIN
  SELECT * INTO target_payment FROM public.payments WHERE id = p_payment_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Pembayaran tidak ditemukan'; END IF;
  IF target_payment.status IN ('Berhasil', 'Lunas') AND target_payment.campaign_id IS NOT NULL THEN
    RETURN target_payment.campaign_id;
  END IF;
  IF target_payment.status NOT IN ('Menunggu Verifikasi', 'Pending', 'Gagal') THEN
    RAISE EXCEPTION 'Status pembayaran tidak dapat disetujui: %', target_payment.status;
  END IF;

  SELECT * INTO target_campaign
  FROM public.campaigns
  WHERE id = target_payment.campaign_id
     OR (payment_id = target_payment.id)
     OR (lower(customer_email) = lower(coalesce(target_payment.customer_email, '')) AND title = target_payment.campaign_name)
  ORDER BY (payment_id = target_payment.id) DESC, created_at DESC
  LIMIT 1
  FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Campaign untuk pembayaran tidak ditemukan'; END IF;

  UPDATE public.payments
  SET status = 'Berhasil', paid_at = COALESCE(paid_at, now()), verified_at = now(), verified_by = p_admin_email,
      rejection_reason = NULL, campaign_id = target_campaign.id, updated_at = now()
  WHERE id = target_payment.id;

  UPDATE public.campaigns
  SET payment_id = target_payment.id, payment_status = 'Pembayaran Disetujui',
      payment_rejection_reason = NULL, status = 'Aktif', updated_at = now()
  WHERE id = target_campaign.id;

  SELECT count(*)::integer INTO slot_count FROM public.campaign_jobs WHERE campaign_id = target_campaign.id;
  IF slot_count = 0 THEN
    slot_count := GREATEST(target_campaign.slots, 1);
    gross_amount := GREATEST(target_campaign.budget, 0);
    base_amount := floor(gross_amount / slot_count);
    remainder := gross_amount - base_amount * slot_count;
    FOR slot_index IN 1..slot_count LOOP
      INSERT INTO public.campaign_jobs (
        campaign_id, campaign_title, platform, gross_price, payout, deadline, brief, status
      ) VALUES (
        target_campaign.id, target_campaign.title, target_campaign.platform,
        base_amount + CASE WHEN slot_index <= remainder THEN 1 ELSE 0 END,
        0,
        target_campaign.deadline, target_campaign.brief, 'Tersedia'
      );
    END LOOP;
  END IF;

  INSERT INTO public.finance_notifications (category, title, body, link)
  VALUES ('payment', 'Pembayaran disetujui', 'Campaign ' || target_campaign.title || ' sekarang aktif.', '/customer');
  RETURN target_campaign.id;
END;
$$;

REVOKE ALL ON FUNCTION public.approve_campaign_payment(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.approve_campaign_payment(uuid, text) TO anon, authenticated;

-- 5. Kembalikan claim_campaign_job ke versi murni online dengan level buzzer
CREATE OR REPLACE FUNCTION public.claim_campaign_job(p_job_id uuid, p_buzzer_email text, p_buzzer_name text)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  target_job public.campaign_jobs%ROWTYPE;
  target_campaign public.campaigns%ROWTYPE;
  assigned_count integer;
  snapshot_level text;
  gross_amount numeric;
  buzzer_share_percentage numeric;
  buzzer_share_amount numeric;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.buzzer_applications
    WHERE lower(trim(email)) = lower(trim(p_buzzer_email)) AND status = 'approved'
  ) AND NOT EXISTS (
    SELECT 1 FROM public.app_accounts
    WHERE lower(trim(email)) = lower(trim(p_buzzer_email)) AND role = 'buzzer'
  ) THEN
    RAISE EXCEPTION 'Akun buzzer belum diverifikasi admin';
  END IF;

  SELECT * INTO target_job FROM public.campaign_jobs WHERE id = p_job_id FOR UPDATE;
  IF NOT FOUND OR target_job.status <> 'Tersedia' OR target_job.buzzer_email IS NOT NULL THEN
    RAISE EXCEPTION 'Job sudah tidak tersedia';
  END IF;

  SELECT * INTO target_campaign FROM public.campaigns WHERE id = target_job.campaign_id FOR UPDATE;
  IF NOT FOUND OR target_campaign.payment_status <> 'Pembayaran Disetujui' OR target_campaign.status NOT IN ('Aktif', 'Review') THEN
    RAISE EXCEPTION 'Campaign belum aktif atau pembayaran belum disetujui';
  END IF;

  IF target_campaign.start_date !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' OR target_campaign.start_date::date > CURRENT_DATE THEN
    RAISE EXCEPTION 'Campaign belum memasuki tanggal mulai';
  END IF;
  IF target_campaign.deadline !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' OR target_campaign.deadline::date < CURRENT_DATE THEN
    RAISE EXCEPTION 'Masa campaign telah berakhir';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.social_accounts
    WHERE lower(trim(buzzer_email)) = lower(trim(p_buzzer_email))
      AND lower(trim(platform)) = lower(trim(target_job.platform))
      AND lower(trim(verification)) = 'terverifikasi'
      AND (is_active = true OR is_active IS NULL)
  ) AND NOT EXISTS (
    SELECT 1 FROM public.buzzer_applications
    WHERE lower(trim(email)) = lower(trim(p_buzzer_email))
      AND status = 'approved'
      AND lower(trim(platform)) = lower(trim(target_job.platform))
  ) AND NOT EXISTS (
    SELECT 1 FROM public.app_accounts
    WHERE lower(trim(email)) = lower(trim(p_buzzer_email))
      AND role = 'buzzer'
      AND lower(trim(coalesce(platform, ''))) = lower(trim(target_job.platform))
  ) THEN
    RAISE EXCEPTION 'Akun sosial media kamu belum terverifikasi atau tidak sesuai platform job';
  END IF;

  SELECT level INTO snapshot_level FROM public.buzzer_wallets WHERE lower(trim(buzzer_email)) = lower(trim(p_buzzer_email));
  IF snapshot_level IS NULL THEN
    snapshot_level := 'Bronze';
  END IF;

  buzzer_share_percentage := public.buzzer_share_percentage_for_level(snapshot_level);

  gross_amount := GREATEST(COALESCE(target_job.gross_price, target_campaign.budget / GREATEST(target_campaign.slots, 1), 0), 0);
  IF gross_amount <= 0 THEN
    RAISE EXCEPTION 'Harga job tidak valid';
  END IF;

  buzzer_share_amount := ROUND(gross_amount * buzzer_share_percentage / 100);

  SELECT count(*)::integer INTO assigned_count
  FROM public.campaign_jobs WHERE campaign_id = target_campaign.id AND buzzer_email IS NOT NULL;
  IF assigned_count >= GREATEST(target_campaign.slots, 1) THEN
    UPDATE public.campaigns SET target_reached_at = COALESCE(target_reached_at, now()), updated_at = now() WHERE id = target_campaign.id;
    RAISE EXCEPTION 'Target campaign telah tercapai';
  END IF;
  IF EXISTS (
    SELECT 1 FROM public.campaign_jobs
    WHERE campaign_id = target_campaign.id AND lower(trim(buzzer_email)) = lower(trim(p_buzzer_email))
  ) THEN
    RAISE EXCEPTION 'Kamu sudah pernah mengambil campaign ini';
  END IF;

  UPDATE public.campaign_jobs
  SET status = 'Diambil', buzzer_email = lower(trim(p_buzzer_email)), buzzer_name = p_buzzer_name,
      gross_price = gross_amount, payout = buzzer_share_amount,
      buzzer_level = snapshot_level, buzzer_percentage = buzzer_share_percentage,
      buzzer_amount = buzzer_share_amount, admin_percentage = 100 - buzzer_share_percentage,
      admin_amount = gross_amount - buzzer_share_amount, updated_at = now()
  WHERE id = target_job.id;

  IF assigned_count + 1 >= GREATEST(target_campaign.slots, 1) THEN
    UPDATE public.campaigns SET target_reached_at = now(), updated_at = now() WHERE id = target_campaign.id;
  END IF;
  RETURN target_job.id;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_campaign_job(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_campaign_job(uuid, text, text) TO anon, authenticated;

-- 6. Kembalikan get_buzzer_campaign_jobs ke versi online murni
CREATE OR REPLACE FUNCTION public.get_buzzer_campaign_jobs(p_buzzer_email text)
RETURNS SETOF public.campaign_jobs
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT job.*
  FROM public.campaign_jobs AS job
  JOIN public.campaigns AS campaign ON campaign.id = job.campaign_id
  WHERE (
      EXISTS (
        SELECT 1
        FROM public.buzzer_applications AS application
        WHERE lower(trim(application.email)) = lower(trim(p_buzzer_email))
          AND application.status = 'approved'
      )
      OR EXISTS (
        SELECT 1
        FROM public.app_accounts AS acc
        WHERE lower(trim(acc.email)) = lower(trim(p_buzzer_email))
          AND acc.role = 'buzzer'
      )
    )
    AND campaign.payment_status = 'Pembayaran Disetujui'
    AND campaign.start_date ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
    AND campaign.start_date::date <= CURRENT_DATE
    AND campaign.deadline ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
    AND campaign.deadline::date >= CURRENT_DATE
    AND (
      lower(trim(coalesce(job.buzzer_email, ''))) = lower(trim(p_buzzer_email))
      OR (
        job.status = 'Tersedia'
        AND job.buzzer_email IS NULL
        AND campaign.status IN ('Aktif', 'Review')
        AND (
          SELECT count(*)
          FROM public.campaign_jobs AS assigned_job
          WHERE assigned_job.campaign_id = campaign.id
            AND assigned_job.buzzer_email IS NOT NULL
        ) < GREATEST(campaign.slots, 1)
        AND (
          EXISTS (
            SELECT 1
            FROM public.social_accounts AS account
            WHERE lower(trim(account.buzzer_email)) = lower(trim(p_buzzer_email))
              AND lower(trim(account.platform)) = lower(trim(job.platform))
              AND lower(trim(account.verification)) = 'terverifikasi'
              AND (account.is_active = true OR account.is_active IS NULL)
          )
          OR EXISTS (
            SELECT 1
            FROM public.buzzer_applications AS application
            WHERE lower(trim(application.email)) = lower(trim(p_buzzer_email))
              AND application.status = 'approved'
              AND lower(trim(application.platform)) = lower(trim(job.platform))
          )
          OR EXISTS (
            SELECT 1
            FROM public.app_accounts AS account
            WHERE lower(trim(account.email)) = lower(trim(p_buzzer_email))
              AND account.role = 'buzzer'
              AND lower(trim(coalesce(account.platform, ''))) = lower(trim(job.platform))
          )
        )
      )
    )
  ORDER BY job.created_at DESC;
$$;

REVOKE ALL ON FUNCTION public.get_buzzer_campaign_jobs(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_buzzer_campaign_jobs(text) TO anon, authenticated;

-- 7. Kembalikan credit_buzzer_after_job_approval ke versi standar online
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
    INSERT INTO public.buzzer_wallets (buzzer_email, buzzer_name, balance, pending_balance, campaigns_completed, updated_at)
    VALUES (lower(trim(NEW.buzzer_email)), COALESCE(NEW.buzzer_name, NEW.buzzer_email), snapshot_buzzer_amount, 0, 1, now())
    ON CONFLICT (buzzer_email) DO UPDATE SET
      balance = public.buzzer_wallets.balance + EXCLUDED.balance,
      campaigns_completed = COALESCE(public.buzzer_wallets.campaigns_completed, 0) + 1,
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
