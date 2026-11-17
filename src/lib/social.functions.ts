/**
 * Server function untuk akun media sosial buzzer (Fase 2).
 *
 * Sejak migration `20261116000002_harden_rls_phase2_accounts.sql`,
 * `social_accounts` tidak bisa ditulis langsung dari client. Semua mutasi
 * di sini berjalan dengan `service_role` dan memvalidasi sesi:
 *
 *   * buzzer hanya boleh menyentuh baris miliknya sendiri;
 *   * kolom yang menentukan peringkat/level (`verification`, `followers`,
 *     `is_active`) TIDAK bisa diubah dari sisi buzzer — hanya admin.
 *
 * Pendaftaran awal (belum login) memakai `submitSocialAccountsFn` yang
 * memaksa status `Menunggu` + `is_active = false`, sehingga tidak menambah
 * followers terverifikasi maupun level.
 */
import { createServerFn } from "@tanstack/react-start";

type Session = { email: string; role: "admin" | "buzzer" | "customer" };

async function currentSession(): Promise<Session | null> {
  const { getServerSession } = await import("./session.server");
  return (await getServerSession()) as Session | null;
}

async function adminClient() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as any;
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

/** Ambil baris social account dan pastikan milik email tertentu. */
async function ownedSocialRow(id: string, email: string) {
  const db = await adminClient();
  const { data: row, error } = await db
    .from("social_accounts")
    .select("id, buzzer_email, verification, pending_followers")
    .eq("id", id)
    .maybeSingle();
  if (error) fail(error);
  if (!row) throw new Error("Akun media sosial tidak ditemukan.");
  if (String(row.buzzer_email ?? "").trim().toLowerCase() !== email) {
    throw new Error("Akun media sosial ini bukan milik akun yang sedang masuk.");
  }
  return row as { id: string; verification: string | null; pending_followers: number | null };
}

/* ------------------------------------------------------------------ */
/* Pendaftaran (belum ada sesi)                                        */
/* ------------------------------------------------------------------ */

export const submitSocialAccountsFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as {
        buzzerEmail: string;
        buzzerName: string;
        accounts: Array<{
          platform: string;
          username: string;
          profileUrl?: string;
          followers: number;
          category?: string;
        }>;
      },
  )
  .handler(async ({ data }) => {
    const db = await adminClient();
    const email = String(data?.buzzerEmail ?? "").trim().toLowerCase();
    const name = String(data?.buzzerName ?? "").trim();
    if (!email) throw new Error("Email buzzer wajib diisi.");

    const rows = (data?.accounts ?? [])
      .filter((account) => String(account?.username ?? "").trim() && account?.platform)
      .map((account) => ({
        buzzer_email: email,
        buzzer_name: name,
        platform: String(account.platform),
        username: String(account.username).trim(),
        account_name: name,
        profile_url: account.profileUrl ?? "",
        followers: Math.max(0, Math.floor(Number(account.followers) || 0)),
        category: account.category ?? "",
        // Nilai di bawah dipaksa server: pendaftaran tidak boleh
        // menghasilkan akun terverifikasi.
        verification: "Menunggu",
        is_active: false,
      }));

    if (rows.length === 0) return { ok: true as const, inserted: 0 };

    const { error } = await db
      .from("social_accounts")
      .upsert(rows, {
        onConflict: "buzzer_email,platform,username",
        ignoreDuplicates: true,
      });
    if (error) fail(error);

    return { ok: true as const, inserted: rows.length };
  });

/* ------------------------------------------------------------------ */
/* Buzzer                                                              */
/* ------------------------------------------------------------------ */

export const addSocialAccountFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as {
        platform: string;
        username: string;
        accountName?: string;
        profileUrl?: string;
        followers?: number;
        following?: number;
        posts?: number;
        category?: string;
        bio?: string;
        photoUrl?: string | null;
      },
  )
  .handler(async ({ data }) => {
    const session = await currentSession();
    if (!session || session.role !== "buzzer") {
      throw new Error("Hanya akun buzzer yang bisa menambah akun media sosial.");
    }

    const db = await adminClient();
    const username = String(data?.username ?? "").trim();
    if (!username || !data?.platform) throw new Error("Platform dan username wajib diisi.");

    const { data: profile } = await db
      .from("app_accounts")
      .select("name")
      .eq("email", session.email)
      .maybeSingle();

    const { error } = await db.from("social_accounts").insert({
      buzzer_email: session.email,
      buzzer_name: (profile?.name as string | null) ?? session.email.split("@")[0],
      platform: String(data.platform),
      username,
      account_name: String(data.accountName ?? "").trim(),
      profile_url: String(data.profileUrl ?? "").trim(),
      followers: Math.max(0, Math.floor(Number(data.followers) || 0)),
      following_count: Math.max(0, Math.floor(Number(data.following) || 0)),
      posts: Math.max(0, Math.floor(Number(data.posts) || 0)),
      category: String(data.category ?? ""),
      bio: String(data.bio ?? ""),
      photo_url: data.photoUrl ?? null,
      verification: "Menunggu",
      is_active: false,
    } as never);
    if (error) fail(error);

    return { ok: true as const };
  });

export const updateSocialAccountFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as {
        id: string;
        platform?: string;
        username?: string;
        accountName?: string;
        profileUrl?: string;
        following?: number;
        posts?: number;
        category?: string;
        bio?: string;
        photoUrl?: string | null;
        pendingFollowers?: number;
        pendingProofUrl?: string;
      },
  )
  .handler(async ({ data }) => {
    const session = await currentSession();
    if (!session) throw new Error("Sesi tidak ditemukan. Silakan masuk ulang.");

    const row = await ownedSocialRow(data.id, session.email);
    const db = await adminClient();

    const patch: Record<string, unknown> = {
      pending_verification: "Menunggu",
      pending_submitted_at: new Date().toISOString(),
      pending_rejection_note: null,
      updated_at: new Date().toISOString(),
    };
    if (data.platform !== undefined) patch["platform"] = String(data.platform);
    if (data.username !== undefined) patch["username"] = String(data.username).trim();
    if (data.accountName !== undefined) patch["account_name"] = String(data.accountName).trim();
    if (data.profileUrl !== undefined) patch["profile_url"] = String(data.profileUrl).trim();
    if (data.following !== undefined) {
      patch["following_count"] = Math.max(0, Math.floor(Number(data.following) || 0));
    }
    if (data.posts !== undefined) {
      patch["posts"] = Math.max(0, Math.floor(Number(data.posts) || 0));
    }
    if (data.category !== undefined) patch["category"] = String(data.category);
    if (data.bio !== undefined) patch["bio"] = String(data.bio);
    if (data.photoUrl !== undefined) patch["photo_url"] = data.photoUrl ?? null;

    // Buzzer hanya boleh mengajukan angka followers; nilai efektif menunggu
    // persetujuan admin (kolom `followers` tidak disentuh di sini).
    if (data.pendingFollowers !== undefined && data.pendingProofUrl) {
      patch["pending_followers"] = Math.max(0, Math.floor(Number(data.pendingFollowers) || 0));
      patch["pending_proof_url"] = String(data.pendingProofUrl).trim();
    }

    // Akun yang sebelumnya ditolak kembali ke antrean verifikasi.
    if (row.verification === "Ditolak") {
      patch["verification"] = "Menunggu";
      patch["rejection_note"] = null;
    }

    const { error } = await db.from("social_accounts").update(patch as never).eq("id", data.id);
    if (error) fail(error);

    return { ok: true as const };
  });

export const submitFollowerUpdateFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as { id: string; followers: number; proofUrl: string },
  )
  .handler(async ({ data }) => {
    const session = await currentSession();
    if (!session) throw new Error("Sesi tidak ditemukan. Silakan masuk ulang.");

    await ownedSocialRow(data.id, session.email);
    const followers = Math.max(0, Math.floor(Number(data.followers) || 0));
    const proofUrl = String(data?.proofUrl ?? "").trim();
    if (!proofUrl) throw new Error("Bukti followers wajib diunggah.");

    const db = await adminClient();
    const { error } = await db
      .from("social_accounts")
      .update({
        pending_followers: followers,
        pending_proof_url: proofUrl,
        pending_submitted_at: new Date().toISOString(),
        pending_verification: "Menunggu",
        pending_rejection_note: null,
      } as never)
      .eq("id", data.id);
    if (error) fail(error);

    return { ok: true as const };
  });

export const requestSocialDeactivateFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id: string; reason?: string })
  .handler(async ({ data }) => {
    const session = await currentSession();
    if (!session) throw new Error("Sesi tidak ditemukan. Silakan masuk ulang.");

    await ownedSocialRow(data.id, session.email);
    const reason = String(data?.reason ?? "").trim();

    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (reason) patch["rejection_note"] = `[Permintaan Nonaktif/Hapus]: ${reason}`;

    const db = await adminClient();
    const { error } = await db.from("social_accounts").update(patch as never).eq("id", data.id);
    if (error) fail(error);

    return { ok: true as const };
  });

/* ------------------------------------------------------------------ */
/* Admin                                                               */
/* ------------------------------------------------------------------ */

export const adminUpdateSocialAccountFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as { id: string; patch: Record<string, string | number | boolean | null> },
  )
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./session.server");
    await requireAdmin();

    const allowed = new Set([
      "platform",
      "username",
      "account_name",
      "profile_url",
      "followers",
      "following_count",
      "posts",
      "category",
      "bio",
      "photo_url",
      "verification",
      "rejection_note",
      "is_active",
      "pending_verification",
      "pending_rejection_note",
      "pending_followers",
      "pending_proof_url",
      "pending_submitted_at",
    ]);

    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const [key, value] of Object.entries(data.patch ?? {})) {
      if (allowed.has(key)) patch[key] = value;
    }
    if (Object.keys(patch).length === 1) {
      throw new Error("Tidak ada kolom yang bisa diperbarui.");
    }

    const db = await adminClient();
    const { error } = await db.from("social_accounts").update(patch as never).eq("id", data.id);
    if (error) fail(error);

    return { ok: true as const };
  });

export const adminApproveSocialAccountFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id: string })
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./session.server");
    await requireAdmin();

    const db = await adminClient();
    const { data: row, error: readError } = await db
      .from("social_accounts")
      .select("id, pending_followers")
      .eq("id", data.id)
      .maybeSingle();
    if (readError) fail(readError);
    if (!row) throw new Error("Akun media sosial tidak ditemukan.");

    const patch: Record<string, unknown> = {
      verification: "Terverifikasi",
      is_active: true,
      pending_verification: null,
      pending_rejection_note: null,
      rejection_note: null,
      updated_at: new Date().toISOString(),
    };
    if (row.pending_followers !== null && row.pending_followers !== undefined) {
      patch["followers"] = Number(row.pending_followers);
      patch["pending_followers"] = null;
      patch["pending_proof_url"] = null;
      patch["pending_submitted_at"] = null;
    }

    const { error } = await db.from("social_accounts").update(patch as never).eq("id", data.id);
    if (error) fail(error);

    return { ok: true as const };
  });

export const adminRejectSocialAccountFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id: string; reason: string })
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./session.server");
    await requireAdmin();

    const reason = String(data?.reason ?? "").trim() || "Pembaruan akun ditolak admin";
    const db = await adminClient();

    const { data: row, error: readError } = await db
      .from("social_accounts")
      .select("id, verification")
      .eq("id", data.id)
      .maybeSingle();
    if (readError) fail(readError);
    if (!row) throw new Error("Akun media sosial tidak ditemukan.");

    const patch: Record<string, unknown> = {
      pending_verification: "Ditolak",
      pending_rejection_note: reason,
      updated_at: new Date().toISOString(),
    };
    if (row.verification === "Menunggu") {
      patch["verification"] = "Ditolak";
      patch["is_active"] = false;
      patch["rejection_note"] = reason;
    }

    const { error } = await db.from("social_accounts").update(patch as never).eq("id", data.id);
    if (error) fail(error);

    return { ok: true as const };
  });

export const adminDeleteSocialAccountFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id: string })
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./session.server");
    await requireAdmin();

    const db = await adminClient();
    const { error } = await db.from("social_accounts").delete().eq("id", data.id);
    if (error) fail(error);

    return { ok: true as const };
  });

export const adminToggleSocialAccountFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id: string; isActive: boolean })
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./session.server");
    await requireAdmin();

    const db = await adminClient();
    const { error } = await db
      .from("social_accounts")
      .update({ is_active: Boolean(data.isActive), updated_at: new Date().toISOString() } as never)
      .eq("id", data.id);
    if (error) fail(error);

    return { ok: true as const };
  });

export const adminApproveDeactivationFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id: string })
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./session.server");
    await requireAdmin();

    const db = await adminClient();
    const { data: row, error: readError } = await db
      .from("social_accounts")
      .select("id, rejection_note")
      .eq("id", data.id)
      .maybeSingle();
    if (readError) fail(readError);
    if (!row) throw new Error("Akun media sosial tidak ditemukan.");

    const cleaned = String(row.rejection_note ?? "").replace(
      "[Permintaan Nonaktif/Hapus]: ",
      "",
    );
    const { error } = await db
      .from("social_accounts")
      .update({
        is_active: false,
        rejection_note: `[Nonaktif]: ${cleaned}`,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", data.id);
    if (error) fail(error);

    return { ok: true as const };
  });

export const adminRejectDeactivationFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id: string; reason: string })
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./session.server");
    await requireAdmin();

    const reason = String(data?.reason ?? "").trim();
    if (!reason) throw new Error("Alasan penolakan wajib diisi.");

    const db = await adminClient();
    const { error } = await db
      .from("social_accounts")
      .update({
        rejection_note: `[Penolakan Nonaktif/Hapus]: ${reason}`,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", data.id);
    if (error) fail(error);

    return { ok: true as const };
  });

/** Verifikasi massal akun "Menunggu" milik satu buzzer (dipakai saat approval). */export const adminBulkVerifySocialAccountsFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { buzzerEmail: string })
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./session.server");
    await requireAdmin();

    const email = String(data?.buzzerEmail ?? "").trim().toLowerCase();
    if (!email) throw new Error("Email buzzer wajib diisi.");

    const db = await adminClient();
    const { error } = await db
      .from("social_accounts")
      .update({
        verification: "Terverifikasi",
        is_active: true,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("buzzer_email", email)
      .eq("verification", "Menunggu");
    if (error) fail(error);

    return { ok: true as const };
  });

/**
 * Admin menambah atau memperbarui akun media sosial untuk seorang buzzer.
 * Dipakai panel admin saat menyunting data buzzer.
 */
export const adminUpsertSocialAccountFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as {
        buzzerEmail: string;
        buzzerName?: string;
        platform: string;
        username: string;
        followers?: number;
        verification?: string;
        isActive?: boolean;
      },
  )
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./session.server");
    await requireAdmin();

    const email = String(data?.buzzerEmail ?? "").trim().toLowerCase();
    const platform = String(data?.platform ?? "").trim();
    const username = String(data?.username ?? "").trim();
    if (!email || !platform || !username) {
      throw new Error("Email, platform, dan username wajib diisi.");
    }

    const db = await adminClient();
    const { data: existing, error: readError } = await db
      .from("social_accounts")
      .select("id")
      .eq("buzzer_email", email)
      .ilike("platform", platform)
      .maybeSingle();
    if (readError) fail(readError);

    if (existing) {
      const { error } = await db
        .from("social_accounts")
        .update({
          verification: data.verification ?? "Terverifikasi",
          is_active: data.isActive ?? true,
          followers: Math.max(0, Math.floor(Number(data.followers) || 0)),
          username,
          updated_at: new Date().toISOString(),
        } as never)
        .eq("id", existing.id);
      if (error) fail(error);
      return { ok: true as const, id: existing.id as string };
    }

    const { data: inserted, error } = await db
      .from("social_accounts")
      .insert({
        buzzer_email: email,
        buzzer_name: String(data.buzzerName ?? "").trim() || email.split("@")[0],
        platform,
        username,
        account_name: String(data.buzzerName ?? "").trim(),
        profile_url: "",
        followers: Math.max(0, Math.floor(Number(data.followers) || 0)),
        following_count: 0,
        posts: 0,
        category: "Umum",
        bio: "",
        verification: data.verification ?? "Terverifikasi",
        is_active: data.isActive ?? true,
      } as never)
      .select("id")
      .maybeSingle();
    if (error) fail(error);

    return { ok: true as const, id: (inserted?.id as string | undefined) ?? null };
  });
