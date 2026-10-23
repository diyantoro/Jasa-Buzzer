-- =====================================================================
-- Migration: 20261005160000_offline_buzzer_pricing_and_payout.sql
-- Description: SISTEM HARGA DAN PEMBAGIAN PEMBAYARAN KHUSUS OFFLINE BUZZER
--              - Offline buzzer TIDAK menggunakan Level Buzzer
--              - Payout per buzzer ditentukan oleh Admin
--              - Total Anggaran Buzzer = slots * payout_per_buzzer
--              - Pendapatan Admin = customer_price - total_anggaran_buzzer
--              - Payout masuk ke wallet hanya setelah verifikasi pengerjaan admin
--              - Snapshot payout pada job saat buzzer claim
--              - Fitur Online Buzzer tetap 100% menggunakan level buzzer
-- =====================================================================

-- 1. Tambah kolom payout_per_buzzer pada service_catalogs jika belum ada
ALTER TABLE public.service_catalogs
  ADD COLUMN IF NOT EXISTS payout_per_buzzer numeric NOT NULL DEFAULT 0;

-- 2. Fungsi untuk update payout per buzzer oleh Admin pada campaign Offline
CREATE OR REPLACE FUNCTION public.update_offline_campaign_payout(
  p_campaign_id uuid,
  p_payout_per_buzzer numeric
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_camp public.campaigns%ROWTYPE;
  total_anggaran numeric;
BEGIN
  SELECT * INTO target_camp FROM public.campaigns WHERE id = p_campaign_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Kampanye tidak ditemukan';
  END IF;

  IF target_camp.platform <> 'Offline' THEN
    RAISE EXCEPTION 'Hanya kampanye Offline yang dapat mengubah nominal bayaran per buzzer';
  END IF;

  IF p_payout_per_buzzer IS NULL OR p_payout_per_buzzer < 0 THEN
    RAISE EXCEPTION 'Nominal bayaran per buzzer tidak valid';
  END IF;

  total_anggaran := target_camp.slots * p_payout_per_buzzer;
  IF total_anggaran > target_camp.budget THEN
    RAISE EXCEPTION 'Total bayaran buzzer tidak boleh melebihi harga pesanan.';
  END IF;

  -- Update payout per buzzer pada kampanye
  UPDATE public.campaigns
  SET payout_per_buzzer = p_payout_per_buzzer,
      updated_at = now()
  WHERE id = p_campaign_id;

  -- Update job yang BELUM diambil buzzer (status Tersedia dan buzzer_email IS NULL)
  -- Job yang SUDAH diambil (buzzer_email IS NOT NULL) TIDAK diubah (mempertahankan snapshot)
  UPDATE public.campaign_jobs
  SET payout = p_payout_per_buzzer,
      buzzer_amount = p_payout_per_buzzer,
      admin_amount = GREATEST(COALESCE(gross_price, target_camp.budget / GREATEST(target_camp.slots, 1)) - p_payout_per_buzzer, 0),
      updated_at = now()
  WHERE campaign_id = p_campaign_id
    AND buzzer_email IS NULL
    AND status = 'Tersedia';

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.update_offline_campaign_payout(uuid, numeric) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_offline_campaign_payout(uuid, numeric) TO anon, authenticated;

-- 3. Perbarui approve_campaign_payment agar job offline langsung menggunakan payout_per_buzzer
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
  job_payout numeric;
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
    
    -- Untuk Offline, jika target_campaign.payout_per_buzzer > 0, gunakan itu
    IF target_campaign.platform = 'Offline' THEN
      job_payout := COALESCE(target_campaign.payout_per_buzzer, 0);
    ELSE
      job_payout := 0; -- Online buzzer dihitung saat claim berdasarkan level
    END IF;

    FOR slot_index IN 1..slot_count LOOP
      INSERT INTO public.campaign_jobs (
        campaign_id, campaign_title, platform, gross_price, payout, deadline, brief, status
      ) VALUES (
        target_campaign.id, target_campaign.title, target_campaign.platform,
        base_amount + CASE WHEN slot_index <= remainder THEN 1 ELSE 0 END,
        job_payout,
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

-- 4. Perbarui claim_campaign_job:
--    - Jika Offline: Menggunakan payout_per_buzzer TANPA level buzzer (Bronze/Silver/Gold ditiadakan).
--    - Jika Online: Tetap menggunakan algoritma level buzzer yang ada tanpa diubah.
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
    -- Offline job: Buzzer must be Offline Buzzer
    IF user_category IS NOT NULL AND NOT (
      lower(user_category) LIKE '%offline%' OR lower(user_category) LIKE '%hybrid%'
    ) THEN
      RAISE EXCEPTION 'Job Offline hanya dapat diambil oleh akun kategori Offline Buzzer';
    END IF;
  ELSE
    -- Online job: Offline-only buzzers cannot take online jobs
    IF user_category IS NOT NULL AND lower(user_category) = 'buzzer offline' THEN
      RAISE EXCEPTION 'Job Online tidak dapat diambil oleh akun kategori Offline Buzzer';
    END IF;

    -- Online job start date check
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
    -- KHUSUS OFFLINE BUZZER:
    -- TIDAK menggunakan Level Buzzer (Bronze/Silver/Gold dsb).
    -- Menggunakan nominal bayaran per buzzer yang ditentukan admin.
    -- =================================================================
    buzzer_share_amount := GREATEST(COALESCE(target_job.payout, target_campaign.payout_per_buzzer, 0), 0);
    
    IF buzzer_share_amount <= 0 THEN
      -- Fallback jika belum di-set: gunakan harga per slot
      buzzer_share_amount := gross_amount;
    END IF;

    IF buzzer_share_amount > gross_amount THEN
      RAISE EXCEPTION 'Total bayaran buzzer tidak boleh melebihi harga pesanan.';
    END IF;

    -- Snapshot langsung ke job tanpa level buzzer
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
    -- KHUSUS ONLINE BUZZER:
    -- TETAP 100% menggunakan Level Buzzer dan persentase yang sudah ada.
    -- =================================================================
    SELECT level INTO snapshot_level FROM public.buzzer_wallets WHERE lower(trim(buzzer_email)) = lower(trim(p_buzzer_email));
    IF snapshot_level IS NULL THEN
      snapshot_level := 'Bronze';
    END IF;

    buzzer_share_percentage := public.buzzer_share_percentage_for_level(snapshot_level);
    buzzer_share_amount := ROUND(gross_amount * buzzer_share_percentage / 100);

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
    UPDATE public.campaigns SET target_reached_at = now(), updated_at = now() WHERE id = target_campaign.id;
  END IF;

  RETURN target_job.id;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_campaign_job(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_campaign_job(uuid, text, text) TO anon, authenticated;

-- 5. Perbarui credit_buzzer_after_job_approval:
--    - Transaksi wallet untuk Offline diberi judul "Pendapatan Job Offline"
--    - Saldo hanya bertambah setelah admin memverifikasi bukti pengerjaan
CREATE OR REPLACE FUNCTION public.credit_buzzer_after_job_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  snapshot_buzzer_amount numeric := GREATEST(COALESCE(NEW.buzzer_amount, NEW.payout, 0), 0);
  snapshot_admin_amount numeric := GREATEST(COALESCE(NEW.admin_amount, NEW.gross_price - snapshot_buzzer_amount, 0), 0);
  trans_title text;
  trans_desc text;
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

    -- Masukkan ke wallet buzzer
    INSERT INTO public.buzzer_wallets (buzzer_email, buzzer_name, balance, pending_balance, updated_at)
    VALUES (lower(trim(NEW.buzzer_email)), COALESCE(NEW.buzzer_name, NEW.buzzer_email), snapshot_buzzer_amount, 0, now())
    ON CONFLICT (buzzer_email) DO UPDATE SET
      balance = public.buzzer_wallets.balance + EXCLUDED.balance,
      updated_at = now();

    -- Catat aktivitas keuangan dengan nama transaksi sesuai kategori
    IF NEW.platform = 'Offline' THEN
      trans_title := 'Pendapatan Job Offline';
      trans_desc := NEW.campaign_title || ' - honor pengerjaan event offline disetujui admin';
    ELSE
      trans_title := 'Payout Buzzer';
      trans_desc := NEW.campaign_title || ' - payout buzzer disetujui admin';
    END IF;

    INSERT INTO public.finance_activity (type, title, description, amount, ref_table, ref_id)
    VALUES ('buzzer', trans_title, trans_desc, snapshot_buzzer_amount, 'campaign_jobs', NEW.id::text);

    IF snapshot_admin_amount > 0 THEN
      INSERT INTO public.finance_activity (type, title, description, amount, ref_table, ref_id)
      VALUES ('admin', 'Komisi Admin', NEW.campaign_title || ' - pendapatan admin dari pengerjaan yang diverifikasi', snapshot_admin_amount, 'campaign_jobs', NEW.id::text);
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS credit_buzzer_after_job_approval ON public.campaign_jobs;
CREATE TRIGGER credit_buzzer_after_job_approval
AFTER UPDATE OF admin_verified_at, status ON public.campaign_jobs
FOR EACH ROW EXECUTE FUNCTION public.credit_buzzer_after_job_approval();
