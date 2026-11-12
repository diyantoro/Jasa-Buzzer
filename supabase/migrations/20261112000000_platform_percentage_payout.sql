-- =====================================================================
-- Migration: 20261112000000_platform_percentage_payout.sql
-- Description: Bayaran job online memakai PERSENTASE level, bukan nominal
--              tetap. Level diambil dari akun sosial media yang
--              platformnya cocok dengan job (terverifikasi & aktif).
--
--              Alasan: harga job di sistem berkisar Rp 8.000 - Rp 300.000,
--              sedangkan nominal tetap per level (Gold Rp 150.000,
--              Platinum Rp 400.000, Diamond Rp 1.000.000) membuat seluruh
--              harga job habis ke buzzer (margin admin Rp 0).
--
--              Aturan baru:
--                Bronze 40%, Silver 45%, Gold 50%, Platinum 55%, Diamond 60%
--              (nilai disimpan di buzzer_levels.payout_percentage dan
--               dapat diubah admin)
--
--              Job Offline TIDAK berubah: tetap payout_per_buzzer admin.
-- =====================================================================

-- 1. Kolom persentase pada tabel level -------------------------------
ALTER TABLE public.buzzer_levels
  ADD COLUMN IF NOT EXISTS payout_percentage numeric(5,2) NOT NULL DEFAULT 40;

UPDATE public.buzzer_levels
SET payout_percentage = CASE lower(trim(name))
    WHEN 'bronze'   THEN 40
    WHEN 'silver'   THEN 45
    WHEN 'gold'     THEN 50
    WHEN 'platinum' THEN 55
    WHEN 'diamond'  THEN 60
    ELSE payout_percentage
  END
WHERE payout_percentage IS NULL
   OR (payout_percentage = 40 AND lower(trim(name)) <> 'bronze');

-- 2. Fungsi klaim job ------------------------------------------------
CREATE OR REPLACE FUNCTION public.claim_campaign_job(p_job_id uuid, p_buzzer_email text, p_buzzer_name text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_job public.campaign_jobs%ROWTYPE;
  target_campaign public.campaigns%ROWTYPE;
  assigned_count integer;
  snapshot_level text;
  gross_amount numeric;
  buzzer_share_percentage numeric;
  buzzer_share_amount numeric;
  user_category text;
  app_status text;
  acc_role text;
BEGIN
  -- 1. Check account verification
  SELECT status, buzzer_category INTO app_status, user_category
  FROM public.buzzer_applications
  WHERE lower(trim(email)) = lower(trim(p_buzzer_email))
  ORDER BY submitted_at DESC
  LIMIT 1;

  SELECT role, company INTO acc_role, user_category
  FROM public.app_accounts
  WHERE lower(trim(email)) = lower(trim(p_buzzer_email))
  LIMIT 1;

  IF (app_status IS DISTINCT FROM 'approved') AND (acc_role IS DISTINCT FROM 'buzzer') THEN
    RAISE EXCEPTION 'Akun buzzer belum diverifikasi admin';
  END IF;

  -- 2. Lock job
  SELECT * INTO target_job FROM public.campaign_jobs WHERE id = p_job_id FOR UPDATE;
  IF NOT FOUND OR target_job.status <> 'Tersedia' OR target_job.buzzer_email IS NOT NULL THEN
    RAISE EXCEPTION 'Job sudah tidak tersedia';
  END IF;

  -- 3. Lock campaign
  SELECT * INTO target_campaign FROM public.campaigns WHERE id = target_job.campaign_id FOR UPDATE;
  IF NOT FOUND OR target_campaign.payment_status <> 'Pembayaran Disetujui' OR target_campaign.status NOT IN ('Aktif', 'Review') THEN
    RAISE EXCEPTION 'Campaign belum aktif atau pembayaran belum disetujui';
  END IF;

  -- 4. Check deadline (do not allow expired campaign)
  IF target_campaign.deadline ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' AND target_campaign.deadline::date < CURRENT_DATE THEN
    RAISE EXCEPTION 'Masa campaign telah berakhir';
  END IF;

  -- 5. Strict category & platform validation
  IF target_job.platform = 'Offline' THEN
    IF user_category IS NOT NULL AND NOT (
      lower(user_category) LIKE '%offline%' OR lower(user_category) LIKE '%hybrid%'
    ) THEN
      RAISE EXCEPTION 'Job Offline hanya dapat diambil oleh akun kategori Offline Buzzer';
    END IF;
  ELSE
    IF user_category IS NOT NULL AND lower(user_category) = 'buzzer offline' THEN
      RAISE EXCEPTION 'Job Online tidak dapat diambil oleh akun kategori Offline Buzzer';
    END IF;

    IF target_campaign.start_date ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' AND target_campaign.start_date::date > CURRENT_DATE THEN
      RAISE EXCEPTION 'Campaign belum memasuki tanggal mulai';
    END IF;

    -- Online job requires matching verified social account
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
  END IF;

  -- 6. Check slot availability
  SELECT count(*)::integer INTO assigned_count
  FROM public.campaign_jobs WHERE campaign_id = target_campaign.id AND buzzer_email IS NOT NULL;

  IF assigned_count >= GREATEST(target_campaign.slots, 1) THEN
    UPDATE public.campaigns SET target_reached_at = COALESCE(target_reached_at, now()), updated_at = now() WHERE id = target_campaign.id;
    RAISE EXCEPTION 'Target campaign telah tercapai';
  END IF;

  -- 7. Prevent duplicate claiming
  IF EXISTS (
    SELECT 1 FROM public.campaign_jobs
    WHERE campaign_id = target_campaign.id AND lower(trim(buzzer_email)) = lower(trim(p_buzzer_email))
  ) THEN
    RAISE EXCEPTION 'Kamu sudah pernah mengambil campaign ini';
  END IF;

  -- 8. Payout calculation & Snapshot
  gross_amount := GREATEST(COALESCE(target_job.gross_price, target_campaign.budget / GREATEST(target_campaign.slots, 1), 0), 0);
  IF gross_amount <= 0 THEN
    RAISE EXCEPTION 'Harga job tidak valid';
  END IF;

  IF target_job.platform = 'Offline' THEN
    -- =================================================================
    -- OFFLINE: nominal tetap yang ditetapkan admin (payout_per_buzzer).
    -- =================================================================
    buzzer_share_amount := GREATEST(COALESCE(target_job.payout, target_campaign.payout_per_buzzer, 0), 0);

    IF buzzer_share_amount <= 0 THEN
      RAISE EXCEPTION 'Nominal buzzer belum ditetapkan admin untuk job ini';
    END IF;

    IF buzzer_share_amount > gross_amount THEN
      RAISE EXCEPTION 'Total bayaran buzzer tidak boleh melebihi harga pesanan.';
    END IF;

    UPDATE public.campaign_jobs
    SET status = 'Diambil',
        buzzer_email = lower(trim(p_buzzer_email)),
        buzzer_name = p_buzzer_name,
        buzzer_level = NULL,
        buzzer_percentage = NULL,
        buzzer_amount = buzzer_share_amount,
        admin_percentage = NULL,
        admin_amount = gross_amount - buzzer_share_amount,
        payout = buzzer_share_amount,
        updated_at = now()
    WHERE id = target_job.id;
  ELSE
    -- =================================================================
    -- ONLINE: persentase level dari AKUN yang platformnya cocok.
    -- Bronze 40% ... Diamond 60% dari harga job.
    -- =================================================================
    SELECT bl.name, bl.payout_percentage
      INTO snapshot_level, buzzer_share_percentage
    FROM public.social_accounts AS sa
    JOIN public.buzzer_levels AS bl ON sa.followers >= bl.min_followers
    WHERE lower(trim(sa.buzzer_email)) = lower(trim(p_buzzer_email))
      AND lower(trim(sa.platform)) = lower(trim(target_job.platform))
      AND lower(trim(sa.verification)) = 'terverifikasi'
      AND (sa.is_active = true OR sa.is_active IS NULL)
    ORDER BY bl.min_followers DESC
    LIMIT 1;

    -- Jaring pengaman: klaim sebenarnya sudah divalidasi di langkah 5.
    IF snapshot_level IS NULL THEN
      snapshot_level := 'Bronze';
      SELECT payout_percentage INTO buzzer_share_percentage
      FROM public.buzzer_levels
      WHERE lower(trim(name)) = 'bronze';
    END IF;

    IF buzzer_share_percentage IS NULL OR buzzer_share_percentage <= 0 THEN
      buzzer_share_percentage := 40;
    END IF;

    buzzer_share_amount := ROUND(gross_amount * buzzer_share_percentage / 100);
    IF buzzer_share_amount > gross_amount THEN
      buzzer_share_amount := gross_amount;
    END IF;
    IF buzzer_share_amount < 0 THEN
      buzzer_share_amount := 0;
    END IF;

    UPDATE public.campaign_jobs
    SET status = 'Diambil',
        buzzer_email = lower(trim(p_buzzer_email)),
        buzzer_name = p_buzzer_name,
        buzzer_level = snapshot_level,
        buzzer_percentage = buzzer_share_percentage,
        buzzer_amount = buzzer_share_amount,
        admin_percentage = 100 - buzzer_share_percentage,
        admin_amount = gross_amount - buzzer_share_amount,
        payout = buzzer_share_amount,
        updated_at = now()
    WHERE id = target_job.id;
  END IF;

  -- 9. If this filled the last slot, mark campaign target reached
  IF assigned_count + 1 >= GREATEST(target_campaign.slots, 1) THEN
    UPDATE public.campaigns SET target_reached_at = now() WHERE id = target_campaign.id;
  END IF;

  RETURN target_job.id;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_campaign_job(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_campaign_job(uuid, text, text) TO anon, authenticated;
