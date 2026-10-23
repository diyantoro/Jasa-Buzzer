import { supabase } from "@/integrations/supabase/client";

const BUCKET = "bukti-pengerjaan";
const ONE_YEAR = 60 * 60 * 24 * 365;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

/**
 * Unggah screenshot atau file PDF bukti pengerjaan buzzer ke penyimpanan dan
 * kembalikan signed URL yang bisa langsung dipakai customer.
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

  const extensionByType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "application/pdf": "pdf",
  };
  const ext = isPdf ? "pdf" : (extensionByType[file.type] || "jpg");
  const contentType = isPdf ? "application/pdf" : (file.type || "image/jpeg");
  const path = `proofs/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;

  const { data: uploaded, error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType,
  });
  if (error) {
    console.error("[Proof Upload] Supabase Storage upload error:", error);
    throw error;
  }
  if (!uploaded?.path) {
    const uploadError = new Error("Supabase tidak mengembalikan path file bukti.");
    console.error("[Proof Upload] Invalid upload response:", uploaded);
    throw uploadError;
  }

  const { data, error: signErr } = await supabase.storage.from(BUCKET).createSignedUrl(uploaded.path, ONE_YEAR);
  if (signErr || !data?.signedUrl) {
    console.error("[Proof Upload] Supabase Storage signed URL error:", signErr);
    throw signErr ?? new Error("Gagal membuat URL bukti");
  }
  return data.signedUrl;
}
