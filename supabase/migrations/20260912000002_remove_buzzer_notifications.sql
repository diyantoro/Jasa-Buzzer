DROP TRIGGER IF EXISTS notify_buzzers_for_new_job_trigger ON public.campaign_jobs;
DROP FUNCTION IF EXISTS public.notify_buzzers_for_new_job();
DROP INDEX IF EXISTS public.finance_notifications_recipient_email_idx;
ALTER TABLE public.finance_notifications
  DROP COLUMN IF EXISTS recipient_email;