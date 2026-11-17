/**
 * Server function unggah file ke Supabase Storage.
 *
 * Fase 2c: policy storage sebelumnya mengizinkan `anon` menulis langsung ke
 * bucket `bukti-pengerjaan` dan `campaign-thumbnails`. Sekarang upload
 * dilakukan server dengan `service_role`, sehingga hanya sesi yang sah yang
 * bisa menulis dan tipe/ukuran file divalidasi di server.
 */
import { createServerFn } from "@tanstack/react-start";
import { describeDbError } from "./db-error";

const PROOF_BUCKET = "bukti-pengerjaan";
const THUMBNAIL_BUCKET = "campaign-thumbnails";
const ONE_YEAR = 60 * 60 * 24 * 365;

const PROOF_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const PROOF_MAX_BYTES = 12 * 1024 * 1024;
const THUMBNAIL_MAX_BYTES = 5 * 1024 * 1024;

type Session = { email: string; role: "admin" | "buzzer" | "customer" };

async function adminClient() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as any;
}

async function currentSession(): Promise<Session | null> {
  const { getServerSession } = await import("./session.server");
  return (await getServerSession()) as Session | null;
}

function fail(error: unknown): never {
  throw new Error(describeDbError(error));
}

function decodeBase64(value: unknown): Uint8Array {
  const clean = String(value ?? "").replace(/^data:[^;]+;base64,/, "");
  if (!clean) throw new Error("File kosong.");
  try {
    const binary = atob(clean);
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
  } catch {
    throw new Error("File tidak bisa dibaca.");
  }
}

function extensionFor(contentType: string, fileName: string): string {
  const byType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "application/pdf": "pdf",
  };
  if (byType[contentType]) return byType[contentType];
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  return /^[a-z0-9]{1,5}$/.test(ext) ? ext : "bin";
}

export const uploadProofFileFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as { fileName: string; contentType: string; dataBase64: string },
  )
  .handler(async ({ data }) => {
    const session = await currentSession();
    if (!session) throw new Error("Sesi tidak ditemukan. Silakan masuk ulang.");
    if (session.role !== "buzzer" && session.role !== "admin") {
      throw new Error("Hanya akun buzzer yang bisa mengunggah bukti.");
    }

    const { enforceRateLimit, RATE_LIMITS } = await import("./rate-limit.server");
    enforceRateLimit(
      `upload-proof:${session.email}`,
      RATE_LIMITS.uploadProof.limit,
      RATE_LIMITS.uploadProof.windowMs,
    );

    const fileName = String(data?.fileName ?? "file");
    const contentType = String(data?.contentType ?? "").toLowerCase();
    const isPdf = contentType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf");
    if (!PROOF_TYPES.has(contentType) && !isPdf) {
      throw new Error("Format bukti harus JPG, PNG, WEBP, atau PDF.");
    }

    const bytes = decodeBase64(data?.dataBase64);
    if (bytes.length <= 0) throw new Error("File bukti kosong.");
    if (bytes.length > PROOF_MAX_BYTES) {
      throw new Error("Ukuran bukti maksimal 12 MB.");
    }

    const ext = isPdf ? "pdf" : extensionFor(contentType, fileName);
    const path = `proofs/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;

    const db = await adminClient();
    const { error } = await db.storage.from(PROOF_BUCKET).upload(path, bytes, {
      cacheControl: "3600",
      upsert: false,
      contentType: isPdf ? "application/pdf" : contentType,
    });
    if (error) fail(error);

    const { data: signed, error: signError } = await db.storage
      .from(PROOF_BUCKET)
      .createSignedUrl(path, ONE_YEAR);
    if (signError || !signed?.signedUrl) {
      fail(signError ?? new Error("Gagal membuat URL bukti."));
    }

    return { ok: true as const, path, url: signed.signedUrl as string };
  });

export const uploadCatalogThumbnailFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as { fileName: string; contentType: string; dataBase64: string },
  )
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./session.server");
    await requireAdmin();

    const fileName = String(data?.fileName ?? "thumbnail");
    const contentType = String(data?.contentType ?? "").toLowerCase();
    if (!IMAGE_TYPES.has(contentType)) {
      throw new Error("Gambar harus berupa JPG, PNG, WEBP, atau GIF.");
    }

    const bytes = decodeBase64(data?.dataBase64);
    if (bytes.length <= 0) throw new Error("Gambar kosong.");
    if (bytes.length > THUMBNAIL_MAX_BYTES) {
      throw new Error("Ukuran gambar maksimal 5 MB.");
    }

    const path = `catalogs/${crypto.randomUUID()}.${extensionFor(contentType, fileName)}`;
    const db = await adminClient();
    const { error } = await db.storage.from(THUMBNAIL_BUCKET).upload(path, bytes, {
      cacheControl: "3600",
      upsert: false,
      contentType,
    });
    if (error) fail(error);

    const { data: publicData } = db.storage.from(THUMBNAIL_BUCKET).getPublicUrl(path);
    return { ok: true as const, path, url: publicData.publicUrl as string };
  });
