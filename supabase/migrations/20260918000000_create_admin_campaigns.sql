-- Admin-created campaigns are published immediately, with one available job per slot.
ALTER TABLE public.campaigns
  ADD COLUMN IF NOT EXISTS service_type text,
  ADD COLUMN IF NOT EXISTS thumbnail_url text,
  ADD COLUMN IF NOT EXISTS catalog_visible boolean NOT NULL DEFAULT false;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'campaign-thumbnails',
  'campaign-thumbnails',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "campaign thumbnails upload" ON storage.objects;
CREATE POLICY "campaign thumbnails upload"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'campaign-thumbnails');

DROP POLICY IF EXISTS "campaign thumbnails update" ON storage.objects;
CREATE POLICY "campaign thumbnails update"
  ON storage.objects FOR UPDATE TO anon, authenticated
  USING (bucket_id = 'campaign-thumbnails')
  WITH CHECK (bucket_id = 'campaign-thumbnails');

DROP POLICY IF EXISTS "campaign thumbnails delete" ON storage.objects;
CREATE POLICY "campaign thumbnails delete"
  ON storage.objects FOR DELETE TO anon, authenticated
  USING (bucket_id = 'campaign-thumbnails');

CREATE OR REPLACE FUNCTION public.create_admin_campaign(
  p_title text,
  p_platform text,
  p_service_type text,
  p_price_per_slot numeric,
  p_slots integer,
  p_deadline text,
  p_brief text,
  p_thumbnail_url text,
  p_customer_email text,
  p_customer_name text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  created_campaign_id uuid;
  total_budget numeric;
  buzzer_payout numeric;
  job_index integer;
BEGIN
  IF nullif(trim(p_title), '') IS NULL THEN RAISE EXCEPTION 'Nama kampanye wajib diisi'; END IF;
  IF nullif(trim(p_platform), '') IS NULL THEN RAISE EXCEPTION 'Platform wajib dipilih'; END IF;
  IF nullif(trim(p_service_type), '') IS NULL THEN RAISE EXCEPTION 'Jenis layanan wajib dipilih'; END IF;
  IF p_price_per_slot IS NULL OR p_price_per_slot <= 0 THEN RAISE EXCEPTION 'Harga per slot harus lebih dari 0'; END IF;
  IF p_slots IS NULL OR p_slots < 1 THEN RAISE EXCEPTION 'Jumlah slot harus lebih dari 0'; END IF;
  IF nullif(trim(p_customer_email), '') IS NULL OR nullif(trim(p_customer_name), '') IS NULL THEN RAISE EXCEPTION 'Identitas admin tidak ditemukan'; END IF;

  total_budget := p_price_per_slot * p_slots;
  buzzer_payout := round(p_price_per_slot * 0.40);

  INSERT INTO public.campaigns (
    title, customer_email, customer_name, platform, service_type, brief,
    thumbnail_url, catalog_visible, budget, payout_per_buzzer, slots, deadline, status, payment_status
  ) VALUES (
    trim(p_title), lower(trim(p_customer_email)), trim(p_customer_name), trim(p_platform),
    trim(p_service_type), coalesce(p_brief, ''), nullif(trim(p_thumbnail_url), ''), true,
    total_budget, buzzer_payout, p_slots, coalesce(nullif(trim(p_deadline), ''), ''), 'Aktif', 'Pembayaran Disetujui'
  ) RETURNING id INTO created_campaign_id;

  FOR job_index IN 1..p_slots LOOP
    INSERT INTO public.campaign_jobs (
      campaign_id, campaign_title, platform, gross_price, payout, deadline, brief, status
    ) VALUES (
      created_campaign_id, trim(p_title), trim(p_platform), p_price_per_slot,
      buzzer_payout, coalesce(nullif(trim(p_deadline), ''), ''), coalesce(p_brief, ''), 'Tersedia'
    );
  END LOOP;

  RETURN created_campaign_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_admin_campaign(text, text, text, numeric, integer, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_admin_campaign(text, text, text, numeric, integer, text, text, text, text, text) TO anon, authenticated;
