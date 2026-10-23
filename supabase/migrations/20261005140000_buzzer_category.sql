-- Migration: Add buzzer_category to buzzer_applications and app_accounts
ALTER TABLE IF EXISTS public.buzzer_applications ADD COLUMN IF NOT EXISTS buzzer_category text DEFAULT 'Buzzer Online';
ALTER TABLE IF EXISTS public.app_accounts ADD COLUMN IF NOT EXISTS buzzer_category text DEFAULT 'Buzzer Online';
