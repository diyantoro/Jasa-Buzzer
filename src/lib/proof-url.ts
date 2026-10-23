import { supabase } from "@/integrations/supabase/client";

const BUCKET = "bukti-pengerjaan";
const SIGNED_PATH_MARKER = `/storage/v1/object/sign/${BUCKET}/`;
const PUBLIC_PATH_MARKER = `/storage/v1/object/public/${BUCKET}/`;

export interface ParsedProof {
  screenshotUrl: string | null;
  postUrl: string | null;
  rawText?: string | null;
}

/** Parse compound proof string (e.g. "<screenshot_url> | <post_link>") into separate parts */
export function parseProofValue(value?: string | null): ParsedProof {
  if (!value || typeof value !== "string" || !value.trim()) {
    return { screenshotUrl: null, postUrl: null };
  }
  const trimmed = value.trim();
  const parts = trimmed.split(" | ").map((p) => p.trim()).filter(Boolean);

  let screenshotUrl: string | null = null;
  let postUrl: string | null = null;

  for (const part of parts) {
    const isStorage =
      part.includes(SIGNED_PATH_MARKER) ||
      part.includes(PUBLIC_PATH_MARKER) ||
      part.includes("/storage/v1/object/sign/") ||
      part.includes("/storage/v1/object/public/") ||
      part.startsWith("proofs/") ||
      part.includes(`/${BUCKET}/`);

    if (isStorage) {
      if (!screenshotUrl) screenshotUrl = part;
    } else if (/^https?:\/\//i.test(part)) {
      if (!postUrl) postUrl = part;
    } else if (/\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(part)) {
      if (!screenshotUrl) screenshotUrl = part;
    } else if (!postUrl && !screenshotUrl) {
      if (part.startsWith("proofs/")) {
        screenshotUrl = part;
      } else {
        postUrl = part.startsWith("www.") ? `https://${part}` : part;
      }
    }
  }

  // Fallback if parts didn't match specific patterns
  if (!screenshotUrl && !postUrl && parts.length > 0) {
    if (parts[0].startsWith("proofs/") || /\.(png|jpe?g|webp)(\?.*)?$/i.test(parts[0])) {
      screenshotUrl = parts[0];
      if (parts[1]) postUrl = parts[1];
    } else {
      postUrl = parts[0];
    }
  }

  return {
    screenshotUrl,
    postUrl,
    rawText: parts.length > 1 ? parts.slice(1).join(" | ") : null,
  };
}

/** Convert a stored storage path or old signed URL into a fresh signed URL. */
export async function resolveProofUrl(value: string): Promise<string> {
  const parsed = parseProofValue(value);
  const target = parsed.screenshotUrl || parsed.postUrl || (value || "").trim();
  if (!target) throw new Error("URL bukti kosong.");

  let path = target;
  const signedIndex = target.indexOf(SIGNED_PATH_MARKER);
  const publicIndex = target.indexOf(PUBLIC_PATH_MARKER);
  if (signedIndex >= 0) {
    path = target.slice(signedIndex + SIGNED_PATH_MARKER.length).split("?")[0];
  } else if (publicIndex >= 0) {
    path = target.slice(publicIndex + PUBLIC_PATH_MARKER.length).split("?")[0];
  } else if (target.includes(`/${BUCKET}/`)) {
    const idx = target.indexOf(`/${BUCKET}/`);
    path = target.slice(idx + `/${BUCKET}/`.length).split("?")[0];
  }

  if (/^https?:\/\//i.test(path)) {
    return target;
  }

  const cleanPath = decodeURIComponent(path.replace(/^\/+/, "").split("?")[0]);
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(cleanPath, 60 * 60);
  if (error || !data?.signedUrl) {
    console.error("[resolveProofUrl] Error creating signed url:", error);
    if (/^https?:\/\//i.test(target)) return target;
    throw error ?? new Error("Gagal membuat URL bukti baru.");
  }
  return data.signedUrl;
}

/** Resolve both screenshot and post link from a stored proof string */
export async function resolveProofItems(value?: string | null): Promise<{ screenshotUrl: string | null; postUrl: string | null }> {
  if (!value) return { screenshotUrl: null, postUrl: null };
  const parsed = parseProofValue(value);
  let resolvedScreenshot: string | null = null;
  if (parsed.screenshotUrl) {
    try {
      resolvedScreenshot = await resolveProofUrl(parsed.screenshotUrl);
    } catch (e) {
      console.warn("[resolveProofItems] Failed to resolve screenshot URL:", e);
      // Fallback: extract base URL before pipe
      resolvedScreenshot = parsed.screenshotUrl.split(" | ")[0].trim();
    }
  }

  let validPostUrl = parsed.postUrl;
  if (validPostUrl && !validPostUrl.startsWith("http://") && !validPostUrl.startsWith("https://")) {
    validPostUrl = `https://${validPostUrl}`;
  }

  return {
    screenshotUrl: resolvedScreenshot,
    postUrl: validPostUrl,
  };
}
