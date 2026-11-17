const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

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
 * Unggah screenshot atau file PDF bukti pengerjaan buzzer.
 *
 * Fase 2c: file dikirim ke server function dan diunggah dengan `service_role`.
 * Client tidak lagi memegang izin tulis ke bucket `bukti-pengerjaan`.
 */
export async function uploadProofScreenshot(file: File): Promise<string> {
  if (!(file instanceof File)) {
    throw new Error("File bukti tidak terbaca.");
  }
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!ALLOWED_TYPES.has(file.type) && !isPdf) {
    throw new Error("Format bukti harus JPG, PNG, WEBP, atau PDF.");
  }
  if (file.size <= 0) {
    throw new Error("File bukti kosong.");
  }

  const { uploadProofFileFn } = await import("./uploads.functions");
  const result = await uploadProofFileFn({
    data: {
      fileName: file.name,
      contentType: isPdf ? "application/pdf" : file.type || "image/jpeg",
      dataBase64: await fileToBase64(file),
    },
  });

  return result.url;
}
