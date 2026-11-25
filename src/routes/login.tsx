import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  Megaphone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import {
  setSession,
  findAccountWithMessage,
  registerAccount,
  type Role,
  type Session,
} from "@/lib/auth";

import { getApplicationByEmail } from "@/lib/buzzer-verification";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Masuk — BuzzHub" }] }),
  component: LoginPage,
});

type DemoUser = { name: string; email: string; password: string; role: Role };

const USERS: DemoUser[] = [
  { name: "Super Admin", email: "admin@buzzhub.id", password: "Admin123!", role: "admin" },
  { name: "Buzzer Premium", email: "buzzer@buzzhub.id", password: "Buzzer123!", role: "buzzer" },
  { name: "Customer Utama", email: "customer@buzzhub.id", password: "Customer123!", role: "customer" },
];

// Jalur demo (membuat sesi tanpa verifikasi database & bootstrap admin) hanya
// aktif saat development. Di production login tetap divalidasi ke database.
// Untuk demo publik yang memang butuh jalur ini, set VITE_ENABLE_DEMO_LOGIN=true.
const DEMO_LOGIN_ENABLED =
  import.meta.env.DEV || import.meta.env["VITE_ENABLE_DEMO_LOGIN"] === "true";

const LOGIN_TRUST = [
  {
    icon: ShieldCheck,
    title: "Buzzer terverifikasi",
    desc: "Setiap akun diperiksa sebelum mengambil job.",
  },
  {
    icon: BarChart3,
    title: "Laporan real-time",
    desc: "Pantau reach & engagement tanpa menunggu.",
  },
  {
    icon: CheckCircle2,
    title: "Garansi 100% refund",
    desc: "Hasil tidak sesuai target? Dana kembali.",
  },
] as const;

const LOGIN_STATS = [
  { label: "Brand", value: "300+" },
  { label: "Buzzer", value: "8.000+" },
  { label: "Rating", value: "4.9/5" },
] as const;

/** Gaya field login: tinggi seragam, hover & focus jelas, tetap mengikuti token tema. */
const FIELD_CLASS =
  "h-11 rounded-lg text-sm shadow-sm transition-[border-color,box-shadow] hover:border-brand/40 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/25";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setWarning(null);

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      setError("Format email tidak valid.");
      return;
    }
    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    const emailLc = email.trim().toLowerCase();
    const demo = DEMO_LOGIN_ENABLED
      ? USERS.find((u) => u.email.toLowerCase() === emailLc && u.password === password)
      : undefined;
    let loginMessage: string | undefined;
    let lookup = await findAccountWithMessage(emailLc, password);
    let user: Session | null = lookup.user;
    loginMessage = lookup.message;

    if (demo?.role === "admin" && !user) {
      const provisioned = await registerAccount({
        role: "admin",
        name: demo.name,
        email: demo.email,
        password: demo.password,
      });
      if (provisioned.ok) {
        user = { role: demo.role, name: demo.name, email: demo.email };
      } else {
        lookup = await findAccountWithMessage(emailLc, password);
        user = lookup.user;
        if (lookup.message) loginMessage = lookup.message;
      }
    } else if (demo && !user) {
      user = { role: demo.role, name: demo.name, email: demo.email };
    }

    // Status verifikasi hanya menentukan akses job, bukan akses login.
    const app = await getApplicationByEmail(emailLc);
    if (app && (!user || user.role === "buzzer")) {
      if (app.status === "approved" && !user) {
        // Pulihkan akun lama yang sudah approved tetapi belum memiliki app_accounts.
        await registerAccount({
          role: "buzzer",
          name: app.name,
          email: app.email,
          password,
          phone: app.phone,
          city: app.city,
          bio: app.bio,
          username: app.username,
          platform: app.platform,
          followers: app.followers,
          industry: app.category,
        });
        // Level buzzer ditetapkan admin saat verifikasi. Registrasi sendiri
        // tidak boleh menentukan level karena level memengaruhi payout.

        const restored = await findAccountWithMessage(app.email, password);
        if (!restored.user) {
          // Jangan pernah membuat sesi dari data aplikasi bila verifikasi
          // kredensial gagal (termasuk saat rate limit aktif).
          setLoading(false);
          setError(restored.message ?? "Email atau kata sandi salah.");
          return;
        }
        setSession(restored.user);
        if (remember) localStorage.setItem("buzzhub.remember", app.email);
        try {
          await navigate({ to: `/buzzer` });
        } catch {
          setLoading(false);
          setError("Gagal membuka dashboard. Silakan coba lagi.");
          return;
        }
        toast.success(`Selamat datang, ${app.name}!`);
        return;
      }
    }

    if (!user) {
      setLoading(false);
      setError(
        loginMessage ??
          (DEMO_LOGIN_ENABLED
            ? "Email atau kata sandi salah. Coba akun demo di bawah."
            : "Email atau kata sandi salah."),
      );
      return;
    }

    setSession(user);
    if (remember) localStorage.setItem("buzzhub.remember", user.email);
    // Tunggu navigasi dashboard selesai dulu supaya toast tidak muncul
    // saat form login masih menampilkan loading.
    try {
      await navigate({ to: `/${user.role}` as never });
    } catch {
      setLoading(false);
      setError("Gagal membuka dashboard. Silakan coba lagi.");
      return;
    }
    if (user.role === "buzzer" && app?.status === "pending") {
      toast.warning("Menunggu Verifikasi Admin", {
        description: "Data pendaftaran Anda sedang diperiksa. Job akan tersedia setelah akun diverifikasi.",
      });
    } else if (user.role === "buzzer" && app?.status === "rejected") {
      toast.error("Verifikasi Ditolak", {
        description: "Pendaftaran Anda telah ditolak oleh Admin. Anda tidak dapat mengambil job melalui akun ini.",
      });
    } else if (user.role === "buzzer" && app?.status === "approved") {
      toast.success("Verifikasi Berhasil", {
        description: "Selamat! Job yang sesuai dengan kategori Anda sekarang tersedia.",
      });
    } else {
      toast.success(`Selamat datang, ${user.name}!`);
    }
  };

  return (
    <div className="min-h-screen bg-card text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
        {/* Panel brand — biru penuh, menyentuh pinggir layar */}
        <section className="relative flex min-h-[340px] flex-col overflow-hidden gradient-brand px-5 py-7 text-white sm:px-10 sm:py-10 lg:min-h-screen lg:px-14 lg:py-12 xl:px-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(7,16,46,0.45)_100%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_4%,rgba(255,255,255,0.28),transparent_42%)]"
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-px bg-white/10" />

          <Link
            to="/"
            className="relative z-10 inline-flex w-fit items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
              <Megaphone className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight sm:text-xl">
              Buzz<span className="text-cyan-200">Hub</span>
            </span>
          </Link>

          <div className="relative z-10 my-auto w-full max-w-xl py-10 lg:py-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[0.62rem] font-extrabold uppercase tracking-[0.16em] backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Platform Buzzer #1 di Indonesia
            </span>
            <h1 className="mt-5 text-balance font-display text-[clamp(1.9rem,3vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.03em]">
              Satu akun untuk semua kampanye Anda.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base">
              Masuk untuk mengelola campaign, memantau performa, dan mencairkan penghasilan —
              semuanya dalam satu dashboard.
            </p>

            <ul className="mt-8 space-y-4">
              {LOGIN_TRUST.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25">
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-5">{item.title}</p>
                    <p className="text-xs leading-4 text-white/75">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {LOGIN_STATS.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 backdrop-blur-sm">
                  <p className="font-numeric text-base font-bold leading-none">{stat.value}</p>
                  <p className="mt-1 text-[0.58rem] font-medium uppercase tracking-[0.08em] text-white/70">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-[11px] text-white/60">© 2026 BuzzHub. Semua hak dilindungi.</p>
        </section>

        {/* Form — langsung di area putih, tanpa kartu */}
        <main className="relative flex items-center justify-center bg-card px-5 py-10 sm:px-8 lg:min-h-screen lg:px-12 lg:py-12 dark:bg-background">
          <Link
            to="/"
            className="group absolute right-6 top-6 inline-flex h-9 items-center gap-1.5 rounded-full border border-border/80 bg-card/80 px-3.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur transition-all duration-200 hover:border-brand/40 hover:bg-card hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 sm:right-10 sm:top-8"
          >
            <ArrowLeft
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            Kembali ke Beranda
          </Link>

          <div className="w-full max-w-[420px]">
            <div className="mb-7">
              <p className="eyebrow text-brand">Selamat datang kembali</p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-[1.75rem]">
                Masuk ke akun
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">Gunakan email & kata sandi Anda.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1.5">
                  <Mail
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="nama@perusahaan.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn(FIELD_CLASS, "pl-9")}
                    required
                  />
                </div>
              </div>

              <PasswordInput
                id="password"
                label="Kata sandi"
                autoComplete="current-password"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />}
                className={FIELD_CLASS}
                required
              />

              {warning && (
                <div
                  role="status"
                  className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2.5 text-sm text-amber-800 dark:border-amber-700/60 dark:bg-amber-500/10 dark:text-amber-200"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{warning}</span>
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 cursor-pointer rounded border-border accent-[color:var(--brand)] transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
                  />
                  Ingat saya
                </label>
                <button
                  type="button"
                  onClick={() => toast.info("Tautan reset sandi telah dikirim ke email Anda.")}
                  className="rounded font-medium text-brand transition-colors hover:text-brand/80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
                >
                  Lupa sandi?
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl gradient-cta font-display text-sm font-bold text-brand-foreground shadow-glow transition-[filter,transform] hover:brightness-110 active:scale-[0.995] focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> Memproses…
                  </>
                ) : (
                  "Masuk"
                )}
              </Button>

            </form>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-5 text-sm">
              <p className="text-muted-foreground">Belum punya akun?</p>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-9 rounded-lg px-2 font-display text-[0.8rem] font-bold text-brand hover:bg-brand/10 hover:text-brand"
              >
                <Link to="/register">
                  Daftar gratis <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <div className="mt-5 text-center text-xs text-muted-foreground">
              <a
                href="mailto:hello@buzzhub.id"
                className="font-medium text-brand transition-colors hover:text-brand/80 hover:underline"
              >
                Butuh bantuan?
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
