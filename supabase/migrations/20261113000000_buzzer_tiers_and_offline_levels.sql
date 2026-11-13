-- =====================================================================
-- Migration: 20261113000000_buzzer_tiers_and_offline_levels.sql
-- Description: Klasifikasi buzzer Biasa / Pro / Premium.
--
--   1. `buzzer_levels.tier`      → kelas untuk setiap level
--        Bronze                    → Biasa
--        Silver, Gold              → Pro
--        Platinum, Diamond         → Premium
--   2. `service_pricing.buzzer_tier` → harga per platform + jenis + kelas
--   3. `campaigns.buzzer_tier`   → kelas yang dipilih customer
--   4. `campaign_jobs.required_tier` → kelas job (disalin dari campaign)
--   5. `recalculate_buzzer_level` → buzzer OFFLINE juga punya level
--   6. `claim_campaign_job`      → validasi kelas dua arah:
--        - naik  : kelas lebih tinggi boleh ambil job lebih rendah
--                  setelah 6 jam per tingkat
--        - turun : kelas satu tingkat di bawah boleh mengambil setelah
--                  12 jam (tidak pernah dua tingkat)
--   7. `create_customer_custom_scheduled_payment_campaign` → p_buzzer_tier
--
--   Data lama otomatis menjadi kelas 'Biasa' sehingga order dan job yang
--   sedang berjalan tidak berubah.
-- =====================================================================

-- 1. Kelas pada tabel level ------------------------------------------
ALTER TABLE public.buzzer_levels
  ADD COLUMN IF NOT EXISTS tier text;

UPDATE public.buzzer_levels
SET tier = CASE lower(trim(name))
    WHEN 'bronze'   THEN 'Biasa'
    WHEN 'silver'   THEN 'Pro'
    WHEN 'gold'     THEN 'Pro'
    WHEN 'platinum' THEN 'Premium'
    WHEN 'diamond'  THEN 'Premium'
    ELSE 'Biasa'
  END
WHERE tier IS NULL OR trim(tier) = '';

ALTER TABLE public.buzzer_levels ALTER COLUMN tier SET DEFAULT 'Biasa';
ALTER TABLE public.buzzer_levels ALTER COLUMN tier SET NOT NULL;
ALTER TABLE public.buzzer_levels DROP CONSTRAINT IF EXISTS buzzer_levels_tier_check;
ALTER TABLE public.buzzer_levels
  ADD CONSTRAINT buzzer_levels_tier_check CHECK (tier IN ('Biasa', 'Pro', 'Premium'));

-- 2. Kelas pada harga layanan ----------------------------------------
ALTER TABLE public.service_pricing
  ADD COLUMN IF NOT EXISTS buzzer_tier text NOT NULL DEFAULT 'Biasa';

ALTER TABLE public.service_pricing DROP CONSTRAINT IF EXISTS service_pricing_tier_check;
ALTER TABLE public.service_pricing
  ADD CONSTRAINT service_pricing_tier_check CHECK (buzzer_tier IN ('Biasa', 'Pro', 'Premium'));

-- Satu kombinasi platform + jenis layanan kini punya satu harga per kelas.
ALTER TABLE public.service_pricing DROP CONSTRAINT IF EXISTS service_pricing_platform_service_type_key;
DROP INDEX IF EXISTS public.service_pricing_platform_service_type_key;
ALTER TABLE public.service_pricing DROP CONSTRAINT IF EXISTS service_pricing_platform_service_type_buzzer_tier_key;
ALTER TABLE public.service_pricing
  ADD CONSTRAINT service_pricing_platform_service_type_buzzer_tier_key
  UNIQUE (platform, service_type, buzzer_tier);

CREATE INDEX IF NOT EXISTS service_pricing_tier_lookup_idx
  ON public.service_pricing (platform, service_type, buzzer_tier, status);

-- 3. Kelas pada campaign ---------------------------------------------
ALTER TABLE public.campaigns
  ADD COLUMN IF NOT EXISTS buzzer_tier text NOT NULL DEFAULT 'Biasa';

ALTER TABLE public.campaigns DROP CONSTRAINT IF EXISTS campaigns_buzzer_tier_check;
ALTER TABLE public.campaigns
  ADD CONSTRAINT campaigns_buzzer_tier_check CHECK (buzzer_tier IN ('Biasa', 'Pro', 'Premium'));

-- 4. Kelas pada job ---------------------------------------------------
ALTER TABLE public.campaign_jobs
  ADD COLUMN IF NOT EXISTS required_tier text NOT NULL DEFAULT 'Biasa';

ALTER TABLE public.campaign_jobs DROP CONSTRAINT IF EXISTS campaign_jobs_required_tier_check;
ALTER TABLE public.campaign_jobs
  ADD CONSTRAINT campaign_jobs_required_tier_check CHECK (required_tier IN ('Biasa', 'Pro', 'Premium'));

-- Salin kelas campaign ke setiap job yang dibuat sesudah ini.
CREATE OR REPLACE FUNCTION public.set_campaign_job_required_tier()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  SELECT COALESCE(c.buzzer_tier, 'Biasa') INTO NEW.required_tier
  FROM public.campaigns AS c
  WHERE c.id = NEW.campaign_id;

  NEW.required_tier := COALESCE(NEW.required_tier, 'Biasa');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_campaign_job_required_tier ON public.campaign_jobs;
CREATE TRIGGER set_campaign_job_required_tier
  BEFORE INSERT ON public.campaign_jobs
  FOR EACH ROW EXECUTE FUNCTION public.set_campaign_job_required_tier();

-- Samakan job lama dengan kelas campaign-nya.
UPDATE public.campaign_jobs AS job
SET required_tier = COALESCE(campaign.buzzer_tier, 'Biasa')
FROM public.campaigns AS campaign
WHERE campaign.id = job.campaign_id
  AND job.required_tier IS DISTINCT FROM COALESCE(campaign.buzzer_tier, 'Biasa');

-- 5. Helper kelas ------------------------------------------------------
CREATE OR REPLACE FUNCTION public.buzzer_tier_rank(p_tier text)
RETURNS integer
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE lower(trim(COALESCE(p_tier, '')))
    WHEN 'premium' THEN 3
    WHEN 'pro'     THEN 2
    WHEN 'biasa'   THEN 1
    ELSE 1
  END;
$$;

CREATE OR REPLACE FUNCTION public.buzzer_tier_for_followers(p_followers integer)
RETURNS text
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(
    (
      SELECT bl.tier
      FROM public.buzzer_levels AS bl
      WHERE bl.min_followers <= GREATEST(COALESCE(p_followers, 0), 0)
      ORDER BY bl.min_followers DESC, bl.sort_order DESC
      LIMIT 1
    ),
    'Biasa'
  );
$$;

GRANT EXECUTE ON FUNCTION public.buzzer_tier_rank(text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.buzzer_tier_for_followers(integer) TO anon, authenticated, service_role;

-- 6. Level untuk SEMUA kategori, termasuk Buzzer Offline --------------
CREATE OR REPLACE FUNCTION public.recalculate_buzzer_level(target_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  normalized_email text := lower(trim(target_email));
  total_followers integer;
  resolved_level text;
  buzzer_name_value text;
BEGIN
  IF normalized_email IS NULL OR normalized_email = '' THEN
    RETURN;
  END IF;

  -- Total followers dari akun terverifikasi yang masih aktif.
  SELECT COALESCE(SUM(followers), 0)::integer
    INTO total_followers
  FROM public.social_accounts
  WHERE lower(trim(buzzer_email)) = normalized_email
    AND verification = 'Terverifikasi'
    AND COALESCE(is_active, true);

  -- Semua kategori buzzer (Online, Offline, Offline-Online) punya level.
  -- Level offline hanya badge: nominal bayaran tetap payout_per_buzzer.
  SELECT bl.name
    INTO resolved_level
  FROM public.buzzer_levels AS bl
  WHERE bl.min_followers <= total_followers
  ORDER BY bl.min_followers DESC, bl.sort_order DESC
  LIMIT 1;

  SELECT COALESCE(
    (
      SELECT buzzer_name
      FROM public.buzzer_wallets
      WHERE lower(trim(buzzer_email)) = normalized_email
      LIMIT 1
    ),
    (
      SELECT name
      FROM public.app_accounts
      WHERE lower(trim(email)) = normalized_email
      LIMIT 1
    ),
    split_part(normalized_email, '@', 1)
  ) INTO buzzer_name_value;

  INSERT INTO public.buzzer_wallets (
    buzzer_email,
    buzzer_name,
    followers,
    verified_followers,
    level,
    level_assigned_at
  ) VALUES (
    normalized_email,
    buzzer_name_value,
    total_followers,
    total_followers,
    resolved_level,
    CASE WHEN resolved_level IS NULL THEN NULL ELSE now() END
  )
  ON CONFLICT (buzzer_email) DO UPDATE SET
    followers = EXCLUDED.followers,
    verified_followers = EXCLUDED.verified_followers,
    level = EXCLUDED.level,
    level_assigned_at = CASE
      WHEN EXCLUDED.level IS NULL THEN NULL
      WHEN public.buzzer_wallets.level IS DISTINCT FROM EXCLUDED.level THEN now()
      ELSE public.buzzer_wallets.level_assigned_at
    END,
    updated_at = now();
END;
$$;

GRANT EXECUTE ON FUNCTION public.recalculate_buzzer_level(text) TO anon, authenticated, service_role;

-- Hitung ulang level seluruh buzzer agar offline langsung dapat badge.
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT DISTINCT lower(trim(email)) AS email
    FROM public.app_accounts
    WHERE role = 'buzzer' AND email IS NOT NULL
  LOOP
    PERFORM public.recalculate_buzzer_level(r.email);
  END LOOP;
END;
$$;

-- 7. Klaim job dengan validasi kelas dua arah -------------------------
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

  -- Kelas & waktu
  required_tier_value text;
  buzzer_tier_value text;
  required_rank integer;
  buzzer_rank integer;
  buzzer_followers integer;
  publish_at timestamptz;
  elapsed_hours numeric;

  -- Aturan fallback
  c_rise_hours constant integer := 6;   -- naik satu tingkat
  c_fall_hours constant integer := 12;  -- turun satu tingkat
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

  -- 8. Followers & kelas buzzer -------------------------------------
  IF target_job.platform = 'Offline' THEN
    -- Buzzer offline: level dari total followers semua akun terverifikasi.
    SELECT COALESCE(SUM(followers), 0)::integer INTO buzzer_followers
    FROM public.social_accounts
    WHERE lower(trim(buzzer_email)) = lower(trim(p_buzzer_email))
      AND verification = 'Terverifikasi'
      AND COALESCE(is_active, true);
  ELSE
    -- Buzzer online: level dari akun yang platformnya cocok dengan job.
    SELECT COALESCE(SUM(followers), 0)::integer INTO buzzer_followers
    FROM public.social_accounts
    WHERE lower(trim(buzzer_email)) = lower(trim(p_buzzer_email))
      AND lower(trim(platform)) = lower(trim(target_job.platform))
      AND lower(trim(verification)) = 'terverifikasi'
      AND COALESCE(is_active, true);
  END IF;

  buzzer_tier_value := public.buzzer_tier_for_followers(COALESCE(buzzer_followers, 0));
  buzzer_rank := public.buzzer_tier_rank(buzzer_tier_value);

  -- 9. Validasi kelas job (job offline tidak memakai kelas) ----------
  IF target_job.platform <> 'Offline' THEN
    required_tier_value := COALESCE(
      NULLIF(trim(target_job.required_tier), ''),
      NULLIF(trim(target_campaign.buzzer_tier), ''),
      'Biasa'
    );
    required_rank := public.buzzer_tier_rank(required_tier_value);

    -- Waktu job mulai terlihat buzzer: tanggal mulai campaign (kalau ada)
    -- atau saat job dibuat.
    publish_at := target_job.created_at;
    IF target_campaign.start_date ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' THEN
      publish_at := GREATEST(publish_at, target_campaign.start_date::date::timestamptz);
    END IF;
    elapsed_hours := GREATEST(EXTRACT(EPOCH FROM (now() - publish_at)) / 3600.0, 0);

    IF buzzer_rank >= required_rank THEN
      -- Naik kelas: butuh 6 jam per tingkat di atas kelas job.
      IF elapsed_hours < c_rise_hours * (buzzer_rank - required_rank) THEN
        RAISE EXCEPTION 'Job kelas % baru dibuka untuk kelas % setelah % jam',
          required_tier_value, buzzer_tier_value,
          (c_rise_hours * (buzzer_rank - required_rank))::integer;
      END IF;
    ELSIF buzzer_rank = required_rank - 1 THEN
      -- Turun satu tingkat: hanya setelah 12 jam dan job masih kosong.
      IF elapsed_hours < c_fall_hours THEN
        RAISE EXCEPTION 'Job kelas % masih diprioritaskan untuk kelas % sampai % jam pertama',
          required_tier_value, required_tier_value, c_fall_hours;
      END IF;
    ELSE
      RAISE EXCEPTION 'Job ini membutuhkan buzzer kelas minimal %', required_tier_value;
    END IF;
  END IF;

  -- 10. Payout calculation & Snapshot ------------------------------
  gross_amount := GREATEST(COALESCE(target_job.gross_price, target_campaign.budget / GREATEST(target_campaign.slots, 1), 0), 0);
  IF gross_amount <= 0 THEN
    RAISE EXCEPTION 'Harga job tidak valid';
  END IF;

  IF target_job.platform = 'Offline' THEN
    -- =================================================================
    -- OFFLINE: nominal tetap admin (payout_per_buzzer). Level hanya badge.
    -- =================================================================
    buzzer_share_amount := GREATEST(COALESCE(target_job.payout, target_campaign.payout_per_buzzer, 0), 0);

    IF buzzer_share_amount <= 0 THEN
      RAISE EXCEPTION 'Nominal buzzer belum ditetapkan admin untuk job ini';
    END IF;

    IF buzzer_share_amount > gross_amount THEN
      RAISE EXCEPTION 'Total bayaran buzzer tidak boleh melebihi harga pesanan.';
    END IF;

    SELECT bl.name INTO snapshot_level
    FROM public.buzzer_levels AS bl
    WHERE bl.min_followers <= COALESCE(buzzer_followers, 0)
    ORDER BY bl.min_followers DESC, bl.sort_order DESC
    LIMIT 1;

    UPDATE public.campaign_jobs
    SET status = 'Diambil',
        buzzer_email = lower(trim(p_buzzer_email)),
        buzzer_name = p_buzzer_name,
        buzzer_level = snapshot_level,
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
    FROM public.buzzer_levels AS bl
    WHERE bl.min_followers <= COALESCE(buzzer_followers, 0)
    ORDER BY bl.min_followers DESC, bl.sort_order DESC
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

  -- 11. If this filled the last slot, mark campaign target reached
  IF assigned_count + 1 >= GREATEST(target_campaign.slots, 1) THEN
    UPDATE public.campaigns SET target_reached_at = now() WHERE id = target_campaign.id;
  END IF;

  RETURN target_job.id;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_campaign_job(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_campaign_job(uuid, text, text) TO anon, authenticated;

-- 8. Pesanan sendiri: harga sesuai kelas ------------------------------
DROP FUNCTION IF EXISTS public.create_customer_custom_scheduled_payment_campaign(
  text, text, text, text, text, text, text, text, text, integer, text, text
);

CREATE OR REPLACE FUNCTION public.create_customer_custom_scheduled_payment_campaign(
  p_invoice_no text,
  p_customer_name text,
  p_customer_email text,
  p_campaign_name text,
  p_platform text,
  p_service_type text,
  p_method text,
  p_note text,
  p_brief text,
  p_slots integer,
  p_start_date text,
  p_deadline text,
  p_buzzer_tier text DEFAULT 'Biasa'
)
RETURNS TABLE(payment_id uuid, campaign_id uuid)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  pricing public.service_pricing%ROWTYPE;
  created_payment_id uuid;
  created_campaign_id uuid;
  normalized_email text := lower(trim(p_customer_email));
  snapshot_total numeric;
  resolved_tier text := CASE lower(trim(COALESCE(p_buzzer_tier, 'Biasa')))
    WHEN 'premium' THEN 'Premium'
    WHEN 'pro'     THEN 'Pro'
    ELSE 'Biasa'
  END;
BEGIN
  IF p_slots IS NULL OR p_slots < 1 THEN
    RAISE EXCEPTION 'Jumlah buzzer minimal 1';
  END IF;
  IF p_start_date !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
     OR p_deadline !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
     OR p_deadline::date < p_start_date::date THEN
    RAISE EXCEPTION 'Rentang tanggal campaign tidak valid';
  END IF;

  SELECT * INTO pricing
  FROM public.service_pricing
  WHERE status = 'Aktif'
    AND lower(trim(platform)) = lower(trim(p_platform))
    AND lower(trim(service_type)) = lower(trim(p_service_type))
    AND lower(trim(buzzer_tier)) = lower(trim(resolved_tier));
  IF pricing.id IS NULL THEN
    RAISE EXCEPTION 'Harga layanan kelas % belum dikonfigurasi admin', resolved_tier;
  END IF;

  snapshot_total := pricing.price_per_buzzer * p_slots;

  INSERT INTO public.payments (
    invoice_no, customer_name, customer_email, campaign_name, campaign_type,
    method, note, amount, buzzer_cost, fee, status, paid_at,
    price_per_buzzer, buzzer_count, total_amount
  ) VALUES (
    p_invoice_no, p_customer_name, normalized_email, p_campaign_name, p_platform,
    p_method, p_note, snapshot_total, 0, snapshot_total, 'Menunggu Verifikasi', now(),
    pricing.price_per_buzzer, p_slots, snapshot_total
  ) RETURNING id INTO created_payment_id;

  INSERT INTO public.campaigns (
    title, customer_email, customer_name, platform, service_type, brief, budget,
    payout_per_buzzer, slots, start_date, deadline, payment_id, payment_status, status,
    price_per_buzzer, buzzer_count, total_amount, buzzer_tier
  ) VALUES (
    p_campaign_name, normalized_email, p_customer_name, p_platform, p_service_type,
    p_brief, snapshot_total, 0, p_slots, p_start_date, p_deadline, created_payment_id,
    'Menunggu Verifikasi', 'Draft', pricing.price_per_buzzer, p_slots, snapshot_total, resolved_tier
  ) RETURNING id INTO created_campaign_id;

  UPDATE public.payments
  SET campaign_id = created_campaign_id, updated_at = now()
  WHERE id = created_payment_id;

  RETURN QUERY SELECT created_payment_id, created_campaign_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_customer_custom_scheduled_payment_campaign(
  text, text, text, text, text, text, text, text, text, integer, text, text, text
) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_customer_custom_scheduled_payment_campaign(
  text, text, text, text, text, text, text, text, text, integer, text, text, text
) TO anon, authenticated;
