/**
 * Server function pesan campaign & support (`campaign_messages`).
 *
 * Fase 2b: tabel ini tidak lagi bisa ditulis dari browser. Pengirim
 * (`from_email` / `from_role`) selalu diambil dari sesi bertanda tangan,
 * sehingga client tidak bisa memalsukan identitas pengirim.
 */
import { createServerFn } from "@tanstack/react-start";

export const SUPPORT_ADMIN_EMAIL = "admin@buzzhub.id";

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
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error && "message" in error
        ? String((error as { message: unknown }).message)
        : String(error);
  throw new Error(message);
}

/** Pastikan sesi berhak mengirim pesan pada campaign tertentu. */
async function assertCampaignAccess(session: Session, campaignId: string) {
  if (session.role === "admin") return;

  const db = await adminClient();
  const { data: campaign, error } = await db
    .from("campaigns")
    .select("customer_email")
    .eq("id", campaignId)
    .maybeSingle();
  if (error) fail(error);
  if (!campaign) throw new Error("Campaign tidak ditemukan.");

  const owner = String(campaign.customer_email ?? "").trim().toLowerCase();
  if (session.role === "customer" && owner === session.email) return;

  if (session.role === "buzzer") {
    const { data: job, error: jobError } = await db
      .from("campaign_jobs")
      .select("id")
      .eq("campaign_id", campaignId)
      .eq("buzzer_email", session.email)
      .limit(1)
      .maybeSingle();
    if (jobError) fail(jobError);
    if (job) return;
  }

  throw new Error("Akun ini tidak terlibat dalam campaign tersebut.");
}

export const sendCampaignMessageFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as {
        campaignId?: string | null;
        toEmail?: string;
        body: string;
      },
  )
  .handler(async ({ data }) => {
    const session = await currentSession();
    if (!session) throw new Error("Sesi tidak ditemukan. Silakan masuk ulang.");

    const body = String(data?.body ?? "").trim();
    if (!body) throw new Error("Pesan tidak boleh kosong.");

    const campaignId = data.campaignId ? String(data.campaignId).trim() : null;
    if (campaignId) await assertCampaignAccess(session, campaignId);

    const toEmail = String(data.toEmail ?? "").trim().toLowerCase();
    if (session.role === "admin" && !toEmail) {
      throw new Error("Penerima pesan wajib diisi.");
    }

    const db = await adminClient();
    const { data: profile } = await db
      .from("app_accounts")
      .select("name")
      .eq("email", session.email)
      .maybeSingle();

    const { data: inserted, error } = await db
      .from("campaign_messages")
      .insert({
        campaign_id: campaignId,
        from_role: session.role,
        from_name: String(profile?.name ?? "").trim() || session.email.split("@")[0],
        from_email: session.email,
        to_email: toEmail || SUPPORT_ADMIN_EMAIL,
        body,
        read_at: null,
      } as never)
      .select("*")
      .single();
    if (error) fail(error);

    return { ok: true as const, message: inserted };
  });

export const markSupportMessagesReadFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { threadEmail?: string | null })
  .handler(async ({ data }) => {
    const session = await currentSession();
    if (!session) throw new Error("Sesi tidak ditemukan. Silakan masuk ulang.");

    const db = await adminClient();
    let builder = db
      .from("campaign_messages")
      .update({ read_at: new Date().toISOString() } as never)
      .is("campaign_id", null)
      .is("read_at", null);

    if (session.role === "admin") {
      builder = builder.neq("from_role", "admin");
      const threadEmail = String(data?.threadEmail ?? "").trim().toLowerCase();
      if (threadEmail) builder = builder.eq("from_email", threadEmail);
    } else {
      builder = builder.eq("from_role", "admin").eq("to_email", session.email);
    }

    const { error } = await builder;
    if (error) fail(error);

    return { ok: true as const };
  });
