-- Level buzzer hanya boleh diberikan kepada kategori Buzzer Online.
-- Total followers tetap dihitung dari akun media sosial yang terverifikasi admin.

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
BEGIN
  IF normalized_email IS NULL OR normalized_email = '' THEN
    RETURN;
  END IF;

  SELECT COALESCE(
    (
      SELECT lower(trim(b.buzzer_category))
      FROM public.buzzer_applications AS b
      WHERE lower(trim(b.email)) = normalized_email
      ORDER BY b.submitted_at DESC
      LIMIT 1
    ),
    (
      SELECT lower(trim(a.buzzer_category))
      FROM public.app_accounts AS a
      WHERE lower(trim(a.email)) = normalized_email
      LIMIT 1
    ),
    (
      SELECT lower(trim(a.company))
      FROM public.app_accounts AS a
      WHERE lower(trim(a.email)) = normalized_email
      LIMIT 1
    ),
    'buzzer online'
  ) INTO buzzer_category;

  SELECT COALESCE(SUM(followers), 0)::integer
    INTO total_followers
  FROM public.social_accounts
  WHERE lower(trim(buzzer_email)) = normalized_email
    AND verification = 'Terverifikasi';

  IF lower(trim(COALESCE(buzzer_category, 'buzzer online'))) = 'buzzer online' THEN
    SELECT bl.name
      INTO resolved_level
    FROM public.buzzer_levels AS bl
    WHERE bl.min_followers <= total_followers
    ORDER BY bl.min_followers DESC, bl.sort_order DESC
    LIMIT 1;
  ELSE
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

-- Bersihkan level yang mungkin tersisa untuk buzzer offline.
UPDATE public.buzzer_wallets AS w
SET level = NULL,
    level_assigned_at = NULL
WHERE EXISTS (
  SELECT 1
  FROM public.app_accounts AS a
  WHERE lower(trim(a.email)) = lower(trim(w.buzzer_email))
    AND lower(trim(COALESCE(a.buzzer_category, a.company, ''))) <> 'buzzer online'
);

GRANT EXECUTE ON FUNCTION public.recalculate_buzzer_level(text) TO anon, authenticated, service_role;
