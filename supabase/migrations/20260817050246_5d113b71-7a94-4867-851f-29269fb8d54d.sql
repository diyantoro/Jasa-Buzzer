CREATE TABLE public.app_accounts (
  email text PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.app_accounts TO service_role;
ALTER TABLE public.app_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service role only" ON public.app_accounts FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE public.buzzer_applications (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  username text NOT NULL DEFAULT '',
  platform text NOT NULL DEFAULT 'Instagram',
  platforms text[] NOT NULL DEFAULT '{}',
  followers integer NOT NULL DEFAULT 0,
  phone text,
  city text,
  category text,
  bio text,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'pending',
  reviewed_at timestamptz,
  review_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.buzzer_applications TO anon, authenticated;
GRANT ALL ON public.buzzer_applications TO service_role;
ALTER TABLE public.buzzer_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY demo_all ON public.buzzer_applications FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_app_accounts_updated_at BEFORE UPDATE ON public.app_accounts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_buzzer_applications_updated_at BEFORE UPDATE ON public.buzzer_applications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();