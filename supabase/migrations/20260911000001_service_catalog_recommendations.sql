CREATE TABLE IF NOT EXISTS public.service_catalog_recommendations (
  catalog_id text NOT NULL,
  campaign_type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (catalog_id, campaign_type),
  CONSTRAINT service_catalog_recommendations_campaign_type_check
    CHECK (campaign_type IN ('like', 'komentar', 'like-komentar', 'share', 'follow', 'review'))
);

CREATE INDEX IF NOT EXISTS service_catalog_recommendations_catalog_idx
  ON public.service_catalog_recommendations (catalog_id);

ALTER TABLE public.service_catalog_recommendations ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_catalog_recommendations TO anon, authenticated;
GRANT ALL ON public.service_catalog_recommendations TO service_role;

DROP POLICY IF EXISTS "service catalog recommendations access" ON public.service_catalog_recommendations;
CREATE POLICY "service catalog recommendations access"
  ON public.service_catalog_recommendations FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS update_service_catalog_recommendations_updated_at ON public.service_catalog_recommendations;
CREATE TRIGGER update_service_catalog_recommendations_updated_at
BEFORE UPDATE ON public.service_catalog_recommendations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'service_catalog_recommendations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.service_catalog_recommendations;
  END IF;
END $$;
