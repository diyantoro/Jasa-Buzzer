import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { notifyRatingReceived } from "@/lib/buzzer-notification-store";
import { getCachedRows, isCacheFresh, loadCachedRows } from "@/lib/query-cache";

export type BuzzerRating = {
  id: string;
  customer_id: string;
  job_id: string;
  campaign_id: string | null;
  campaign_title: string;
  buzzer_email: string;
  buzzer_name: string;
  customer_email: string;
  customer_name: string;
  stars: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  customer_edit_count?: number;
  order_completed_at?: string | null;
};

/**
 * Logika weighted average rating buzzer dengan nilai peredam/prior:
 * 1. Rating awal buzzer adalah 5.0.
 * 2. Nilai awal default buzzer baru: current_rating = 5.0 dan total_reviews = 9.
 * 3. Ketika ada rating baru dari customer (skor 1 - 5), hitung dengan rumus:
 *    rating_baru = ((rating_lama * total_reviews) + skor_baru) / (total_reviews + 1)
 *    Contoh: Rating 5.0 dengan ulasan baru 4 -> ((5.0 * 9) + 4) / 10 = 4.9
 * 4. Pembulatan: 1 desimal (Math.round(val * 10) / 10).
 */
export function calculateWeightedRating(
  currentRating: number = 0,
  totalReviews: number = 0,
  newScore: number,
): { newRating: number; newTotalReviews: number } {
  const ratingLama =
    typeof currentRating === "number" && !isNaN(currentRating) && currentRating > 0
      ? currentRating
      : 0;
  const reviewsLama =
    typeof totalReviews === "number" && !isNaN(totalReviews) && totalReviews > 0
      ? totalReviews
      : 0;
  const skorBaru = Math.min(5, Math.max(1, Math.round(newScore)));

  if (reviewsLama === 0) {
    return { newRating: skorBaru, newTotalReviews: 1 };
  }

  const calculatedRating = ((ratingLama * reviewsLama) + skorBaru) / (reviewsLama + 1);
  const newRating = Math.round(calculatedRating * 10) / 10;
  const newTotalReviews = reviewsLama + 1;

  return { newRating, newTotalReviews };
}

/**
 * Rating dan total_reviews dikelola trigger `sync_buzzer_rating` setiap kali
 * `buzzer_ratings` berubah. Sejak Fase 1 client tidak lagi menulis ke
 * `buzzer_wallets` / `app_accounts`; fungsi ini hanya membaca hasil trigger.
 */
export async function updateBuzzerRatingAndReviews(
  buzzerEmail: string,
  _newScore: number,
): Promise<{ newRating: number; newTotalReviews: number }> {
  const email = buzzerEmail.trim().toLowerCase();
  if (!email) {
    return { newRating: 0, newTotalReviews: 0 };
  }

  const { data: wallet } = await supabase
    .from("buzzer_wallets")
    .select("rating, total_reviews")
    .eq("buzzer_email", email)
    .maybeSingle();

  const { data: account } = await (supabase as any).from("app_accounts_public")
    .select("rating, total_reviews")
    .eq("email", email)
    .maybeSingle();

  const newTotalReviews = Number(wallet?.total_reviews ?? account?.total_reviews ?? 0);
  const newRating = Number(wallet?.rating ?? account?.rating ?? 0);
  return { newRating, newTotalReviews };
}

/**
 * Sinkronisasi menyeluruh rating buzzer. Perhitungan sudah dilakukan trigger
 * `sync_buzzer_rating`, jadi fungsi ini hanya membaca nilai terbaru.
 */
export async function syncBuzzerRatingFull(buzzerEmail: string): Promise<number> {
  const email = buzzerEmail.trim().toLowerCase();
  if (!email) return 0;

  const { data: wallet } = await supabase
    .from("buzzer_wallets")
    .select("rating")
    .eq("buzzer_email", email)
    .maybeSingle();

  return Number(wallet?.rating ?? 0);
}

const RATINGS_CACHE_KEY = "buzzer_ratings:all";

export function useBuzzerRatings() {
  const [data, setData] = useState<BuzzerRating[]>(
    () => getCachedRows<BuzzerRating>(RATINGS_CACHE_KEY) ?? [],
  );
  const [loading, setLoading] = useState(
    () => !getCachedRows<BuzzerRating>(RATINGS_CACHE_KEY),
  );
  // Nama channel harus unik per instance/mount. Kalau tidak, instance kedua
  // akan menempelkan callback ke channel yang sudah subscribe dan Supabase
  // melempar error "cannot add postgres_changes callbacks after subscribe()".
  const [channelId] = useState(() => `ratings-${Math.random().toString(36).slice(2, 10)}`);

  const fetchAll = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) setLoading(true);
    try {
      const rows = await loadCachedRows<BuzzerRating>(RATINGS_CACHE_KEY, async () => {
        const { data: rows, error } = await supabase
          .from("buzzer_ratings")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(500);
        if (error) throw error;
        return (rows as BuzzerRating[]) ?? [];
      });
      setData(rows);
    } catch (error) {
      console.error("Gagal memuat rating buzzer:", error);
      if (!getCachedRows<BuzzerRating>(RATINGS_CACHE_KEY)) setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const hasCache = Boolean(getCachedRows<BuzzerRating>(RATINGS_CACHE_KEY));
    if (!hasCache) {
      void fetchAll();
    } else if (!isCacheFresh(RATINGS_CACHE_KEY)) {
      void fetchAll({ silent: true });
    }
    const ch = supabase
      .channel(`rt-buzzer_ratings-${channelId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "buzzer_ratings" }, () => {
        void fetchAll({ silent: true });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [fetchAll, channelId]);

  return { data, loading, refetch: fetchAll };
}

export async function rateBuzzer(input: {
  customer_id: string;
  job_id: string;
  campaign_id: string | null;
  campaign_title: string;
  buzzer_email: string;
  buzzer_name: string;
  customer_email: string;
  customer_name: string;
  stars: number;
  comment?: string;
}) {
  const stars = Math.min(5, Math.max(1, Math.round(input.stars)));
  // Fase 2: ulasan ditulis server; identitas customer diambil dari sesi.
  const { rateBuzzerFn } = await import("./rating.functions");
  try {
    await rateBuzzerFn({
      data: {
        jobId: input.job_id,
        campaignId: input.campaign_id,
        campaignTitle: input.campaign_title,
        buzzerEmail: input.buzzer_email,
        buzzerName: input.buzzer_name,
        stars,
        comment: input.comment?.trim() || null,
      },
    });
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }

  // Update rating & total_reviews buzzer terkait dengan metode weighted average
  if (input.buzzer_email) {
    await updateBuzzerRatingAndReviews(input.buzzer_email, stars);
    void notifyRatingReceived({
      buzzerEmail: input.buzzer_email,
      campaignTitle: input.campaign_title || "Kampanye",
      stars,
      comment: input.comment,
    });
  }
}

export async function rateCampaignForAllBuzzers(input: {
  customer_id: string;
  campaign_id: string;
  stars: number;
  comment?: string;
}) {
  const stars = Math.min(5, Math.max(1, Math.round(input.stars)));
  // Fase 2: RPC dijalankan server dengan identitas customer dari sesi.
  const { rateCampaignForAllBuzzersFn } = await import("./rating.functions");
  try {
    await rateCampaignForAllBuzzersFn({
      data: {
        campaignId: input.campaign_id,
        stars,
        comment: input.comment?.trim() || null,
      },
    });
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }

  // Dapatkan buzzer pada campaign ini dan update rating mereka dengan weighted average
  try {
    const { data: jobs } = await supabase
      .from("campaign_jobs")
      .select("buzzer_email")
      .eq("campaign_id", input.campaign_id)
      .not("buzzer_email", "is", null);

    const buzzerEmails = Array.from(
      new Set(
        (jobs ?? [])
          .map((j) => (j.buzzer_email ?? "").trim().toLowerCase())
          .filter(Boolean),
      ),
    );

    const { data: campaignData } = await supabase
      .from("campaigns")
      .select("title")
      .eq("id", input.campaign_id)
      .maybeSingle();

    const campaignTitle = campaignData?.title || "Kampanye";

    await Promise.allSettled(
      buzzerEmails.map(async (email) => {
        await updateBuzzerRatingAndReviews(email, stars);
        await notifyRatingReceived({
          buzzerEmail: email,
          campaignTitle,
          stars,
          comment: input.comment,
        });
      }),
    );
  } catch (err) {
    console.error("Gagal sinkronisasi rating buzzer:", err);
  }
}

export async function updateAdminBuzzerRating(input: {
  id: string;
  admin_email: string;
  stars: number;
  comment?: string;
}) {
  const stars = Math.min(5, Math.max(1, Math.round(input.stars)));
  // Fase 1: RPC admin hanya bisa dipanggil service_role lewat server function.
  const { adminUpdateBuzzerRatingFn } = await import("./admin.functions");
  await adminUpdateBuzzerRatingFn({
    data: { id: input.id, stars, comment: input.comment?.trim() || null },
  });

  try {
    const { data: ratingRow } = await supabase
      .from("buzzer_ratings")
      .select("buzzer_email")
      .eq("id", input.id)
      .maybeSingle();

    if (ratingRow?.buzzer_email) {
      await syncBuzzerRatingFull(ratingRow.buzzer_email);
    }
  } catch (err) {
    console.error("Gagal sinkronisasi rating buzzer:", err);
  }
}

export async function updateCustomerBuzzerRating(input: {
  id: string;
  customer_email: string;
  stars: number;
  comment?: string;
}) {
  const stars = Math.min(5, Math.max(1, Math.round(input.stars)));
  // Fase 2: edit ulasan dijalankan server. Identitas customer diambil dari
  // sesi bertanda tangan, bukan dari parameter client.
  const { updateCustomerRatingFn } = await import("./rating.functions");
  await updateCustomerRatingFn({
    data: { id: input.id, stars, comment: input.comment?.trim() || null },
  });

  try {
    const { data: ratingRow } = await (supabase as any)
      .from("buzzer_ratings")
      .select("buzzer_email, campaign_id")
      .eq("id", input.id)
      .maybeSingle();

    if (ratingRow?.campaign_id) {
      const { data: allBuzzerRows } = await (supabase as any)
        .from("buzzer_ratings")
        .select("buzzer_email")
        .eq("campaign_id", ratingRow.campaign_id);
      const emails = Array.from(new Set((allBuzzerRows ?? []).map((r: any) => r.buzzer_email).filter(Boolean)));
      await Promise.allSettled(emails.map((em) => syncBuzzerRatingFull(em as string)));
    } else if (ratingRow?.buzzer_email) {
      await syncBuzzerRatingFull(ratingRow.buzzer_email);
    }
  } catch (err) {
    console.error("Gagal sinkronisasi rating buzzer:", err);
  }
}

export async function deleteAdminBuzzerRating(id: string, adminEmail: string) {
  const { data: ratingRow } = await supabase
    .from("buzzer_ratings")
    .select("buzzer_email")
    .eq("id", id)
    .maybeSingle();

  // Fase 1: RPC admin hanya bisa dipanggil service_role lewat server function.
  const { adminDeleteBuzzerRatingFn } = await import("./admin.functions");
  await adminDeleteBuzzerRatingFn({ data: { id } });

  if (ratingRow?.buzzer_email) {
    await syncBuzzerRatingFull(ratingRow.buzzer_email);
  }
}

export function averageStars(ratings: { stars: number }[]) {
  if (!ratings || !ratings.length) return 0;
  const sum = ratings.reduce((a, r) => a + Number(r.stars || 0), 0);
  return Math.round((sum / ratings.length) * 10) / 10;
}
