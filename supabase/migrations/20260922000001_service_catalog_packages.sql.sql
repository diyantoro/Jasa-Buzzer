CREATE TABLE IF NOT EXISTS public.catalog_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_id uuid NOT NULL REFERENCES public.service_catalogs(id) ON DELETE CASCADE,
  name text NOT NULL,
  price numeric NOT NULL CHECK (price > 0),
  buzzer_count integer NOT NULL CHECK (buzzer_count > 0),
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Nonaktif')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS catalog_packages_catalog_status_idx
  ON public.catalog_packages (catalog_id, status, created_at DESC);

ALTER TABLE public.catalog_packages ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.catalog_packages TO anon, authenticated;
GRANT ALL ON public.catalog_packages TO service_role;

DROP POLICY IF EXISTS "catalog packages access" ON public.catalog_packages;
CREATE POLICY "catalog packages access" ON public.catalog_packages
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS update_catalog_packages_updated_at ON public.catalog_packages;
CREATE TRIGGER update_catalog_packages_updated_at
  BEFORE UPDATE ON public.catalog_packages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.campaigns
  ADD COLUMN IF NOT EXISTS package_id uuid REFERENCES public.catalog_packages(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS package_name text,
  ADD COLUMN IF NOT EXISTS package_price numeric,
  ADD COLUMN IF NOT EXISTS package_buzzer_count integer;

CREATE INDEX IF NOT EXISTS campaigns_package_id_idx
  ON public.campaigns (package_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'catalog_packages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.catalog_packages;
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.create_customer_catalog_package_scheduled_payment_campaign(
  p_catalog_id uuid,
  p_package_id uuid,
  p_invoice_no text,
  p_customer_name text,
  p_customer_email text,
  p_campaign_name text,
  p_method text,
  p_note text,
  p_brief text,
  p_start_date text,
  p_deadline text,
  p_package_name text,
  p_package_price numeric,
  p_package_buzzer_count integer
)
RETURNS TABLE(payment_id uuid, campaign_id uuid)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  catalog public.service_catalogs%ROWTYPE;
  package_row public.catalog_packages%ROWTYPE;
  created_payment_id uuid;
  created_campaign_id uuid;
  normalized_email text := lower(trim(p_customer_email));
  total_amount numeric;
BEGIN
  IF p_package_id IS NULL THEN
    RAISE EXCEPTION 'Paket katalog wajib dipilih';
  END IF;
  IF p_start_date !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
     OR p_deadline !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
     OR p_deadline::date < p_start_date::date THEN
    RAISE EXCEPTION 'Rentang tanggal campaign tidak valid';
  END IF;

  SELECT * INTO catalog FROM public.service_catalogs WHERE id = p_catalog_id FOR UPDATE;
  IF catalog.id IS NULL OR catalog.status <> 'Aktif' THEN
    RAISE EXCEPTION 'Katalog layanan tidak tersedia atau sudah nonaktif';
  END IF;

  SELECT * INTO package_row FROM public.catalog_packages WHERE id = p_package_id AND catalog_id = p_catalog_id FOR UPDATE;
  IF package_row.id IS NULL OR package_row.status <> 'Aktif' THEN
    RAISE EXCEPTION 'Paket yang dipilih tidak tersedia atau sudah nonaktif';
  END IF;

  total_amount := package_row.price;
  INSERT INTO public.payments (invoice_no, customer_name, customer_email, campaign_name, campaign_type, method, note, amount, buzzer_cost, fee, status, paid_at)
  VALUES (
    p_invoice_no,
    p_customer_name,
    normalized_email,
    p_campaign_name,
    catalog.platform,
    p_method,
    p_note,
    total_amount,
    0,
    total_amount,
    'Menunggu Verifikasi',
    now()
  )
  RETURNING id INTO created_payment_id;

  INSERT INTO public.campaigns (
    title, customer_email, customer_name, platform, service_type, brief, budget,
    payout_per_buzzer, slots, start_date, deadline, payment_id, payment_status,
    status, catalog_id, package_id, package_name, package_price, package_buzzer_count
  )
  VALUES (
    p_campaign_name,
    normalized_email,
    p_customer_name,
    catalog.platform,
    catalog.service_type,
    p_brief,
    total_amount,
    0,
    package_row.buzzer_count,
    p_start_date,
    p_deadline,
    created_payment_id,
    'Menunggu Verifikasi',
    'Draft',
    catalog.id,
    package_row.id,
    COALESCE(nullif(trim(p_package_name), ''), package_row.name),
    COALESCE(p_package_price, package_row.price),
    COALESCE(p_package_buzzer_count, package_row.buzzer_count)
  )
  RETURNING id INTO created_campaign_id;

  UPDATE public.payments SET campaign_id = created_campaign_id, updated_at = now() WHERE id = created_payment_id;
  RETURN QUERY SELECT created_payment_id, created_campaign_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_customer_catalog_package_scheduled_payment_campaign(uuid, uuid, text, text, text, text, text, text, text, text, text, text, numeric, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_customer_catalog_package_scheduled_payment_campaign(uuid, uuid, text, text, text, text, text, text, text, text, text, text, numeric, integer) TO anon, authenticated;
