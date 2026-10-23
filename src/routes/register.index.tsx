import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, BarChart3, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { registerAccount } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/register/")({
  head: () => ({
    meta: [
      { title: "Daftar Customer — BuzzHub" },
      { name: "description", content: "Buat akun customer BuzzHub dan mulai kampanye buzzer terverifikasi dalam hitungan menit." },
      { property: "og:title", content: "Daftar Customer — BuzzHub" },
      { property: "og:description", content: "Buat akun customer BuzzHub dan mulai kampanye buzzer terverifikasi dalam hitungan menit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RegisterPage,
});

const INDUSTRI = ["Retail", "F&B", "Fintech", "Politik", "Edukasi", "Teknologi", "Kesehatan", "Otomotif", "Lainnya"] as const;

function RegisterPage() {
  const navigate = useNavigate();
  const [industri, setIndustri] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const confirmMismatch = confirm.length > 0 && confirm !== password;

  const handleCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const customerEmail = email.trim();
    if (!name || !customerEmail) return toast.error("Nama dan email wajib diisi.");
    if (!industri) return toast.error("Pilih industri terlebih dulu.");
    if (password.length < 8) return toast.error("Kata sandi minimal 8 karakter.");
    if (confirm !== password) return toast.error("Ulangi kata sandi belum cocok.");

    setLoading(true);
    const phone = String(fd.get("phone") || "").replace(/\D/g, "");
    const city = String(fd.get("city") || "").trim();
    const res = await registerAccount({
      role: "customer",
      name,
      email: customerEmail,
      password,
      phone,
      city,
      company: name,
      industry: industri,
    });
    setLoading(false);
    if (!res.ok) return toast.error(res.message!);
    toast.success("Akun customer berhasil dibuat! Silakan masuk.");
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/30">
      <div className="mx-auto grid min-h-screen max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div className="hidden lg:block">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Kembali ke beranda
          </Link>
          <h1 className="mt-6 font-display text-4xl font-bold leading-tight">
            Mulai perjalanan <span className="text-gradient-brand">viral</span> brand Anda
          </h1>
          <p className="mt-3 text-muted-foreground">
            Daftar gratis dalam 30 detik dan langsung susun kampanye pertama Anda.
          </p>
          <div className="mt-10 grid gap-4">
            {[
              { i: Users, t: "Jangkau audiens lebih luas", d: "Hubungkan campaign Anda dengan buzzer yang sesuai kebutuhan brand." },
              { i: BarChart3, t: "Pantau campaign real-time", d: "Lihat progres campaign, bukti pengerjaan, dan hasilnya dalam satu dashboard." },
              { i: ShieldCheck, t: "Pembayaran transparan", d: "Kelola biaya campaign dengan proses pembayaran yang jelas dan aman." },
            ].map((f) => (
              <div key={f.t} className="rounded-2xl border border-border bg-card p-5">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg gradient-brand text-brand-foreground"><f.i className="h-5 w-5" /></span>
                <h3 className="mt-3 font-display text-lg font-bold">{f.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-glow sm:p-8">
          <Link to="/" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground lg:hidden">
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Link>
          <h2 className="font-display text-2xl font-bold">Buat akun customer</h2>
          <p className="mt-1 text-sm text-muted-foreground">Gratis, tanpa kartu kredit.</p>

          <form onSubmit={handleCustomer} className="mt-6 space-y-4" autoComplete="new-password">
            <div>
              <Label htmlFor="c-name">Nama brand / perusahaan</Label>
              <Input id="c-name" name="name" placeholder="Contoh: PT Kreatif Digital" required />
            </div>
            <div>
              <Label htmlFor="c-email">Email</Label>
              <Input id="c-email" name="customer-email" type="email" autoComplete="new-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@buzzhub.id" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="c-phone">No. WhatsApp</Label>
                <Input id="c-phone" name="phone" inputMode="numeric" pattern="[0-9]*" placeholder="081234567890" onChange={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""); }} />
              </div>
              <div>
                <Label htmlFor="c-city">Kota</Label>
                <Input id="c-city" name="city" placeholder="Contoh: Jakarta" />
              </div>
              <div>
                <Label>Industri</Label>
                <Select value={industri} onValueChange={setIndustri}>
                  <SelectTrigger><SelectValue placeholder="Pilih industri" /></SelectTrigger>
                  <SelectContent>
                    {INDUSTRI.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <PasswordInput
              id="c-pass"
              name="customer-password"
              label="Kata sandi"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              showStrength
              required
            />
            <PasswordInput
              id="c-pass-confirm"
              name="customer-password-confirm"
              label="Ulangi kata sandi"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Ketik ulang kata sandi"
              hint={
                confirm.length === 0
                  ? undefined
                  : confirmMismatch
                    ? "Kata sandi belum cocok."
                    : "Kata sandi cocok."
              }
              hintTone={confirmMismatch ? "error" : "success"}
              required
            />
            <Button type="submit" disabled={loading || confirmMismatch} className="w-full gradient-brand text-brand-foreground hover:opacity-90">
              {loading ? "Memproses..." : "Daftar sebagai Customer"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link to="/login" className="font-semibold text-brand hover:underline">Masuk</Link>
          </p>

        </div>
      </div>
    </div>
  );
}
