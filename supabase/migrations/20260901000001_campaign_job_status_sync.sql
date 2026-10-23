CREATE OR REPLACE FUNCTION public.sync_campaign_status_from_jobs()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.campaign_jobs
    WHERE campaign_id = NEW.campaign_id AND status = 'Review'
  ) THEN
    UPDATE public.campaigns SET status = 'Review', updated_at = now()
    WHERE id = NEW.campaign_id AND status <> 'Dibatalkan';
  ELSIF NOT EXISTS (
    SELECT 1 FROM public.campaign_jobs
    WHERE campaign_id = NEW.campaign_id AND status <> 'Selesai'
  ) THEN
    UPDATE public.campaigns SET status = 'Selesai', updated_at = now()
    WHERE id = NEW.campaign_id AND status <> 'Dibatalkan';
  ELSIF EXISTS (
    SELECT 1 FROM public.campaign_jobs
    WHERE campaign_id = NEW.campaign_id AND status IN ('Diambil', 'Revisi')
  ) THEN
    UPDATE public.campaigns SET status = 'Aktif', updated_at = now()
    WHERE id = NEW.campaign_id AND status <> 'Dibatalkan';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS sync_campaign_status_after_job_update ON public.campaign_jobs;
CREATE TRIGGER sync_campaign_status_after_job_update
AFTER INSERT OR UPDATE OF status ON public.campaign_jobs
FOR EACH ROW EXECUTE FUNCTION public.sync_campaign_status_from_jobs();