DO $$
DECLARE
  duplicate_group record;
  duplicate_job record;
BEGIN
  FOR duplicate_group IN
    SELECT campaign_id, lower(trim(buzzer_email)) AS buzzer_email
    FROM public.campaign_jobs
    WHERE campaign_id IS NOT NULL
      AND buzzer_email IS NOT NULL
      AND trim(buzzer_email) <> ''
    GROUP BY campaign_id, lower(trim(buzzer_email))
    HAVING count(*) > 1
  LOOP
    FOR duplicate_job IN
      SELECT id
      FROM public.campaign_jobs
      WHERE campaign_id = duplicate_group.campaign_id
        AND lower(trim(buzzer_email)) = duplicate_group.buzzer_email
      ORDER BY updated_at DESC, created_at DESC, id DESC
      OFFSET 1
    LOOP
      UPDATE public.campaign_jobs
      SET buzzer_email = NULL,
          buzzer_name = NULL
      WHERE id = duplicate_job.id;
    END LOOP;
  END LOOP;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS campaign_jobs_one_assignment_per_campaign_buzzer_idx
  ON public.campaign_jobs (campaign_id, lower(trim(buzzer_email)))
  WHERE campaign_id IS NOT NULL
    AND buzzer_email IS NOT NULL
    AND trim(buzzer_email) <> '';
