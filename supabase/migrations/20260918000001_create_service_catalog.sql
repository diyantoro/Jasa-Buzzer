-- A catalog is a product offered by BUZZPRO.  It is deliberately separate
-- from campaigns: a campaign is only created after a customer checks out.
CREATE TABLE IF NOT EXISTS public.service_catalogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  platform text NOT NULL,
  service_type text NOT NULL,
  price numeric NOT NULL CHECK (price > 0),
  slots integer NOT NULL CHECK (slots > 0),
  thumbnail_url text,
  status text NOT NULL DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Nonaktif')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS service_catalogs_status_created_idx
  ON public.service_catalogs (status, created_at DESC);

ALTER TABLE public.service_catalogs ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_catalogs TO anon, authenticated;
GRANT ALL ON public.service_catalogs TO service_role;
DROP POLICY IF EXISTS "service catalogs access" ON public.service_catalogs;
CREATE POLICY "service catalogs access" ON public.service_catalogs
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS update_service_catalogs_updated_at ON public.service_catalogs;
CREATE TRIGGER update_service_catalogs_updated_at
  BEFORE UPDATE ON public.service_catalogs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.campaigns
  ADD COLUMN IF NOT EXISTS catalog_id uuid REFERENCES public.service_catalogs(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS campaigns_catalog_id_idx ON public.campaigns (catalog_id);

-- Remove the superseded endpoint which created a paid campaign and jobs from
-- an admin form. Admins now create rows in service_catalogs only.
DROP FUNCTION IF EXISTS public.create_admin_campaign(text, text, text, numeric, integer, text, text, text, text, text);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'service_catalogs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.service_catalogs;
  END IF;
END $$;

-- The extra catalog argument keeps the existing 15-argument RPC compatible.
-- When present, the server reads price, platform, and slots from the catalog
-- rather than trusting client supplied checkout values.
CREATE OR REPLACE FUNCTION public.create_customer_catalog_payment_campaign(
  p_catalog_id uuid,
  p_invoice_no text, p_customer_name text, p_customer_email text,
  p_campaign_name text, p_method text, p_note text, p_brief text, p_deadline text
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
  SELECT * INTO catalog FROM public.service_catalogs WHERE id = p_catalog_id FOR SHARE;
  IF catalog.id IS NULL OR catalog.status <> 'Aktif' THEN
    RAISE EXCEPTION 'Katalog layanan tidak tersedia atau sudah nonaktif';
  END IF;
  IF nullif(trim(p_invoice_no), '') IS NULL OR nullif(trim(p_campaign_name), '') IS NULL THEN
    RAISE EXCEPTION 'Invoice dan nama campaign wajib diisi';
  END IF;
  buzzer_payout := round(catalog.price * 0.40 / catalog.slots);
  INSERT INTO public.payments (invoice_no, customer_name, customer_email, campaign_name, campaign_type, method, note, amount, buzzer_cost, fee, status, paid_at)
  VALUES (p_invoice_no, p_customer_name, normalized_email, p_campaign_name, catalog.platform, p_method, p_note, catalog.price, round(catalog.price * .40), catalog.price - round(catalog.price * .40), 'Menunggu Verifikasi', now())
  RETURNING id INTO created_payment_id;
  INSERT INTO public.campaigns (title, customer_email, customer_name, platform, service_type, brief, budget, payout_per_buzzer, slots, deadline, payment_id, payment_status, status, catalog_id)
  VALUES (p_campaign_name, normalized_email, p_customer_name, catalog.platform, catalog.service_type, p_brief, catalog.price, buzzer_payout, catalog.slots, p_deadline, created_payment_id, 'Menunggu Verifikasi', 'Draft', catalog.id)
  RETURNING id INTO created_campaign_id;
  UPDATE public.payments SET campaign_id = created_campaign_id, updated_at = now() WHERE id = created_payment_id;
  RETURN QUERY SELECT created_payment_id, created_campaign_id;
END;
$$;
REVOKE ALL ON FUNCTION public.create_customer_catalog_payment_campaign(uuid, text, text, text, text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_customer_catalog_payment_campaign(uuid, text, text, text, text, text, text, text, text) TO anon, authenticated;
