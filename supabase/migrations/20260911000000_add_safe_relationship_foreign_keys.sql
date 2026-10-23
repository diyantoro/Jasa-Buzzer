-- Safe relationship hardening for existing data.
-- Constraints are added as NOT VALID so existing orphan rows do not make
-- deployment fail. New INSERT/UPDATE rows are still checked immediately.

CREATE INDEX IF NOT EXISTS campaign_jobs_campaign_id_idx
  ON public.campaign_jobs (campaign_id);

CREATE INDEX IF NOT EXISTS campaign_messages_campaign_id_idx
  ON public.campaign_messages (campaign_id);

CREATE INDEX IF NOT EXISTS buzzer_ratings_job_id_idx
  ON public.buzzer_ratings (job_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_attribute child_key
      ON child_key.attrelid = c.conrelid
     AND child_key.attnum = ANY (c.conkey)
    JOIN pg_attribute parent_key
      ON parent_key.attrelid = c.confrelid
     AND parent_key.attnum = ANY (c.confkey)
    WHERE c.contype = 'f'
      AND c.conrelid = 'public.campaign_jobs'::regclass
      AND c.confrelid = 'public.campaigns'::regclass
      AND child_key.attname = 'campaign_id'
      AND parent_key.attname = 'id'
  ) THEN
    ALTER TABLE public.campaign_jobs
      ADD CONSTRAINT campaign_jobs_campaign_id_fkey
      FOREIGN KEY (campaign_id)
      REFERENCES public.campaigns(id)
      NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_attribute child_key
      ON child_key.attrelid = c.conrelid
     AND child_key.attnum = ANY (c.conkey)
    JOIN pg_attribute parent_key
      ON parent_key.attrelid = c.confrelid
     AND parent_key.attnum = ANY (c.confkey)
    WHERE c.contype = 'f'
      AND c.conrelid = 'public.campaign_messages'::regclass
      AND c.confrelid = 'public.campaigns'::regclass
      AND child_key.attname = 'campaign_id'
      AND parent_key.attname = 'id'
  ) THEN
    ALTER TABLE public.campaign_messages
      ADD CONSTRAINT campaign_messages_campaign_id_fkey
      FOREIGN KEY (campaign_id)
      REFERENCES public.campaigns(id)
      ON DELETE SET NULL
      NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_attribute child_key
      ON child_key.attrelid = c.conrelid
     AND child_key.attnum = ANY (c.conkey)
    JOIN pg_attribute parent_key
      ON parent_key.attrelid = c.confrelid
     AND parent_key.attnum = ANY (c.confkey)
    WHERE c.contype = 'f'
      AND c.conrelid = 'public.buzzer_ratings'::regclass
      AND c.confrelid = 'public.campaign_jobs'::regclass
      AND child_key.attname = 'job_id'
      AND parent_key.attname = 'id'
  ) THEN
    ALTER TABLE public.buzzer_ratings
      ADD CONSTRAINT buzzer_ratings_job_id_fkey
      FOREIGN KEY (job_id)
      REFERENCES public.campaign_jobs(id)
      NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_attribute child_key
      ON child_key.attrelid = c.conrelid
     AND child_key.attnum = ANY (c.conkey)
    JOIN pg_attribute parent_key
      ON parent_key.attrelid = c.confrelid
     AND parent_key.attnum = ANY (c.confkey)
    WHERE c.contype = 'f'
      AND c.conrelid = 'public.buzzer_ratings'::regclass
      AND c.confrelid = 'public.campaigns'::regclass
      AND child_key.attname = 'campaign_id'
      AND parent_key.attname = 'id'
  ) THEN
    ALTER TABLE public.buzzer_ratings
      ADD CONSTRAINT buzzer_ratings_campaign_id_fkey
      FOREIGN KEY (campaign_id)
      REFERENCES public.campaigns(id)
      NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_attribute child_key
      ON child_key.attrelid = c.conrelid
     AND child_key.attnum = ANY (c.conkey)
    JOIN pg_attribute parent_key
      ON parent_key.attrelid = c.confrelid
     AND parent_key.attnum = ANY (c.confkey)
    WHERE c.contype = 'f'
      AND c.conrelid = 'public.campaign_job_submissions'::regclass
      AND c.confrelid = 'public.campaign_jobs'::regclass
      AND child_key.attname = 'job_id'
      AND parent_key.attname = 'id'
  ) THEN
    ALTER TABLE public.campaign_job_submissions
      ADD CONSTRAINT campaign_job_submissions_job_id_fkey
      FOREIGN KEY (job_id)
      REFERENCES public.campaign_jobs(id)
      ON DELETE CASCADE
      NOT VALID;
  END IF;
END $$;

-- Run these queries on the target database before validating the constraints.
-- Any returned row is legacy data that must be reviewed, not deleted blindly.
--
-- SELECT job.id, job.campaign_id
-- FROM public.campaign_jobs job
-- LEFT JOIN public.campaigns campaign ON campaign.id = job.campaign_id
-- WHERE job.campaign_id IS NOT NULL AND campaign.id IS NULL;
--
-- SELECT message.id, message.campaign_id
-- FROM public.campaign_messages message
-- LEFT JOIN public.campaigns campaign ON campaign.id = message.campaign_id
-- WHERE message.campaign_id IS NOT NULL AND campaign.id IS NULL;
--
-- SELECT rating.id, rating.job_id, rating.campaign_id
-- FROM public.buzzer_ratings rating
-- LEFT JOIN public.campaign_jobs job ON job.id = rating.job_id
-- WHERE job.id IS NULL;
--
-- SELECT rating.id, rating.job_id, rating.campaign_id
-- FROM public.buzzer_ratings rating
-- LEFT JOIN public.campaigns campaign ON campaign.id = rating.campaign_id
-- WHERE rating.campaign_id IS NOT NULL AND campaign.id IS NULL;
--
-- After the orphan queries return no rows, validate each constraint:
-- ALTER TABLE public.campaign_jobs VALIDATE CONSTRAINT campaign_jobs_campaign_id_fkey;
-- ALTER TABLE public.campaign_messages VALIDATE CONSTRAINT campaign_messages_campaign_id_fkey;
-- ALTER TABLE public.buzzer_ratings VALIDATE CONSTRAINT buzzer_ratings_job_id_fkey;
-- ALTER TABLE public.buzzer_ratings VALIDATE CONSTRAINT buzzer_ratings_campaign_id_fkey;
-- ALTER TABLE public.campaign_job_submissions VALIDATE CONSTRAINT campaign_job_submissions_job_id_fkey;
