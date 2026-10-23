-- Remove the obsolete QRIS Storage configuration. QRIS now uses the static
-- public/qris-merchant-buzzpro.png asset, so Storage data is intentionally left untouched.
DROP POLICY IF EXISTS "qris merchant read" ON storage.objects;
DROP POLICY IF EXISTS "qris merchant upload" ON storage.objects;
DROP POLICY IF EXISTS "qris merchant update" ON storage.objects;

DROP TABLE IF EXISTS public.qris_merchant_settings;
