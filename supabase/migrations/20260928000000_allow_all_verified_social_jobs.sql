-- Support multiple verified social media accounts per buzzer for campaign job visibility and claiming.
-- Allows buzzers with multiple approved social accounts (e.g. Instagram + TikTok) to see and claim jobs for all verified platforms.

CREATE OR REPLACE FUNCTION public.get_buzzer_campaign_jobs(p_buzzer_email text)
RETURNS SETOF public.campaign_jobs
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT job.*
  FROM public.campaign_jobs AS job
  JOIN public.campaigns AS campaign ON campaign.id = job.campaign_id
  WHERE (
      EXISTS (
        SELECT 1
        FROM public.buzzer_applications AS application
        WHERE lower(trim(application.email)) = lower(trim(p_buzzer_email))
          AND application.status = 'approved'
      )
      OR EXISTS (
        SELECT 1
        FROM public.app_accounts AS acc
        WHERE lower(trim(acc.email)) = lower(trim(p_buzzer_email))
          AND acc.role = 'buzzer'
      )
    )
    AND campaign.payment_status = 'Pembayaran Disetujui'
    AND campaign.start_date ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
    AND campaign.start_date::date <= CURRENT_DATE
    AND campaign.deadline ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
    AND campaign.deadline::date >= CURRENT_DATE
    AND (
      lower(trim(coalesce(job.buzzer_email, ''))) = lower(trim(p_buzzer_email))
      OR (
        job.status = 'Tersedia'
        AND job.buzzer_email IS NULL
        AND campaign.status IN ('Aktif', 'Review')
        AND (
          SELECT count(*)
          FROM public.campaign_jobs AS assigned_job
          WHERE assigned_job.campaign_id = campaign.id
            AND assigned_job.buzzer_email IS NOT NULL
        ) < GREATEST(campaign.slots, 1)
        AND (
          job.platform = 'Offline'
          OR EXISTS (
            SELECT 1
            FROM public.social_accounts AS account
            WHERE lower(trim(account.buzzer_email)) = lower(trim(p_buzzer_email))
              AND lower(trim(account.platform)) = lower(trim(job.platform))
              AND lower(trim(account.verification)) = 'terverifikasi'
              AND (account.is_active = true OR account.is_active IS NULL)
          )
          OR EXISTS (
            SELECT 1
            FROM public.buzzer_applications AS application
            WHERE lower(trim(application.email)) = lower(trim(p_buzzer_email))
              AND application.status = 'approved'
              AND lower(trim(application.platform)) = lower(trim(job.platform))
          )
          OR EXISTS (
            SELECT 1
            FROM public.app_accounts AS acc
            WHERE lower(trim(acc.email)) = lower(trim(p_buzzer_email))
              AND acc.role = 'buzzer'
              AND lower(trim(coalesce(acc.platform, ''))) = lower(trim(job.platform))
          )
        )
      )
    )
  ORDER BY job.created_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.claim_campaign_job(p_job_id uuid, p_buzzer_email text, p_buzzer_name text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_job public.campaign_jobs%ROWTYPE;
  target_campaign public.campaigns%ROWTYPE;
  assigned_count integer;
  snapshot_level text;
  gross_amount numeric;
  level_payout numeric;
  buzzer_share_amount numeric;
  buzzer_share_percentage numeric;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.buzzer_applications
    WHERE lower(trim(email)) = lower(trim(p_buzzer_email)) AND status = 'approved'
  ) AND NOT EXISTS (
    SELECT 1 FROM public.app_accounts
    WHERE lower(trim(email)) = lower(trim(p_buzzer_email)) AND role = 'buzzer'
  ) THEN
    RAISE EXCEPTION 'Akun buzzer belum diverifikasi admin';
  END IF;

  SELECT * INTO target_job FROM public.campaign_jobs WHERE id = p_job_id FOR UPDATE;
  IF NOT FOUND OR target_job.status <> 'Tersedia' OR target_job.buzzer_email IS NOT NULL THEN
    RAISE EXCEPTION 'Job sudah tidak tersedia';
  END IF;

  SELECT * INTO target_campaign FROM public.campaigns WHERE id = target_job.campaign_id FOR UPDATE;
  IF NOT FOUND OR target_campaign.payment_status <> 'Pembayaran Disetujui' OR target_campaign.status NOT IN ('Aktif', 'Review') THEN
    RAISE EXCEPTION 'Campaign belum aktif atau pembayaran belum disetujui';
  END IF;
  IF target_campaign.start_date !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' OR target_campaign.start_date::date > CURRENT_DATE THEN
    RAISE EXCEPTION 'Campaign belum memasuki tanggal mulai';
  END IF;
  IF target_campaign.deadline !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' OR target_campaign.deadline::date < CURRENT_DATE THEN
    RAISE EXCEPTION 'Masa campaign telah berakhir';
  END IF;

  IF target_job.platform <> 'Offline' AND NOT EXISTS (
    SELECT 1 FROM public.social_accounts
    WHERE lower(trim(buzzer_email)) = lower(trim(p_buzzer_email))
      AND lower(trim(platform)) = lower(trim(target_job.platform))
      AND lower(trim(verification)) = 'terverifikasi'
      AND (is_active = true OR is_active IS NULL)
  ) AND NOT EXISTS (
    SELECT 1 FROM public.buzzer_applications
    WHERE lower(trim(email)) = lower(trim(p_buzzer_email))
      AND status = 'approved'
      AND lower(trim(platform)) = lower(trim(target_job.platform))
  ) AND NOT EXISTS (
    SELECT 1 FROM public.app_accounts
    WHERE lower(trim(email)) = lower(trim(p_buzzer_email))
      AND role = 'buzzer'
      AND lower(trim(coalesce(platform, ''))) = lower(trim(target_job.platform))
  ) THEN
    RAISE EXCEPTION 'Akun sosial media kamu belum terverifikasi atau tidak sesuai platform job';
  END IF;

  SELECT wallet.level INTO snapshot_level
  FROM public.buzzer_wallets AS wallet
  WHERE lower(trim(wallet.buzzer_email)) = lower(trim(p_buzzer_email));

  IF snapshot_level NOT IN ('Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond') THEN
    PERFORM public.recalculate_buzzer_level(p_buzzer_email);
    SELECT wallet.level INTO snapshot_level
    FROM public.buzzer_wallets AS wallet
    WHERE lower(trim(wallet.buzzer_email)) = lower(trim(p_buzzer_email));
  END IF;

  IF snapshot_level NOT IN ('Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond') THEN
    snapshot_level := 'Bronze';
  END IF;

  SELECT GREATEST(COALESCE(level.payout_per_job, 0), 0) INTO level_payout
  FROM public.buzzer_levels AS level
  WHERE level.name = snapshot_level;
  IF COALESCE(level_payout, 0) <= 0 THEN
    level_payout := 1000;
  END IF;

  gross_amount := GREATEST(COALESCE(target_job.gross_price, target_campaign.budget / GREATEST(target_campaign.slots, 1), 0), 0);
  IF gross_amount <= 0 THEN
    RAISE EXCEPTION 'Harga job tidak valid';
  END IF;
  buzzer_share_amount := LEAST(gross_amount, level_payout);
  buzzer_share_percentage := ROUND(buzzer_share_amount * 100 / gross_amount, 2);

  SELECT count(*)::integer INTO assigned_count
  FROM public.campaign_jobs WHERE campaign_id = target_campaign.id AND buzzer_email IS NOT NULL;
  IF assigned_count >= GREATEST(target_campaign.slots, 1) THEN
    UPDATE public.campaigns SET target_reached_at = COALESCE(target_reached_at, now()), updated_at = now() WHERE id = target_campaign.id;
    RAISE EXCEPTION 'Target campaign telah tercapai';
  END IF;
  IF EXISTS (
    SELECT 1 FROM public.campaign_jobs
    WHERE campaign_id = target_campaign.id AND lower(trim(buzzer_email)) = lower(trim(p_buzzer_email))
  ) THEN
    RAISE EXCEPTION 'Kamu sudah pernah mengambil campaign ini';
  END IF;

  UPDATE public.campaign_jobs
  SET status = 'Diambil', buzzer_email = lower(trim(p_buzzer_email)), buzzer_name = p_buzzer_name,
      gross_price = gross_amount, payout = buzzer_share_amount,
      buzzer_level = snapshot_level, buzzer_percentage = buzzer_share_percentage,
      buzzer_amount = buzzer_share_amount, admin_percentage = 100 - buzzer_share_percentage,
      admin_amount = gross_amount - buzzer_share_amount, updated_at = now()
  WHERE id = target_job.id;

  IF assigned_count + 1 >= GREATEST(target_campaign.slots, 1) THEN
    UPDATE public.campaigns SET target_reached_at = now(), updated_at = now() WHERE id = target_campaign.id;
  END IF;
  RETURN target_job.id;
END;
$$;

REVOKE ALL ON FUNCTION public.get_buzzer_campaign_jobs(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_buzzer_campaign_jobs(text) TO anon, authenticated;
REVOKE ALL ON FUNCTION public.claim_campaign_job(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_campaign_job(uuid, text, text) TO anon, authenticated;
