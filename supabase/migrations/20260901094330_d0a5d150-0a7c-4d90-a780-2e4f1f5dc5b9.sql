alter table public.app_accounts
  add column if not exists phone text,
  add column if not exists city text,
  add column if not exists bio text,
  add column if not exists company text,
  add column if not exists industry text,
  add column if not exists username text,
  add column if not exists platform text,
  add column if not exists followers integer,
  add column if not exists avatar_url text;