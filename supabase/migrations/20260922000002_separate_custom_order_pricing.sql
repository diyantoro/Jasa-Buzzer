-- Pesanan Sendiri uses a platform/service price table. Admin catalogs remain
-- fixed-price products in service_catalogs and do not use this table.
CREATE TABLE IF NOT EXISTS public.service_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  service_type text NOT NULL,
  price_per_buzzer numeric NOT NULL CHECK (price_per_buzzer > 0),
  status text NOT NULL DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Nonaktif')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (platform, service_type)
);

CREATE INDEX IF NOT EXISTS service_pricing_lookup_idx
  ON public.service_pricing (platform, service_type, status);

ALTER TABLE public.service_pricing ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_pricing TO anon, authenticated;
GRANT ALL ON public.service_pricing TO service_role;
DROP POLICY IF EXISTS "service pricing access" ON public.service_pricing;
CREATE POLICY "service pricing access" ON public.service_pricing
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS update_service_pricing_updated_at ON public.service_pricing;
CREATE TRIGGER update_service_pricing_updated_at
  BEFORE UPDATE ON public.service_pricing
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'service_pricing'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.service_pricing;
  END IF;
END $$;

-- The database resolves the active per-buzzer price and calculates the gross
-- amount. Client supplied price and total values are intentionally absent.
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
  p_deadline text
)
RETURNS TABLE(payment_id uuid, campaign_id uuid)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  pricing public.service_pricing%ROWTYPE;
  created_payment_id uuid;
  created_campaign_id uuid;
  normalized_email text := lower(trim(p_customer_email));
  total_amount numeric;
BEGIN
  IF p_slots IS NULL OR p_slots < 1 THEN
    RAISE EXCEPTION 'Jumlah buzzer minimal 1';
  END IF;
  IF p_start_date !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
     OR p_deadline !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
     OR p_deadline::date < p_start_date::date THEN
    RAISE EXCEPTION 'Rentang tanggal campaign tidak valid';
  END IF;
  IF nullif(trim(p_invoice_no), '') IS NULL OR nullif(trim(p_campaign_name), '') IS NULL THEN
    RAISE EXCEPTION 'Invoice dan nama campaign wajib diisi';
  END IF;

  SELECT * INTO pricing
  FROM public.service_pricing
  WHERE lower(platform) = lower(trim(p_platform))
    AND lower(service_type) = lower(trim(p_service_type))
    AND status = 'Aktif';
  IF pricing.id IS NULL THEN
    RAISE EXCEPTION 'Harga layanan per buzzer belum dikonfigurasi admin';
  END IF;

  total_amount := pricing.price_per_buzzer * p_slots;
  INSERT INTO public.payments (
    invoice_no, customer_name, customer_email, campaign_name, campaign_type,
    method, note, amount, buzzer_cost, fee, status, paid_at
  ) VALUES (
    p_invoice_no, p_customer_name, normalized_email, p_campaign_name, p_platform,
    p_method, p_note, total_amount, 0, total_amount, 'Menunggu Verifikasi', now()
  ) RETURNING id INTO created_payment_id;

  INSERT INTO public.campaigns (
    title, customer_email, customer_name, platform, service_type, brief, budget,
    payout_per_buzzer, slots, start_date, deadline, payment_id, payment_status, status
  ) VALUES (
    p_campaign_name, normalized_email, p_customer_name, p_platform, p_service_type,
    p_brief, total_amount, 0, p_slots, p_start_date, p_deadline, created_payment_id,
    'Menunggu Verifikasi', 'Draft'
  ) RETURNING id INTO created_campaign_id;

  UPDATE public.payments SET campaign_id = created_campaign_id, updated_at = now()
  WHERE id = created_payment_id;
  RETURN QUERY SELECT created_payment_id, created_campaign_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_customer_custom_scheduled_payment_campaign(
  text, text, text, text, text, text, text, text, text, integer, text, text
) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_customer_custom_scheduled_payment_campaign(
  text, text, text, text, text, text, text, text, text, integer, text, text
) TO anon, authenticated;

-- Catalog orders are fixed-price offers. The client cannot change catalog
-- price or buzzer quantity by sending a different slot count.
CREATE OR REPLACE FUNCTION public.create_customer_catalog_scheduled_payment_campaign(
  p_catalog_id uuid,
  p_invoice_no text, p_customer_name text, p_customer_email text,
  p_campaign_name text, p_method text, p_note text, p_brief text,
  p_start_date text, p_deadline text, p_slots integer
)
RETURNS TABLE(payment_id uuid, campaign_id uuid)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  catalog public.service_catalogs%ROWTYPE;
  created_payment_id uuid;
  created_campaign_id uuid;
  normalized_email text := lower(trim(p_customer_email));
  buzzer_payout numeric;
BEGIN
  IF p_start_date !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
     OR p_deadline !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
     OR p_deadline::date < p_start_date::date THEN
    RAISE EXCEPTION 'Rentang tanggal campaign tidak valid';
  END IF;

  SELECT * INTO catalog FROM public.service_catalogs
  WHERE id = p_catalog_id AND status = 'Aktif';
  IF catalog.id IS NULL THEN
    RAISE EXCEPTION 'Katalog layanan tidak tersedia atau sudah nonaktif';
  END IF;
  buzzer_payout := round(catalog.price * 0.40 / greatest(catalog.slots, 1));

  INSERT INTO public.payments (
    invoice_no, customer_name, customer_email, campaign_name, campaign_type,
    method, note, amount, buzzer_cost, fee, status, paid_at
  ) VALUES (
    p_invoice_no, p_customer_name, normalized_email, p_campaign_name, catalog.platform,
    p_method, p_note, catalog.price, round(catalog.price * 0.40),
    catalog.price - round(catalog.price * 0.40), 'Menunggu Verifikasi', now()
  ) RETURNING id INTO created_payment_id;

  INSERT INTO public.campaigns (
    title, customer_email, customer_name, platform, service_type, brief, budget,
    payout_per_buzzer, slots, start_date, deadline, payment_id, payment_status,
    status, catalog_id
  ) VALUES (
    p_campaign_name, normalized_email, p_customer_name, catalog.platform,
    catalog.service_type, p_brief, catalog.price, buzzer_payout, catalog.slots,
    p_start_date, p_deadline, created_payment_id, 'Menunggu Verifikasi', 'Draft', catalog.id
  ) RETURNING id INTO created_campaign_id;

  UPDATE public.payments SET campaign_id = created_campaign_id, updated_at = now()
  WHERE id = created_payment_id;
  RETURN QUERY SELECT created_payment_id, created_campaign_id;
END;
$$;