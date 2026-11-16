/**
 * Server function sinkronisasi level & followers buzzer.
 *
 * Sejak Fase 1, `buzzer_wallets` dan `app_accounts` tidak bisa ditulis
 * langsung dari client. Fungsi ini menghitung ulang followers terverifikasi
 * dan level di server, sehingga client tidak bisa memilih level sendiri
 * (level menentukan persentase payout).
 *
 * Aturan akses:
 *   * admin boleh menyinkronkan buzzer mana pun;
 *   * buzzer hanya boleh menyinkronkan akunnya sendiri.
 *
 * Sumber angka: hanya akun sosial dengan `verification = 'Terverifikasi'`
 * dan masih aktif. Angka kiriman client diabaikan sepenuhnya.
 */
import { createServerFn } from "@tanstack/react-start";

export const syncBuzzerLevelFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { buzzerEmail: string })
  .handler(async ({ data }) => {
    const { getServerSession } = await import("./session.server");
    const { supabaseAdmin: adminClient } = await import("@/integrations/supabase/client.server");
    const supabaseAdmin = adminClient as any;

    const email = String(data?.buzzerEmail ?? "").trim().toLowerCase();
    if (!email) throw new Error("Email buzzer wajib diisi.");

    const session = await getServerSession();
    if (!session) throw new Error("Sesi tidak ditemukan. Silakan masuk ulang.");
    if (session.role !== "admin" && session.email !== email) {
      throw new Error("Akses ditolak: hanya admin atau pemilik akun.");
    }

    const { data: accounts, error: socialError } = await supabaseAdmin
      .from("social_accounts")
      .select("followers, is_active, verification")
      .eq("buzzer_email", email)
      .ilike("verification", "Terverifikasi");

    if (socialError) throw new Error(socialError.message);

    const totalFollowers = ((accounts ?? []) as Array<{
      followers: number | null;
      is_active: boolean | null;
    }>)
      .filter((account) => account.is_active !== false)
      .reduce((sum, account) => sum + (Number(account.followers) || 0), 0);

    const { data: levels, error: levelError } = await supabaseAdmin
      .from("buzzer_levels")
      .select("name, min_followers, max_followers, sort_order")
      .order("sort_order", { ascending: true });

    if (levelError) throw new Error(levelError.message);

    const levelRows = (levels ?? []) as Array<{
      name: string;
      min_followers: number | null;
      max_followers: number | null;
    }>;

    const matched =
      levelRows.find((row) => {
        const min = Number(row.min_followers ?? 0);
        const max = row.max_followers === null ? null : Number(row.max_followers);
        return totalFollowers >= min && (max === null || totalFollowers <= max);
      }) ?? levelRows[0];

    const levelName = matched?.name ?? "Bronze";
    const now = new Date().toISOString();

    const { data: existingWallet } = await supabaseAdmin
      .from("buzzer_wallets")
      .select("buzzer_email")
      .eq("buzzer_email", email)
      .maybeSingle();

    if (existingWallet) {
      const { error } = await supabaseAdmin
        .from("buzzer_wallets")
        .update({
          followers: totalFollowers,
          verified_followers: totalFollowers,
          level: levelName,
          level_assigned_at: now,
          updated_at: now,
        } as never)
        .eq("buzzer_email", email);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("buzzer_wallets").insert({
        buzzer_email: email,
        buzzer_name: email.split("@")[0],
        followers: totalFollowers,
        verified_followers: totalFollowers,
        level: levelName,
        level_assigned_at: now,
        updated_at: now,
      } as never);
      if (error) throw new Error(error.message);
    }

    await supabaseAdmin
      .from("app_accounts")
      .update({ followers: totalFollowers, updated_at: now } as never)
      .eq("email", email)
      .eq("role", "buzzer");

    await supabaseAdmin
      .from("buzzer_applications")
      .update({ followers: totalFollowers } as never)
      .eq("email", email);

    return { ok: true as const, level: levelName, followers: totalFollowers };
  });
