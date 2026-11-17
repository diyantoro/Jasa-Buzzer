/**
 * Server function rating buzzer (Fase 2).
 *
 * Sejak `social_accounts`/`buzzer_ratings` dikunci, ulasan tidak lagi
 * ditulis dari browser. Semua fungsi di sini memakai sesi bertanda tangan
 * sebagai identitas customer, sehingga client tidak bisa mengaku sebagai
 * customer lain atau mengubah ulasan milik orang lain.
 */
import { createServerFn } from "@tanstack/react-start";
import { describeDbError } from "./db-error";

type Session = { email: string; role: "admin" | "buzzer" | "customer" };

async function requireCustomer() {
  const { getServerSession } = await import("./session.server");
  const session = (await getServerSession()) as Session | null;
  if (!session) throw new Error("Sesi tidak ditemukan. Silakan masuk ulang.");
  if (session.role !== "customer") {
    throw new Error("Hanya akun customer yang bisa memberi ulasan.");
  }
  return session;
}

async function adminClient() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as any;
}

function fail(error: unknown): never {
  throw new Error(describeDbError(error));
}

function clampStars(value: unknown): number {
  return Math.min(5, Math.max(1, Math.round(Number(value) || 0)));
}

/* ------------------------------------------------------------------ */
/* Customer memberi ulasan pada satu job                               */
/* ------------------------------------------------------------------ */

export const rateBuzzerFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as {
        jobId: string;
        campaignId?: string | null;
        campaignTitle?: string;
        buzzerEmail: string;
        buzzerName?: string;
        stars: number;
        comment?: string | null;
      },
  )
  .handler(async ({ data }) => {
    const session = await requireCustomer();
    const db = await adminClient();

    const jobId = String(data?.jobId ?? "").trim();
    const buzzerEmail = String(data?.buzzerEmail ?? "").trim().toLowerCase();
    if (!jobId || !buzzerEmail) throw new Error("Data ulasan tidak lengkap.");

    const { data: job, error: jobError } = await db
      .from("campaign_jobs")
      .select("id, campaign_id, buzzer_email, status, admin_verified_at, campaign_title")
      .eq("id", jobId)
      .maybeSingle();
    if (jobError) fail(jobError);
    if (!job) throw new Error("Job tidak ditemukan.");

    const jobOwner = String(job.buzzer_email ?? "").trim().toLowerCase();
    if (jobOwner !== buzzerEmail) {
      throw new Error("Job ini bukan milik buzzer yang diulas.");
    }
    const finished = job.status === "Selesai" || job.admin_verified_at !== null;
    if (!finished) throw new Error("Job belum selesai sehingga belum bisa diulas.");

    // Pastikan campaign benar-benar milik customer yang sedang masuk.
    const campaignId = job.campaign_id ?? data.campaignId ?? null;
    if (campaignId) {
      const { data: campaign, error: campaignError } = await db
        .from("campaigns")
        .select("customer_email")
        .eq("id", campaignId)
        .maybeSingle();
      if (campaignError) fail(campaignError);
      const owner = String(campaign?.customer_email ?? "").trim().toLowerCase();
      if (owner && owner !== session.email) {
        throw new Error("Campaign ini bukan milik akun yang sedang masuk.");
      }
    }

    const { data: profile } = await db
      .from("app_accounts")
      .select("name")
      .eq("email", session.email)
      .maybeSingle();

    const { error } = await db.from("buzzer_ratings").insert({
      job_id: jobId,
      campaign_id: campaignId,
      campaign_title: String(data.campaignTitle ?? job.campaign_title ?? ""),
      buzzer_email: buzzerEmail,
      buzzer_name: String(data.buzzerName ?? ""),
      customer_email: session.email,
      customer_id: session.email,
      customer_name: String(profile?.name ?? session.email),
      stars: clampStars(data.stars),
      comment: data.comment?.trim() || null,
    } as never);

    if (error) {
      if (error.code === "23505") throw new Error("Pesanan ini sudah diulas.");
      fail(error);
    }

    return { ok: true as const };
  });

/* ------------------------------------------------------------------ */
/* Customer mengubah ulasannya sendiri (maksimal 1x, 24 jam)            */
/* ------------------------------------------------------------------ */

export const updateCustomerRatingFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as { id: string; stars: number; comment?: string | null },
  )
  .handler(async ({ data }) => {
    const session = await requireCustomer();
    const db = await adminClient();
    const stars = clampStars(data.stars);
    const ratingId = String(data?.id ?? "").trim();
    if (!ratingId) throw new Error("ID ulasan wajib diisi.");

    // RPC tetap dipakai karena sudah menegakkan batas 1x edit + 24 jam.
    const { error: rpcError } = await db.rpc("update_customer_buzzer_rating", {
      p_rating_id: ratingId,
      p_customer_email: session.email,
      p_stars: stars,
      p_comment: data.comment?.trim() || null,
    });

    if (!rpcError) return { ok: true as const };

    const message = String(rpcError.message ?? "");
    if (
      message.includes("Kesempatan edit") ||
      message.includes("Batas waktu") ||
      message.includes("bukan milik")
    ) {
      throw new Error(message);
    }

    // Fallback server-side jika RPC belum ada di schema cache. Aturan edit
    // tetap ditegakkan di sini.
    const { data: ratingRow, error: fetchError } = await db
      .from("buzzer_ratings")
      .select("*")
      .eq("id", ratingId)
      .maybeSingle();
    if (fetchError) fail(fetchError);
    if (!ratingRow) throw new Error("Ulasan tidak ditemukan.");

    const owner = String(ratingRow.customer_id ?? ratingRow.customer_email ?? "")
      .trim()
      .toLowerCase();
    if (owner !== session.email) throw new Error("Ulasan bukan milik customer ini.");
    if (Number(ratingRow.customer_edit_count ?? 0) >= 1) {
      throw new Error("Kesempatan edit ulasan sudah digunakan (maksimal 1x).");
    }

    let completedTime = ratingRow.order_completed_at
      ? new Date(ratingRow.order_completed_at).getTime()
      : 0;
    if (!completedTime && ratingRow.campaign_id) {
      const { data: campaign } = await db
        .from("campaigns")
        .select("target_reached_at, updated_at")
        .eq("id", ratingRow.campaign_id)
        .maybeSingle();
      if (campaign?.target_reached_at) {
        completedTime = new Date(campaign.target_reached_at).getTime();
      } else if (campaign?.updated_at) {
        completedTime = new Date(campaign.updated_at).getTime();
      }
    }
    if (!completedTime) completedTime = new Date(ratingRow.created_at).getTime();
    if (Date.now() > completedTime + 24 * 60 * 60 * 1000) {
      throw new Error("Batas waktu edit ulasan sudah berakhir (melebihi 1x24 jam sejak pesanan selesai).");
    }

    const patch: Record<string, unknown> = {
      stars,
      comment: data.comment?.trim() || null,
      customer_edit_count: Number(ratingRow.customer_edit_count ?? 0) + 1,
      updated_at: new Date().toISOString(),
    };
    if (!ratingRow.order_completed_at && completedTime) {
      patch["order_completed_at"] = new Date(completedTime).toISOString();
    }

    const { error } = await db
      .from("buzzer_ratings")
      .update(patch as never)
      .eq("id", ratingId);
    if (error) fail(error);

    return { ok: true as const };
  });

/* ------------------------------------------------------------------ */
/* Customer mengulas seluruh buzzer pada satu campaign                 */
/* ------------------------------------------------------------------ */

export const rateCampaignForAllBuzzersFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as { campaignId: string; stars: number; comment?: string | null },
  )
  .handler(async ({ data }) => {
    const session = await requireCustomer();
    const db = await adminClient();

    const campaignId = String(data?.campaignId ?? "").trim();
    if (!campaignId) throw new Error("ID campaign wajib diisi.");

    const { data: campaign, error: campaignError } = await db
      .from("campaigns")
      .select("customer_email")
      .eq("id", campaignId)
      .maybeSingle();
    if (campaignError) fail(campaignError);
    if (!campaign) throw new Error("Campaign tidak ditemukan.");

    const owner = String(campaign.customer_email ?? "").trim().toLowerCase();
    if (owner && owner !== session.email) {
      throw new Error("Campaign ini bukan milik akun yang sedang masuk.");
    }

    const { error } = await db.rpc("rate_campaign_for_all_buzzers", {
      p_customer_id: session.email,
      p_campaign_id: campaignId,
      p_stars: clampStars(data.stars),
      p_comment: data.comment?.trim() || null,
    });
    if (error) {
      if (error.code === "23505") throw new Error("Campaign ini sudah diulas.");
      fail(error);
    }

    return { ok: true as const };
  });
