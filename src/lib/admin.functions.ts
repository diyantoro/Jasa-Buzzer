/**
 * Server function admin.
 *
 * Semua operasi istimewa dipindahkan ke sini supaya client tidak lagi
 * menulis langsung ke tabel uang. Setiap handler memverifikasi cookie
 * sesi bertanda tangan DAN memastikan role di database masih `admin`.
 *
 * Catatan: `supabaseAdmin` WAJIB memakai secret key asli. Kalau hanya
 * publishable key, query berjalan sebagai anon dan akan ditolak policy
 * hasil migrasi 20261116000000_harden_rls_phase1.
 */
import { createServerFn } from "@tanstack/react-start";

type AdminContext = Awaited<ReturnType<typeof buildAdminContext>>;

async function buildAdminContext() {
  const { requireAdmin } = await import("./session.server");
  const session = await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return { db: supabaseAdmin as any, session };
}

function fail(error: unknown): never {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error && "message" in error
        ? String((error as { message: unknown }).message)
        : String(error);
  throw new Error(message);
}

/* ------------------------------------------------------------------ */
/* Pembayaran                                                          */
/* ------------------------------------------------------------------ */

export const adminApprovePaymentFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { paymentId: string })
  .handler(async ({ data }) => {
    const { db, session } = await buildAdminContext();
    const { error } = await db.rpc("approve_campaign_payment", {
      p_payment_id: data.paymentId,
      p_admin_email: session.email,
    });
    if (error) fail(error);
    const { writeAuditLog } = await import("./audit.server");
    await writeAuditLog({
      actor: session,
      action: "payment.approve",
      targetType: "payment",
      targetId: data.paymentId,
    });
    return { ok: true as const };
  });

export const adminRejectPaymentFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { paymentId: string; reason: string })
  .handler(async ({ data }) => {
    const { db, session } = await buildAdminContext();
    const reason = data.reason.trim();
    if (!reason) throw new Error("Alasan penolakan wajib diisi.");
    const { error } = await db.rpc("reject_campaign_payment", {
      p_payment_id: data.paymentId,
      p_reason: reason,
      p_admin_email: session.email,
    });
    if (error) fail(error);
    const { writeAuditLog } = await import("./audit.server");
    await writeAuditLog({
      actor: session,
      action: "payment.reject",
      targetType: "payment",
      targetId: data.paymentId,
      details: { reason },
    });
    return { ok: true as const };
  });

export const adminDeletePaymentFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { paymentId: string })
  .handler(async ({ data }) => {
    const { db, session } = await buildAdminContext();
    const { error } = await db.from("payments").delete().eq("id", data.paymentId);
    if (error) fail(error);
    const { writeAuditLog } = await import("./audit.server");
    await writeAuditLog({
      actor: session,
      action: "payment.delete",
      targetType: "payment",
      targetId: data.paymentId,
    });
    return { ok: true as const };
  });

export const adminUpdatePaymentFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as {
        paymentId: string;
        amount?: number;
        method?: string;
        note?: string | null;
        status?: string;
      },
  )
  .handler(async ({ data }) => {
    const { db, session } = await buildAdminContext();
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (data.amount !== undefined) patch["amount"] = data.amount;
    if (data.method !== undefined) patch["method"] = data.method;
    if (data.note !== undefined) patch["note"] = data.note;
    if (data.status !== undefined) patch["status"] = data.status;

    const { error } = await db
      .from("payments")
      .update(patch as never)
      .eq("id", data.paymentId);
    if (error) fail(error);
    const { writeAuditLog } = await import("./audit.server");
    await writeAuditLog({
      actor: session,
      action: "payment.update",
      targetType: "payment",
      targetId: data.paymentId,
      details: patch,
    });
    return { ok: true as const };
  });

/* ------------------------------------------------------------------ */
/* Pencairan                                                           */
/* ------------------------------------------------------------------ */

export const adminApproveWithdrawalFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { withdrawalId: string; note?: string; proofUrl?: string })
  .handler(async ({ data }) => {
    const { db, session } = await buildAdminContext();
    const { error } = await db.rpc("approve_withdrawal", {
      p_withdrawal_id: data.withdrawalId,
      p_admin_note: data.note ?? null,
      p_proof_url: data.proofUrl ?? null,
    });
    if (error) fail(error);
    const { writeAuditLog } = await import("./audit.server");
    await writeAuditLog({
      actor: session,
      action: "withdrawal.approve",
      targetType: "withdrawal",
      targetId: data.withdrawalId,
      details: { note: data.note ?? null, proofUrl: data.proofUrl ?? null },
    });
    return { ok: true as const };
  });

export const adminRejectWithdrawalFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { withdrawalId: string; reason: string })
  .handler(async ({ data }) => {
    const { db, session } = await buildAdminContext();
    const { error } = await db.rpc("reject_withdrawal", {
      p_withdrawal_id: data.withdrawalId,
      p_reason: data.reason ?? "",
    });
    if (error) fail(error);
    const { writeAuditLog } = await import("./audit.server");
    await writeAuditLog({
      actor: session,
      action: "withdrawal.reject",
      targetType: "withdrawal",
      targetId: data.withdrawalId,
      details: { reason: data.reason ?? "" },
    });
    return { ok: true as const };
  });

export const adminEditWithdrawalFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as {
        withdrawalId: string;
        status?: string;
        amount?: number;
        method?: string;
        accountNo?: string;
        adminNote?: string;
      },
  )
  .handler(async ({ data }) => {
    const { db, session } = await buildAdminContext();
    const { error } = await db.rpc("edit_withdrawal", {
      p_withdrawal_id: data.withdrawalId,
      p_status: data.status ?? null,
      p_amount: data.amount ?? null,
      p_method: data.method ?? null,
      p_account_no: data.accountNo ?? null,
      p_admin_note: data.adminNote ?? null,
    });
    if (error) fail(error);
    const { writeAuditLog } = await import("./audit.server");
    await writeAuditLog({
      actor: session,
      action: "withdrawal.update",
      targetType: "withdrawal",
      targetId: data.withdrawalId,
      details: {
        status: data.status ?? null,
        amount: data.amount ?? null,
        method: data.method ?? null,
        adminNote: data.adminNote ?? null,
      },
    });
    return { ok: true as const };
  });

export const adminDeleteWithdrawalFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { withdrawalId: string })
  .handler(async ({ data }) => {
    const { db, session } = await buildAdminContext();
    const { error } = await db.rpc("delete_withdrawal", {
      p_withdrawal_id: data.withdrawalId,
    });
    if (error) fail(error);
    const { writeAuditLog } = await import("./audit.server");
    await writeAuditLog({
      actor: session,
      action: "withdrawal.delete",
      targetType: "withdrawal",
      targetId: data.withdrawalId,
    });
    return { ok: true as const };
  });

/* ------------------------------------------------------------------ */
/* Job                                                                 */
/* ------------------------------------------------------------------ */

export const adminReviewJobFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as { jobId: string; status: "Review" | "Selesai"; note?: string },
  )
  .handler(async ({ data }) => {
    const { db, session } = await buildAdminContext();
    const now = new Date().toISOString();

    const { error } = await db
      .from("campaign_jobs")
      .update({
        status: data.status,
        note: data.note ?? null,
        admin_verified_at: now,
        updated_at: now,
      } as never)
      .eq("id", data.jobId);
    if (error) fail(error);

    const { error: submissionError } = await db
      .from("campaign_job_submissions")
      .update({ status: data.status, reviewed_at: now } as never)
      .eq("job_id", data.jobId)
      .eq("status", "Review");
    if (submissionError) fail(submissionError);

    const { writeAuditLog } = await import("./audit.server");
    await writeAuditLog({
      actor: session,
      action: data.status === "Selesai" ? "job.approve" : "job.review",
      targetType: "campaign_job",
      targetId: data.jobId,
      details: { status: data.status, note: data.note ?? null },
    });

    return { ok: true as const };
  });

export const adminRejectJobProofFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { jobId: string; reason: string; rejectedBy?: string })
  .handler(async ({ data }) => {
    const { db, session } = await buildAdminContext();
    const reason = data.reason.trim();
    if (!reason) throw new Error("Alasan penolakan wajib diisi.");
    const now = new Date().toISOString();
    const rejectedBy = data.rejectedBy ?? session.email;

    const { data: latest } = await db
      .from("campaign_job_submissions")
      .select("id")
      .eq("job_id", data.jobId)
      .order("submission_number", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latest?.id) {
      const { error } = await db
        .from("campaign_job_submissions")
        .update({
          status: "Ditolak",
          rejection_reason: reason,
          rejected_at: now,
          rejected_by: rejectedBy,
          reviewed_at: now,
        } as never)
        .eq("id", latest.id);
      if (error) fail(error);
    } else {
      const { data: job } = await db
        .from("campaign_jobs")
        .select("proof_url, buzzer_email")
        .eq("id", data.jobId)
        .maybeSingle();

      if (job?.proof_url) {
        const { error } = await db.from("campaign_job_submissions").insert({
          job_id: data.jobId,
          buzzer_email: job.buzzer_email ?? "",
          proof_url: job.proof_url,
          submission_number: 1,
          status: "Ditolak",
          rejection_reason: reason,
          rejected_at: now,
          rejected_by: rejectedBy,
          reviewed_at: now,
        } as never);
        if (error) fail(error);
      }
    }

    const { error } = await db
      .from("campaign_jobs")
      .update({
        status: "Revisi",
        note: reason,
        rejection_reason: reason,
        rejected_at: now,
        rejected_by: rejectedBy,
        admin_verified_at: null,
        customer_rated_at: null,
        updated_at: now,
      } as never)
      .eq("id", data.jobId);
    if (error) fail(error);

    const { writeAuditLog } = await import("./audit.server");
    await writeAuditLog({
      actor: session,
      action: "job.reject_proof",
      targetType: "campaign_job",
      targetId: data.jobId,
      details: { reason, rejectedBy },
    });

    return { ok: true as const };
  });

export const adminDeleteJobFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { jobId: string })
  .handler(async ({ data }) => {
    const { db, session } = await buildAdminContext();
    await db.from("campaign_job_submissions").delete().eq("job_id", data.jobId);
    await db.from("buzzer_ratings").delete().eq("job_id", data.jobId);
    const { error } = await db.from("campaign_jobs").delete().eq("id", data.jobId);
    if (error) fail(error);
    const { writeAuditLog } = await import("./audit.server");
    await writeAuditLog({
      actor: session,
      action: "job.delete",
      targetType: "campaign_job",
      targetId: data.jobId,
    });
    return { ok: true as const };
  });

export const adminUpdateJobFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as {
        jobId: string;
        status?: string;
        note?: string | null;
        rejection_reason?: string | null;
        admin_verified_at?: string | null;
      },
  )
  .handler(async ({ data }) => {
    const { db } = await buildAdminContext();
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (data.status !== undefined) patch["status"] = data.status;
    if (data.note !== undefined) patch["note"] = data.note;
    if (data.rejection_reason !== undefined) patch["rejection_reason"] = data.rejection_reason;
    if (data.admin_verified_at !== undefined) patch["admin_verified_at"] = data.admin_verified_at;

    const { error } = await db
      .from("campaign_jobs")
      .update(patch as never)
      .eq("id", data.jobId);
    if (error) fail(error);
    return { ok: true as const };
  });

/* ------------------------------------------------------------------ */
/* Campaign                                                            */
/* ------------------------------------------------------------------ */

export const adminRejectCampaignFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { campaignId: string; note?: string })
  .handler(async ({ data }) => {
    const { db, session } = await buildAdminContext();
    const { error } = await db
      .from("campaigns")
      .update({
        status: "Dibatalkan",
        brief: data.note ? `[Ditolak] ${data.note}` : undefined,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", data.campaignId);
    if (error) fail(error);
    const { writeAuditLog } = await import("./audit.server");
    await writeAuditLog({
      actor: session,
      action: "campaign.reject",
      targetType: "campaign",
      targetId: data.campaignId,
      details: { note: data.note ?? null },
    });
    return { ok: true as const };
  });

export const adminCompleteCampaignFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { campaignId: string })
  .handler(async ({ data }) => {
    const { db, session } = await buildAdminContext();
    const { data: campaign, error } = await db
      .from("campaigns")
      .select("status, payment_status, target_reached_at")
      .eq("id", data.campaignId)
      .single();
    if (error) fail(error);
    if (!campaign) throw new Error("Kampanye tidak ditemukan.");
    if (campaign.payment_status !== "Pembayaran Disetujui") {
      throw new Error("Pembayaran campaign belum disetujui.");
    }
    if (campaign.status === "Selesai") return { ok: true as const };

    const { error: updateError } = await db
      .from("campaigns")
      .update({
        status: "Selesai",
        target_reached_at: campaign.target_reached_at ?? new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", data.campaignId)
      .neq("status", "Dibatalkan");
    if (updateError) fail(updateError);
    const { writeAuditLog } = await import("./audit.server");
    await writeAuditLog({
      actor: session,
      action: "campaign.complete",
      targetType: "campaign",
      targetId: data.campaignId,
    });
    return { ok: true as const };
  });

export const adminUpdateCampaignFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as { campaignId: string; title: string; brief: string; deadline: string },
  )
  .handler(async ({ data }) => {
    const { db, session } = await buildAdminContext();
    const title = data.title.trim();
    if (!title) throw new Error("Judul kampanye wajib diisi.");

    const { data: current, error } = await db
      .from("campaigns")
      .select("brief")
      .eq("id", data.campaignId)
      .single();
    if (error) fail(error);
    if (!current) throw new Error("Kampanye tidak ditemukan.");

    const { error: updateError } = await db
      .from("campaigns")
      .update({
        title,
        brief: data.brief,
        deadline: data.deadline,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", data.campaignId);
    if (updateError) fail(updateError);

    await db
      .from("campaign_jobs")
      .update({ campaign_title: title, deadline: data.deadline } as never)
      .eq("campaign_id", data.campaignId);

    const oldBrief = (current as { brief?: string | null }).brief ?? "";
    if (oldBrief !== data.brief) {
      await db
        .from("campaign_jobs")
        .update({ brief: data.brief } as never)
        .eq("campaign_id", data.campaignId)
        .eq("brief", oldBrief);
    }

    const { writeAuditLog } = await import("./audit.server");
    await writeAuditLog({
      actor: session,
      action: "campaign.update",
      targetType: "campaign",
      targetId: data.campaignId,
      details: { title, deadline: data.deadline },
    });

    return { ok: true as const };
  });

export const adminDeleteCampaignFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { campaignId: string })
  .handler(async ({ data }) => {
    const { db, session } = await buildAdminContext();

    const { data: jobs } = await db
      .from("campaign_jobs")
      .select("id")
      .eq("campaign_id", data.campaignId);
    const jobIds = ((jobs ?? []) as Array<{ id: string }>).map((job) => job.id);

    if (jobIds.length > 0) {
      await db.from("campaign_job_submissions").delete().in("job_id", jobIds);
      await db.from("buzzer_ratings").delete().in("job_id", jobIds);
    }
    await db.from("buzzer_ratings").delete().eq("campaign_id", data.campaignId);
    await db.from("campaign_messages").delete().eq("campaign_id", data.campaignId);
    await db.from("campaign_jobs").delete().eq("campaign_id", data.campaignId);
    await db.from("payments").update({ campaign_id: null } as never).eq("campaign_id", data.campaignId);

    const { error } = await db.from("campaigns").delete().eq("id", data.campaignId);
    if (error) fail(error);
    const { writeAuditLog } = await import("./audit.server");
    await writeAuditLog({
      actor: session,
      action: "campaign.delete",
      targetType: "campaign",
      targetId: data.campaignId,
      details: { deletedJobs: jobIds.length },
    });
    return { ok: true as const };
  });

/* ------------------------------------------------------------------ */
/* Rate card & katalog                                                 */
/* ------------------------------------------------------------------ */

export const adminSavePricingFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as {
        id?: string | null;
        platform: string;
        serviceType: string;
        buzzerTier: string;
        pricePerBuzzer: number;
        status: string;
      },
  )
  .handler(async ({ data }) => {
    const { db } = await buildAdminContext();
    const row = {
      platform: data.platform,
      service_type: data.serviceType,
      buzzer_tier: data.buzzerTier,
      price_per_buzzer: data.pricePerBuzzer,
      status: data.status,
      updated_at: new Date().toISOString(),
    };

    if (data.id) {
      const { error } = await db.from("service_pricing").update(row as never).eq("id", data.id);
      if (error) fail(error);
    } else {
      const { error } = await db.from("service_pricing").insert(row as never);
      if (error) fail(error);
    }
    return { ok: true as const };
  });

export const adminDeletePricingFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id: string })
  .handler(async ({ data }) => {
    const { db } = await buildAdminContext();
    const { error } = await db.from("service_pricing").delete().eq("id", data.id);
    if (error) fail(error);
    return { ok: true as const };
  });

export const adminSaveCatalogFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id?: string | null; values: Record<string, unknown> })
  .handler(async ({ data }) => {
    const { db } = await buildAdminContext();
    const values = { ...data.values, updated_at: new Date().toISOString() };
    if (data.id) {
      const { error } = await db.from("service_catalogs").update(values as never).eq("id", data.id);
      if (error) fail(error);
    } else {
      const { error } = await db.from("service_catalogs").insert(values as never);
      if (error) fail(error);
    }
    return { ok: true as const };
  });

export const adminDeleteCatalogFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id: string })
  .handler(async ({ data }) => {
    const { db } = await buildAdminContext();
    await db.from("catalog_packages").delete().eq("catalog_id", data.id);
    await db.from("campaigns").update({ catalog_id: null } as never).eq("catalog_id", data.id);
    const { error } = await db.from("service_catalogs").delete().eq("id", data.id);
    if (error) fail(error);
    return { ok: true as const };
  });

export const adminSaveCatalogPackageFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id?: string | null; values: Record<string, unknown> })
  .handler(async ({ data }) => {
    const { db } = await buildAdminContext();
    const values = { ...data.values, updated_at: new Date().toISOString() };
    if (data.id) {
      const { error } = await db.from("catalog_packages").update(values as never).eq("id", data.id);
      if (error) fail(error);
    } else {
      const { error } = await db.from("catalog_packages").insert(values as never);
      if (error) fail(error);
    }
    return { ok: true as const };
  });

export const adminDeleteCatalogPackageFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id: string })
  .handler(async ({ data }) => {
    const { db } = await buildAdminContext();
    const { error } = await db.from("catalog_packages").delete().eq("id", data.id);
    if (error) fail(error);
    return { ok: true as const };
  });

/* ------------------------------------------------------------------ */
/* Level & pembukuan                                                   */
/* ------------------------------------------------------------------ */

export const adminUpdateLevelFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as { name: string; payoutPercentage?: number; payoutPerJob?: number },
  )
  .handler(async ({ data }) => {
    const { db, session } = await buildAdminContext();
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (data.payoutPercentage !== undefined) patch["payout_percentage"] = data.payoutPercentage;
    if (data.payoutPerJob !== undefined) patch["payout_per_job"] = data.payoutPerJob;

    const { error } = await db.from("buzzer_levels").update(patch as never).eq("name", data.name);
    if (error) fail(error);
    const { writeAuditLog } = await import("./audit.server");
    await writeAuditLog({
      actor: session,
      action: "level.update",
      targetType: "buzzer_level",
      targetId: data.name,
      details: patch,
    });
    return { ok: true as const };
  });

/**
 * Admin menetapkan level buzzer berdasarkan followers terverifikasi.
 * Level menentukan persentase payout, jadi hanya admin yang boleh menulis.
 */
export const adminAssignLevelFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as { email: string; name?: string; verifiedFollowers: number },
  )
  .handler(async ({ data }) => {
    const { db, session } = await buildAdminContext();
    const email = data.email.trim().toLowerCase();
    if (!email) throw new Error("Email buzzer wajib diisi.");

    const followers = Math.max(0, Math.floor(Number(data.verifiedFollowers) || 0));
    const now = new Date().toISOString();

    const { data: levels, error: levelError } = await db
      .from("buzzer_levels")
      .select("name, min_followers, max_followers, sort_order")
      .order("sort_order", { ascending: true });
    if (levelError) fail(levelError);

    const rows = (levels ?? []) as Array<{
      name: string;
      min_followers: number | null;
      max_followers: number | null;
    }>;
    const matched =
      rows.find((row) => {
        const min = Number(row.min_followers ?? 0);
        const max = row.max_followers === null ? null : Number(row.max_followers);
        return followers >= min && (max === null || followers <= max);
      }) ?? rows[0];
    const levelName = matched?.name ?? "Bronze";

    const { data: wallet } = await db
      .from("buzzer_wallets")
      .select("buzzer_email")
      .eq("buzzer_email", email)
      .maybeSingle();

    if (wallet) {
      const { error } = await db
        .from("buzzer_wallets")
        .update({
          level: levelName,
          verified_followers: followers,
          level_assigned_at: now,
          updated_at: now,
        } as never)
        .eq("buzzer_email", email);
      if (error) fail(error);
    } else {
      const { error } = await db.from("buzzer_wallets").insert({
        buzzer_email: email,
        buzzer_name: (data.name ?? "").trim() || email.split("@")[0],
        level: levelName,
        verified_followers: followers,
        followers,
        level_assigned_at: now,
        updated_at: now,
      } as never);
      if (error) fail(error);
    }

    const { writeAuditLog } = await import("./audit.server");
    await writeAuditLog({
      actor: session,
      action: "buzzer.level_assign",
      targetType: "buzzer_wallet",
      targetId: email,
      details: { level: levelName, verifiedFollowers: followers },
    });

    return { ok: true as const, level: levelName };
  });

export const adminUpdateOfflinePayoutFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { campaignId: string; payoutPerBuzzer: number })
  .handler(async ({ data }) => {
    const { db, session } = await buildAdminContext();
    const { error } = await db.rpc("update_offline_campaign_payout", {
      p_campaign_id: data.campaignId,
      p_payout_per_buzzer: data.payoutPerBuzzer,
    });
    if (error) fail(error);
    const { writeAuditLog } = await import("./audit.server");
    await writeAuditLog({
      actor: session,
      action: "campaign.update_payout",
      targetType: "campaign",
      targetId: data.campaignId,
      details: { payoutPerBuzzer: data.payoutPerBuzzer },
    });
    return { ok: true as const };
  });

export const adminRecalculateWalletFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as Record<string, never> | undefined)
  .handler(async () => {
    const { db } = await buildAdminContext();
    const { error } = await db.rpc("recalculate_admin_wallet");
    if (error) fail(error);
    return { ok: true as const };
  });

/* ------------------------------------------------------------------ */
/* Rekening admin                                                      */
/* ------------------------------------------------------------------ */

export const adminSaveBankAccountsFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as {
        accounts: Array<{
          id: string;
          bankName: string;
          accountNumber: string;
          accountHolder: string;
          isActive: boolean;
        }>;
      },
  )
  .handler(async ({ data }) => {
    const { db } = await buildAdminContext();
    const rows = (data.accounts ?? []).map((account) => ({
      id: account.id,
      bank_name: account.bankName,
      account_number: account.accountNumber,
      account_holder: account.accountHolder,
      is_active: account.isActive,
      updated_at: new Date().toISOString(),
    }));

    if (rows.length === 0) {
      const { error } = await db.from("admin_bank_accounts").delete().neq("id", "");
      if (error) fail(error);
      return { ok: true as const };
    }

    const { error } = await db
      .from("admin_bank_accounts")
      .upsert(rows as never, { onConflict: "id" });
    if (error) fail(error);
    return { ok: true as const };
  });

export const adminDeleteBankAccountFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id: string })
  .handler(async ({ data }) => {
    const { db } = await buildAdminContext();
    const { error } = await db.from("admin_bank_accounts").delete().eq("id", data.id);
    if (error) fail(error);
    return { ok: true as const };
  });

/* ------------------------------------------------------------------ */
/* Dompet admin                                                        */
/* ------------------------------------------------------------------ */

export const adminSaveWalletFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as {
        balance: number;
        totalRevenue: number;
        totalBuzzerPayout: number;
        totalIncoming: number;
        completedJobsCount: number;
      },
  )
  .handler(async ({ data }) => {
    const { db } = await buildAdminContext();
    const { error } = await db.from("admin_wallet").upsert(
      {
        id: "primary",
        balance: data.balance,
        total_revenue: data.totalRevenue,
        total_buzzer_payout: data.totalBuzzerPayout,
        total_incoming: data.totalIncoming,
        completed_jobs_count: data.completedJobsCount,
        updated_at: new Date().toISOString(),
      } as never,
      { onConflict: "id" },
    );
    if (error) fail(error);
    return { ok: true as const };
  });

export const adminRequestWalletWithdrawalFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as {
        id: string;
        amount: number;
        method: string;
        provider: string;
        accountNo: string;
        status: string;
        createdAt: string;
      },
  )
  .handler(async ({ data }) => {
    const { db } = await buildAdminContext();
    const { error } = await db.from("admin_withdrawals").insert({
      id: data.id,
      amount: data.amount,
      method: data.method,
      provider: data.provider,
      account_no: data.accountNo,
      status: data.status,
      created_at: data.createdAt,
    } as never);
    if (error) fail(error);
    return { ok: true as const };
  });

export const adminCreateCampaignFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as {
        title: string;
        platform: string;
        serviceType: string;
        pricePerSlot: number;
        slots: number;
        deadline: string;
        brief: string;
        thumbnailUrl: string;
        customerEmail: string;
        customerName: string;
      },
  )
  .handler(async ({ data }) => {
    const { db } = await buildAdminContext();
    const { error } = await db.rpc("create_admin_campaign", {
      p_title: data.title,
      p_platform: data.platform,
      p_service_type: data.serviceType,
      p_price_per_slot: data.pricePerSlot,
      p_slots: data.slots,
      p_deadline: data.deadline,
      p_brief: data.brief,
      p_thumbnail_url: data.thumbnailUrl,
      p_customer_email: data.customerEmail,
      p_customer_name: data.customerName,
    });
    if (error) fail(error);
    return { ok: true as const };
  });

/* ------------------------------------------------------------------ */
/* Akun                                                                */
/* ------------------------------------------------------------------ */

export const adminUpdateAccountFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as { email: string; role?: string | null; name?: string | null; phone?: string | null },
  )
  .handler(async ({ data }) => {
    const { db, session } = await buildAdminContext();
    const { error } = await db.rpc("admin_update_account", {
      p_email: data.email,
      p_role: data.role ?? null,
      p_name: data.name ?? null,
      p_phone: data.phone ?? null,
    });
    if (error) fail(error);
    const { writeAuditLog } = await import("./audit.server");
    await writeAuditLog({
      actor: session,
      action: "account.update",
      targetType: "app_account",
      targetId: String(data.email ?? "").trim().toLowerCase(),
      details: { role: data.role ?? null, name: data.name ?? null },
    });
    return { ok: true as const };
  });

export const adminListAccountsFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { role?: string } | undefined)
  .handler(async ({ data }) => {
    const { db } = await buildAdminContext();
    let query = db
      .from("app_accounts")
      .select(
        "email, name, role, phone, city, bio, company, industry, username, platform, followers, avatar_url, buzzer_category, rating, total_reviews, created_at, updated_at",
      )
      .order("created_at", { ascending: false });

    if (data?.role) query = query.eq("role", data.role);
    const { data: rows, error } = await query;
    if (error) fail(error);
    return { ok: true as const, accounts: rows ?? [] };
  });

/** Patch kolom profil akun dari panel admin (whitelist kolom). */
export const adminPatchAccountFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as { email: string; patch: Record<string, string | number | null> },
  )
  .handler(async ({ data }) => {
    const { db, session } = await buildAdminContext();
    const allowed = new Set([
      "name",
      "role",
      "phone",
      "city",
      "bio",
      "company",
      "industry",
      "username",
      "platform",
      "followers",
      "avatar_url",
      "buzzer_category",
    ]);
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const [key, value] of Object.entries(data.patch ?? {})) {
      if (allowed.has(key)) patch[key] = value;
    }
    if (Object.keys(patch).length === 1) {
      throw new Error("Tidak ada kolom yang bisa diperbarui.");
    }

    const { error } = await db
      .from("app_accounts")
      .update(patch as never)
      .eq("email", data.email.trim().toLowerCase());
    if (error) fail(error);
    const { writeAuditLog } = await import("./audit.server");
    await writeAuditLog({
      actor: session,
      action: "account.patch",
      targetType: "app_account",
      targetId: data.email.trim().toLowerCase(),
      details: patch,
    });
    return { ok: true as const };
  });

export const adminDeleteAccountFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { email: string; role: "customer" | "buzzer" })
  .handler(async ({ data }) => {
    const { db, session } = await buildAdminContext();
    const { error } = await db.rpc("delete_management_account", {
      p_email: data.email,
      p_role: data.role,
    });
    if (error) fail(error);
    const { writeAuditLog } = await import("./audit.server");
    await writeAuditLog({
      actor: session,
      action: "account.delete",
      targetType: "app_account",
      targetId: String(data.email ?? "").trim().toLowerCase(),
      details: { role: data.role },
    });
    return { ok: true as const };
  });

/* ------------------------------------------------------------------ */
/* Rating buzzer (admin)                                               */
/* ------------------------------------------------------------------ */

export const adminUpdateBuzzerRatingFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as { id: string; stars: number; comment?: string | null },
  )
  .handler(async ({ data }) => {
    const { db, session } = await buildAdminContext();
    const stars = Math.min(5, Math.max(1, Math.round(Number(data.stars) || 0)));
    const { error } = await db.rpc("update_admin_buzzer_rating", {
      p_rating_id: data.id,
      p_admin_email: session.email,
      p_stars: stars,
      p_comment: data.comment?.trim() || null,
    });
    if (error) fail(error);
    const { writeAuditLog } = await import("./audit.server");
    await writeAuditLog({
      actor: session,
      action: "rating.update",
      targetType: "buzzer_rating",
      targetId: data.id,
      details: { stars, comment: data.comment?.trim() || null },
    });
    return { ok: true as const };
  });

export const adminDeleteBuzzerRatingFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id: string })
  .handler(async ({ data }) => {
    const { db, session } = await buildAdminContext();
    const { error } = await db.rpc("delete_admin_buzzer_rating", {
      p_rating_id: data.id,
      p_admin_email: session.email,
    });
    if (error) fail(error);
    const { writeAuditLog } = await import("./audit.server");
    await writeAuditLog({
      actor: session,
      action: "rating.delete",
      targetType: "buzzer_rating",
      targetId: data.id,
    });
    return { ok: true as const };
  });

/* ------------------------------------------------------------------ */
/* Ledger aktivitas keuangan                                           */
/* ------------------------------------------------------------------ */

/**
 * Hapus satu baris `finance_activity` berdasarkan `ref_id`.
 * Sejak Fase 1 tabel ledger tidak bisa ditulis/dihapus client.
 */
export const adminDeleteFinanceActivityFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { refId: string })
  .handler(async ({ data }) => {
    const { db } = await buildAdminContext();
    const refId = String(data?.refId ?? "").trim();
    if (!refId) throw new Error("ref_id wajib diisi.");
    const { error } = await db.from("finance_activity").delete().eq("ref_id", refId);
    if (error) fail(error);
    return { ok: true as const };
  });

export type AdminServerFnContext = AdminContext;
