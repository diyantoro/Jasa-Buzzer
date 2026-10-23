-- Only expose jobs that belong to an approved, active campaign and match a
-- buzzer's verified and active social account.
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
  WHERE campaign.payment_status = 'Pembayaran Disetujui'
    AND campaign.status IN ('Aktif', 'Review', 'Selesai')
    AND (
      lower(trim(job.buzzer_email)) = lower(trim(p_buzzer_email))
      OR (
        job.status = 'Tersedia'
        AND job.buzzer_email IS NULL
        AND EXISTS (
          SELECT 1
          FROM public.social_accounts AS account
          WHERE lower(trim(account.buzzer_email)) = lower(trim(p_buzzer_email))
            AND account.platform = job.platform
            AND account.verification = 'Terverifikasi'
            AND account.is_active = true
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
BEGIN
  SELECT * INTO target_job FROM public.campaign_jobs WHERE id = p_job_id FOR UPDATE;
  IF NOT FOUND OR target_job.status <> 'Tersedia' OR target_job.buzzer_email IS NOT NULL THEN
    RAISE EXCEPTION 'Job sudah tidak tersedia';
  END IF;

  SELECT * INTO target_campaign FROM public.campaigns WHERE id = target_job.campaign_id FOR UPDATE;
  IF NOT FOUND OR target_campaign.payment_status <> 'Pembayaran Disetujui' OR target_campaign.status NOT IN ('Aktif', 'Review') THEN
    RAISE EXCEPTION 'Campaign belum aktif atau pembayaran belum disetujui';
  END IF;
  IF NOT EXISTS (
    SELECT 1
    FROM public.social_accounts
    WHERE lower(trim(buzzer_email)) = lower(trim(p_buzzer_email))
      AND platform = target_job.platform
      AND verification = 'Terverifikasi'
      AND is_active = true
  ) THEN
    RAISE EXCEPTION 'Akun sosial media kamu belum terverifikasi atau tidak sesuai platform job';
  END IF;

  SELECT count(*)::integer INTO assigned_count
  FROM public.campaign_jobs
  WHERE campaign_id = target_campaign.id AND buzzer_email IS NOT NULL;
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
  SET status = 'Diambil', buzzer_email = lower(trim(p_buzzer_email)), buzzer_name = p_buzzer_name, updated_at = now()
  WHERE id = target_job.id;
  IF assigned_count + 1 >= GREATEST(target_campaign.slots, 1) THEN
    UPDATE public.campaigns SET target_reached_at = now(), updated_at = now() WHERE id = target_campaign.id;
  END IF;
  RETURN target_job.id;
END;
$$;

DROP POLICY IF EXISTS "demo_all" ON public.campaign_jobs;
DROP POLICY IF EXISTS "management campaign jobs read" ON public.campaign_jobs;
CREATE POLICY "campaign jobs approved read"
  ON public.campaign_jobs FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.campaigns AS campaign
      WHERE campaign.id = campaign_jobs.campaign_id
        AND campaign.payment_status = 'Pembayaran Disetujui'
        AND campaign.status IN ('Aktif', 'Review', 'Selesai')
    )
  );
CREATE POLICY "campaign jobs management insert"
  ON public.campaign_jobs FOR INSERT TO anon, authenticated
  WITH CHECK (true);
CREATE POLICY "campaign jobs management update"
  ON public.campaign_jobs FOR UPDATE TO anon, authenticated
  USING (true) WITH CHECK (true);
CREATE POLICY "campaign jobs management delete"
  ON public.campaign_jobs FOR DELETE TO anon, authenticated
  USING (true);

CREATE OR REPLACE FUNCTION public.validate_campaign_job_assignment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_campaign public.campaigns%ROWTYPE;
BEGIN
  IF OLD.status = 'Tersedia'
     AND (NEW.status IN ('Diambil', 'Upload', 'Review', 'Revisi', 'Selesai') OR NEW.buzzer_email IS NOT NULL) THEN
    SELECT * INTO target_campaign FROM public.campaigns WHERE id = NEW.campaign_id;
    IF NOT FOUND OR target_campaign.payment_status <> 'Pembayaran Disetujui' OR target_campaign.status NOT IN ('Aktif', 'Review') THEN
      RAISE EXCEPTION 'Campaign belum aktif atau pembayaran belum disetujui';
    END IF;
    IF NEW.buzzer_email IS NULL OR NOT EXISTS (
      SELECT 1
      FROM public.social_accounts
      WHERE lower(trim(buzzer_email)) = lower(trim(NEW.buzzer_email))
        AND platform = NEW.platform
        AND verification = 'Terverifikasi'
        AND is_active = true
    ) THEN
      RAISE EXCEPTION 'Akun sosial media buzzer belum terverifikasi atau tidak sesuai platform';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_campaign_job_assignment ON public.campaign_jobs;
CREATE TRIGGER validate_campaign_job_assignment
BEFORE UPDATE OF status, buzzer_email ON public.campaign_jobs
FOR EACH ROW EXECUTE FUNCTION public.validate_campaign_job_assignment();

REVOKE ALL ON FUNCTION public.get_buzzer_campaign_jobs(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_buzzer_campaign_jobs(text) TO anon, authenticated;
REVOKE ALL ON FUNCTION public.claim_campaign_job(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_campaign_job(uuid, text, text) TO anon, authenticated;