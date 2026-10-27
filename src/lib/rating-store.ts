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
 * Update kolom rating dan total_reviews di database (buzzer_wallets dan app_accounts)
 */
export async function updateBuzzerRatingAndReviews(
  buzzerEmail: string,
  newScore: number,
): Promise<{ newRating: number; newTotalReviews: number }> {
  const email = buzzerEmail.trim().toLowerCase();
  if (!email) {
    return { newRating: 0, newTotalReviews: 0 };
  }

  // Dapatkan data rating dan total_reviews saat ini
  const [{ data: wallet }, { data: account }] = await Promise.all([
    supabase
      .from("buzzer_wallets")
      .select("rating, total_reviews")
      .eq("buzzer_email", email)
      .maybeSingle(),
    supabase
      .from("app_accounts")
      .select("rating, total_reviews")
      .eq("email", email)
      .eq("role", "buzzer")
      .maybeSingle(),
  ]);

  const currentReviews = Number(
    wallet?.total_reviews != null && Number(wallet.total_reviews) >= 0
      ? wallet.total_reviews
      : account?.total_reviews != null && Number(account.total_reviews) >= 0
      ? account.total_reviews
      : 0,
  );

  const currentRating = currentReviews > 0 ? Number(
    wallet?.rating != null && Number(wallet.rating) >= 0
      ? wallet.rating
      : account?.rating != null && Number(account.rating) >= 0
      ? account.rating
      : 0,
  ) : 0;

  const { newRating, newTotalReviews } = calculateWeightedRating(
    currentRating,
    currentReviews,
    newScore,
  );

  // Update kolom rating dan total_reviews di tabel buzzer terkait
  await Promise.allSettled([
    (supabase as any)
      .from("buzzer_wallets")
      .update({
        rating: newRating,
        total_reviews: newTotalReviews,
        updated_at: new Date().toISOString(),
      })
      .eq("buzzer_email", email),
    supabase
      .from("app_accounts")
      .update({
        rating: newRating,
        total_reviews: newTotalReviews,
        updated_at: new Date().toISOString(),
      })
      .eq("email", email)
      .eq("role", "buzzer"),
  ]);

  return { newRating, newTotalReviews };
}

/**
 * Sinkronisasi menyeluruh rating buzzer dari tabel buzzer_ratings (0 jika belum ada ulasan)
 */
export async function syncBuzzerRatingFull(buzzerEmail: string): Promise<number> {
  const email = buzzerEmail.trim().toLowerCase();
  if (!email) return 0;

  const { data: rows } = await (supabase as any)
    .from("buzzer_ratings")
    .select("stars")
    .eq("buzzer_email", email);

  const ratings = rows ?? [];
  const totalReviews = ratings.length;
  if (totalReviews === 0) {
    await Promise.allSettled([
      (supabase as any)
        .from("buzzer_wallets")
        .update({
          rating: 0,
          total_reviews: 0,
          updated_at: new Date().toISOString(),
        })
        .eq("buzzer_email", email),
      supabase
        .from("app_accounts")
        .update({
          rating: 0,
          total_reviews: 0,
          updated_at: new Date().toISOString(),
        })
        .eq("email", email)
        .eq("role", "buzzer"),
    ]);
    return 0;
  }

  const starSum = ratings.reduce((sum: number, r: any) => sum + Number(r.stars || 0), 0);
  const calculatedRating = Math.round((starSum / totalReviews) * 10) / 10;

  await Promise.allSettled([
    (supabase as any)
      .from("buzzer_wallets")
      .update({
        rating: calculatedRating,
        total_reviews: totalReviews,
        updated_at: new Date().toISOString(),
      })
      .eq("buzzer_email", email),
    supabase
      .from("app_accounts")
      .update({
        rating: calculatedRating,
        total_reviews: totalReviews,
        updated_at: new Date().toISOString(),
      })
      .eq("email", email)
      .eq("role", "buzzer"),
  ]);

  return calculatedRating;
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
  const { error } = await (supabase as any)
    .from("buzzer_ratings")
    .insert({ ...input, stars, comment: input.comment?.trim() || null });
  if (error) {
    if (error.code === "23505") throw new Error("Pesanan ini sudah diulas.");
    throw error;
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
  const { error } = await (supabase as any).rpc("rate_campaign_for_all_buzzers", {
    p_customer_id: input.customer_id,
    p_campaign_id: input.campaign_id,
    p_stars: stars,
    p_comment: input.comment?.trim() || null,
  });
  if (error) {
    if (error.code === "23505") throw new Error("Campaign ini sudah diulas.");
    throw error;
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
  const { error } = await (supabase as any).rpc("update_admin_buzzer_rating", {
    p_rating_id: input.id,
    p_admin_email: input.admin_email,
    p_stars: stars,
    p_comment: input.comment?.trim() || null,
  });
  if (error) throw error;

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
  const normalizedEmail = input.customer_email.trim().toLowerCase();

  const { error: rpcError } = await (supabase as any).rpc("update_customer_buzzer_rating", {
    p_rating_id: input.id,
    p_customer_email: normalizedEmail,
    p_stars: stars,
    p_comment: input.comment?.trim() || null,
  });

  if (rpcError) {
    const msg = rpcError.message || "";
    if (msg.includes("Kesempatan edit") || msg.includes("Batas waktu") || msg.includes("bukan milik")) {
      throw new Error(msg);
    }

    // Direct fallback jika RPC belum tersedia di schema cache
    const { data: ratingRowRaw, error: fetchErr } = await (supabase as any)
      .from("buzzer_ratings")
      .select("*")
      .eq("id", input.id)
      .maybeSingle();

    const ratingRow: any = ratingRowRaw;

    if (fetchErr || !ratingRow) {
      throw new Error("Ulasan tidak ditemukan.");
    }

    const ratingOwner = (ratingRow.customer_id || ratingRow.customer_email || "").trim().toLowerCase();
    if (ratingOwner !== normalizedEmail) {
      throw new Error("Ulasan bukan milik customer ini.");
    }

    if ((ratingRow.customer_edit_count ?? 0) >= 1) {
      throw new Error("Kesempatan edit ulasan sudah digunakan (maksimal 1x).");
    }

    // Dapatkan waktu pesanan selesai
    let completedTime = ratingRow.order_completed_at ? new Date(ratingRow.order_completed_at).getTime() : 0;
    if (!completedTime && ratingRow.campaign_id) {
      const { data: camp } = await (supabase as any)
        .from("campaigns")
        .select("target_reached_at, updated_at")
        .eq("id", ratingRow.campaign_id)
        .maybeSingle();
      if (camp?.target_reached_at) {
        completedTime = new Date(camp.target_reached_at).getTime();
      } else if (camp?.updated_at) {
        completedTime = new Date(camp.updated_at).getTime();
      }
    }
    if (!completedTime) {
      completedTime = new Date(ratingRow.created_at).getTime();
    }

    // Batas waktu: 1x24 jam dari sesudah selesainya pesanan
    if (Date.now() > completedTime + 24 * 60 * 60 * 1000) {
      throw new Error("Batas waktu edit ulasan sudah berakhir (melebihi 1x24 jam sejak pesanan selesai).");
    }

    const newEditCount = (ratingRow.customer_edit_count ?? 0) + 1;
    const updatePayload: Record<string, any> = {
      stars,
      comment: input.comment?.trim() || null,
      customer_edit_count: newEditCount,
      updated_at: new Date().toISOString(),
    };
    if (!ratingRow.order_completed_at && completedTime) {
      updatePayload.order_completed_at = new Date(completedTime).toISOString();
    }

    let updateErr: any = null;
    if (ratingRow.campaign_id) {
      const res = await (supabase as any)
        .from("buzzer_ratings")
        .update(updatePayload)
        .eq("campaign_id", ratingRow.campaign_id)
        .eq("customer_id", normalizedEmail);
      updateErr = res.error;
    } else {
      const res = await (supabase as any)
        .from("buzzer_ratings")
        .update(updatePayload)
        .eq("id", input.id);
      updateErr = res.error;
    }

    if (updateErr) {
      throw new Error(updateErr.message || "Gagal memperbarui ulasan.");
    }
  }

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

  const { error } = await (supabase as any).rpc("delete_admin_buzzer_rating", {
    p_rating_id: id,
    p_admin_email: adminEmail,
  });
  if (error) throw error;

  if (ratingRow?.buzzer_email) {
    await syncBuzzerRatingFull(ratingRow.buzzer_email);
  }
}

export function averageStars(ratings: { stars: number }[]) {
  if (!ratings || !ratings.length) return 0;
  const sum = ratings.reduce((a, r) => a + Number(r.stars || 0), 0);
  return Math.round((sum / ratings.length) * 10) / 10;
}
