import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Loader2, Mail, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { setSession, findAccount, registerAccount, type Role, type Session } from "@/lib/auth";
import { assignLevelFromVerification } from "@/lib/buzzer-level";
import { getApplicationByEmail } from "@/lib/buzzer-verification";
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
    const demo = USERS.find(
      (u) => u.email.toLowerCase() === emailLc && u.password === password,
    );
    let user: Session | null = await findAccount(emailLc, password);

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
        user = await findAccount(emailLc, password);
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
        await assignLevelFromVerification(app.email, app.name, app.followers);

        const restoredUser = await findAccount(app.email, password);
        setSession(
          restoredUser ?? {
            role: "buzzer",
            name: app.name,
            email: app.email,
            phone: app.phone,
            city: app.city,
            bio: app.bio,
            username: app.username,
            platform: app.platform,
            followers: app.followers,
          }
        );
        if (remember) localStorage.setItem("buzzhub.remember", app.email);
        toast.success(`Selamat datang, ${app.name}!`);
        navigate({ to: `/buzzer` });
        return;
      }
    }

    if (!user) {
      setLoading(false);
      setError("Email atau kata sandi salah. Coba akun demo di bawah.");
      return;
    }

    setSession(user);
    if (remember) localStorage.setItem("buzzhub.remember", user.email);
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
    navigate({ to: `/${user.role}` as never });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-background to-blue-50">
      <div className="mx-auto grid min-h-screen max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-12">
        {/* Left */}
        <div className="space-y-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Kembali ke beranda
          </Link>

          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-brand" /> Platform Buzzer #1 di Indonesia
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Masuk ke <span className="text-gradient-brand">BuzzHub</span>
            </h1>
            <p className="mt-3 max-w-md text-muted-foreground">
              Satu login untuk semua peran. Sistem akan mengarahkan Anda otomatis ke dashboard sesuai role akun.
            </p>
          </div>

        </div>

        {/* Right — form */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-glow sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl gradient-brand text-brand-foreground">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold">Masuk ke akun</h2>
              <p className="text-sm text-muted-foreground">Gunakan email & kata sandi Anda.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nama@perusahaan.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
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
              required
            />

            {warning && (
              <div role="status" className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-700/60 dark:bg-amber-500/10 dark:text-amber-200">
                {warning}
              </div>
            )}

            {error && (
              <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-[color:var(--brand)]"
                />
                Ingat saya
              </label>
              <button
                type="button"
                onClick={() => toast.info("Tautan reset sandi telah dikirim ke email Anda.")}
                className="font-medium text-brand hover:underline"
              >
                Lupa sandi?
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full gradient-brand text-brand-foreground hover:opacity-90"
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses…</>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link to="/register" className="font-semibold text-brand hover:underline">
              Daftar gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
