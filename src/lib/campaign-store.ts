import { useCallback, useEffect, useId, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { notifyTaskApproved, notifyTaskRejected, notifyNewTaskAvailable } from "@/lib/buzzer-notification-store";
import { getBuzzerPercentageForLevel, currentLevels, percentageForLevel } from "@/lib/buzzer-level";
import { getCachedRows, isCacheFresh, loadCachedRows } from "@/lib/query-cache";

export type CampaignPlatform = "TikTok" | "Instagram" | "X (Twitter)" | "Facebook" | "YouTube" | "Telegram" | "LinkedIn" | "Threads";
export type CampaignStatus = "Draft" | "Aktif" | "Review" | "Selesai" | "Dibatalkan";
export type CampaignJobStatus = "Tersedia" | "Diambil" | "Review" | "Revisi" | "Selesai" | "Ditolak";

export type Campaign = {
  id: string;
  title: string;
  customer_email: string;
  customer_name: string;
  platform: CampaignPlatform;
  service_type?: string | null;
  thumbnail_url?: string | null;
  catalog_visible?: boolean;
  brief: string;
  budget: number;
  payout_per_buzzer: number;
  slots: number;
  start_date?: string;
  deadline: string;
  status: CampaignStatus;
  payment_id?: string | null;
  catalog_id?: string | null;
  package_id?: string | null;
  package_name?: string | null;
  package_price?: number | null;
  package_buzzer_count?: number | null;
  price_per_buzzer?: number | null;
  buzzer_count?: number | null;
  total_amount?: number | null;
  payment_status?: string | null;
  payment_rejection_reason?: string | null;
  /** Kelas buzzer yang dipilih customer (Biasa / Pro / Premium). */
  buzzer_tier?: "Biasa" | "Pro" | "Premium" | null;
  /** Customer mengizinkan job diturunkan satu kelas setelah 12 jam. */
  allow_tier_downgrade?: boolean | null;
  target_reached_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type ServicePricing = {
  id: string;
  platform: CampaignPlatform;
  service_type: string;
  price_per_buzzer: number;
  /** Kelas buzzer yang memakai harga ini. */
  buzzer_tier: "Biasa" | "Pro" | "Premium";
  status: "Aktif" | "Nonaktif";
  created_at: string;
  updated_at: string;
};

export type CatalogPackage = {
  id: string;
  catalog_id: string;
  name: string;
  price: number;
  buzzer_count: number;
  description: string;
  status: "Aktif" | "Nonaktif";
  created_at: string;
  updated_at: string;
};

export type ServiceCatalog = {
  id: string;
  title: string;
  platform: CampaignPlatform;
  service_type: string;
  price: number;
  slots: number;
  payout_per_buzzer?: number;
  thumbnail_url: string | null;
  description?: string;
  status: "Draft" | "Aktif" | "Nonaktif";
  created_at: string;
  updated_at: string;
};

export type CampaignJob = {
  id: string;
  campaign_id: string;
  campaign_title: string;
  platform: CampaignPlatform;
  /** Kelas minimal untuk mengambil job ini. */
  required_tier?: "Biasa" | "Pro" | "Premium" | null;
  /** Customer mengizinkan job diturunkan satu kelas setelah 12 jam. */
  allow_tier_downgrade?: boolean | null;
  buzzer_email: string | null;
  buzzer_name: string | null;
  gross_price: number;
  buzzer_level?: string | null;
  buzzer_percentage?: number | null;
  buzzer_amount?: number | null;
  admin_percentage?: number | null;
  admin_amount?: number | null;
  payout: number;
  deadline: string;
  brief: string;
  status: CampaignJobStatus;
  proof_url: string | null;
  note: string | null;
  rejection_reason?: string | null;
  rejected_at?: string | null;
  rejected_by?: string | null;
  resubmission_count?: number;
  submitted_at?: string | null;
  admin_verified_at?: string | null;
  customer_rated_at?: string | null;
  attendance_status?: string | null;
  attendance_confirmed_at?: string | null;
  checkin_at?: string | null;
  checkout_at?: string | null;
  activity_note?: string | null;
  location_name?: string | null;
  event_date?: string | null;
  event_time?: string | null;
  created_at: string;
  updated_at: string;
};

export type CampaignMessage = {
  id: string;
  campaign_id: string | null;
  from_role: "customer" | "buzzer" | "admin";
  from_name: string;
  from_email: string;
  to_email: string;
  body: string;
  read_at: string | null;
  created_at: string;
};

export type CampaignJobSubmission = {
  id: string;
  job_id: string;
  buzzer_email: string;
  proof_url: string;
  submission_number: number;
  status: CampaignJobStatus;
  rejection_reason: string | null;
  rejected_at: string | null;
  rejected_by: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
};

let catalogPackageChannelSequence = 0;

function useRealtime<T>(table: string, order: { column: string; ascending: boolean }) {
  // Several dashboard sections can read the same table at once. Supabase
  // forbids adding callbacks to an already subscribed channel with the same
  // topic, therefore each hook instance needs its own channel name.
  const channelId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const cacheKey = `${table}:${order.column}:${order.ascending}`;
  const [data, setData] = useState<T[]>(() => getCachedRows<T>(cacheKey) ?? []);
  const [loading, setLoading] = useState(() => !getCachedRows<T>(cacheKey));
  const [error, setError] = useState<string | null>(null);
  const fetchAll = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) setLoading(true);
    setError(null);
    try {
      const rows = await loadCachedRows<T>(cacheKey, async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const client = supabase as any;
        const { data: rows, error: queryError } = await client
          .from(table)
          .select("*")
          .order(order.column, { ascending: order.ascending })
          .limit(500);
        if (queryError) throw queryError;
        return (rows as T[]) ?? [];
      });
      setData(rows);
    } catch (queryError) {
      const message = queryError instanceof Error
        ? queryError.message
        : typeof queryError === "object" && queryError !== null && "message" in queryError && typeof queryError.message === "string"
          ? queryError.message
          : String(queryError);
      console.error(`[Supabase] Failed to load ${table}:`, queryError);
      if (!getCachedRows<T>(cacheKey)) setData([]);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [table, order.column, order.ascending, cacheKey]);
  useEffect(() => {
    const hasCache = Boolean(getCachedRows<T>(cacheKey));
    if (!hasCache) {
      void fetchAll();
    } else if (!isCacheFresh(cacheKey)) {
      void fetchAll({ silent: true });
    }
    const ch = supabase
      .channel(`rt-${table}-${channelId}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, () => {
        void fetchAll({ silent: true });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [table, fetchAll, channelId, cacheKey]);
  const refetch = useCallback(() => fetchAll(), [fetchAll]);
  return { data, loading, error, refetch };
}

export const useCampaigns = () => useRealtime<Campaign>("campaigns", { column: "created_at", ascending: false });
export const useServiceCatalogs = () => useRealtime<ServiceCatalog>("service_catalogs", { column: "created_at", ascending: false });
export const useServicePricings = () => useRealtime<ServicePricing>("service_pricing", { column: "platform", ascending: true });

export async function createServicePricing(input: Omit<ServicePricing, "id" | "created_at" | "updated_at">) {
  const { adminSavePricingFn } = await import("./admin.functions");
  await adminSavePricingFn({
    data: {
      platform: input.platform,
      serviceType: input.service_type,
      buzzerTier: (input as { buzzer_tier?: string }).buzzer_tier ?? "Biasa",
      pricePerBuzzer: Number(input.price_per_buzzer),
      status: input.status ?? "Aktif",
    },
  });
}

export async function updateServicePricing(id: string, input: Partial<ServicePricing>) {
  const { adminSavePricingFn } = await import("./admin.functions");
  await adminSavePricingFn({
    data: {
      id,
      platform: input.platform ?? "",
      serviceType: input.service_type ?? "",
      buzzerTier: (input as { buzzer_tier?: string }).buzzer_tier ?? "Biasa",
      pricePerBuzzer: Number(input.price_per_buzzer ?? 0),
      status: input.status ?? "Aktif",
    },
  });
}

export async function deleteServicePricing(id: string) {
  const { adminDeletePricingFn } = await import("./admin.functions");
  await adminDeletePricingFn({ data: { id } });
}
export const useCatalogPackages = (catalogId?: string | null) => {
  const channelId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const channelInstanceId = useState(() => ++catalogPackageChannelSequence)[0];
  const [data, setData] = useState<CatalogPackage[]>([]);
  const [loading, setLoading] = useState(Boolean(catalogId));
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!catalogId) {
      setData([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data: rows, error: queryError } = await (supabase as any)
        .from("catalog_packages")
        .select("*")
        .eq("catalog_id", catalogId)
        .order("created_at", { ascending: false });
      if (queryError) throw queryError;
      setData((rows as CatalogPackage[]) ?? []);
    } catch (queryError) {
      const message = queryError instanceof Error ? queryError.message : String(queryError);
      console.error("[Supabase] Failed to load catalog packages:", queryError);
      setData([]);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [catalogId]);

  useEffect(() => {
    void fetchAll();
    if (!catalogId) return;

    // Keep the database query independent from Realtime. Realtime is an
    // enhancement and must not replace catalog data when its connection fails.
    const channel = supabase
      .channel(`rt-catalog-packages-${catalogId}-${channelId}-${channelInstanceId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "catalog_packages", filter: `catalog_id=eq.${catalogId}` }, () => {
        void fetchAll();
      })
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.warn(`[Supabase] Catalog package realtime unavailable for ${catalogId}:`, status);
        }
      });
    return () => { void supabase.removeChannel(channel); };
  }, [catalogId, fetchAll, channelId, channelInstanceId]);

  return { data, loading, error, refetch: fetchAll };
};
export const useCampaignJobs = () => useRealtime<CampaignJob>("campaign_jobs", { column: "created_at", ascending: false });
export const useCampaignMessages = () => useRealtime<CampaignMessage>("campaign_messages", { column: "created_at", ascending: false });
export const useCampaignJobSubmissions = () => useRealtime<CampaignJobSubmission>("campaign_job_submissions", { column: "created_at", ascending: false });

export function useCompletedCampaignJobs() {
  const channelId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const cacheKey = "campaign_jobs:completed:updated_at:desc";
  const [data, setData] = useState<CampaignJob[]>(() => getCachedRows<CampaignJob>(cacheKey) ?? []);
  const [loading, setLoading] = useState(() => !getCachedRows<CampaignJob>(cacheKey));
  const [error, setError] = useState<string | null>(null);

  const fetchCompleted = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) setLoading(true);
    setError(null);
    try {
      const rows = await loadCachedRows<CampaignJob>(cacheKey, async () => {
        const { data: rows, error: queryError } = await (supabase as any)
          .from("campaign_jobs")
          .select("*")
          .or("status.eq.Selesai,admin_verified_at.not.is.null")
          .order("updated_at", { ascending: false });
        if (queryError) throw queryError;
        return (rows as CampaignJob[]) ?? [];
      });
      setData(rows);
    } catch (err: any) {
      console.error("[Supabase] Failed to load completed campaign_jobs:", err);
      if (!getCachedRows<CampaignJob>(cacheKey)) setData([]);
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }, [cacheKey]);

  useEffect(() => {
    const hasCache = Boolean(getCachedRows<CampaignJob>(cacheKey));
    if (!hasCache) {
      void fetchCompleted();
    } else if (!isCacheFresh(cacheKey)) {
      void fetchCompleted({ silent: true });
    }
    const ch = supabase
      .channel(`rt-completed-jobs-${channelId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "campaign_jobs" }, () => {
        void fetchCompleted({ silent: true });
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(ch);
    };
  }, [fetchCompleted, channelId, cacheKey]);

  const refetch = useCallback(() => fetchCompleted(), [fetchCompleted]);
  return { data, loading, error, refetch };
}

export function useBuzzerCampaignJobs(buzzerEmail: string) {
  const channelId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [data, setData] = useState<CampaignJob[]>([]);
  const [loading, setLoading] = useState(true);
  const email = buzzerEmail.trim().toLowerCase();
  const fetchAvailable = useCallback(async () => {
    if (!email) {
      setData([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      // 1. Always directly fetch all jobs assigned to this buzzer (Selesai, Review, Diambil, Revisi, Ditolak)
      // This guarantees that a buzzer's job history is never lost or blocked by RPC errors/deadlines.
      const { data: myAssignedJobs, error: myError } = await supabase
        .from("campaign_jobs")
        .select("*")
        .ilike("buzzer_email", email)
        .order("updated_at", { ascending: false });

      if (myError) {
        console.warn("[Supabase] Failed to load assigned buzzer jobs:", myError);
      }

      // 2. Load ALL available open jobs across all platforms (Instagram, TikTok, YouTube, X, Facebook, Telegram, dll)
      const { data: openRows, error: openError } = await supabase
        .from("campaign_jobs")
        .select("*")
        .eq("status", "Tersedia")
        .is("buzzer_email", null)
        .order("created_at", { ascending: false })
        .limit(2000);

      if (openError) {
        console.warn("[Supabase] Failed to load open campaign jobs:", openError);
      }

      // 3. Merge without duplicates (assigned jobs take priority)
      const jobMap = new Map<string, CampaignJob>();
      for (const j of (openRows as CampaignJob[]) ?? []) {
        jobMap.set(j.id, j);
      }
      for (const j of (myAssignedJobs as CampaignJob[]) ?? []) {
        jobMap.set(j.id, j);
      }

      setData(Array.from(jobMap.values()));
    } catch (err) {
      console.error("[Supabase] Exception in useBuzzerCampaignJobs:", err);
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    if (!email) return;
    void fetchAvailable();
    const channelName = `rt-buzzer-campaign-jobs-${email.replace(/[^a-zA-Z0-9_-]/g, "_")}-${channelId}-${Math.random().toString(36).slice(2, 7)}`;
    const channel = supabase
      .channel(channelName)
      .on("postgres_changes", { event: "*", schema: "public", table: "campaign_jobs" }, () => { void fetchAvailable(); })
      .on("postgres_changes", { event: "*", schema: "public", table: "campaigns" }, () => { void fetchAvailable(); })
      .on("postgres_changes", { event: "*", schema: "public", table: "social_accounts" }, () => { void fetchAvailable(); })
      // Admin approval changes the application first. Listening to it makes
      // pre-existing eligible jobs appear immediately, even if the social
      // account synchronization event arrives a moment later.
      .on("postgres_changes", { event: "*", schema: "public", table: "buzzer_applications", filter: `email=eq.${email}` }, () => { void fetchAvailable(); })
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.warn(`[Supabase] Realtime unavailable for ${email}:`, status);
        }
      });
    return () => { void supabase.removeChannel(channel); };
  }, [email, fetchAvailable, channelId]);

  return { data, loading, refetch: fetchAvailable };
}

export async function takeCampaignJob(id: string, buzzerEmail: string, buzzerName: string) {
  const email = buzzerEmail.trim().toLowerCase();
  const { data: job, error: jobError } = await supabase.from("campaign_jobs").select("platform").eq("id", id).maybeSingle();
  if (jobError) throw jobError;
  if (!job) throw new Error("Job sudah tidak tersedia.");

  const { data: matchingAccount, error: accountError } = await supabase
    .from("social_accounts")
    .select("id")
    .eq("buzzer_email", email)
    .ilike("platform", job.platform)
    .ilike("verification", "Terverifikasi")
    .limit(1)
    .maybeSingle();
  if (accountError) throw accountError;
  if (!matchingAccount) {
    const { data: acc } = await (supabase as any).from("app_accounts_public")
      .select("platform")
      .eq("email", email)
      .ilike("platform", job.platform)
      .maybeSingle();
    if (!acc) {
      throw new Error("Akun media sosial belum ada, ayo daftar");
    }
  }

  // The database function locks the campaign and enforces payment, target, and duplicate rules atomically.
  const { error } = await (supabase as any).rpc("claim_campaign_job", {
    p_job_id: id,
    p_buzzer_email: email,
    p_buzzer_name: buzzerName,
  });
  if (error) throw new Error(error.message || "Job sudah tidak tersedia.");
}
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * UUID deterministik supaya job lokal yang belum ada di Supabase tidak
 * menghasilkan baris ganda setiap kali bukti dikirim ulang.
 */
function stableUuid(input: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  let h3 = 0x9e3779b9;
  let h4 = 0x85ebca6b;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193);
    h2 = Math.imul(h2 ^ c, 0x85ebca6b);
    h3 = Math.imul(h3 ^ c, 0xc2b2ae35);
    h4 = Math.imul(h4 ^ c, 0x27d4eb2f);
  }
  const hex = (n: number) => (n >>> 0).toString(16).padStart(8, "0");
  const chars = (hex(h1) + hex(h2) + hex(h3) + hex(h4)).split("");
  chars[12] = "5";
  chars[16] = ((parseInt(chars[16], 16) & 0x3) | 0x8).toString(16);
  const value = chars.join("");
  return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`;
}

function campaignIdForLocalJob(jobId: string): string {
  // Demo jobs use a paired campaign UUID: bbbbbbbb-... -> aaaaaaaa-...
  if (/^bbbbbbbb-0000-4000-8000-[0-9a-f]{12}$/i.test(jobId)) {
    return `aaaaaaaa${jobId.slice(8)}`;
  }
  return stableUuid(`buzzhub:campaign:${jobId}`);
}

export type SyncableBuzzerJob = {
  id: string;
  title: string;
  platform: CampaignPlatform;
  brief: string;
  deadline: string;
  payout: number;
  status: CampaignJobStatus | "Upload";
  proofUrl?: string;
  note?: string;
  rejection_reason?: string;
  rejected_at?: string;
  admin_verified_at?: string | null;
  customer_rated_at?: string | null;
  updatedAt?: string;
};

/**
 * Job demo/lokal tidak lagi bisa "dipromosikan" menjadi campaign di database.
 *
 * Sebelum Fase 1 fungsi ini membuat baris `campaigns` dengan
 * payment_status = 'Pembayaran Disetujui' lalu langsung menyisipkan
 * `campaign_jobs`. Itu jalan pintas yang melewati verifikasi pembayaran admin,
 * sehingga dihapus pada Fase 1. Job demo harus dibuat ulang lewat alur
 * campaign normal (customer checkout -> admin verifikasi pembayaran).
 */
export async function ensureCampaignJobInSupabase(
  job: SyncableBuzzerJob,
  buzzerEmail: string,
  _buzzerName?: string,
): Promise<string> {
  const email = buzzerEmail.trim().toLowerCase();
  if (!email) throw new Error("Email buzzer tidak ditemukan.");

  const localId = job.id.replace(/^db:/, "");
  const jobId = UUID_PATTERN.test(localId) ? localId : stableUuid(`buzzhub:job:${localId}`);

  const { data: existing, error } = await supabase
    .from("campaign_jobs")
    .select("id, buzzer_email")
    .eq("id", jobId)
    .maybeSingle();
  if (error) throw error;

  if (!existing?.id) {
    throw new Error(
      "Job ini masih berupa data demo di browser dan belum ada di database. " +
        "Minta admin membuat campaign agar bukti bisa diverifikasi.",
    );
  }
  if (existing.buzzer_email && existing.buzzer_email.toLowerCase() !== email) {
    throw new Error("Job ini sudah terhubung ke akun buzzer lain.");
  }
  return existing.id;
}

export async function submitCampaignJobProof(id: string, url: string, buzzerEmail = "") {
  const email = buzzerEmail.trim().toLowerCase();
  const { data: job, error: jobLookupError } = await supabase
    .from("campaign_jobs")
    .select("id, buzzer_email, status")
    .eq("id", id)
    .maybeSingle();
  if (jobLookupError) throw jobLookupError;
  if (!job) throw new Error("Job tidak ditemukan di database Supabase.");
  if (!job.buzzer_email) throw new Error("Job ini belum diambil oleh buzzer.");
  if (job.buzzer_email.toLowerCase() !== email) {
    throw new Error("Job ini bukan milik akun buzzer yang sedang masuk.");
  }
  if (!["Diambil", "Revisi", "Upload", "Ditolak"].includes(job.status)) {
    throw new Error(`Job berstatus ${job.status} tidak dapat menerima bukti baru.`);
  }

  // Fase 1: submit_job_proof hanya dipanggil server (sesi buzzer diverifikasi).
  const { submitJobProofFn } = await import("./buzzer.functions");
  try {
    await submitJobProofFn({ data: { jobId: id, proofUrl: url } });
  } catch (error) {
    console.error("[Proof Upload] submit_job_proof error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Bukti gagal disimpan ke job.",
    );
  }
}

/**
 * Verifikasi pengerjaan. Sejak Fase 1 seluruh mutasi dijalankan di server;
 * trigger `credit_buzzer_after_job_approval` yang mengkredit saldo, jadi
 * tidak ada lagi fallback kredit manual di client.
 */
export async function reviewCampaignJob(id: string, status: CampaignJobStatus, note?: string) {
  if (status !== "Review" && status !== "Selesai") {
    throw new Error("Status verifikasi harus 'Review' atau 'Selesai'.");
  }

  const { adminReviewJobFn } = await import("./admin.functions");
  await adminReviewJobFn({ data: { jobId: id, status, note } });

  try {
    const { data: job } = await supabase
      .from("campaign_jobs")
      .select("buzzer_email, campaign_title, buzzer_amount, payout")
      .eq("id", id)
      .maybeSingle();
    if (job?.buzzer_email) {
      void notifyTaskApproved({
        buzzerEmail: job.buzzer_email,
        campaignTitle: job.campaign_title || "Kampanye",
        fee: Number(job.buzzer_amount || job.payout || 0),
        jobId: id,
      });
    }
  } catch (error) {
    console.warn("Gagal mengirim notifikasi persetujuan tugas:", error);
  }
}


export async function rejectCampaignJob(id: string, reason: string, rejectedBy = "admin") {
  const cleanReason = reason.trim();
  if (!cleanReason) throw new Error("Alasan penolakan wajib diisi.");

  const { adminRejectJobProofFn } = await import("./admin.functions");
  await adminRejectJobProofFn({
    data: { jobId: id, reason: cleanReason, rejectedBy },
  });

  // Notifikasi penolakan / permintaan revisi ke akun buzzer
  try {
    const { data: job } = await supabase
      .from("campaign_jobs")
      .select("buzzer_email, campaign_title")
      .eq("id", id)
      .maybeSingle();
    if (job?.buzzer_email) {
      void notifyTaskRejected({
        buzzerEmail: job.buzzer_email,
        campaignTitle: job.campaign_title || "Kampanye",
        reason: cleanReason,
        jobId: id,
      });
    }
  } catch (e) {
    console.warn("Gagal mengirim notifikasi penolakan tugas:", e);
  }
}

export async function updateCampaignJob(id: string, updates: Partial<CampaignJob>) {
  const { adminUpdateJobFn } = await import("./admin.functions");
  await adminUpdateJobFn({
    data: {
      jobId: id,
      status: updates.status,
      note: updates.note ?? null,
      rejection_reason: updates.rejection_reason ?? null,
      admin_verified_at: updates.admin_verified_at ?? null,
    },
  });
}

export async function deleteCampaignJob(id: string) {
  const { adminDeleteJobFn } = await import("./admin.functions");
  await adminDeleteJobFn({ data: { jobId: id } });
}

export function calculatePayoutSplit(total: number, buzzerAmount = 0) {
  const safeTotal = Number(total || 0);
  const buzzerShare = Math.min(Math.max(0, safeTotal), Math.max(0, Number(buzzerAmount || 0)));
  const buzzerPercent = safeTotal > 0 ? Math.round((buzzerShare / safeTotal) * 10000) / 100 : 0;
  const adminPercent = Math.max(0, 100 - buzzerPercent);
  const adminShare = Math.max(0, safeTotal - buzzerShare);

  return {
    total: safeTotal,
    buzzerPercent,
    adminPercent,
    buzzerShare,
    adminShare,
  };
}

/** Membagi total campaign ke slot dalam rupiah bulat tanpa mengubah totalnya. */
export function allocateJobPrices(total: number, slots: number) {
  const safeTotal = Math.max(0, Math.round(Number(total || 0)));
  const safeSlots = Math.max(1, Math.floor(Number(slots || 1)));
  const base = Math.floor(safeTotal / safeSlots);
  const remainder = safeTotal - base * safeSlots;
  return Array.from({ length: safeSlots }, (_, index) => base + (index < remainder ? 1 : 0));
}

export async function createCampaign(input: Omit<Campaign, "id" | "created_at" | "updated_at" | "status"> & { status?: CampaignStatus }) {
  const { adminCreateCampaignFn } = await import("./admin.functions");
  const row = input as unknown as {
    title: string;
    platform: string;
    service_type?: string;
    price_per_buzzer?: number;
    slots: number;
    deadline: string;
    brief?: string;
    thumbnail_url?: string;
    customer_email?: string;
    customer_name?: string;
  };
  await adminCreateCampaignFn({
    data: {
      title: row.title,
      platform: row.platform,
      serviceType: row.service_type ?? "",
      pricePerSlot: Number(row.price_per_buzzer ?? 0),
      slots: Number(row.slots ?? 0),
      deadline: row.deadline,
      brief: row.brief ?? "",
      thumbnailUrl: row.thumbnail_url ?? "",
      customerEmail: row.customer_email ?? "",
      customerName: row.customer_name ?? "",
    },
  });
}

/** Menghitung split pendapatan buzzer dan komisi admin berdasarkan persentase level (Bronze 40%, Silver 45%, Gold 50%, Platinum 55%, Diamond 60%). */
export function calculateCampaignJobSplit(
  job: (
    Pick<
      CampaignJob,
      "gross_price" | "payout" | "buzzer_level" | "buzzer_percentage" | "buzzer_amount" | "admin_percentage" | "admin_amount"
    > & { platform?: string; grossPrice?: number; buzzerAmount?: number; adminAmount?: number; buzzerLevel?: string }
  ) | any,
) {
  const total = Math.max(
    0,
    Number(job?.grossPrice ?? job?.gross_price ?? job?.gross_amount ?? job?.budget) || 0
  );

  const level = job?.buzzer_level ?? job?.buzzerLevel;
  const levels = currentLevels();
  const targetPct = percentageForLevel(level, levels);
  const snapshot = Number(job?.buzzer_amount ?? job?.payout ?? 0);
  const hasSnapshot = Number.isFinite(snapshot) && snapshot > 0;
  // Bagian buzzer = persentase level × harga job (maksimal sebesar harga job).
  const buzzerShare = Math.min(
    Math.max(0, hasSnapshot ? snapshot : Math.round((total * targetPct) / 100)),
    total,
  );
  const adminShare = Math.max(0, total - buzzerShare);

  const buzzerPercent = total > 0 ? Math.round((buzzerShare / total) * 10000) / 100 : targetPct;
  const adminPercent = Math.max(0, 100 - buzzerPercent);
  return {
    total,
    buzzerPercent,
    adminPercent,
    buzzerShare,
    adminShare,
    levelName: level ?? "Bronze",
  };
}
/** Admin creates a product listing only; this never creates a campaign, job, or payment. */
export async function createServiceCatalog(input: Omit<ServiceCatalog, "id" | "created_at" | "updated_at" | "status"> & { status?: ServiceCatalog["status"] }) {
  const { adminSaveCatalogFn } = await import("./admin.functions");
  await adminSaveCatalogFn({
    data: { values: { ...input, status: input.status ?? "Aktif" } },
  });
}

export async function updateServiceCatalogStatus(id: string, status: ServiceCatalog["status"]) {
  const { adminSaveCatalogFn } = await import("./admin.functions");
  await adminSaveCatalogFn({ data: { id, values: { status } } });
}

export async function updateServiceCatalog(id: string, input: Partial<Omit<ServiceCatalog, "id" | "created_at" | "updated_at">>) {
  const { adminSaveCatalogFn } = await import("./admin.functions");
  await adminSaveCatalogFn({ data: { id, values: input } });
}

export async function deleteServiceCatalog(id: string) {
  const { adminDeleteCatalogFn } = await import("./admin.functions");
  await adminDeleteCatalogFn({ data: { id } });
}

export async function createCatalogPackage(input: Omit<CatalogPackage, "id" | "created_at" | "updated_at"> & { status?: CatalogPackage["status"] }) {
  const { adminSaveCatalogPackageFn } = await import("./admin.functions");
  await adminSaveCatalogPackageFn({
    data: { values: { ...input, status: input.status ?? "Aktif" } },
  });
}

export async function updateCatalogPackage(id: string, input: Partial<Omit<CatalogPackage, "id" | "created_at" | "updated_at" | "catalog_id">>) {
  const { adminSaveCatalogPackageFn } = await import("./admin.functions");
  await adminSaveCatalogPackageFn({ data: { id, values: input } });
}

export async function updateCatalogPackageStatus(id: string, status: CatalogPackage["status"]) {
  const { adminSaveCatalogPackageFn } = await import("./admin.functions");
  await adminSaveCatalogPackageFn({ data: { id, values: { status } } });
}

export async function deleteCatalogPackage(id: string) {
  const { adminDeleteCatalogPackageFn } = await import("./admin.functions");
  await adminDeleteCatalogPackageFn({ data: { id } });
}

export async function sendCampaignMessage(msg: Omit<CampaignMessage, "id" | "created_at" | "read_at">) {
  // Fase 2b: pengirim ditentukan server dari sesi.
  const { sendCampaignMessageFn } = await import("./messages.functions");
  await sendCampaignMessageFn({
    data: {
      campaignId: msg.campaign_id,
      toEmail: msg.to_email,
      body: msg.body,
    },
  });
}

/** Customer submits an order -> campaign menunggu approval admin sebelum job dibuka. */
export async function submitCampaignRequest(input: {
  title: string;
  customer_email: string;
  customer_name: string;
  platform: string;
  brief: string;
  budget: number;
  payout_per_buzzer: number;
  slots: number;
  start_date: string;
  deadline: string;
  payment_id: string;
}) {
  void input;
  throw new Error(
    "Pembuatan campaign manual sudah dihapus. Gunakan RPC checkout customer " +
      "(create_customer_custom_scheduled_payment_campaign / create_customer_catalog_*).",
  );
}

export async function createCustomerPaymentCampaign(input: {
  invoice_no: string;
  customer_name: string;
  customer_email: string;
  campaign_name: string;
  campaign_type: string;
  service_type?: string;
  method: string;
  note: string | null;
  amount: number;
  buzzer_cost: number;
  fee: number;
  brief: string;
  budget: number;
  payout_per_buzzer: number;
  slots: number;
  start_date: string;
  deadline: string;
  catalog_id?: string;
  package_id?: string;
  package_name?: string;
  package_price?: number;
  package_buzzer_count?: number;
  thumbnail_url?: string;
  /** Kelas buzzer pilihan customer untuk pesanan sendiri. */
  buzzer_tier?: "Biasa" | "Pro" | "Premium";
  /** Customer mengizinkan job diturunkan satu kelas setelah 12 jam. */
  allow_tier_downgrade?: boolean;
}) {
  const formatDatabaseError = (value: unknown) => {
    if (value instanceof Error) return value.message;
    if (typeof value === "object" && value !== null) {
      const candidate = value as { message?: unknown; code?: unknown; details?: unknown; hint?: unknown };
      return [candidate.message, candidate.code ? `code ${candidate.code}` : null, candidate.details, candidate.hint]
        .filter((part): part is string => typeof part === "string" && part.length > 0)
        .join(" | ") || JSON.stringify(value);
    }
    return String(value);
  };


  if (input.catalog_id) {
    if (input.package_id) {
      const { data, error } = await (supabase as any).rpc("create_customer_catalog_package_scheduled_payment_campaign", {
        p_catalog_id: input.catalog_id,
        p_package_id: input.package_id,
        p_invoice_no: input.invoice_no, p_customer_name: input.customer_name, p_customer_email: input.customer_email,
        p_campaign_name: input.campaign_name, p_method: input.method, p_note: input.note,
        p_brief: input.brief, p_start_date: input.start_date, p_deadline: input.deadline,
        p_package_name: input.package_name ?? null,
        p_package_price: input.package_price ?? input.amount,
        p_package_buzzer_count: input.package_buzzer_count ?? input.slots,
      });
      if (error) throw new Error(formatDatabaseError(error));
      const row = Array.isArray(data) ? data[0] : data;
      if (!row?.payment_id || !row?.campaign_id) throw new Error("Database tidak mengembalikan ID pembayaran dan campaign.");
      return { paymentId: row.payment_id as string, campaignId: row.campaign_id as string };
    }
    const { data, error } = await (supabase as any).rpc("create_customer_catalog_scheduled_payment_campaign", {
      p_catalog_id: input.catalog_id,
      p_invoice_no: input.invoice_no, p_customer_name: input.customer_name, p_customer_email: input.customer_email,
      p_campaign_name: input.campaign_name, p_method: input.method, p_note: input.note,
      p_brief: input.brief, p_start_date: input.start_date, p_deadline: input.deadline,
      p_slots: input.slots,
    });
    if (error) throw new Error(formatDatabaseError(error));
    const row = Array.isArray(data) ? data[0] : data;
    if (!row?.payment_id || !row?.campaign_id) throw new Error("Database tidak mengembalikan ID pembayaran dan campaign.");
    return { paymentId: row.payment_id as string, campaignId: row.campaign_id as string };
  }
  const { data: customData, error: customError } = await (supabase as any).rpc("create_customer_custom_scheduled_payment_campaign", {
    p_invoice_no: input.invoice_no,
    p_customer_name: input.customer_name,
    p_customer_email: input.customer_email,
    p_campaign_name: input.campaign_name,
    p_platform: input.campaign_type,
    p_service_type: input.service_type ?? "",
    p_method: input.method,
    p_note: input.note,
    p_brief: input.brief,
    p_slots: input.slots,
    p_start_date: input.start_date,
    p_deadline: input.deadline,
    p_buzzer_tier: input.buzzer_tier ?? "Biasa",
    p_allow_tier_downgrade: input.allow_tier_downgrade ?? false,
  });
  if (customError) throw new Error(formatDatabaseError(customError));
  const customRow = Array.isArray(customData) ? customData[0] : customData;
  if (!customRow?.payment_id || !customRow?.campaign_id) throw new Error("Database tidak mengembalikan ID pembayaran dan campaign.");
  return { paymentId: customRow.payment_id as string, campaignId: customRow.campaign_id as string };
}

/** Admin menyetujui kampanye: status jadi Aktif + job dibuka untuk buzzer sesuai jumlah slot. */
export async function approveCampaign(c: Campaign) {
  const paymentId = c.payment_id;
  if (!paymentId) throw new Error("Campaign belum memiliki pembayaran untuk diverifikasi.");
  // Fase 1: approve_campaign_payment hanya bisa dipanggil service_role.
  const { adminApprovePaymentFn } = await import("./admin.functions");
  await adminApprovePaymentFn({ data: { paymentId } });
}

/** Admin menolak kampanye. */
export async function rejectCampaign(id: string, note?: string) {
  const { adminRejectCampaignFn } = await import("./admin.functions");
  await adminRejectCampaignFn({ data: { campaignId: id, note } });
}

/** Admin menandai kampanye selesai. */
export async function completeCampaign(id: string) {
  const { adminCompleteCampaignFn } = await import("./admin.functions");
  await adminCompleteCampaignFn({ data: { campaignId: id } });
}

/**
 * Admin memperbarui detail kampanye (judul, brief, deadline).
 * Snapshot pada campaign_jobs ikut disinkronkan di server.
 */
export async function updateCampaignDetails(
  id: string,
  patch: { title: string; brief: string; deadline: string },
) {
  const { adminUpdateCampaignFn } = await import("./admin.functions");
  await adminUpdateCampaignFn({
    data: { campaignId: id, title: patch.title, brief: patch.brief, deadline: patch.deadline },
  });
}

/** Admin menghapus kampanye secara permanen beserta data relasinya. */
export async function deleteCampaign(id: string) {
  const { adminDeleteCampaignFn } = await import("./admin.functions");
  await adminDeleteCampaignFn({ data: { campaignId: id } });
}

