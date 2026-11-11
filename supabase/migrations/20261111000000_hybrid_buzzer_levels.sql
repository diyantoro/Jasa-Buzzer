-- =====================================================================
-- Migration: 20261111000000_hybrid_buzzer_levels.sql
-- Description: Level buzzer berlaku untuk kategori yang punya komponen
--              online, yaitu `Buzzer Online` dan `Buzzer Offline-Online`
--              (hybrid). Hanya `Buzzer Offline` murni yang tidak punya
--              level.
--
--              Migration ini MENGGANTIKAN aturan pada
--              20261110000000_buzzer_online_level_only.sql (yang hanya
--              mengizinkan `Buzzer Online`). Fungsi ini dipanggil oleh
--              trigger pada tabel social_accounts, sehingga tanpa
--              perubahan ini level buzzer hybrid akan terhapus kembali
--              setiap kali data akun sosialnya berubah.
-- =====================================================================

CREATE OR REPLACE FUNCTION public.recalculate_buzzer_level(target_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  normalized_email text := lower(trim(target_email));
  total_followers integer;
  resolved_level text;
  buzzer_name_value text;
  buzzer_category text;
  normalized_category text;
BEGIN
  IF normalized_email IS NULL OR normalized_email = '' THEN
    RETURN;
  END IF;

  -- Ambil kategori dari sumber paling otoritatif.
  SELECT COALESCE(
    (
      SELECT NULLIF(trim(b.buzzer_category), '')
      FROM public.buzzer_applications AS b
      WHERE lower(trim(b.email)) = normalized_email
      ORDER BY b.submitted_at DESC
      LIMIT 1
    ),
    (
      SELECT NULLIF(trim(a.buzzer_category), '')
      FROM public.app_accounts AS a
      WHERE lower(trim(a.email)) = normalized_email
      LIMIT 1
    ),
    (
      SELECT NULLIF(trim(a.company), '')
      FROM public.app_accounts AS a
      WHERE lower(trim(a.email)) = normalized_email
      LIMIT 1
    ),
    'Buzzer Online'
  ) INTO buzzer_category;

  -- Normalisasi: "Buzzer Online" -> "online", "Buzzer Offline-Online" -> "offline-online"
  normalized_category := regexp_replace(
    lower(trim(COALESCE(buzzer_category, 'Buzzer Online'))),
    '^buzzer[[:space:]]+',
    ''
  );

  -- Total followers hanya dari akun media sosial yang sudah terverifikasi admin.
  SELECT COALESCE(SUM(followers), 0)::integer
    INTO total_followers
  FROM public.social_accounts
  WHERE lower(trim(buzzer_email)) = normalized_email
    AND verification = 'Terverifikasi';

  IF normalized_category <> 'offline' THEN
    -- Online & Offline-Online (hybrid) memiliki level.
    SELECT bl.name
      INTO resolved_level
    FROM public.buzzer_levels AS bl
    WHERE bl.min_followers <= total_followers
    ORDER BY bl.min_followers DESC, bl.sort_order DESC
    LIMIT 1;
  ELSE
    -- Buzzer Offline murni tidak punya level.
    resolved_level := NULL;
  END IF;

  SELECT COALESCE(
    (
      SELECT buzzer_name
      FROM public.buzzer_wallets
      WHERE lower(trim(buzzer_email)) = normalized_email
      LIMIT 1
    ),
    (
      SELECT name
      FROM public.app_accounts
      WHERE lower(trim(email)) = normalized_email
      LIMIT 1
    ),
    split_part(normalized_email, '@', 1)
  ) INTO buzzer_name_value;

  INSERT INTO public.buzzer_wallets (
    buzzer_email,
    buzzer_name,
    followers,
    verified_followers,
    level,
    level_assigned_at
  ) VALUES (
    normalized_email,
    buzzer_name_value,
    total_followers,
    total_followers,
    resolved_level,
    CASE WHEN resolved_level IS NULL THEN NULL ELSE now() END
  )
  ON CONFLICT (buzzer_email) DO UPDATE SET
    followers = EXCLUDED.followers,
    verified_followers = EXCLUDED.verified_followers,
    level = EXCLUDED.level,
    level_assigned_at = CASE
      WHEN EXCLUDED.level IS NULL THEN NULL
      WHEN public.buzzer_wallets.level IS DISTINCT FROM EXCLUDED.level THEN now()
      ELSE public.buzzer_wallets.level_assigned_at
    END,
    updated_at = now();
END;
$$;

-- Bersihkan level yang tersisa untuk Buzzer Offline murni saja.
-- Hybrid (offline-online) TIDAK ikut dibersihkan.
UPDATE public.buzzer_wallets AS w
SET level = NULL,
    level_assigned_at = NULL
WHERE EXISTS (
  SELECT 1
  FROM public.app_accounts AS a
  WHERE lower(trim(a.email)) = lower(trim(w.buzzer_email))
    AND regexp_replace(
          lower(trim(COALESCE(
            NULLIF(a.buzzer_category, ''),
            NULLIF(a.company, ''),
            'Buzzer Online'
          ))),
          '^buzzer[[:space:]]+',
          ''
        ) = 'offline'
);

-- Hitung ulang level seluruh buzzer agar level hybrid yang sempat
-- terhapus oleh aturan lama langsung pulih.
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT DISTINCT lower(trim(email)) AS email
    FROM public.app_accounts
    WHERE role = 'buzzer' AND email IS NOT NULL
  LOOP
    PERFORM public.recalculate_buzzer_level(r.email);
  END LOOP;
END;
$$;

GRANT EXECUTE ON FUNCTION public.recalculate_buzzer_level(text) TO anon, authenticated, service_role;
