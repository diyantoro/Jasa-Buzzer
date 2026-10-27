import { useCallback, useEffect, useId, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { notifyTaskApproved, notifyTaskRejected, notifyNewTaskAvailable } from "@/lib/buzzer-notification-store";
import { getBuzzerPercentageForLevel } from "@/lib/buzzer-level";
import { getCachedRows, isCacheFresh, loadCachedRows } from "@/lib/query-cache";

export type CampaignPlatform = "TikTok" | "Instagram" | "X (Twitter)" | "Facebook" | "YouTube" | "Telegram" | "LinkedIn";
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
  target_reached_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type ServicePricing = {
  id: string;
  platform: CampaignPlatform;
  service_type: string;
  price_per_buzzer: number;
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
  const { error } = await (supabase as any).from("service_pricing").insert(input);
  if (error) throw error;
}

export async function updateServicePricing(id: string, input: Partial<ServicePricing>) {
  const { error } = await (supabase as any).from("service_pricing").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteServicePricing(id: string) {
  const { error } = await (supabase as any).from("service_pricing").delete().eq("id", id);
  if (error) throw error;
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
    const { data: acc } = await supabase
      .from("app_accounts")
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
 * Menyambungkan job demo/lokal ke Supabase sebelum bukti dikirim.
 *
 * Job demo tetap bisa tampil dari localStorage ketika database kosong, tetapi
 * saat buzzer mengirim bukti baris campaign + job dibuat di Supabase dengan ID
 * deterministik. Dengan begitu bukti, status, dan riwayat tidak tertinggal di
 * browser saja dan admin/customer bisa melihatnya.
 */
export async function ensureCampaignJobInSupabase(
  job: SyncableBuzzerJob,
  buzzerEmail: string,
  buzzerName: string,
): Promise<string> {
  const email = buzzerEmail.trim().toLowerCase();
  if (!email) throw new Error("Email buzzer tidak ditemukan.");

  const localId = job.id.replace(/^db:/, "");
  const jobId = UUID_PATTERN.test(localId) ? localId : stableUuid(`buzzhub:job:${localId}`);
  const campaignId = campaignIdForLocalJob(jobId);

  const { data: existing, error: existingError } = await supabase
    .from("campaign_jobs")
    .select("id, buzzer_email")
    .eq("id", jobId)
    .maybeSingle();
  if (existingError) throw existingError;
  if (existing?.id) {
    if (existing.buzzer_email && existing.buzzer_email.toLowerCase() !== email) {
      throw new Error("Job ini sudah terhubung ke akun buzzer lain.");
    }
    return existing.id;
  }

  const payout = Math.max(0, Number(job.payout) || 0);
  // Database caps the buzzer share at 40% of gross_price. Use a 2.5x gross
  // snapshot so the demo payout shown in the UI stays exactly the same.
  const grossPrice = Math.max(payout, Math.round(payout * 2.5));
  const adminAmount = Math.max(0, grossPrice - payout);
  const buzzerPercentage = grossPrice > 0 ? Math.round((payout / grossPrice) * 100) : 100;
  const adminPercentage = 100 - buzzerPercentage;
  const normalizedStatus: CampaignJobStatus =
    job.status === "Ditolak" ? "Revisi" : job.status === "Upload" ? "Review" : job.status;
  const campaignStatus = normalizedStatus === "Review" ? "Review" : "Aktif";
  const deadline = /^\d{4}-\d{2}-\d{2}$/.test(job.deadline)
    ? job.deadline
    : new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
  const startDate = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
  const timestamp = job.updatedAt && !Number.isNaN(Date.parse(job.updatedAt))
    ? job.updatedAt
    : new Date().toISOString();
  const proofUrl = job.proofUrl ?? null;
  const submittedAt = proofUrl ? timestamp : null;

  const campaignPayload = {
    id: campaignId,
    title: job.title,
    customer_email: "customer@buzzhub.id",
    customer_name: "Customer Utama",
    platform: job.platform,
    brief: job.brief,
    budget: grossPrice,
    payout_per_buzzer: payout,
    slots: 1,
    deadline,
    status: campaignStatus,
    payment_status: "Pembayaran Disetujui",
    start_date: startDate,
    price_per_buzzer: grossPrice,
    buzzer_count: 1,
    total_amount: grossPrice,
    created_at: timestamp,
    updated_at: timestamp,
  };

  const { error: campaignError } = await (supabase as any)
    .from("campaigns")
    .upsert(campaignPayload, { onConflict: "id" });
  if (campaignError) throw campaignError;

  const jobPayload = {
    id: jobId,
    campaign_id: campaignId,
    campaign_title: job.title,
    platform: job.platform,
    buzzer_email: email,
    buzzer_name: buzzerName.trim() || email,
    payout,
    deadline,
    brief: job.brief,
    status: normalizedStatus,
    proof_url: proofUrl,
    note: job.note ?? null,
    rejection_reason: job.rejection_reason ?? null,
    rejected_at: job.rejected_at ?? null,
    rejected_by: job.rejection_reason || normalizedStatus === "Revisi" ? "admin@buzzhub.id" : null,
    resubmission_count: normalizedStatus === "Revisi" ? 1 : 0,
    submitted_at: submittedAt,
    admin_verified_at: job.admin_verified_at ?? null,
    customer_rated_at: job.customer_rated_at ?? null,
    gross_price: grossPrice,
    buzzer_level: null,
    buzzer_percentage: buzzerPercentage,
    buzzer_amount: payout,
    admin_percentage: adminPercentage,
    admin_amount: adminAmount,
    created_at: timestamp,
    updated_at: timestamp,
  };

  const { error: jobError } = await (supabase as any)
    .from("campaign_jobs")
    .insert(jobPayload);
  if (jobError) {
    // Tab lain mungkin sudah lebih dulu membuat baris dengan ID deterministik ini.
    const { data: raced } = await supabase
      .from("campaign_jobs")
      .select("id, buzzer_email")
      .eq("id", jobId)
      .maybeSingle();
    if (raced?.id) {
      if (raced.buzzer_email && raced.buzzer_email.toLowerCase() !== email) {
        throw new Error("Job ini sudah terhubung ke akun buzzer lain.");
      }
      return raced.id;
    }
    throw jobError;
  }

  return jobId;
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
  if (!["Diambil", "Revisi", "Ditolak"].includes(job.status)) {
    throw new Error(`Job berstatus ${job.status} tidak dapat menerima bukti baru.`);
  }

  const { data: previous, error: previousError } = await supabase
    .from("campaign_job_submissions")
    .select("submission_number")
    .eq("job_id", id)
    .order("submission_number", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (previousError) throw previousError;
  const submissionNumber = (previous?.submission_number ?? 0) + 1;
  const { data: submission, error: submissionError } = await supabase
    .from("campaign_job_submissions")
    .insert({
      job_id: id,
      buzzer_email: email,
      proof_url: url,
      submission_number: submissionNumber,
      status: "Review",
    })
    .select("id")
    .single();
  if (submissionError) throw submissionError;

  const { data, error } = await supabase
    .from("campaign_jobs")
    .update({ status: "Review", proof_url: url, note: null, rejection_reason: null, rejected_at: null, rejected_by: null, admin_verified_at: null, customer_rated_at: null, resubmission_count: Math.max(0, submissionNumber - 1), submitted_at: new Date().toISOString(), updated_at: new Date().toISOString() } as any)
    .eq("id", id)
    .select("id, proof_url, status")
    .maybeSingle();
  if (error || !data?.proof_url) {
    if (submission?.id) {
      await supabase.from("campaign_job_submissions").delete().eq("id", submission.id);
    }
    console.error("[Proof Upload] Supabase campaign_jobs update error:", error);
    throw error ?? new Error("Bukti berhasil diunggah tetapi belum tersimpan ke job.");
  }
}

export async function reviewCampaignJob(id: string, status: CampaignJobStatus, note?: string) {
  const { error } = await supabase.from("campaign_jobs").update({
    status,
    note: note ?? null,
    ...(status === "Review" || status === "Selesai" ? { admin_verified_at: new Date().toISOString() } : {}),
  } as any).eq("id", id);
  if (error) throw error;
  const { error: submissionError } = await supabase.from("campaign_job_submissions").update({ status, reviewed_at: new Date().toISOString() }).eq("job_id", id).eq("status", "Review");
  if (submissionError) throw submissionError;

  if (status === "Review" || status === "Selesai") {
    const { data: job } = await supabase.from("campaign_jobs").select("*").eq("id", id).maybeSingle();
    if (job?.buzzer_email) {
      const fee = Number(job.buzzer_amount || job.payout || 0);

      // Safe wallet crediting fallback:
      // Pastikan saldo wallet ter-update dan transaksi dicatat dengan benar
      if (fee > 0) {
        const buzzerEmail = job.buzzer_email.trim().toLowerCase();
        const { data: existingAct } = await supabase
          .from("finance_activity")
          .select("id")
          .eq("ref_table", "campaign_jobs")
          .eq("ref_id", String(id))
          .eq("type", "buzzer")
          .maybeSingle();

        if (!existingAct) {
          const { data: curWallet } = await supabase
            .from("buzzer_wallets")
            .select("balance")
            .eq("buzzer_email", buzzerEmail)
            .maybeSingle();

          const prevBal = Number(curWallet?.balance ?? 0);
          await supabase.from("buzzer_wallets").upsert({
            buzzer_email: buzzerEmail,
            buzzer_name: job.buzzer_name || buzzerEmail,
            balance: prevBal + fee,
            updated_at: new Date().toISOString(),
          });

          await supabase.from("finance_activity").insert({
            type: "buzzer",
            title: "Payout Buzzer",
            description: `${job.campaign_title} - payout buzzer disetujui admin`,
            amount: fee,
            ref_table: "campaign_jobs",
            ref_id: String(id),
          });

          const adminFee = Math.max(0, Number(job.gross_price || 0) - fee);
          if (adminFee > 0) {
            await supabase.from("finance_activity").insert({
              type: "admin",
              title: "Komisi Admin",
              description: `${job.campaign_title} - komisi admin dari pengerjaan yang diverifikasi`,
              amount: adminFee,
              ref_table: "campaign_jobs",
              ref_id: String(id),
            });
          }
        }
      }

      if (status === "Review" || status === "Selesai") {
        void notifyTaskApproved({
          buzzerEmail: job.buzzer_email,
          campaignTitle: job.campaign_title || "Kampanye",
          fee,
          jobId: id,
        });
      }
    }
    if (job?.campaign_id) {
      const { data: campaignJobs } = await (supabase as any).from("campaign_jobs").select("buzzer_email, admin_verified_at").eq("campaign_id", job.campaign_id);
      if (campaignJobs?.length && campaignJobs.every((item: any) => item.buzzer_email && item.admin_verified_at)) {
        await supabase.from("campaigns").update({ status: "Selesai" }).eq("id", job.campaign_id);
      }
    }
  }
}

export async function rejectCampaignJob(id: string, reason: string, rejectedBy = "admin") {
  const cleanReason = reason.trim();
  if (!cleanReason) throw new Error("Alasan penolakan wajib diisi.");
  const rejectedAt = new Date().toISOString();
  const { data: latest, error: latestError } = await supabase
    .from("campaign_job_submissions")
    .select("id")
    .eq("job_id", id)
    .order("submission_number", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (latestError) throw latestError;
  if (latest?.id) {
    const { error } = await supabase.from("campaign_job_submissions").update({ status: "Ditolak", rejection_reason: cleanReason, rejected_at: rejectedAt, rejected_by: rejectedBy, reviewed_at: rejectedAt }).eq("id", latest.id);
    if (error) throw error;
  } else {
    const { data: job, error: jobError } = await supabase.from("campaign_jobs").select("proof_url, buzzer_email").eq("id", id).maybeSingle();
    if (jobError) throw jobError;
    if (job?.proof_url) {
      const { error } = await supabase.from("campaign_job_submissions").insert({
        job_id: id,
        buzzer_email: job.buzzer_email ?? "",
        proof_url: job.proof_url,
        submission_number: 1,
        status: "Ditolak",
        rejection_reason: cleanReason,
        rejected_at: rejectedAt,
        rejected_by: rejectedBy,
        reviewed_at: rejectedAt,
      });
      if (error) throw error;
    }
  }
  const { error } = await supabase.from("campaign_jobs").update({ status: "Revisi", note: cleanReason, rejection_reason: cleanReason, rejected_at: rejectedAt, rejected_by: rejectedBy, admin_verified_at: null, customer_rated_at: null } as any).eq("id", id);
  if (error) throw error;

  // Notifikasi penolakan / permintaan revisi ke akun buzzer
  try {
    const { data: job } = await supabase.from("campaign_jobs").select("buzzer_email, campaign_title").eq("id", id).maybeSingle();
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
  const { error } = await supabase.from("campaign_jobs").update(updates as any).eq("id", id);
  if (error) throw error;
}

export async function deleteCampaignJob(id: string) {
  try {
    await supabase.from("campaign_job_submissions").delete().eq("job_id", id);
  } catch (e) {
    console.warn("Gagal menghapus submissions terkait:", e);
  }
  try {
    await (supabase as any).from("buzzer_ratings").delete().eq("job_id", id);
  } catch (e) {
    console.warn("Gagal menghapus rating terkait:", e);
  }
  const { error } = await supabase.from("campaign_jobs").delete().eq("id", id);
  if (error) throw error;
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
  const { error } = await supabase.from("campaigns").insert({ ...input, status: input.status ?? "Aktif" } as any);
  if (error) throw error;
}

/** Menghitung split pendapatan buzzer dan komisi admin berdasarkan level buzzer (Bronze 40%, Silver 45%, Gold 50%, Platinum 55%, Diamond 60%). */
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
  const targetPct = getBuzzerPercentageForLevel(level);

  let buzzerShare: number;
  let adminShare: number;

  if (total > 0) {
    buzzerShare = Math.round((total * targetPct) / 100);
    adminShare = Math.max(0, total - buzzerShare);
  } else {
    buzzerShare = 0;
    adminShare = 0;
  }

  const buzzerPercent = targetPct;
  const adminPercent = 100 - targetPct;
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
  const payload = { ...input, status: input.status ?? "Aktif" };
  const { error } = await (supabase as any).from("service_catalogs").insert(payload);
  if (error) {
    if (error.message?.includes("payout_per_buzzer")) {
      const { payout_per_buzzer, ...safePayload } = payload as any;
      const { error: retryErr } = await (supabase as any).from("service_catalogs").insert(safePayload);
      if (retryErr) throw retryErr;
      return;
    }
    throw error;
  }
}

export async function updateServiceCatalogStatus(id: string, status: ServiceCatalog["status"]) {
  const { error } = await (supabase as any).from("service_catalogs").update({ status }).eq("id", id);
  if (error) throw error;
}
export async function updateServiceCatalog(id: string, input: Partial<Omit<ServiceCatalog, "id" | "created_at" | "updated_at">>) {
  const { error } = await (supabase as any).from("service_catalogs").update(input).eq("id", id);
  if (error) {
    if (error.message?.includes("payout_per_buzzer")) {
      const { payout_per_buzzer, ...safeInput } = input as any;
      const { error: retryErr } = await (supabase as any).from("service_catalogs").update(safeInput).eq("id", id);
      if (retryErr) throw retryErr;
      return;
    }
    throw error;
  }
}

export async function deleteServiceCatalog(id: string) {
  try {
    await (supabase as any).from("catalog_packages").delete().eq("catalog_id", id);
    await (supabase as any).from("campaigns").update({ catalog_id: null }).eq("catalog_id", id);
  } catch (err) {
    console.warn("Error cleaning up catalog references:", err);
  }
  const { error } = await (supabase as any).from("service_catalogs").delete().eq("id", id);
  if (error) throw error;
}

export async function createCatalogPackage(input: Omit<CatalogPackage, "id" | "created_at" | "updated_at"> & { status?: CatalogPackage["status"] }) {
  const { error } = await (supabase as any).from("catalog_packages").insert({ ...input, status: input.status ?? "Aktif" });
  if (error) throw error;
}

export async function updateCatalogPackage(id: string, input: Partial<Omit<CatalogPackage, "id" | "created_at" | "updated_at" | "catalog_id">>) {
  const { error } = await (supabase as any).from("catalog_packages").update(input).eq("id", id);
  if (error) throw error;
}

export async function updateCatalogPackageStatus(id: string, status: CatalogPackage["status"]) {
  const { error } = await (supabase as any).from("catalog_packages").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteCatalogPackage(id: string) {
  const { error } = await (supabase as any).from("catalog_packages").delete().eq("id", id);
  if (error) throw error;
}

export async function sendCampaignMessage(msg: Omit<CampaignMessage, "id" | "created_at" | "read_at">) {
  const { error } = await supabase.from("campaign_messages").insert(msg);
  if (error) throw error;
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
  const { payment_id, ...campaignInput } = input;
  const { data, error } = await supabase.from("campaigns").insert({ ...campaignInput, payment_id, payment_status: "Menunggu Verifikasi", status: "Draft" } as any).select("id").single();
  if (error) throw error;
  const { error: paymentError } = await supabase.from("payments").update({ campaign_id: data.id } as any).eq("id", payment_id);
  if (paymentError) throw paymentError;
  return data.id as string;
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
  const { error } = await (supabase as any).rpc("approve_campaign_payment", {
    p_payment_id: paymentId,
    p_admin_email: "admin",
  });
  if (error) throw error;
}

/** Admin menolak kampanye. */
export async function rejectCampaign(id: string, note?: string) {
  const { error } = await supabase
    .from("campaigns")
    .update({ status: "Dibatalkan", brief: note ? `[Ditolak] ${note}` : undefined })
    .eq("id", id);
  if (error) throw error;
}

/** Admin menandai kampanye selesai. */
export async function completeCampaign(id: string) {
  const { data: campaign, error: campaignError } = await supabase.from("campaigns").select("status, payment_status, target_reached_at").eq("id", id).single();
  if (campaignError) throw campaignError;
  if (campaign.payment_status !== "Pembayaran Disetujui") throw new Error("Pembayaran campaign belum disetujui.");
  if (campaign.status === "Selesai") return;

  const { error: updateError } = await (supabase as any)
    .from("campaigns")
    .update({ status: "Selesai", target_reached_at: campaign.target_reached_at ?? new Date().toISOString() })
    .eq("id", id)
    .neq("status", "Dibatalkan");
  if (updateError) throw updateError;
}

/**
 * Admin memperbarui detail kampanye (judul, brief, deadline).
 * Snapshot pada campaign_jobs ikut disinkronkan: judul & deadline untuk semua job,
 * brief hanya untuk job yang brief-nya masih sama dengan brief kampanye lama.
 */
export async function updateCampaignDetails(
  id: string,
  patch: { title: string; brief: string; deadline: string },
) {
  const title = patch.title.trim();
  if (!title) throw new Error("Judul kampanye wajib diisi.");

  const { data: current, error: fetchError } = await supabase
    .from("campaigns")
    .select("brief")
    .eq("id", id)
    .single();
  if (fetchError || !current) throw new Error("Kampanye tidak ditemukan.");

  const { error } = await supabase
    .from("campaigns")
    .update({ title, brief: patch.brief, deadline: patch.deadline, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;

  const { error: jobsError } = await supabase
    .from("campaign_jobs")
    .update({ campaign_title: title, deadline: patch.deadline })
    .eq("campaign_id", id);
  if (jobsError) console.error("Gagal sinkron judul/deadline job:", jobsError);

  const oldBrief = (current as { brief?: string | null }).brief ?? "";
  if (oldBrief !== patch.brief) {
    const { error: briefError } = await supabase
      .from("campaign_jobs")
      .update({ brief: patch.brief })
      .eq("campaign_id", id)
      .eq("brief", oldBrief);
    if (briefError) console.error("Gagal sinkron brief job:", briefError);
  }
}

/** Admin menghapus kampanye secara permanen beserta data relasinya. */
export async function deleteCampaign(id: string) {
  // 1. Ambil daftar job IDs yang terhubung ke kampanye ini
  const { data: jobs } = await supabase
    .from("campaign_jobs")
    .select("id")
    .eq("campaign_id", id);
  const jobIds = (jobs || []).map((j: { id: string }) => j.id);

  // 2. Hapus submissions dan rating per job jika ada
  if (jobIds.length > 0) {
    await supabase.from("campaign_job_submissions").delete().in("job_id", jobIds);
    await supabase.from("buzzer_ratings").delete().in("job_id", jobIds);
  }

  // 3. Hapus buzzer ratings yang terhubung langsung ke campaign_id
  await (supabase as any).from("buzzer_ratings").delete().eq("campaign_id", id);

  // 4. Hapus pesan percakapan kampanye
  await supabase.from("campaign_messages").delete().eq("campaign_id", id);

  // 5. Hapus seluruh jobs kampanye
  await supabase.from("campaign_jobs").delete().eq("campaign_id", id);

  // 6. Lepaskan referensi payment bila terikat
  await (supabase as any).from("payments").update({ campaign_id: null }).eq("campaign_id", id);

  // 7. Hapus record kampanye itu sendiri
  const { error } = await supabase.from("campaigns").delete().eq("id", id);
  if (error) throw error;
}

