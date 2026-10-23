-- A service catalog is an admin-owned product. A customer order remains a
-- campaign linked through catalog_id, so catalog stock and customer orders are
-- deliberately kept separate.
ALTER TABLE public.service_catalogs
  ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT '';

ALTER TABLE public.service_catalogs DROP CONSTRAINT IF EXISTS service_catalogs_status_check;
ALTER TABLE public.service_catalogs
  ADD CONSTRAINT service_catalogs_status_check CHECK (status IN ('Draft', 'Aktif', 'Nonaktif'));

-- This RPC takes the requested buzzer count, locks the catalog row, then
-- counts all previously created orders for it. The row lock serializes
-- simultaneous checkouts and prevents slot overselling.
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
  reserved_slots integer;
  created_payment_id uuid;
  created_campaign_id uuid;
  normalized_email text := lower(trim(p_customer_email));
  total_amount numeric;
  buzzer_payout numeric;
BEGIN
  IF p_slots IS NULL OR p_slots < 1 THEN RAISE EXCEPTION 'Jumlah buzzer minimal 1'; END IF;
  IF p_start_date !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
     OR p_deadline !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
     OR p_deadline::date < p_start_date::date THEN
    RAISE EXCEPTION 'Rentang tanggal campaign tidak valid';
  END IF;

  SELECT * INTO catalog FROM public.service_catalogs WHERE id = p_catalog_id FOR UPDATE;
  IF catalog.id IS NULL OR catalog.status <> 'Aktif' THEN
    RAISE EXCEPTION 'Katalog layanan tidak tersedia atau sudah nonaktif';
  END IF;
  SELECT COALESCE(sum(slots), 0)::integer INTO reserved_slots
  FROM public.campaigns
  WHERE catalog_id = catalog.id AND status <> 'Dibatalkan';
  IF reserved_slots + p_slots > catalog.slots THEN
    RAISE EXCEPTION 'Slot buzzer tidak mencukupi. Tersedia % slot', GREATEST(catalog.slots - reserved_slots, 0);
  END IF;

  total_amount := catalog.price * p_slots;
  buzzer_payout := round(catalog.price * .40);
  INSERT INTO public.payments (invoice_no, customer_name, customer_email, campaign_name, campaign_type, method, note, amount, buzzer_cost, fee, status, paid_at)
  VALUES (p_invoice_no, p_customer_name, normalized_email, p_campaign_name, catalog.platform, p_method, p_note,
    total_amount, buzzer_payout * p_slots, total_amount - (buzzer_payout * p_slots), 'Menunggu Verifikasi', now())
  RETURNING id INTO created_payment_id;

  INSERT INTO public.campaigns (title, customer_email, customer_name, platform, service_type, brief, budget, payout_per_buzzer, slots, start_date, deadline, payment_id, payment_status, status, catalog_id)
  VALUES (p_campaign_name, normalized_email, p_customer_name, catalog.platform, catalog.service_type, p_brief,
    total_amount, buzzer_payout, p_slots, p_start_date, p_deadline, created_payment_id, 'Menunggu Verifikasi', 'Draft', catalog.id)
  RETURNING id INTO created_campaign_id;
  UPDATE public.payments SET campaign_id = created_campaign_id, updated_at = now() WHERE id = created_payment_id;
  RETURN QUERY SELECT created_payment_id, created_campaign_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_customer_catalog_scheduled_payment_campaign(uuid, text, text, text, text, text, text, text, text, text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_customer_catalog_scheduled_payment_campaign(uuid, text, text, text, text, text, text, text, text, text, integer) TO anon, authenticated;
