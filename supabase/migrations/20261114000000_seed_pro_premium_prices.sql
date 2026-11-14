-- =====================================================================
-- Migration: 20261114000000_seed_pro_premium_prices.sql
-- Description: Isi awal harga kelas Pro & Premium dari harga Biasa.
--
--   Pro     = Biasa x 1,8  (dibulatkan ke ribuan terdekat)
--   Premium = Biasa x 3,0  (dibulatkan ke ribuan terdekat)
--
--   Aturan:
--   - Hanya MENAMBAH baris yang belum ada (ON CONFLICT DO NOTHING),
--     jadi harga yang sudah diisi admin tidak pernah ditimpa.
--   - Harga Biasa tidak diubah sama sekali.
--   - Baris hasil seed ini normal: admin bebas mengubah atau
--     menghapusnya lewat menu "Harga Pesanan Sendiri".
--
--   Contoh: Biasa Rp 10.000 → Pro Rp 18.000, Premium Rp 30.000
--           Biasa Rp  8.000 → Pro Rp 14.000, Premium Rp 24.000
-- =====================================================================

INSERT INTO public.service_pricing (
  platform,
  service_type,
  buzzer_tier,
  price_per_buzzer,
  status
)
SELECT
  base.platform,
  base.service_type,
  'Pro',
  GREATEST(
    ROUND(base.price_per_buzzer * 1.8 / 1000) * 1000,
    base.price_per_buzzer + 1000
  ),
  base.status
FROM public.service_pricing AS base
WHERE base.buzzer_tier = 'Biasa'
ON CONFLICT (platform, service_type, buzzer_tier) DO NOTHING;

INSERT INTO public.service_pricing (
  platform,
  service_type,
  buzzer_tier,
  price_per_buzzer,
  status
)
SELECT
  base.platform,
  base.service_type,
  'Premium',
  GREATEST(
    ROUND(base.price_per_buzzer * 3.0 / 1000) * 1000,
    base.price_per_buzzer + 2000
  ),
  base.status
FROM public.service_pricing AS base
WHERE base.buzzer_tier = 'Biasa'
ON CONFLICT (platform, service_type, buzzer_tier) DO NOTHING;
