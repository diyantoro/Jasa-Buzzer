-- =====================================================================
-- Migration: 20261116000008_lock_guest_checkout_rpcs.sql
-- 1. Guest checkout tetap didukung untuk customer, tetapi pemanggilannya
--    kini melalui server function createCheckoutCampaignFn.
--    Empat RPC checkout ditutup dari browser (anon/authenticated) dan
--    hanya boleh dipanggil oleh service_role.
-- 2. Constraint integritas tanggal: start_date <= deadline pada campaigns.
-- =====================================================================
BEGIN;

-- Helper pengunci RPC
CREATE OR REPLACE FUNCTION pg_temp.lock_checkout_rpc(signature text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  EXECUTE format(
    'REVOKE ALL PRIVILEGES ON FUNCTION %s FROM PUBLIC, anon, authenticated',
    signature
  );
  EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', signature);
EXCEPTION
  WHEN undefined_function OR undefined_object THEN
    NULL;
END;
$$;

-- Tutup seluruh overload RPC checkout customer
SELECT pg_temp.lock_checkout_rpc(
  'public.create_customer_catalog_package_scheduled_payment_campaign(uuid, uuid, text, text, text, text, text, text, text, text, text, text, numeric, integer)'
);
SELECT pg_temp.lock_checkout_rpc(
  'public.create_customer_catalog_scheduled_payment_campaign(uuid, text, text, text, text, text, text, text, text, text)'
);
SELECT pg_temp.lock_checkout_rpc(
  'public.create_customer_catalog_scheduled_payment_campaign(uuid, text, text, text, text, text, text, text, text, text, integer)'
);
SELECT pg_temp.lock_checkout_rpc(
  'public.create_customer_custom_scheduled_payment_campaign(text, text, text, text, text, text, text, text, text, integer, text, text, text, boolean)'
);

-- Constraint rentang tanggal: deadline tidak boleh mendahului start_date jika keduanya terisi
ALTER TABLE public.campaigns
  DROP CONSTRAINT IF EXISTS campaigns_date_range_check;
ALTER TABLE public.campaigns
  ADD CONSTRAINT campaigns_date_range_check
  CHECK (start_date = '' OR deadline = '' OR deadline::date >= start_date::date);

COMMIT;
