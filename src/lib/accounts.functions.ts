import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SALT = "buzzhub::v1::";
const PBKDF2_ITERATIONS = 210_000;
const encoder = new TextEncoder();

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(value: string): Uint8Array<ArrayBuffer> {
  const clean = value.length % 2 === 0 ? value : `0${value}`;
  const bytes = new Uint8Array(clean.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = parseInt(clean.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

/** Hash lama (SHA-256 + salt global). Hanya dipakai untuk verifikasi migrasi. */
async function legacyHash(email: string, password: string): Promise<string> {
  const data = encoder.encode(`${SALT}${email.toLowerCase()}::${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return toHex(new Uint8Array(digest));
}

async function derivePbkdf2(password: string, salt: Uint8Array<ArrayBuffer>): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    key,
    256,
  );
  return new Uint8Array(bits);
}

/**
 * Hash password dengan PBKDF2-SHA256 + salt acak per akun.
 * Format: `pbkdf2$<iterations>$<saltHex>$<hashHex>`
 */
async function hashPassword(_email: string, password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derivePbkdf2(password, salt);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toHex(salt)}$${toHex(hash)}`;
}

/** Verifikasi password baru (PBKDF2) atau hash lama (SHA-256). */
async function verifyPassword(email: string, password: string, stored: string | null | undefined) {
  const value = String(stored ?? "");
  if (!value) return { ok: false as const, needsRehash: false };

  if (value.startsWith("pbkdf2$")) {
    const [, iterationsRaw, saltHex, hashHex] = value.split("$");
    const iterations = Number(iterationsRaw);
    if (!iterations || !saltHex || !hashHex) return { ok: false as const, needsRehash: false };

    const salt = fromHex(saltHex);
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveBits"],
    );
    const bits = new Uint8Array(
      await crypto.subtle.deriveBits(
        { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
        key,
        256,
      ),
    );
    const expected = fromHex(hashHex);
    if (bits.length !== expected.length) return { ok: false as const, needsRehash: false };
    let diff = 0;
    for (let index = 0; index < bits.length; index += 1) diff |= bits[index] ^ expected[index];
    return { ok: diff === 0, needsRehash: false };
  }

  // Hash legacy: cocok -> perlu di-rehash ke PBKDF2 saat login berhasil.
  const legacy = await legacyHash(email, password);
  return { ok: value === legacy, needsRehash: value === legacy };
}

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "buzzer", "customer"]),
  phone: z
    .string()
    .regex(/^\d*$/, "Nomor WhatsApp hanya boleh berisi angka.")
    .optional()
    .nullable(),
  city: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  buzzer_category: z.string().optional().nullable(),
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

const changePasswordSchema = z.object({
  email: z.string().email(),
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export const registerAccountFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as z.input<typeof registerSchema>)
  .handler(async ({ data: raw }) => {
    try {
      const parsed = registerSchema.safeParse(raw);
      if (!parsed.success) {
        return {
          ok: false as const,
          message: "Data tidak valid. Periksa email dan kata sandi Anda.",
        };
      }
      const data = parsed.data;

      // Akun admin tidak boleh dibuat lewat endpoint publik saat production.
      // Di development tetap diizinkan agar bootstrap demo mudah.
      if (data.role === "admin" && process.env["NODE_ENV"] === "production") {
        try {
          const { requireAdmin } = await import("./session.server");
          await requireAdmin();
        } catch {
          return {
            ok: false as const,
            message: "Hanya admin yang sudah masuk yang bisa membuat akun admin.",
          };
        }
      }

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
        ...(data.buzzer_category !== undefined && data.buzzer_category !== null
          ? { buzzer_category: data.buzzer_category }
          : {}),
        ...(data.industry !== undefined && data.industry !== null
          ? { industry: data.industry }
          : {}),
        ...(data.username !== undefined && data.username !== null
          ? { username: data.username }
          : {}),
        ...(data.platform !== undefined && data.platform !== null
          ? { platform: data.platform }
          : {}),
        ...(data.followers !== undefined && data.followers !== null
          ? { followers: data.followers }
          : {}),
        ...(data.avatar_url ? { avatar_url: data.avatar_url } : {}),
      };

      let insertError: unknown = null;
      try {
        const { error } = await supabaseAdmin.from("app_accounts").insert(fullProfileRow as any);
        insertError = error;
      } catch (error) {
        insertError = error;
      }

      if (insertError) {
        const msg =
          insertError instanceof Error
            ? insertError.message
            : typeof insertError === "object" &&
                insertError &&
                "message" in insertError &&
                typeof insertError.message === "string"
              ? insertError.message
              : String(insertError);

        console.error("[Register] Database error:", insertError);
        if (msg.includes("Invalid API key") || msg.includes("JWT")) {
          return {
            ok: false as const,
            message:
              "API key Supabase tidak valid. Gunakan secret key server dari Supabase, bukan publishable key.",
          };
        }

        if (/column .* does not exist|undefined column/i.test(msg)) {
          const { error: fallbackError } = await supabaseAdmin
            .from("app_accounts")
            .insert(accountRow);
          if (fallbackError) {
            console.error("[Register] Fallback database error:", fallbackError);
            return {
              ok: false as const,
              message: "Gagal menyimpan akun. Periksa struktur tabel app_accounts di Supabase.",
            };
          }
          if (data.role === "customer") {
            await supabaseAdmin.from("customer_accounts").upsert(
              {
                email,
                name: data.company?.trim() || data.name.trim(),
                active: true,
              },
              { onConflict: "email" },
            );
          }
          return { ok: true as const, account: { email, name: data.name.trim(), role: data.role } };
        }

        if (/duplicate key|already exists|unique constraint/i.test(msg)) {
          return { ok: false as const, message: "Email ini sudah terdaftar. Silakan masuk." };
        }

        return { ok: false as const, message: `Gagal menyimpan akun: ${msg}` };
      }

      if (data.role === "customer") {
        const { error: customerError } = await supabaseAdmin.from("customer_accounts").upsert(
          {
            email,
            name: data.company?.trim() || data.name.trim(),
            active: true,
          },
          { onConflict: "email" },
        );
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
          message:
            "Server belum dikonfigurasi. Tambahkan SUPABASE_SERVICE_ROLE_KEY di environment server.",
        };
      }
      if (err instanceof Error && err.message.includes("Invalid API key")) {
        return {
          ok: false as const,
          message:
            "API key Supabase tidak valid. Periksa SUPABASE_SERVICE_ROLE_KEY di environment server.",
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

    // Batasi percobaan login per email dan per IP (lihat rate-limit.server.ts).
    const { rateLimitMessage, RATE_LIMITS } = await import("./rate-limit.server");
    const limited = await rateLimitMessage({
      scope: "login",
      identity: email,
      rule: RATE_LIMITS.login,
    });
    if (limited) return { ok: false as const, message: limited };

    const selectColumns =
      "email, name, role, password_hash, phone, city, bio, company, industry, username, platform, followers, avatar_url";

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

    const passwordCheck = await verifyPassword(email, data.password, row.password_hash);
    if (!passwordCheck.ok) {
      return { ok: false as const, message: "Kata sandi salah." };
    }

    // Migrasi transparan: hash lama (SHA-256) diganti PBKDF2 setelah login sukses.
    if (passwordCheck.needsRehash) {
      try {
        const { error: rehashError } = await supabaseAdmin
          .from("app_accounts")
          .update({ password_hash: await hashPassword(email, data.password) })
          .eq("email", email);
        if (rehashError) console.warn("[Login] Gagal upgrade hash password:", rehashError);
      } catch (rehashError) {
        console.warn("[Login] Gagal upgrade hash password:", rehashError);
      }
    }

    // Sesi server-side bertanda tangan. Dipakai server function admin
    // untuk memastikan pemanggil benar-benar admin yang login.
    try {
      const { setSessionCookie } = await import("./session.server");
      await setSessionCookie(row.email, row.role as "admin" | "buzzer" | "customer");
    } catch (cookieError) {
      console.error("[Login] Gagal membuat sesi server:", cookieError);
    }

    // Login berhasil: bersihkan hitungan percobaan untuk email ini.
    try {
      const { resetRateLimit } = await import("./rate-limit.server");
      await resetRateLimit({ scope: "login", identity: email });
    } catch (resetError) {
      console.warn("[Login] Gagal mereset rate limit:", resetError);
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
    if (!account || account.role !== "admin")
      return { ok: false as const, message: "Akun admin tidak ditemukan." };

    if (data.newPassword) {
      const passwordCheck = await verifyPassword(
        email,
        data.currentPassword ?? "",
        account.password_hash,
      );
      if (!data.currentPassword || !passwordCheck.ok) {
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

export const changePasswordFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as z.input<typeof changePasswordSchema>)
  .handler(async ({ data: raw }) => {
    const parsed = changePasswordSchema.safeParse(raw);
    if (!parsed.success) return { ok: false as const, message: "Data password tidak valid." };

    const data = parsed.data;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Identitas diutamakan dari sesi bertanda tangan; email client hanya
    // fallback untuk alur lama. Password lama tetap diverifikasi.
    const { getServerSession } = await import("./session.server");
    const session = (await getServerSession()) as { email: string } | null;
    const email = (session?.email ?? data.email).trim().toLowerCase();

    const { rateLimitMessage, RATE_LIMITS } = await import("./rate-limit.server");
    const limited = await rateLimitMessage({
      scope: "change-password",
      identity: email,
      rule: RATE_LIMITS.changePassword,
    });
    if (limited) return { ok: false as const, message: limited };

    const { data: account, error: accountError } = await supabaseAdmin
      .from("app_accounts")
      .select("email, role, password_hash")
      .eq("email", email)
      .maybeSingle();

    if (accountError) throw accountError;
    if (!account) return { ok: false as const, message: "Akun tidak ditemukan." };
    const passwordCheck = await verifyPassword(email, data.currentPassword, account.password_hash);
    if (!passwordCheck.ok) {
      return { ok: false as const, message: "Password lama tidak sesuai." };
    }

    const { error } = await supabaseAdmin
      .from("app_accounts")
      .update({ password_hash: await hashPassword(email, data.newPassword) })
      .eq("email", email);

    if (error) throw error;
    return { ok: true as const };
  });

/**
 * Sinkronisasi ringkasan akun customer setelah checkout.
 *
 * Fase 2: `customer_accounts` tidak bisa ditulis dari browser. Email selalu
 * diambil dari sesi bertanda tangan, jadi client tidak bisa membuat atau
 * mengubah ringkasan akun customer lain.
 */
export const syncCustomerAccountFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { name?: string })
  .handler(async ({ data }) => {
    const { getServerSession } = await import("./session.server");
    const session = (await getServerSession()) as
      | { email: string; role: "admin" | "buzzer" | "customer" }
      | null;
    if (!session) return { ok: false as const, message: "Sesi tidak ditemukan." };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const name = String(data?.name ?? "").trim();

    const patch: Record<string, unknown> = { active: true };
    if (name) patch["name"] = name;

    const { error } = await supabaseAdmin
      .from("customer_accounts")
      .upsert({ email: session.email, ...patch } as never, { onConflict: "email" });
    if (error) throw error;

    return { ok: true as const };
  });

export const logoutAccountFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as unknown)
  .handler(async () => {
    try {
      const { clearSessionCookie } = await import("./session.server");
      clearSessionCookie();
    } catch (cookieError) {
      console.error("[Logout] Gagal menghapus sesi server:", cookieError);
    }
    return { ok: true as const };
  });
