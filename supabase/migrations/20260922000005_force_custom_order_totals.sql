-- Final reconciliation for Pesanan Sendiri.
-- Admin catalogs (campaigns.catalog_id IS NOT NULL) are intentionally excluded.

INSERT INTO public.service_pricing (platform, service_type, price_per_buzzer, status)
VALUES
  ('Instagram', 'Like', 4000, 'Aktif'),
  ('Instagram', 'Komentar', 6000, 'Aktif'),
  ('Instagram', 'Like + Komentar', 8000, 'Aktif'),
  ('Instagram', 'Share', 6000, 'Aktif'),
  ('Instagram', 'Follow', 6000, 'Aktif'),
  ('Instagram', 'Review', 8000, 'Aktif'),
  ('TikTok', 'Like', 4000, 'Aktif'),
  ('TikTok', 'Komentar', 6000, 'Aktif'),
  ('TikTok', 'Like + Komentar', 8000, 'Aktif'),
  ('TikTok', 'Share', 6000, 'Aktif'),
  ('TikTok', 'Follow', 6000, 'Aktif'),
  ('TikTok', 'Review', 8000, 'Aktif'),
  ('X (Twitter)', 'Like', 4000, 'Aktif'),
  ('X (Twitter)', 'Komentar', 6000, 'Aktif'),
  ('X (Twitter)', 'Like + Komentar', 8000, 'Aktif'),
  ('X (Twitter)', 'Share', 6000, 'Aktif'),
  ('X (Twitter)', 'Follow', 6000, 'Aktif'),
  ('X (Twitter)', 'Review', 8000, 'Aktif'),
  ('Facebook', 'Like', 4000, 'Aktif'),
  ('Facebook', 'Komentar', 6000, 'Aktif'),
  ('Facebook', 'Like + Komentar', 8000, 'Aktif'),
  ('Facebook', 'Share', 6000, 'Aktif'),
  ('Facebook', 'Follow', 6000, 'Aktif'),
  ('Facebook', 'Review', 8000, 'Aktif'),
  ('YouTube', 'Like', 4000, 'Aktif'),
  ('YouTube', 'Komentar', 6000, 'Aktif'),
  ('YouTube', 'Like + Komentar', 8000, 'Aktif'),
  ('YouTube', 'Share', 6000, 'Aktif'),
  ('YouTube', 'Follow', 6000, 'Aktif'),
  ('YouTube', 'Review', 8000, 'Aktif'),
  ('Telegram', 'Like', 4000, 'Aktif'),
  ('Telegram', 'Komentar', 6000, 'Aktif'),
  ('Telegram', 'Like + Komentar', 8000, 'Aktif'),
  ('Telegram', 'Share', 6000, 'Aktif'),
  ('Telegram', 'Follow', 6000, 'Aktif'),
  ('Telegram', 'Review', 8000, 'Aktif')
ON CONFLICT (platform, service_type) DO NOTHING;

-- First correct the campaign gross total from the authoritative per-buzzer
-- table. This matches the amount shown to the customer at checkout.
UPDATE public.campaigns AS campaign
SET budget = pricing.price_per_buzzer * GREATEST(campaign.slots, 1),
    updated_at = now()
FROM public.service_pricing AS pricing
WHERE campaign.catalog_id IS NULL
  AND pricing.status = 'Aktif'
  AND lower(trim(pricing.platform)) = lower(trim(campaign.platform))
  AND lower(trim(pricing.service_type)) = lower(trim(campaign.service_type));

-- Then make the payment row read exactly the same gross total.
UPDATE public.payments AS payment
SET amount = campaign.budget,
    fee = campaign.budget,
    buzzer_cost = 0,
    updated_at = now()
FROM public.campaigns AS campaign
WHERE campaign.payment_id = payment.id
  AND campaign.catalog_id IS NULL
  AND campaign.budget > 0;

-- Guard future direct edits to custom campaigns/payments. The customer RPC
-- remains the normal creation path, but this trigger prevents an amount drift.
CREATE OR REPLACE FUNCTION public.sync_custom_order_payment_total()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  pricing public.service_pricing%ROWTYPE;
  computed_total numeric;
BEGIN
  IF NEW.catalog_id IS NOT NULL THEN
    RETURN NEW;
  END IF;

  SELECT * INTO pricing
  FROM public.service_pricing
  WHERE status = 'Aktif'
    AND lower(trim(platform)) = lower(trim(NEW.platform))
    AND lower(trim(service_type)) = lower(trim(NEW.service_type));
  IF pricing.id IS NULL THEN
    RETURN NEW;
  END IF;

  computed_total := pricing.price_per_buzzer * GREATEST(NEW.slots, 1);
  NEW.budget := computed_total;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_custom_order_campaign_total ON public.campaigns;
CREATE TRIGGER sync_custom_order_campaign_total
  BEFORE INSERT OR UPDATE OF platform, service_type, slots, budget ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.sync_custom_order_payment_total();

CREATE OR REPLACE FUNCTION public.sync_custom_order_payment_amount()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  linked_campaign public.campaigns%ROWTYPE;
BEGIN
  SELECT * INTO linked_campaign FROM public.campaigns WHERE payment_id = NEW.id;
  IF linked_campaign.id IS NOT NULL AND linked_campaign.catalog_id IS NULL THEN
    NEW.amount := linked_campaign.budget;
    NEW.fee := linked_campaign.budget;
    NEW.buzzer_cost := 0;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_custom_order_payment_total ON public.payments;
CREATE TRIGGER sync_custom_order_payment_total
  BEFORE INSERT OR UPDATE OF amount, fee, buzzer_cost ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.sync_custom_order_payment_amount();
