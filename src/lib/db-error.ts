/**
 * Ubah error PostgREST/Supabase menjadi pesan yang bisa ditindaklanjuti.
 *
 * Dipakai server function supaya kegagalan konfigurasi tidak muncul sebagai
 * "gagal" generik, melainkan menyebut penyebab dan perintah perbaikannya.
 */
type DbErrorLike = {
  code?: unknown;
  message?: unknown;
};

export function describeDbError(error: unknown): string {
  if (error instanceof Error && !("code" in error)) return error.message;

  const value = (typeof error === "object" && error ? error : {}) as DbErrorLike;
  const code = typeof value.code === "string" ? value.code : "";
  const message =
    typeof value.message === "string"
      ? value.message
      : error instanceof Error
        ? error.message
        : String(error ?? "Kesalahan database");

  if (code === "PGRST202" || /could not find the function/i.test(message)) {
    return `${message} — Migration hardening belum diterapkan di database. Jalankan \`npm run db:apply\` (lihat docs/SECURITY_HARDENING.md).`;
  }
  if (code === "PGRST205" || /could not find the table/i.test(message)) {
    return `${message} — Tabel belum ada di database. Terapkan migration dengan \`npm run db:apply\`.`;
  }
  if (code === "42501" || /permission denied/i.test(message)) {
    return `${message} — Server tidak memakai hak istimewa. Isi SUPABASE_SERVICE_ROLE_KEY dengan secret key valid, lalu jalankan \`npm run check:env\`.`;
  }
  if (/invalid api key|secret api key required/i.test(message)) {
    return `${message} — SUPABASE_SERVICE_ROLE_KEY ditolak Supabase. Ambil secret key dari project yang benar, lalu jalankan \`npm run check:env\`.`;
  }
  return message;
}
