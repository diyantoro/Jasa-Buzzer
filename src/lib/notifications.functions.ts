/**
 * Server function notifikasi (`notifications`).
 *
 * Fase 2b: tabel ini tidak lagi bisa ditulis dari browser. Aturan akses:
 *
 *   * pengguna hanya boleh membuat/menandai/menghapus notifikasi untuk dirinya;
 *   * admin boleh mengirim notifikasi ke siapa pun (mis. hasil review pesanan);
 *   * customer/buzzer boleh mengirim notifikasi ke akun admin (mis. pesanan baru).
 */
import { createServerFn } from "@tanstack/react-start";
import { describeDbError } from "./db-error";

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

function normalizeEmail(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

async function assertCanTarget(session: Session, target: string) {
  if (session.role === "admin") return;
  if (target === session.email) return;

  // Customer/buzzer boleh mengirim notifikasi ke admin (mis. pesanan baru).
  const db = await adminClient();
  const { data, error } = await db
    .from("app_accounts")
    .select("role")
    .eq("email", target)
    .maybeSingle();
  if (error) fail(error);
  if (data?.role === "admin") return;

  throw new Error("Tidak boleh membuat notifikasi untuk akun lain.");
}

export const createNotificationFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as {
        id?: string;
        user_id: string;
        buzzer_id?: string;
        title: string;
        message: string;
        type?: string;
        metadata?: Record<string, unknown>;
      },
  )
  .handler(async ({ data }) => {
    const session = await currentSession();
    if (!session) throw new Error("Sesi tidak ditemukan. Silakan masuk ulang.");

    const target = normalizeEmail(data?.user_id);
    const title = String(data?.title ?? "").trim();
    const message = String(data?.message ?? "").trim();
    if (!target || !title || !message) {
      throw new Error("Penerima, judul, dan pesan notifikasi wajib diisi.");
    }
    await assertCanTarget(session, target);

    const now = new Date().toISOString();
    const row = {
      id: data.id || crypto.randomUUID(),
      user_id: target,
      buzzer_id: normalizeEmail(data.buzzer_id) || target,
      title,
      message,
      type: String(data.type ?? "general"),
      is_read: false,
      metadata: data.metadata ?? {},
      created_at: now,
      updated_at: now,
    };

    const db = await adminClient();
    const { error } = await db.from("notifications").insert(row as never);
    if (error) fail(error);

    return { ok: true as const, id: row.id };
  });

export const markNotificationReadFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id: string })
  .handler(async ({ data }) => {
    const session = await currentSession();
    if (!session) throw new Error("Sesi tidak ditemukan. Silakan masuk ulang.");

    const id = String(data?.id ?? "").trim();
    if (!id) throw new Error("ID notifikasi wajib diisi.");

    const db = await adminClient();
    const { data: row, error: readError } = await db
      .from("notifications")
      .select("id, user_id, buzzer_id")
      .eq("id", id)
      .maybeSingle();
    if (readError) fail(readError);
    if (!row) return { ok: true as const };

    const owners = [normalizeEmail(row.user_id), normalizeEmail(row.buzzer_id)];
    if (session.role !== "admin" && !owners.includes(session.email)) {
      throw new Error("Notifikasi ini bukan milik akun yang sedang masuk.");
    }

    const { error } = await db
      .from("notifications")
      .update({ is_read: true, updated_at: new Date().toISOString() } as never)
      .eq("id", id);
    if (error) fail(error);

    return { ok: true as const };
  });

export const markAllNotificationsReadFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as unknown)
  .handler(async () => {
    const session = await currentSession();
    if (!session) throw new Error("Sesi tidak ditemukan. Silakan masuk ulang.");

    const db = await adminClient();
    const now = new Date().toISOString();
    const { error: userError } = await db
      .from("notifications")
      .update({ is_read: true, updated_at: now } as never)
      .eq("user_id", session.email)
      .eq("is_read", false);
    if (userError) fail(userError);

    const { error: buzzerError } = await db
      .from("notifications")
      .update({ is_read: true, updated_at: now } as never)
      .eq("buzzer_id", session.email)
      .eq("is_read", false);
    if (buzzerError) fail(buzzerError);

    return { ok: true as const };
  });

export const deleteNotificationFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id: string })
  .handler(async ({ data }) => {
    const session = await currentSession();
    if (!session) throw new Error("Sesi tidak ditemukan. Silakan masuk ulang.");

    const id = String(data?.id ?? "").trim();
    if (!id) throw new Error("ID notifikasi wajib diisi.");

    const db = await adminClient();
    const { data: row, error: readError } = await db
      .from("notifications")
      .select("id, user_id, buzzer_id")
      .eq("id", id)
      .maybeSingle();
    if (readError) fail(readError);
    if (!row) return { ok: true as const };

    const owners = [normalizeEmail(row.user_id), normalizeEmail(row.buzzer_id)];
    if (session.role !== "admin" && !owners.includes(session.email)) {
      throw new Error("Notifikasi ini bukan milik akun yang sedang masuk.");
    }

    const { error } = await db.from("notifications").delete().eq("id", id);
    if (error) fail(error);

    return { ok: true as const };
  });

/**
 * Hapus notifikasi "menunggu/diverifikasi" untuk campaign tertentu milik
 * pengguna yang sedang masuk. Dipakai saat status pesanan berubah.
 */
export const deletePendingNotificationsFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { campaignName: string })
  .handler(async ({ data }) => {
    const session = await currentSession();
    if (!session) throw new Error("Sesi tidak ditemukan. Silakan masuk ulang.");

    const campaignName = String(data?.campaignName ?? "").trim();
    if (!campaignName) return { ok: true as const, deleted: 0 };

    const db = await adminClient();
    const { data: rows, error: readError } = await db
      .from("notifications")
      .select("id, title, message")
      .eq("user_id", session.email);
    if (readError) fail(readError);

    const needle = campaignName.toLowerCase();
    const ids = ((rows ?? []) as Array<{ id: string; title?: string | null; message?: string | null }>)
      .filter((row) => {
        const title = String(row.title ?? "").toLowerCase();
        const message = String(row.message ?? "").toLowerCase();
        const pending = title.includes("menunggu") || title.includes("diverifikasi");
        return pending && message.includes(needle);
      })
      .map((row) => row.id);

    if (ids.length === 0) return { ok: true as const, deleted: 0 };

    const { error } = await db.from("notifications").delete().in("id", ids);
    if (error) fail(error);

    return { ok: true as const, deleted: ids.length };
  });

/* ------------------------------------------------------------------ */
/* Notifikasi finance (admin)                                          */
/* ------------------------------------------------------------------ */

async function requireAdminSession(): Promise<Session> {
  const session = await currentSession();
  if (!session) throw new Error("Sesi tidak ditemukan. Silakan masuk ulang.");
  if (session.role !== "admin") throw new Error("Akses ditolak: hanya admin.");
  return session;
}

export const markFinanceNotificationReadFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id: string })
  .handler(async ({ data }) => {
    await requireAdminSession();
    const id = String(data?.id ?? "").trim();
    if (!id) throw new Error("ID notifikasi wajib diisi.");

    const db = await adminClient();
    const { error } = await db.rpc("mark_finance_notification_read", { p_id: id });
    if (error) fail(error);

    return { ok: true as const };
  });

export const markAllFinanceNotificationsReadFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as unknown)
  .handler(async () => {
    await requireAdminSession();

    const db = await adminClient();
    const { error } = await db.rpc("mark_all_finance_notifications_read");
    if (error) fail(error);

    return { ok: true as const };
  });
