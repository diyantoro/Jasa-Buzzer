/**
 * Server function membaca profil akun lengkap.
 *
 * Setelah Fase 1, `app_accounts` tidak lagi bisa dibaca client karena berisi
 * `password_hash`. Profil publik dibaca dari view `app_accounts_public`,
 * sedangkan profil lengkap (phone, bio, city, company) hanya boleh dibaca
 * oleh pemilik akun atau admin melalui fungsi ini.
 */
import { createServerFn } from "@tanstack/react-start";

export const getAccountProfileFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { email: string })
  .handler(async ({ data }) => {
    const { getServerSession } = await import("./session.server");
    const { supabaseAdmin: adminClient } = await import("@/integrations/supabase/client.server");
    const supabaseAdmin = adminClient as any;

    const email = String(data?.email ?? "").trim().toLowerCase();
    if (!email) throw new Error("Email wajib diisi.");

    const session = await getServerSession();
    if (!session) throw new Error("Sesi tidak ditemukan. Silakan masuk ulang.");
    if (session.role !== "admin" && session.email !== email) {
      throw new Error("Akses ditolak.");
    }

    const { data: row, error } = await supabaseAdmin
      .from("app_accounts")
      .select(
        "email, name, role, phone, city, bio, company, industry, username, platform, followers, avatar_url, buzzer_category, address, rating, total_reviews, created_at, updated_at",
      )
      .eq("email", email)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return { ok: true as const, profile: row };
  });
