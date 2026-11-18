-- =====================================================================
-- Migration: 20261116000007_fix_relations_and_constraints.sql
-- Perbaikan relasi & normalisasi setelah audit skema.
--
-- Semua statement dibuat idempoten karena runner menerapkan ulang seluruh
-- migration setiap kali `npm run db:apply` dijalankan.
--
-- Isi:
--   1. Validasi 4 foreign key yang masih berstatus NOT VALID.
--   2. CHECK domain nilai yang dipakai sebagai batas kepercayaan.
--   3. Relasi dua arah campaigns.payment_id <-> payments.campaign_id.
--   4. service_catalog_recommendations.catalog_id: text -> uuid + FK.
--   5. FK akun untuk tabel yang memang dihapus bersama akun.
--   6. CHECK format tanggal (kolom masih text, tapi isinya dijaga).
--   7. Index yang hilang untuk query yang dipakai aplikasi.
--   8. Perbaikan data: akun demo customer yang hilang dari app_accounts.
--   Plus: penjaga di recalculate_buzzer_level() agar trigger hapus
--   social_accounts tidak membuat ulang wallet milik akun yang sudah hilang.
--
-- Yang SENGAJA tidak diubah (lihat docs/SECURITY_HARDENING.md):
--   * total_reviews = 9 dan rating = 5.0 adalah prior Bayesian untuk
--     rating tertimbang, bukan data palsu.
--   * customer_accounts.email tidak diberi FK: alur tamu membuat baris
--     customer_accounts tanpa app_accounts.
--   * bazzer_applications.email tidak diberi FK: pendaftaran publik
--     membuat baris aplikasi sebelum akun ada.
--   * withdrawals/buzzer_ratings/campaign_jobs tidak diberi FK ke
--     app_accounts karena riwayatnya sengaja dipertahankan saat akun
--     dihapus (delete_management_account).
-- =====================================================================
BEGIN;

-- ---------------------------------------------------------------------
-- 1. Validasi foreign key yang tertunda
--    Datanya sudah bersih (0 referensi yatim), jadi aman divalidasi.
-- ---------------------------------------------------------------------
ALTER TABLE public.buzzer_ratings
  VALIDATE CONSTRAINT buzzer_ratings_campaign_id_fkey;
ALTER TABLE public.buzzer_ratings
  VALIDATE CONSTRAINT buzzer_ratings_job_id_fkey;
ALTER TABLE public.campaign_jobs
  VALIDATE CONSTRAINT campaign_jobs_campaign_id_fkey;
ALTER TABLE public.campaign_messages
  VALIDATE CONSTRAINT campaign_messages_campaign_id_fkey;

-- ---------------------------------------------------------------------
-- 2. CHECK domain
-- ---------------------------------------------------------------------

-- role adalah batas kepercayaan: requireAdmin() percaya pada nilai ini.
ALTER TABLE public.app_accounts
  DROP CONSTRAINT IF EXISTS app_accounts_role_check;
ALTER TABLE public.app_accounts
  ADD CONSTRAINT app_accounts_role_check
  CHECK (role IN ('admin', 'buzzer', 'customer'));

ALTER TABLE public.buzzer_ratings
  DROP CONSTRAINT IF EXISTS buzzer_ratings_stars_check;
ALTER TABLE public.buzzer_ratings
  ADD CONSTRAINT buzzer_ratings_stars_check
  CHECK (stars BETWEEN 1 AND 5);

-- admin_wallet adalah tabel singleton: hanya boleh ada baris 'primary'.
ALTER TABLE public.admin_wallet
  DROP CONSTRAINT IF EXISTS admin_wallet_singleton_check;
ALTER TABLE public.admin_wallet
  ADD CONSTRAINT admin_wallet_singleton_check
  CHECK (id = 'primary');

-- ---------------------------------------------------------------------
-- 3. Relasi pembayaran <-> campaign
--    Keduanya sekarang dijaga, dan satu pembayaran hanya boleh menunjuk
--    ke satu campaign. RPC checkout selalu INSERT payments lebih dulu,
--    lalu INSERT campaigns dengan payment_id, baru UPDATE
--    payments.campaign_id — jadi urutan ini aman terhadap FK.
-- ---------------------------------------------------------------------
ALTER TABLE public.campaigns
  DROP CONSTRAINT IF EXISTS campaigns_payment_id_fkey;
ALTER TABLE public.campaigns
  ADD CONSTRAINT campaigns_payment_id_fkey
  FOREIGN KEY (payment_id) REFERENCES public.payments(id)
  ON UPDATE CASCADE ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS campaigns_payment_id_unique_idx
  ON public.campaigns (payment_id)
  WHERE payment_id IS NOT NULL;

ALTER TABLE public.payments
  DROP CONSTRAINT IF EXISTS payments_campaign_id_fkey;
ALTER TABLE public.payments
  ADD CONSTRAINT payments_campaign_id_fkey
  FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id)
  ON UPDATE CASCADE ON DELETE SET NULL;

-- Satu invoice hanya boleh dipakai satu pembayaran.
ALTER TABLE public.payments
  DROP CONSTRAINT IF EXISTS payments_invoice_no_key;
ALTER TABLE public.payments
  ADD CONSTRAINT payments_invoice_no_key UNIQUE (invoice_no);

-- ---------------------------------------------------------------------
-- 4. service_catalog_recommendations.catalog_id: text -> uuid
--    Sebelumnya harus di-cast manual untuk join dan tidak bisa diberi FK.
-- ---------------------------------------------------------------------
DO $$
DECLARE
  current_type text;
BEGIN
  SELECT data_type INTO current_type
    FROM information_schema.columns
   WHERE table_schema = 'public'
     AND table_name = 'service_catalog_recommendations'
     AND column_name = 'catalog_id';

  IF current_type = 'text' THEN
    ALTER TABLE public.service_catalog_recommendations
      DROP CONSTRAINT IF EXISTS service_catalog_recommendations_pkey;
    ALTER TABLE public.service_catalog_recommendations
      DROP CONSTRAINT IF EXISTS service_catalog_recommendations_catalog_id_fkey;
    ALTER TABLE public.service_catalog_recommendations
      ALTER COLUMN catalog_id TYPE uuid USING catalog_id::uuid;
  END IF;
END
$$;

ALTER TABLE public.service_catalog_recommendations
  DROP CONSTRAINT IF EXISTS service_catalog_recommendations_pkey;
ALTER TABLE public.service_catalog_recommendations
  ADD CONSTRAINT service_catalog_recommendations_pkey
  PRIMARY KEY (catalog_id, campaign_type);

ALTER TABLE public.service_catalog_recommendations
  DROP CONSTRAINT IF EXISTS service_catalog_recommendations_catalog_id_fkey;
ALTER TABLE public.service_catalog_recommendations
  ADD CONSTRAINT service_catalog_recommendations_catalog_id_fkey
  FOREIGN KEY (catalog_id) REFERENCES public.service_catalogs(id)
  ON UPDATE CASCADE ON DELETE CASCADE;

-- ---------------------------------------------------------------------
-- 5. FK akun untuk tabel yang dihapus bersama akun
--    delete_management_account() menghapus social_accounts dan
--    buzzer_wallets lebih dulu, jadi CASCADE konsisten dengan alur itu.
-- ---------------------------------------------------------------------
ALTER TABLE public.buzzer_wallets
  DROP CONSTRAINT IF EXISTS buzzer_wallets_buzzer_email_fkey;
ALTER TABLE public.buzzer_wallets
  ADD CONSTRAINT buzzer_wallets_buzzer_email_fkey
  FOREIGN KEY (buzzer_email) REFERENCES public.app_accounts(email)
  ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE public.social_accounts
  DROP CONSTRAINT IF EXISTS social_accounts_buzzer_email_fkey;
ALTER TABLE public.social_accounts
  ADD CONSTRAINT social_accounts_buzzer_email_fkey
  FOREIGN KEY (buzzer_email) REFERENCES public.app_accounts(email)
  ON UPDATE CASCADE ON DELETE CASCADE;

-- Level wallet harus merujuk level yang benar-benar ada, supaya payout
-- tidak dihitung dari level karangan.
ALTER TABLE public.buzzer_wallets
  DROP CONSTRAINT IF EXISTS buzzer_wallets_level_fkey;
ALTER TABLE public.buzzer_wallets
  ADD CONSTRAINT buzzer_wallets_level_fkey
  FOREIGN KEY (level) REFERENCES public.buzzer_levels(name)
  ON UPDATE CASCADE ON DELETE SET NULL;

-- recalculate_buzzer_level() dipanggil trigger AFTER DELETE pada
-- social_accounts. Tanpa penjaga, menghapus akun akan memicu trigger yang
-- membuat ulang baris buzzer_wallets untuk email yang akunnya sudah/akan
-- hilang — bertabrakan dengan FK di atas. Sekarang fungsi berhenti jika
-- akunnya tidak ada.
CREATE OR REPLACE FUNCTION public.recalculate_buzzer_level(target_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  normalized_email text := lower(trim(target_email));
  total_followers integer;
  resolved_level text;
  buzzer_name_value text;
BEGIN
  IF normalized_email IS NULL OR normalized_email = '' THEN
    RETURN;
  END IF;

  -- Jangan membuat wallet untuk akun yang sudah tidak ada.
  IF NOT EXISTS (
    SELECT 1 FROM public.app_accounts
    WHERE lower(trim(email)) = normalized_email
  ) THEN
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
$function$;

-- ---------------------------------------------------------------------
-- 6. CHECK format tanggal
--    Kolom masih text (banyak RPC menerima text), tetapi isinya dijaga
--    agar selalu YYYY-MM-DD atau string kosong.
-- ---------------------------------------------------------------------
ALTER TABLE public.campaigns
  DROP CONSTRAINT IF EXISTS campaigns_start_date_format_check;
ALTER TABLE public.campaigns
  ADD CONSTRAINT campaigns_start_date_format_check
  CHECK (start_date = '' OR start_date ~ '^\d{4}-\d{2}-\d{2}$');

ALTER TABLE public.campaigns
  DROP CONSTRAINT IF EXISTS campaigns_deadline_format_check;
ALTER TABLE public.campaigns
  ADD CONSTRAINT campaigns_deadline_format_check
  CHECK (deadline = '' OR deadline ~ '^\d{4}-\d{2}-\d{2}$');

ALTER TABLE public.campaign_jobs
  DROP CONSTRAINT IF EXISTS campaign_jobs_deadline_format_check;
ALTER TABLE public.campaign_jobs
  ADD CONSTRAINT campaign_jobs_deadline_format_check
  CHECK (deadline = '' OR deadline ~ '^\d{4}-\d{2}-\d{2}$');

-- ---------------------------------------------------------------------
-- 7. Index untuk query yang dipakai aplikasi
-- ---------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS withdrawals_buzzer_status_idx
  ON public.withdrawals (buzzer_email, status);
CREATE INDEX IF NOT EXISTS campaign_jobs_status_tier_idx
  ON public.campaign_jobs (status, required_tier);
CREATE INDEX IF NOT EXISTS campaigns_status_idx
  ON public.campaigns (status);
CREATE INDEX IF NOT EXISTS campaigns_customer_email_idx
  ON public.campaigns (customer_email);
CREATE INDEX IF NOT EXISTS payments_status_idx
  ON public.payments (status);
CREATE INDEX IF NOT EXISTS payments_customer_status_idx
  ON public.payments (customer_email, status);
CREATE INDEX IF NOT EXISTS social_accounts_buzzer_verification_idx
  ON public.social_accounts (buzzer_email, verification);

-- ---------------------------------------------------------------------
-- 8. Perbaikan data
--    customer@buzzhub.id diiklankan di README dan tombol login cepat,
--    tetapi barisnya tidak ada di app_accounts sehingga login demo
--    customer selalu gagal. Hash memakai skema lama (SHA-256 + salt
--    global) dan otomatis di-upgrade ke PBKDF2 saat login berhasil.
--    DO NOTHING: jangan menimpa password yang mungkin sudah diganti.
-- ---------------------------------------------------------------------
INSERT INTO public.app_accounts (email, name, role, password_hash)
VALUES (
  'customer@buzzhub.id',
  'Customer Utama',
  'customer',
  'f349ad37943bf70832d3f414f866aea9e6738b6ddf7fdfde973f6976b2b86282'
)
ON CONFLICT (email) DO NOTHING;

COMMIT;
