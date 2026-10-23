import { supabase } from "@/integrations/supabase/client";

const BUCKET = "campaign-thumbnails";
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 5 * 1024 * 1024;

/** Upload thumbnail katalog ke Supabase Storage dan kembalikan URL publiknya. */
export async function uploadCatalogThumbnail(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) throw new Error("Gambar harus berupa JPG, PNG, WEBP, atau GIF.");
  if (file.size <= 0 || file.size > MAX_BYTES) throw new Error("Ukuran gambar harus antara 1 byte dan 5 MB.");

  const extension = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
  const path = `catalogs/${crypto.randomUUID()}.${extension}`;
  const { data, error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error || !data?.path) throw error ?? new Error("Upload gambar katalog gagal.");
  return supabase.storage.from(BUCKET).getPublicUrl(data.path).data.publicUrl;
}
