const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 5 * 1024 * 1024;

function fileToBase64(file: File): Promise<string> {
  return file.arrayBuffer().then((buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const chunkSize = 0x8000;
    for (let index = 0; index < bytes.length; index += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
    }
    return btoa(binary);
  });
}

/**
 * Upload thumbnail katalog ke Supabase Storage dan kembalikan URL publiknya.
 *
 * Fase 2c: upload dilakukan server function admin; client tidak lagi bisa
 * menulis langsung ke bucket `campaign-thumbnails`.
 */
export async function uploadCatalogThumbnail(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) throw new Error("Gambar harus berupa JPG, PNG, WEBP, atau GIF.");
  if (file.size <= 0 || file.size > MAX_BYTES) throw new Error("Ukuran gambar harus antara 1 byte dan 5 MB.");

  const { uploadCatalogThumbnailFn } = await import("./uploads.functions");
  const result = await uploadCatalogThumbnailFn({
    data: {
      fileName: file.name,
      contentType: file.type,
      dataBase64: await fileToBase64(file),
    },
  });

  return result.url;
}
