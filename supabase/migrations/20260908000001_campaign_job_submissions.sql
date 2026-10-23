ALTER TABLE public.campaign_jobs
  ADD COLUMN IF NOT EXISTS rejection_reason text,
  ADD COLUMN IF NOT EXISTS rejected_at timestamptz,
  ADD COLUMN IF NOT EXISTS rejected_by text,
  ADD COLUMN IF NOT EXISTS resubmission_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS submitted_at timestamptz;

CREATE TABLE IF NOT EXISTS public.campaign_job_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.campaign_jobs(id) ON DELETE CASCADE,
  buzzer_email text NOT NULL,
  proof_url text NOT NULL,
  submission_number integer NOT NULL,
  status text NOT NULL DEFAULT 'Review',
  rejection_reason text,
  rejected_at timestamptz,
  rejected_by text,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (job_id, submission_number)
);

CREATE INDEX IF NOT EXISTS campaign_job_submissions_job_idx
  ON public.campaign_job_submissions (job_id, submission_number DESC);

ALTER TABLE public.campaign_job_submissions ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON public.campaign_job_submissions TO anon, authenticated;
GRANT ALL ON public.campaign_job_submissions TO service_role;
DROP POLICY IF EXISTS "campaign job submissions access" ON public.campaign_job_submissions;
CREATE POLICY "campaign job submissions access"
  ON public.campaign_job_submissions FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS update_campaign_job_submissions_updated_at ON public.campaign_job_submissions;
CREATE TRIGGER update_campaign_job_submissions_updated_at
BEFORE UPDATE ON public.campaign_job_submissions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'campaign_job_submissions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.campaign_job_submissions;
  END IF;
END $$;
