/**
 * Server function sisi buzzer.
 *
 * RPC jembatan Fase 1 (`request_withdrawal`, `submit_job_proof`,
 * `update_profile`) tidak lagi dipanggil langsung dari browser. Fungsi di
 * sini membaca cookie sesi bertanda tangan, lalu memanggil RPC memakai
 * service_role dengan email dari sesi — bukan email kiriman client.
 *
 * Dengan begitu, walau pun belum ada Supabase Auth, client tidak bisa
 * mengaku sebagai buzzer lain.
 */
import { createServerFn } from "@tanstack/react-start";
import { describeDbError } from "./db-error";

async function requireSessionEmail() {
  const { getServerSession } = await import("./session.server");
  const session = await getServerSession();
  if (!session) throw new Error("Sesi tidak ditemukan. Silakan masuk ulang.");
  return session;
}

export const requestWithdrawalFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as { buzzerName: string; amount: number; method: string; accountNo: string },
  )
  .handler(async ({ data }) => {
    const session = await requireSessionEmail();
    if (session.role !== "buzzer") {
      throw new Error("Hanya akun buzzer yang bisa mengajukan pencairan.");
    }

    const { enforceRateLimit, RATE_LIMITS } = await import("./rate-limit.server");
    enforceRateLimit(
      `request-withdrawal:${session.email}`,
      RATE_LIMITS.requestWithdrawal.limit,
      RATE_LIMITS.requestWithdrawal.windowMs,
    );

    const { supabaseAdmin: adminClient } = await import(
      "@/integrations/supabase/client.server"
    );
    const supabaseAdmin = adminClient as any;

    const { data: withdrawalId, error } = await supabaseAdmin.rpc("request_withdrawal", {
      p_buzzer_email: session.email,
      p_buzzer_name: data.buzzerName,
      p_amount: data.amount,
      p_method: data.method,
      p_account_no: data.accountNo,
    });
    if (error) throw new Error(describeDbError(error));

    return { ok: true as const, withdrawalId: withdrawalId as string | null };
  });

export const submitJobProofFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { jobId: string; proofUrl: string })
  .handler(async ({ data }) => {
    const session = await requireSessionEmail();

    const { supabaseAdmin: adminClient } = await import(
      "@/integrations/supabase/client.server"
    );
    const supabaseAdmin = adminClient as any;

    const { data: job, error: jobError } = await supabaseAdmin
      .from("campaign_jobs")
      .select("buzzer_email")
      .eq("id", data.jobId)
      .maybeSingle();
    if (jobError) throw new Error(describeDbError(jobError));
    if (!job) throw new Error("Job tidak ditemukan.");

    const owner = String(job.buzzer_email ?? "").trim().toLowerCase();
    if (session.role !== "admin" && owner !== session.email) {
      throw new Error("Job ini bukan milik akun yang sedang masuk.");
    }

    const { error } = await supabaseAdmin.rpc("submit_job_proof", {
      p_job_id: data.jobId,
      p_buzzer_email: owner,
      p_proof_url: data.proofUrl,
    });
    if (error) throw new Error(describeDbError(error));

    return { ok: true as const };
  });

export const updateOwnProfileFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as {
        name?: string | null;
        phone?: string | null;
        city?: string | null;
        bio?: string | null;
        company?: string | null;
        industry?: string | null;
        username?: string | null;
        platform?: string | null;
        avatarUrl?: string | null;
        buzzerCategory?: string | null;
      },
  )
  .handler(async ({ data }) => {
    const session = await requireSessionEmail();

    const { supabaseAdmin: adminClient } = await import(
      "@/integrations/supabase/client.server"
    );
    const supabaseAdmin = adminClient as any;

    const { data: updated, error } = await supabaseAdmin.rpc("update_profile", {
      p_email: session.email,
      p_name: data.name ?? null,
      p_phone: data.phone ?? null,
      p_city: data.city ?? null,
      p_bio: data.bio ?? null,
      p_company: data.company ?? null,
      p_industry: data.industry ?? null,
      p_username: data.username ?? null,
      p_platform: data.platform ?? null,
      p_avatar_url: data.avatarUrl ?? null,
      p_buzzer_category: data.buzzerCategory ?? null,
    });
    if (error) throw new Error(describeDbError(error));

    // Akun lama yang belum punya baris app_accounts tetap bisa menyimpan
    // profil lewat tabel pendaftaran. Ditulis server, bukan dari browser.
    if (!updated) {
      const applicationPatch: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (data.name !== undefined && data.name !== null) applicationPatch["name"] = data.name;
      if (data.phone !== undefined) applicationPatch["phone"] = data.phone;
      if (data.city !== undefined) applicationPatch["city"] = data.city;
      if (data.username !== undefined) applicationPatch["username"] = data.username;
      if (data.platform !== undefined) applicationPatch["platform"] = data.platform;
      if (data.bio !== undefined) applicationPatch["bio"] = data.bio;
      if (data.buzzerCategory !== undefined && data.buzzerCategory !== null) {
        applicationPatch["buzzer_category"] = data.buzzerCategory;
      }

      let fallbackError: any = null;
      ({ error: fallbackError } = await supabaseAdmin
        .from("buzzer_applications")
        .update(applicationPatch as never)
        .eq("email", session.email)
        .eq("status", "approved"));
      if (fallbackError && /buzzer_category/i.test(String(fallbackError.message ?? ""))) {
        const fallback = { ...applicationPatch };
        delete fallback["buzzer_category"];
        ({ error: fallbackError } = await supabaseAdmin
          .from("buzzer_applications")
          .update(fallback as never)
          .eq("email", session.email)
          .eq("status", "approved"));
      }
      if (fallbackError) throw new Error(fallbackError.message || "Gagal menyimpan profil.");
    }

    return { ok: true as const, updated: Boolean(updated) };
  });

/**
 * Buzzer mengambil job. Email diambil dari sesi bertanda tangan, bukan dari
 * kiriman client, dan RPC `claim_campaign_job` hanya boleh dieksekusi
 * service_role.
 */
export const claimCampaignJobFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { jobId: string; buzzerName: string })
  .handler(async ({ data }) => {
    const session = await requireSessionEmail();
    if (session.role !== "buzzer") {
      throw new Error("Hanya akun buzzer yang bisa mengambil job.");
    }

    const jobId = String(data?.jobId ?? "").trim();
    if (!jobId) throw new Error("ID job wajib diisi.");

    const { supabaseAdmin: adminClient } = await import(
      "@/integrations/supabase/client.server"
    );
    const supabaseAdmin = adminClient as any;

    const { error } = await supabaseAdmin.rpc("claim_campaign_job", {
      p_job_id: jobId,
      p_buzzer_email: session.email,
      p_buzzer_name: String(data?.buzzerName ?? "").trim(),
    });
    if (error) throw new Error(describeDbError(error));

    return { ok: true as const };
  });
