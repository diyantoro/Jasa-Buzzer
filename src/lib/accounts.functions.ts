import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SALT = "buzzhub::v1::";

async function hashPassword(email: string, password: string): Promise<string> {
  const data = new TextEncoder().encode(`${SALT}${email.toLowerCase()}::${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "buzzer", "customer"]),
  phone: z.string().regex(/^\d*$/, "Nomor WhatsApp hanya boleh berisi angka.").optional().nullable(),
  city: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  platform: z.string().optional().nullable(),
  followers: z.number().int().nonnegative().optional().nullable(),
  avatar_url: z.string().optional().nullable(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const updateAccountSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  phone: z.string().regex(/^\d*$/, "Nomor WhatsApp hanya boleh berisi angka.").optional(),
  timezone: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional(),
});

const updateAdminRatingSchema = z.object({
  id: z.string().uuid(),
  adminEmail: z.string().email(),
  stars: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

const deleteAdminRatingSchema = z.object({
  id: z.string().uuid(),
  adminEmail: z.string().email(),
});

const submitFollowerUpdateSchema = z.object({
  id: z.string().uuid(),
  buzzerEmail: z.string().email(),
  followers: z.number().int().positive(),
  proofUrl: z.string().url(),
});

export const registerAccountFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as z.input<typeof registerSchema>)
  .handler(async ({ data: raw }) => {
    try {
      const parsed = registerSchema.safeParse(raw);
      if (!parsed.success) {
        return { ok: false as const, message: "Data tidak valid. Periksa email dan kata sandi Anda." };
      }
      const data = parsed.data;
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const email = data.email.trim().toLowerCase();

      const { data: existing } = await supabaseAdmin
        .from("app_accounts")
        .select("email")
        .eq("email", email)
        .maybeSingle();

      if (existing) {
        return { ok: false as const, message: "Email sudah terdaftar. Silakan masuk." };
      }

      const accountRow = {
        email,
        name: data.name.trim(),
        role: data.role,
        password_hash: await hashPassword(email, data.password),
      };

      const fullProfileRow = {
        ...accountRow,
        ...(data.phone !== undefined && data.phone !== null ? { phone: data.phone } : {}),
        ...(data.city !== undefined && data.city !== null ? { city: data.city } : {}),
        ...(data.bio !== undefined && data.bio !== null ? { bio: data.bio } : {}),
        ...(data.company !== undefined && data.company !== null ? { company: data.company } : {}),
        ...(data.industry !== undefined && data.industry !== null ? { industry: data.industry } : {}),
        ...(data.username !== undefined && data.username !== null ? { username: data.username } : {}),
        ...(data.platform !== undefined && data.platform !== null ? { platform: data.platform } : {}),
        ...(data.followers !== undefined && data.followers !== null ? { followers: data.followers } : {}),
        ...(data.avatar_url ? { avatar_url: data.avatar_url } : {}),
      };

      let insertError: unknown = null;
      try {
        const { error } = await supabaseAdmin.from("app_accounts").insert(fullProfileRow);
        insertError = error;
      } catch (error) {
        insertError = error;
      }

      if (insertError) {
        const msg =
          insertError instanceof Error
            ? insertError.message
            : typeof insertError === "object" && insertError && "message" in insertError && typeof insertError.message === "string"
              ? insertError.message
              : String(insertError);

        console.error("[Register] Database error:", insertError);
        if (msg.includes("Invalid API key") || msg.includes("JWT")) {
          return {
            ok: false as const,
            message: "API key Supabase tidak valid. Gunakan secret key server dari Supabase, bukan publishable key.",
          };
        }

        if (/column .* does not exist|undefined column/i.test(msg)) {
          const { error: fallbackError } = await supabaseAdmin.from("app_accounts").insert(accountRow);
          if (fallbackError) {
            console.error("[Register] Fallback database error:", fallbackError);
            return { ok: false as const, message: "Gagal menyimpan akun. Periksa struktur tabel app_accounts di Supabase." };
          }
          if (data.role === "customer") {
            await supabaseAdmin.from("customer_accounts").upsert({
              email,
              name: data.company?.trim() || data.name.trim(),
              active: true,
            }, { onConflict: "email" });
          }
          return { ok: true as const, account: { email, name: data.name.trim(), role: data.role } };
        }

        if (/duplicate key|already exists|unique constraint/i.test(msg)) {
          return { ok: false as const, message: "Email ini sudah terdaftar. Silakan masuk." };
        }

        return { ok: false as const, message: `Gagal menyimpan akun: ${msg}` };
      }

      if (data.role === "customer") {
        const { error: customerError } = await supabaseAdmin.from("customer_accounts").upsert({
          email,
          name: data.company?.trim() || data.name.trim(),
          active: true,
        }, { onConflict: "email" });
        if (customerError) {
          console.error("[Register] Customer profile database error:", customerError);
        }
      }

      return { ok: true as const, account: { email, name: data.name.trim(), role: data.role } };
    } catch (err) {
      console.error("[Register] Server error:", err);
      if (err instanceof Error && err.message.includes("SUPABASE_SERVICE_ROLE_KEY")) {
        return {
          ok: false as const,
          message: "Server belum dikonfigurasi. Tambahkan SUPABASE_SERVICE_ROLE_KEY di environment server.",
        };
      }
      if (err instanceof Error && err.message.includes("Invalid API key")) {
        return {
          ok: false as const,
          message: "API key Supabase tidak valid. Periksa SUPABASE_SERVICE_ROLE_KEY di environment server.",
        };
      }
      return { ok: false as const, message: "Gagal terhubung ke server. Coba lagi." };
    }
  });

export const loginAccountFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as z.input<typeof loginSchema>)
  .handler(async ({ data: raw }) => {
    const parsed = loginSchema.safeParse(raw);
    if (!parsed.success) {
      return { ok: false as const, message: "Email atau kata sandi tidak valid." };
    }
    const data = parsed.data;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = data.email.trim().toLowerCase();

    const selectColumns = "email, name, role, password_hash, phone, city, bio, company, industry, username, platform, followers, avatar_url";

    let row: any = null;
    try {
      const { data, error } = await supabaseAdmin
        .from("app_accounts")
        .select(selectColumns)
        .eq("email", email)
        .maybeSingle();

      if (error) throw error;
      row = data;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (/column .* does not exist|undefined column/i.test(message)) {
        const { data, error: fallbackError } = await supabaseAdmin
          .from("app_accounts")
          .select("email, name, role, password_hash")
          .eq("email", email)
          .maybeSingle();

        if (fallbackError) throw fallbackError;
        row = data;
      } else {
        throw error;
      }
    }

    if (!row) return { ok: false as const, message: "Akun tidak ditemukan." };

    if (row.password_hash !== (await hashPassword(email, data.password))) {
      return { ok: false as const, message: "Kata sandi salah." };
    }
    return {
      ok: true as const,
      account: {
        email: row.email,
        name: row.name,
        role: row.role as "admin" | "buzzer" | "customer",
        profile: {
          phone: row.phone ?? undefined,
          city: row.city ?? undefined,
          bio: row.bio ?? undefined,
          company: row.company ?? undefined,
          industry: row.industry ?? undefined,
          username: row.username ?? undefined,
          platform: row.platform ?? undefined,
          followers: typeof row.followers === "number" ? row.followers : undefined,
          avatarUrl: row.avatar_url ?? undefined,
        },
      },
    };
  });

export const updateAccountFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as z.input<typeof updateAccountSchema>)
  .handler(async ({ data: raw }) => {
    const parsed = updateAccountSchema.safeParse(raw);
    if (!parsed.success) return { ok: false as const, message: "Data akun tidak valid." };

    const data = parsed.data;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = data.email.trim().toLowerCase();
    const { data: account, error: accountError } = await supabaseAdmin
      .from("app_accounts")
      .select("email, role, password_hash")
      .eq("email", email)
      .maybeSingle();

    if (accountError) throw accountError;
    if (!account || account.role !== "admin") return { ok: false as const, message: "Akun admin tidak ditemukan." };

    if (data.newPassword) {
      if (!data.currentPassword || account.password_hash !== await hashPassword(email, data.currentPassword)) {
        return { ok: false as const, message: "Password lama tidak sesuai." };
      }
    }

    const update = {
      name: data.name.trim(),
      phone: data.phone?.trim() ?? "",
      ...(data.newPassword ? { password_hash: await hashPassword(email, data.newPassword) } : {}),
    };

    const { error } = await supabaseAdmin.from("app_accounts").update(update).eq("email", email);
    if (error) throw error;
    return { ok: true as const };
  });

export const updateAdminRatingFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as z.input<typeof updateAdminRatingSchema>)
  .handler(async ({ data: raw }) => {
    const parsed = updateAdminRatingSchema.safeParse(raw);
    if (!parsed.success) return { ok: false as const, message: "Data ulasan tidak valid." };

    const data = parsed.data;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const adminEmail = data.adminEmail.trim().toLowerCase();
    const { data: account, error: accountError } = await supabaseAdmin
      .from("app_accounts")
      .select("email, role")
      .eq("email", adminEmail)
      .maybeSingle();

    if (accountError) throw accountError;
    if (!account || account.role !== "admin") return { ok: false as const, message: "Akun admin tidak ditemukan." };

    const { error } = await supabaseAdmin
      .from("buzzer_ratings")
      .update({ stars: data.stars, comment: data.comment?.trim() || null })
      .eq("id", data.id);

    if (error) throw error;
    return { ok: true as const };
  });

export const deleteAdminRatingFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as z.input<typeof deleteAdminRatingSchema>)
  .handler(async ({ data: raw }) => {
    const parsed = deleteAdminRatingSchema.safeParse(raw);
    if (!parsed.success) return { ok: false as const, message: "Data ulasan tidak valid." };

    const data = parsed.data;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const adminEmail = data.adminEmail.trim().toLowerCase();
    const { data: account, error: accountError } = await supabaseAdmin
      .from("app_accounts")
      .select("email, role")
      .eq("email", adminEmail)
      .maybeSingle();

    if (accountError) throw accountError;
    if (!account || account.role !== "admin") return { ok: false as const, message: "Akun admin tidak ditemukan." };

    const { error } = await supabaseAdmin
      .from("buzzer_ratings")
      .delete()
      .eq("id", data.id);

    if (error) throw error;
    return { ok: true as const };
  });

export const submitFollowerUpdateFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as z.input<typeof submitFollowerUpdateSchema>)
  .handler(async ({ data: raw }) => {
    const parsed = submitFollowerUpdateSchema.safeParse(raw);
    if (!parsed.success) return { ok: false as const, message: "Data followers atau bukti tidak valid." };

    const data = parsed.data;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = data.buzzerEmail.trim().toLowerCase();
    const { data: account, error: accountError } = await supabaseAdmin
      .from("app_accounts")
      .select("email, role")
      .eq("email", email)
      .maybeSingle();
    if (accountError) throw accountError;
    if (!account || account.role !== "buzzer") return { ok: false as const, message: "Akun buzzer tidak ditemukan." };

    const { error } = await (supabaseAdmin as any)
      .from("social_accounts")
      .update({
        pending_followers: data.followers,
        pending_proof_url: data.proofUrl,
        pending_submitted_at: new Date().toISOString(),
        pending_verification: "Menunggu",
        pending_rejection_note: null,
      })
      .eq("id", data.id)
      .eq("buzzer_email", email);
    if (error) throw error;
    return { ok: true as const };
  });



