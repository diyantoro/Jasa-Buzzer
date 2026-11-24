-- =====================================================================
-- Migration: 20261124000001_rate_limits.sql
-- Penyimpanan bersama untuk rate limiter.
--
-- Sebelumnya limiter berjalan in-memory per instance (best-effort). Tabel
-- ini menyimpan hitungan di Postgres agar batas berlaku lintas instance /
-- isolate. RPC check_rate_limit melakukan hitung + update secara atomik
-- dengan row lock sehingga dua request bersamaan tidak bisa melewati batas.
--
-- Akses dibatasi hanya service_role (dipanggil dari server function),
-- tertutup untuk anon dan authenticated.
-- =====================================================================
BEGIN;

-- ---------------------------------------------------------------------
-- 1. Tabel bucket
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rate_limit_buckets (
  key text PRIMARY KEY,
  count integer NOT NULL DEFAULT 0 CHECK (count >= 0),
  reset_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_buckets_reset_at
  ON public.rate_limit_buckets (reset_at);

COMMENT ON TABLE public.rate_limit_buckets IS
  'Hitungan rate limit per key (email/IP). Hanya diakses service_role.';

-- ---------------------------------------------------------------------
-- 2. Keamanan: RLS & privileges (hanya service_role)
-- ---------------------------------------------------------------------
ALTER TABLE public.rate_limit_buckets ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.rate_limit_buckets FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.rate_limit_buckets TO service_role;

DROP POLICY IF EXISTS "service_role_all_rate_limit_buckets" ON public.rate_limit_buckets;
CREATE POLICY "service_role_all_rate_limit_buckets"
  ON public.rate_limit_buckets
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ---------------------------------------------------------------------
-- 3. RPC atomik
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_key text,
  p_limit integer,
  p_window_ms integer
)
RETURNS TABLE(allowed boolean, retry_after_seconds integer, remaining integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_now timestamptz := clock_timestamp();
  v_key text := left(coalesce(p_key, ''), 512);
  v_window interval := make_interval(secs => p_window_ms::double precision / 1000.0);
  v_count integer;
  v_reset_at timestamptz;
BEGIN
  IF length(v_key) = 0 THEN
    RAISE EXCEPTION 'p_key wajib diisi';
  END IF;
  IF p_limit IS NULL OR p_limit < 1 THEN
    RAISE EXCEPTION 'p_limit harus >= 1';
  END IF;
  IF p_window_ms IS NULL OR p_window_ms < 1000 THEN
    RAISE EXCEPTION 'p_window_ms minimal 1000';
  END IF;

  -- Pastikan baris ada, lalu kunci untuk update agar hitungan konsisten.
  INSERT INTO public.rate_limit_buckets (key, count, reset_at, updated_at)
  VALUES (v_key, 0, v_now + v_window, v_now)
  ON CONFLICT (key) DO NOTHING;

  SELECT b.count, b.reset_at
    INTO v_count, v_reset_at
    FROM public.rate_limit_buckets b
   WHERE b.key = v_key
   FOR UPDATE;

  IF v_reset_at IS NULL OR v_reset_at <= v_now THEN
    v_count := 0;
    v_reset_at := v_now + v_window;
  END IF;

  IF v_count >= p_limit THEN
    UPDATE public.rate_limit_buckets
       SET updated_at = v_now
     WHERE key = v_key;

    RETURN QUERY
      SELECT false,
             GREATEST(1, CEIL(EXTRACT(EPOCH FROM (v_reset_at - v_now)))::integer),
             0;
    RETURN;
  END IF;

  v_count := v_count + 1;

  UPDATE public.rate_limit_buckets
     SET count = v_count,
         reset_at = v_reset_at,
         updated_at = v_now
   WHERE key = v_key;

  RETURN QUERY
    SELECT true, 0, GREATEST(0, p_limit - v_count);
END;
$$;

-- ---------------------------------------------------------------------
-- 4. Pembersihan bucket kedaluwarsa (dipanggil best-effort dari server)
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.prune_rate_limit_buckets()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_deleted integer;
BEGIN
  DELETE FROM public.rate_limit_buckets
   WHERE reset_at < clock_timestamp() - interval '1 day';
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$;

-- ---------------------------------------------------------------------
-- 5. Cabut grant default (Supabase memberi EXECUTE ke anon/authenticated)
-- ---------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.check_rate_limit(text, integer, integer)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(text, integer, integer)
  TO service_role;

REVOKE ALL ON FUNCTION public.prune_rate_limit_buckets()
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.prune_rate_limit_buckets()
  TO service_role;

COMMIT;
