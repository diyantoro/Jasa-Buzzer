-- Migration: 20261027000000_connect_demo_buzzer_data.sql
--
-- Tujuan:
-- 1. Menormalkan kolom yang dipakai alur bukti pengerjaan buzzer.
-- 2. Menyambungkan akun demo `buzzer@buzzhub.id` ke Supabase (akun, aplikasi,
--    akun sosial, dompet) supaya data demo tidak hanya hidup di localStorage.
-- 3. Membuat 8 job demo dengan ID yang sama dengan `DEMO_JOB_IDS` di
--    `src/lib/buzzer-store.ts`, sehingga job yang tampil di dashboard adalah
--    baris Supabase yang nyata dan bukti bisa disimpan ke database.
--
-- Migration ini idempotent. Data job/campaign memakai ON CONFLICT DO NOTHING
-- agar perubahan yang sudah dilakukan pengguna tidak tertimpa saat dijalankan ulang.

-- ---------------------------------------------------------------------------
-- 1. Normalisasi kolom app_accounts
-- ---------------------------------------------------------------------------
ALTER TABLE public.app_accounts
  ADD COLUMN IF NOT EXISTS password_hash text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS company text,
  ADD COLUMN IF NOT EXISTS industry text,
  ADD COLUMN IF NOT EXISTS username text,
  ADD COLUMN IF NOT EXISTS platform text,
  ADD COLUMN IF NOT EXISTS followers integer,
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS total_reviews integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rating numeric DEFAULT 5,
  ADD COLUMN IF NOT EXISTS buzzer_category text,
  ADD COLUMN IF NOT EXISTS address text;

CREATE UNIQUE INDEX IF NOT EXISTS app_accounts_email_lower_idx
  ON public.app_accounts (lower(email));

-- ---------------------------------------------------------------------------
-- 2. Normalisasi kolom campaign & campaign_jobs
-- ---------------------------------------------------------------------------
ALTER TABLE public.campaigns
  ADD COLUMN IF NOT EXISTS payment_id uuid,
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'Menunggu Pembayaran',
  ADD COLUMN IF NOT EXISTS payment_rejection_reason text,
  ADD COLUMN IF NOT EXISTS target_reached_at timestamptz,
  ADD COLUMN IF NOT EXISTS service_type text,
  ADD COLUMN IF NOT EXISTS thumbnail_url text,
  ADD COLUMN IF NOT EXISTS catalog_visible boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS catalog_id uuid,
  ADD COLUMN IF NOT EXISTS start_date text,
  ADD COLUMN IF NOT EXISTS package_id text,
  ADD COLUMN IF NOT EXISTS package_name text,
  ADD COLUMN IF NOT EXISTS package_price numeric,
  ADD COLUMN IF NOT EXISTS package_buzzer_count integer,
  ADD COLUMN IF NOT EXISTS price_per_buzzer numeric,
  ADD COLUMN IF NOT EXISTS buzzer_count integer,
  ADD COLUMN IF NOT EXISTS total_amount numeric;

ALTER TABLE public.campaign_jobs
  ADD COLUMN IF NOT EXISTS customer_rated_at timestamptz,
  ADD COLUMN IF NOT EXISTS gross_price numeric,
  ADD COLUMN IF NOT EXISTS rejection_reason text,
  ADD COLUMN IF NOT EXISTS rejected_at timestamptz,
  ADD COLUMN IF NOT EXISTS rejected_by text,
  ADD COLUMN IF NOT EXISTS resubmission_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS submitted_at timestamptz,
  ADD COLUMN IF NOT EXISTS buzzer_level text,
  ADD COLUMN IF NOT EXISTS buzzer_percentage numeric,
  ADD COLUMN IF NOT EXISTS buzzer_amount numeric,
  ADD COLUMN IF NOT EXISTS admin_percentage numeric,
  ADD COLUMN IF NOT EXISTS admin_amount numeric,
  ADD COLUMN IF NOT EXISTS admin_verified_at timestamptz;

CREATE INDEX IF NOT EXISTS campaign_jobs_buzzer_email_idx
  ON public.campaign_jobs (lower(buzzer_email));
CREATE INDEX IF NOT EXISTS campaign_jobs_campaign_id_idx
  ON public.campaign_jobs (campaign_id);

-- ---------------------------------------------------------------------------
-- 3. Tabel riwayat pengiriman bukti + RLS + realtime
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.campaign_job_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.campaign_jobs(id) ON DELETE CASCADE,
  buzzer_email text NOT NULL,
  proof_url text NOT NULL,
  submission_number integer NOT NULL,
  status text NOT NULL DEFAULT 'Review',
  rejection_reason text,
  rejected_at timestamptz,
  rejected_by text,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (job_id, submission_number)
);

ALTER TABLE public.campaign_job_submissions
  ADD COLUMN IF NOT EXISTS rejection_reason text,
  ADD COLUMN IF NOT EXISTS rejected_at timestamptz,
  ADD COLUMN IF NOT EXISTS rejected_by text,
  ADD COLUMN IF NOT EXISTS submitted_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS campaign_job_submissions_job_idx
  ON public.campaign_job_submissions (job_id, submission_number DESC);
CREATE INDEX IF NOT EXISTS campaign_job_submissions_buzzer_idx
  ON public.campaign_job_submissions (lower(buzzer_email));

ALTER TABLE public.campaign_job_submissions ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaign_job_submissions TO anon, authenticated;
GRANT ALL ON public.campaign_job_submissions TO service_role;

DROP POLICY IF EXISTS "campaign job submissions access" ON public.campaign_job_submissions;
CREATE POLICY "campaign job submissions access"
  ON public.campaign_job_submissions FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS update_campaign_job_submissions_updated_at ON public.campaign_job_submissions;
CREATE TRIGGER update_campaign_job_submissions_updated_at
BEFORE UPDATE ON public.campaign_job_submissions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'campaign_job_submissions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.campaign_job_submissions;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 4. Storage bukti pengerjaan
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'bukti-pengerjaan',
  'bukti-pengerjaan',
  false,
  20971520,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']::text[]
)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "bukti_read" ON storage.objects;
CREATE POLICY "bukti_read"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'bukti-pengerjaan');

DROP POLICY IF EXISTS "bukti_insert" ON storage.objects;
CREATE POLICY "bukti_insert"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'bukti-pengerjaan');

DROP POLICY IF EXISTS "bukti_update" ON storage.objects;
CREATE POLICY "bukti_update"
  ON storage.objects FOR UPDATE TO anon, authenticated
  USING (bucket_id = 'bukti-pengerjaan')
  WITH CHECK (bucket_id = 'bukti-pengerjaan');

-- ---------------------------------------------------------------------------
-- 5. Akun demo buzzer
-- ---------------------------------------------------------------------------
-- Password: Buzzer123!
-- Hash dihitung dengan algoritma yang sama seperti src/lib/accounts.functions.ts.
INSERT INTO public.app_accounts (
  email, name, role, password_hash, phone, city, bio, industry, username,
  platform, followers, buzzer_category, address
)
VALUES (
  'buzzer@buzzhub.id',
  'Buzzer Premium',
  'buzzer',
  '41b817fd2775d50a03a6f2e789412180217e0a897a1a3bd8fd3f0d24983bd5d9',
  '081234567890',
  'Jakarta Selatan',
  'Micro-influencer lifestyle & kuliner. Open collab brand lokal.',
  'Lifestyle',
  '@buzzerpremium',
  'Instagram',
  45200,
  'Buzzer Online',
  'Jakarta Selatan'
)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role = 'buzzer',
  password_hash = EXCLUDED.password_hash,
  phone = COALESCE(public.app_accounts.phone, EXCLUDED.phone),
  city = COALESCE(public.app_accounts.city, EXCLUDED.city),
  bio = COALESCE(public.app_accounts.bio, EXCLUDED.bio),
  industry = COALESCE(public.app_accounts.industry, EXCLUDED.industry),
  username = COALESCE(public.app_accounts.username, EXCLUDED.username),
  platform = COALESCE(public.app_accounts.platform, EXCLUDED.platform),
  followers = COALESCE(public.app_accounts.followers, EXCLUDED.followers),
  buzzer_category = COALESCE(public.app_accounts.buzzer_category, EXCLUDED.buzzer_category),
  address = COALESCE(public.app_accounts.address, EXCLUDED.address),
  updated_at = now();

INSERT INTO public.buzzer_applications (
  id, name, email, username, platform, platforms, followers, phone, city,
  category, bio, submitted_at, status, reviewed_at, review_note
)
VALUES (
  'demo-buzzer-application',
  'Buzzer Premium',
  'buzzer@buzzhub.id',
  '@buzzerpremium',
  'Instagram',
  ARRAY['Instagram', 'TikTok', 'X (Twitter)', 'Facebook', 'YouTube']::text[],
  45200,
  '081234567890',
  'Jakarta Selatan',
  'Lifestyle',
  'Micro-influencer lifestyle & kuliner. Open collab brand lokal.',
  now() - interval '30 days',
  'approved',
  now() - interval '29 days',
  'Akun demo terverifikasi.'
)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  username = EXCLUDED.username,
  platform = EXCLUDED.platform,
  platforms = EXCLUDED.platforms,
  followers = EXCLUDED.followers,
  phone = COALESCE(public.buzzer_applications.phone, EXCLUDED.phone),
  city = COALESCE(public.buzzer_applications.city, EXCLUDED.city),
  category = COALESCE(public.buzzer_applications.category, EXCLUDED.category),
  bio = COALESCE(public.buzzer_applications.bio, EXCLUDED.bio),
  status = 'approved',
  reviewed_at = COALESCE(public.buzzer_applications.reviewed_at, EXCLUDED.reviewed_at),
  updated_at = now();

-- Dompet demo (saldo mengikuti data demo di dashboard).
INSERT INTO public.buzzer_wallets (
  buzzer_email, buzzer_name, balance, pending_balance, platform, followers,
  rating, campaigns_completed, online, updated_at
)
VALUES (
  'buzzer@buzzhub.id',
  'Buzzer Premium',
  3250000,
  0,
  'Instagram',
  45200,
  4.9,
  187,
  true,
  now()
)
ON CONFLICT (buzzer_email) DO UPDATE SET
  buzzer_name = EXCLUDED.buzzer_name,
  balance = EXCLUDED.balance,
  pending_balance = EXCLUDED.pending_balance,
  platform = EXCLUDED.platform,
  followers = EXCLUDED.followers,
  rating = EXCLUDED.rating,
  campaigns_completed = EXCLUDED.campaigns_completed,
  online = EXCLUDED.online,
  updated_at = now();

-- Akun sosial terverifikasi. Trigger recalculate_buzzer_level akan
-- memperbarui level/followers dompet secara otomatis.
INSERT INTO public.social_accounts (
  buzzer_email, buzzer_name, platform, username, account_name, profile_url,
  followers, category, bio, verification, is_active
)
VALUES
  ('buzzer@buzzhub.id', 'Buzzer Premium', 'Instagram', '@buzzerpremium', 'Buzzer Premium', 'https://instagram.com/buzzerpremium', 45200, 'Lifestyle', 'Lifestyle & kuliner', 'Terverifikasi', true),
  ('buzzer@buzzhub.id', 'Buzzer Premium', 'TikTok', '@buzzerpremium', 'Buzzer Premium', 'https://tiktok.com/@buzzerpremium', 12000, 'Lifestyle', 'Review produk & reels', 'Terverifikasi', true),
  ('buzzer@buzzhub.id', 'Buzzer Premium', 'X (Twitter)', '@buzzerpremium', 'Buzzer Premium', 'https://x.com/buzzerpremium', 8000, 'Lifestyle', 'Live tweet & thread', 'Terverifikasi', true),
  ('buzzer@buzzhub.id', 'Buzzer Premium', 'Facebook', 'Buzzer Premium', 'Buzzer Premium', 'https://facebook.com/buzzerpremium', 6000, 'Lifestyle', 'Komunitas ibu & keluarga', 'Terverifikasi', true),
  ('buzzer@buzzhub.id', 'Buzzer Premium', 'YouTube', 'Buzzer Premium', 'Buzzer Premium', 'https://youtube.com/@buzzerpremium', 15000, 'Lifestyle', 'Ulasan produk', 'Terverifikasi', true)
ON CONFLICT (buzzer_email, platform, username) DO UPDATE SET
  buzzer_name = EXCLUDED.buzzer_name,
  account_name = EXCLUDED.account_name,
  profile_url = EXCLUDED.profile_url,
  followers = EXCLUDED.followers,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  verification = 'Terverifikasi',
  is_active = true,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- 5b. Katalog layanan demo
--     Supaya halaman Katalog customer tidak kosong di project baru.
-- ---------------------------------------------------------------------------
INSERT INTO public.service_catalogs (
  id, title, platform, service_type, price, slots, thumbnail_url, description,
  status, created_at, updated_at
)
VALUES
  ('cccccccc-0000-4000-8000-000000000001', 'Instagram Engagement Boost', 'Instagram', 'Like + Komentar', 1500000, 50, NULL, 'Like dan komentar organik dari buzzer terverifikasi untuk meningkatkan engagement postingan Instagram Anda.', 'Aktif', now() - interval '30 days', now() - interval '30 days'),
  ('cccccccc-0000-4000-8000-000000000002', 'TikTok Viral Reels', 'TikTok', 'Review', 2500000, 30, NULL, 'Buzzer membuat video review atau duet dengan audio trending untuk mendorong jangkauan konten TikTok.', 'Aktif', now() - interval '28 days', now() - interval '28 days'),
  ('cccccccc-0000-4000-8000-000000000003', 'X/Twitter Buzz Thread', 'X (Twitter)', 'Komentar', 1200000, 25, NULL, 'Thread dan live tweet untuk membangun percakapan serta awareness brand di X/Twitter.', 'Aktif', now() - interval '26 days', now() - interval '26 days'),
  ('cccccccc-0000-4000-8000-000000000004', 'Facebook Community Share', 'Facebook', 'Share', 1000000, 40, NULL, 'Share postingan ke grup komunitas dan komentar relevan dari buzzer untuk memperluas jangkauan.', 'Aktif', now() - interval '24 days', now() - interval '24 days'),
  ('cccccccc-0000-4000-8000-000000000005', 'YouTube Product Review', 'YouTube', 'Review', 3500000, 15, NULL, 'Ulasan video produk berdurasi 3–5 menit oleh buzzer terverifikasi dengan link produk.', 'Aktif', now() - interval '22 days', now() - interval '22 days'),
  ('cccccccc-0000-4000-8000-000000000006', 'Instagram Reels Skincare', 'Instagram', 'Review', 2000000, 25, NULL, 'Reels dan story unboxing produk skincare dengan audio trending serta mention brand.', 'Aktif', now() - interval '20 days', now() - interval '20 days')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 6. Job demo yang terhubung ke Supabase
--    ID job harus sama dengan DEMO_JOB_IDS di src/lib/buzzer-store.ts.
-- ---------------------------------------------------------------------------
INSERT INTO public.campaigns (
  id, title, customer_email, customer_name, platform, brief, budget,
  payout_per_buzzer, slots, deadline, status, payment_status, start_date,
  price_per_buzzer, buzzer_count, total_amount, catalog_visible
)
VALUES
  ('aaaaaaaa-0000-4000-8000-000000000001', 'Launch Produk Skincare Glowin', 'customer@buzzhub.id', 'Customer Utama', 'Instagram', 'Posting story + feed unboxing produk Glowin tag @glowin.id.', 187500, 75000, 1, to_char(CURRENT_DATE - 2, 'YYYY-MM-DD'), 'Selesai', 'Pembayaran Disetujui', to_char(CURRENT_DATE - 30, 'YYYY-MM-DD'), 187500, 1, 187500, false),
  ('aaaaaaaa-0000-4000-8000-000000000002', 'Hashtag #KopiSenjaPulang', 'customer@buzzhub.id', 'Customer Utama', 'X (Twitter)', 'Tweet pengalaman ngopi sore dengan hashtag, minimum 3 tweet.', 62500, 25000, 1, to_char(CURRENT_DATE - 5, 'YYYY-MM-DD'), 'Selesai', 'Pembayaran Disetujui', to_char(CURRENT_DATE - 30, 'YYYY-MM-DD'), 62500, 1, 62500, false),
  ('aaaaaaaa-0000-4000-8000-000000000003', 'FinPay Cashback Challenge', 'customer@buzzhub.id', 'Customer Utama', 'TikTok', 'Buat video 15 detik review fitur cashback FinPay dengan hashtag #FinPayCuan.', 225000, 90000, 1, to_char(CURRENT_DATE - 8, 'YYYY-MM-DD'), 'Selesai', 'Pembayaran Disetujui', to_char(CURRENT_DATE - 30, 'YYYY-MM-DD'), 225000, 1, 225000, false),
  ('aaaaaaaa-0000-4000-8000-000000000004', 'Promo Ramadhan Bunda', 'customer@buzzhub.id', 'Customer Utama', 'Facebook', 'Share post promo ke 5 grup ibu rumah tangga.', 75000, 30000, 1, to_char(CURRENT_DATE - 12, 'YYYY-MM-DD'), 'Selesai', 'Pembayaran Disetujui', to_char(CURRENT_DATE - 30, 'YYYY-MM-DD'), 75000, 1, 75000, false),
  ('aaaaaaaa-0000-4000-8000-000000000005', 'Review Earphone Sonik', 'customer@buzzhub.id', 'Customer Utama', 'YouTube', 'Ulasan 3 menit kelebihan dan kekurangan Earphone Sonik.', 300000, 120000, 1, to_char(CURRENT_DATE - 20, 'YYYY-MM-DD'), 'Selesai', 'Pembayaran Disetujui', to_char(CURRENT_DATE - 30, 'YYYY-MM-DD'), 300000, 1, 300000, false),
  ('aaaaaaaa-0000-4000-8000-000000000006', 'Viral TikTok Dance Brand', 'customer@buzzhub.id', 'Customer Utama', 'TikTok', 'Ikuti choreography resmi brand dan upload video duet.', 162500, 65000, 1, to_char(CURRENT_DATE + 3, 'YYYY-MM-DD'), 'Review', 'Pembayaran Disetujui', to_char(CURRENT_DATE - 7, 'YYYY-MM-DD'), 162500, 1, 162500, false),
  ('aaaaaaaa-0000-4000-8000-000000000007', 'Boost Reels Skincare', 'customer@buzzhub.id', 'Customer Utama', 'Instagram', 'Upload reels dengan audio trending, minimal 500 views organik.', 137500, 55000, 1, to_char(CURRENT_DATE + 5, 'YYYY-MM-DD'), 'Aktif', 'Pembayaran Disetujui', to_char(CURRENT_DATE - 3, 'YYYY-MM-DD'), 137500, 1, 137500, false),
  ('aaaaaaaa-0000-4000-8000-000000000008', 'Community Meetup Devs', 'customer@buzzhub.id', 'Customer Utama', 'X (Twitter)', 'Live tweet thread selama acara komunitas berlangsung.', 100000, 40000, 1, to_char(CURRENT_DATE + 7, 'YYYY-MM-DD'), 'Aktif', 'Pembayaran Disetujui', to_char(CURRENT_DATE - 2, 'YYYY-MM-DD'), 100000, 1, 100000, false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.campaign_jobs (
  id, campaign_id, campaign_title, platform, buzzer_email, buzzer_name,
  payout, deadline, brief, status, proof_url, note, rejection_reason,
  rejected_at, rejected_by, resubmission_count, submitted_at,
  admin_verified_at, customer_rated_at, gross_price, buzzer_level,
  buzzer_percentage, buzzer_amount, admin_percentage, admin_amount,
  created_at, updated_at
)
VALUES
  ('bbbbbbbb-0000-4000-8000-000000000001', 'aaaaaaaa-0000-4000-8000-000000000001', 'Launch Produk Skincare Glowin', 'Instagram', 'buzzer@buzzhub.id', 'Buzzer Premium', 75000, to_char(CURRENT_DATE - 2, 'YYYY-MM-DD'), 'Posting story + feed unboxing produk Glowin tag @glowin.id.', 'Selesai', 'https://buzzhub.id/demo/proof-1.jpg', NULL, NULL, NULL, NULL, 0, now() - interval '2 days', now() - interval '2 days', NULL, 187500, NULL, 40, 75000, 60, 112500, now() - interval '10 days', now() - interval '2 days'),
  ('bbbbbbbb-0000-4000-8000-000000000002', 'aaaaaaaa-0000-4000-8000-000000000002', 'Hashtag #KopiSenjaPulang', 'X (Twitter)', 'buzzer@buzzhub.id', 'Buzzer Premium', 25000, to_char(CURRENT_DATE - 5, 'YYYY-MM-DD'), 'Tweet pengalaman ngopi sore dengan hashtag, minimum 3 tweet.', 'Selesai', 'https://buzzhub.id/demo/proof-2.jpg', NULL, NULL, NULL, NULL, 0, now() - interval '5 days', now() - interval '5 days', NULL, 62500, NULL, 40, 25000, 60, 37500, now() - interval '12 days', now() - interval '5 days'),
  ('bbbbbbbb-0000-4000-8000-000000000003', 'aaaaaaaa-0000-4000-8000-000000000003', 'FinPay Cashback Challenge', 'TikTok', 'buzzer@buzzhub.id', 'Buzzer Premium', 90000, to_char(CURRENT_DATE - 8, 'YYYY-MM-DD'), 'Buat video 15 detik review fitur cashback FinPay dengan hashtag #FinPayCuan.', 'Selesai', 'https://buzzhub.id/demo/proof-3.jpg', NULL, NULL, NULL, NULL, 0, now() - interval '8 days', now() - interval '8 days', NULL, 225000, NULL, 40, 90000, 60, 135000, now() - interval '15 days', now() - interval '8 days'),
  ('bbbbbbbb-0000-4000-8000-000000000004', 'aaaaaaaa-0000-4000-8000-000000000004', 'Promo Ramadhan Bunda', 'Facebook', 'buzzer@buzzhub.id', 'Buzzer Premium', 30000, to_char(CURRENT_DATE - 12, 'YYYY-MM-DD'), 'Share post promo ke 5 grup ibu rumah tangga.', 'Selesai', 'https://buzzhub.id/demo/proof-4.jpg', NULL, NULL, NULL, NULL, 0, now() - interval '12 days', now() - interval '12 days', NULL, 75000, NULL, 40, 30000, 60, 45000, now() - interval '20 days', now() - interval '12 days'),
  ('bbbbbbbb-0000-4000-8000-000000000005', 'aaaaaaaa-0000-4000-8000-000000000005', 'Review Earphone Sonik', 'YouTube', 'buzzer@buzzhub.id', 'Buzzer Premium', 120000, to_char(CURRENT_DATE - 20, 'YYYY-MM-DD'), 'Ulasan 3 menit kelebihan dan kekurangan Earphone Sonik.', 'Selesai', 'https://buzzhub.id/demo/proof-5.jpg', NULL, NULL, NULL, NULL, 0, now() - interval '20 days', now() - interval '20 days', NULL, 300000, NULL, 40, 120000, 60, 180000, now() - interval '28 days', now() - interval '20 days'),
  ('bbbbbbbb-0000-4000-8000-000000000006', 'aaaaaaaa-0000-4000-8000-000000000006', 'Viral TikTok Dance Brand', 'TikTok', 'buzzer@buzzhub.id', 'Buzzer Premium', 65000, to_char(CURRENT_DATE + 3, 'YYYY-MM-DD'), 'Ikuti choreography resmi brand dan upload video duet.', 'Review', 'https://buzzhub.id/demo/proof-6.jpg', NULL, NULL, NULL, NULL, 0, now() - interval '1 day', NULL, NULL, 162500, NULL, 40, 65000, 60, 97500, now() - interval '5 days', now() - interval '1 day'),
  ('bbbbbbbb-0000-4000-8000-000000000007', 'aaaaaaaa-0000-4000-8000-000000000007', 'Boost Reels Skincare', 'Instagram', 'buzzer@buzzhub.id', 'Buzzer Premium', 55000, to_char(CURRENT_DATE + 5, 'YYYY-MM-DD'), 'Upload reels dengan audio trending, minimal 500 views organik.', 'Diambil', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 137500, NULL, 40, 55000, 60, 82500, now() - interval '3 days', now()),
  ('bbbbbbbb-0000-4000-8000-000000000008', 'aaaaaaaa-0000-4000-8000-000000000008', 'Community Meetup Devs', 'X (Twitter)', 'buzzer@buzzhub.id', 'Buzzer Premium', 40000, to_char(CURRENT_DATE + 7, 'YYYY-MM-DD'), 'Live tweet thread selama acara komunitas berlangsung.', 'Revisi', 'https://buzzhub.id/demo/proof-8.jpg', NULL, 'Thread belum menyebut akun sponsor utama.', now() - interval '1 day', 'admin@buzzhub.id', 1, now() - interval '2 days', NULL, NULL, 100000, NULL, 40, 40000, 60, 60000, now() - interval '6 days', now() - interval '1 day')
ON CONFLICT (id) DO NOTHING;

-- Riwayat pengiriman bukti untuk job demo yang sudah pernah submit.
-- Job "Diambil" sengaja tidak diberi submission agar buzzer bisa menguji upload.
INSERT INTO public.campaign_job_submissions (
  job_id, buzzer_email, proof_url, submission_number, status,
  rejection_reason, rejected_at, rejected_by, submitted_at, reviewed_at
)
VALUES
  ('bbbbbbbb-0000-4000-8000-000000000001', 'buzzer@buzzhub.id', 'https://buzzhub.id/demo/proof-1.jpg', 1, 'Selesai', NULL, NULL, NULL, now() - interval '2 days', now() - interval '2 days'),
  ('bbbbbbbb-0000-4000-8000-000000000002', 'buzzer@buzzhub.id', 'https://buzzhub.id/demo/proof-2.jpg', 1, 'Selesai', NULL, NULL, NULL, now() - interval '5 days', now() - interval '5 days'),
  ('bbbbbbbb-0000-4000-8000-000000000003', 'buzzer@buzzhub.id', 'https://buzzhub.id/demo/proof-3.jpg', 1, 'Selesai', NULL, NULL, NULL, now() - interval '8 days', now() - interval '8 days'),
  ('bbbbbbbb-0000-4000-8000-000000000004', 'buzzer@buzzhub.id', 'https://buzzhub.id/demo/proof-4.jpg', 1, 'Selesai', NULL, NULL, NULL, now() - interval '12 days', now() - interval '12 days'),
  ('bbbbbbbb-0000-4000-8000-000000000005', 'buzzer@buzzhub.id', 'https://buzzhub.id/demo/proof-5.jpg', 1, 'Selesai', NULL, NULL, NULL, now() - interval '20 days', now() - interval '20 days'),
  ('bbbbbbbb-0000-4000-8000-000000000006', 'buzzer@buzzhub.id', 'https://buzzhub.id/demo/proof-6.jpg', 1, 'Review', NULL, NULL, NULL, now() - interval '1 day', NULL),
  ('bbbbbbbb-0000-4000-8000-000000000008', 'buzzer@buzzhub.id', 'https://buzzhub.id/demo/proof-8.jpg', 1, 'Ditolak', 'Thread belum menyebut akun sponsor utama.', now() - interval '1 day', 'admin@buzzhub.id', now() - interval '2 days', now() - interval '1 day')
ON CONFLICT (job_id, submission_number) DO NOTHING;

-- Pastikan PostgREST langsung mengenali kolom/tabel baru.
NOTIFY pgrst, 'reload schema';
