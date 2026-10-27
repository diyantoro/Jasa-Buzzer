/**
 * Cache baris hasil query Supabase di memori browser.
 *
 * Tujuan: perpindahan menu terasa instan. Saat sebuah hook dibuka ulang,
 * data terakhir langsung ditampilkan (stale-while-revalidate) sementara
 * request baru berjalan diam-diam di belakang layar.
 */

type CacheEntry<T> = {
  data: T[];
  updatedAt: number;
};

const cache = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown[]>>();

export function getCachedRows<T>(key: string): T[] | undefined {
  return cache.get(key)?.data as T[] | undefined;
}

export function isCacheFresh(key: string, maxAgeMs = 20_000): boolean {
  const entry = cache.get(key);
  return Boolean(entry && Date.now() - entry.updatedAt < maxAgeMs);
}

export function setCachedRows<T>(key: string, data: T[]): void {
  cache.set(key, { data, updatedAt: Date.now() });
}

/**
 * Ambil data dari cache/network dengan dedupe request yang sedang berjalan.
 * Dua hook yang membaca tabel yang sama pada saat bersamaan hanya memicu
 * satu request jaringan.
 */
export function loadCachedRows<T>(key: string, fetcher: () => Promise<T[]>): Promise<T[]> {
  const pending = inflight.get(key) as Promise<T[]> | undefined;
  if (pending) return pending;

  const promise = fetcher()
    .then((rows) => {
      setCachedRows(key, rows);
      return rows;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, promise as Promise<unknown[]>);
  return promise;
}

export function invalidateCachedRows(prefix?: string): void {
  if (!prefix) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
}
