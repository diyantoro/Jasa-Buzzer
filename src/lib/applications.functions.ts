/**
 * Server function pendaftaran buzzer (`buzzer_applications`).
 *
 * Sebelum Fase 2b, tabel ini bisa ditulis langsung dari browser sehingga
 * pendaftar bisa mengubah `status` menjadi `approved` sendiri. Sekarang:
 *
 *   * pendaftaran publik dipaksa `status = 'pending'` oleh server;
 *   * approve/reject/edit/hapus hanya lewat server function admin;
 *   * client hanya boleh membaca.
 */
import { createServerFn } from "@tanstack/react-start";
import { describeDbError } from "./db-error";

type ApplicationInput = {
  name: string;
  email: string;
  username?: string;
  platform?: string;
  platforms?: string[];
  followers?: number;
  phone?: string;
  city?: string;
  category?: string;
  buzzerCategory?: string;
  address?: string;
  bio?: string;
};

async function adminClient() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin as any;
}

function fail(error: unknown): never {
  throw new Error(describeDbError(error));
}

function bioWithCategory(bio: string | undefined, category: string): string {
  const raw = (bio ?? "").replace(/\[Kategori Buzzer:\s*.*?\]/gi, "").trim();
  return raw ? `${raw}\n\n[Kategori Buzzer: ${category}]` : `[Kategori Buzzer: ${category}]`;
}

/* ------------------------------------------------------------------ */
/* Publik: kirim / kirim ulang pendaftaran                             */
/* ------------------------------------------------------------------ */

export const submitBuzzerApplicationFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as ApplicationInput)
  .handler(async ({ data }) => {
    const db = await adminClient();
    const email = String(data?.email ?? "").trim().toLowerCase();
    const name = String(data?.name ?? "").trim();
    if (!email || !name) throw new Error("Nama dan email wajib diisi.");

    const { data: existing, error: readError } = await db
      .from("buzzer_applications")
      .select("id, status")
      .eq("email", email)
      .maybeSingle();
    if (readError) fail(readError);

    if (existing?.status === "approved") {
      throw new Error("Email ini sudah terverifikasi. Silakan login.");
    }
    if (existing?.status === "pending") {
      throw new Error("Pendaftaran dengan email ini sedang menunggu verifikasi admin.");
    }

    const buzzerCategory = String(data.buzzerCategory ?? "Buzzer Online").trim() || "Buzzer Online";
    const now = new Date().toISOString();
    const row: Record<string, unknown> = {
      id: (existing?.id as string | undefined) ?? `app-${Date.now()}`,
      name,
      email,
      username: String(data.username ?? "").trim(),
      platform: String(data.platform ?? "Instagram"),
      platforms: Array.isArray(data.platforms) ? data.platforms : [],
      followers: Math.max(0, Math.floor(Number(data.followers) || 0)),
      phone: data.phone?.trim() || null,
      city: data.city?.trim() || null,
      category: data.category?.trim() || null,
      address: data.address?.trim() || null,
      bio: bioWithCategory(data.bio, buzzerCategory),
      buzzer_category: buzzerCategory,
      submitted_at: now,
      // Nilai status selalu ditentukan server; input client diabaikan.
      status: "pending",
      reviewed_at: null,
      review_note: null,
      updated_at: now,
    };

    let error: any = null;
    ({ error } = await db.from("buzzer_applications").upsert(row as never, { onConflict: "email" }));

    // Kolom `buzzer_category` / `address` mungkin belum ada di database lama.
    if (error && /buzzer_category|address/i.test(String(error.message ?? ""))) {
      const fallback = { ...row };
      delete fallback["buzzer_category"];
      delete fallback["address"];
      ({ error } = await db.from("buzzer_applications").upsert(fallback as never, { onConflict: "email" }));
    }
    if (error) fail(error);

    return { ok: true as const, id: row["id"] as string, email };
  });

/* ------------------------------------------------------------------ */
/* Admin: review, edit, hapus                                          */
/* ------------------------------------------------------------------ */

export const adminReviewBuzzerApplicationFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id: string; status: "approved" | "rejected"; note?: string })
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./session.server");
    const session = await requireAdmin();

    const id = String(data?.id ?? "").trim();
    const status = data?.status;
    if (!id) throw new Error("ID pendaftaran wajib diisi.");
    if (status !== "approved" && status !== "rejected") {
      throw new Error("Status review tidak valid.");
    }

    const db = await adminClient();
    const now = new Date().toISOString();
    const { error } = await db
      .from("buzzer_applications")
      .update({
        status,
        reviewed_at: now,
        review_note: data.note?.trim() || null,
        updated_at: now,
      } as never)
      .eq("id", id);
    if (error) fail(error);

    const { writeAuditLog } = await import("./audit.server");
    await writeAuditLog({
      actor: session,
      action: status === "approved" ? "application.approve" : "application.reject",
      targetType: "buzzer_application",
      targetId: id,
      details: { note: data.note?.trim() || null },
    });

    return { ok: true as const };
  });

export const adminUpdateBuzzerApplicationFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as {
        id?: string;
        email?: string;
        patch: Partial<ApplicationInput> & { reviewNote?: string };
      },
  )
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./session.server");
    await requireAdmin();

    const id = String(data?.id ?? "").trim();
    const email = String(data?.email ?? "").trim().toLowerCase();
    if (!id && !email) throw new Error("ID atau email pendaftaran wajib diisi.");

    const db = await adminClient();
    const readQuery = db
      .from("buzzer_applications")
      .select("bio, buzzer_category")
      .limit(1);
    const { data: current, error: readError } = id
      ? await readQuery.eq("id", id).maybeSingle()
      : await readQuery.eq("email", email).maybeSingle();
    if (readError) fail(readError);
    if (!current) throw new Error("Pendaftaran buzzer tidak ditemukan.");

    const patch = data.patch ?? {};
    const nextCategory =
      patch.buzzerCategory !== undefined
        ? String(patch.buzzerCategory).trim() || "Buzzer Online"
        : String(current.buzzer_category ?? "").trim() || "Buzzer Online";

    const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (patch.name !== undefined) row["name"] = String(patch.name).trim();
    if (patch.username !== undefined) row["username"] = String(patch.username).trim();
    if (patch.platform !== undefined) row["platform"] = String(patch.platform);
    if (patch.platforms !== undefined) row["platforms"] = patch.platforms ?? [];
    if (patch.followers !== undefined) {
      row["followers"] = Math.max(0, Math.floor(Number(patch.followers) || 0));
    }
    if (patch.phone !== undefined) row["phone"] = patch.phone?.trim() || null;
    if (patch.city !== undefined) row["city"] = patch.city?.trim() || null;
    if (patch.category !== undefined) row["category"] = patch.category?.trim() || null;
    if (patch.address !== undefined) row["address"] = patch.address?.trim() || null;
    if (patch.bio !== undefined || patch.buzzerCategory !== undefined) {
      row["bio"] = bioWithCategory(
        patch.bio !== undefined ? patch.bio : String(current.bio ?? ""),
        nextCategory,
      );
    }
    if (patch.buzzerCategory !== undefined) row["buzzer_category"] = nextCategory;
    if (patch.reviewNote !== undefined) row["review_note"] = patch.reviewNote?.trim() || null;

    let error: any = null;
    const applyUpdate = (values: Record<string, unknown>) => {
      const builder = db.from("buzzer_applications").update(values as never);
      return id ? builder.eq("id", id) : builder.eq("email", email);
    };
    ({ error } = await applyUpdate(row));
    if (error && /buzzer_category|address/i.test(String(error.message ?? ""))) {
      const fallback = { ...row };
      delete fallback["buzzer_category"];
      delete fallback["address"];
      ({ error } = await applyUpdate(fallback));
    }
    if (error) fail(error);

    return { ok: true as const };
  });

export const adminDeleteBuzzerApplicationFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id?: string; email?: string })
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./session.server");
    await requireAdmin();

    const id = String(data?.id ?? "").trim();
    const email = String(data?.email ?? "").trim().toLowerCase();
    if (!id && !email) throw new Error("ID atau email pendaftaran wajib diisi.");

    const db = await adminClient();
    const query = db.from("buzzer_applications").delete();
    const { error } = id ? await query.eq("id", id) : await query.eq("email", email);
    if (error) fail(error);

    return { ok: true as const };
  });
