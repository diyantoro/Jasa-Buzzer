import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BadgeCheck, Coins, Rocket, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/buzzer-hero.jpg";

export const Route = createFileRoute("/jadi-buzzer")({
  head: () => ({
    meta: [
      { title: "Jadi Buzzer — BuzzHub" },
      { name: "description", content: "Gabung sebagai buzzer BuzzHub: ambil job brand, bangun level dari followers terverifikasi, dan cairkan penghasilan dengan aman." },
      { property: "og:title", content: "Jadi Buzzer — BuzzHub" },
      { property: "og:description", content: "Gabung sebagai buzzer BuzzHub: ambil job brand, bangun level dari followers terverifikasi, dan cairkan penghasilan dengan aman." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JadiBuzzerPage,
});

const BENEFITS = [
  { i: Coins, t: "Penghasilan transparan", d: "Payout per job ditentukan level Anda dan terlihat sebelum job diambil." },
  { i: ShieldCheck, t: "Pembayaran aman", d: "Dana masuk ke dompet dan bisa dicairkan setelah pekerjaan disetujui." },
  { i: TrendingUp, t: "Level naik, payout naik", d: "Semakin besar followers terverifikasi, semakin tinggi nilai job Anda." },
  { i: Users, t: "Brand berkualitas", d: "Job datang dari kampanye brand yang sudah terverifikasi admin." },
];

const STEPS = [
  { n: "01", t: "Daftar & isi akun sosial", d: "Lengkapi data diri dan tambahkan akun media sosial beserta jumlah followers." },
  { n: "02", t: "Verifikasi admin", d: "Admin mengecek keaslian akun lalu menetapkan level buzzer Anda." },
  { n: "03", t: "Ambil job", d: "Pilih job kampanye yang tersedia sesuai platform dan brief brand." },
  { n: "04", t: "Kirim bukti & cairkan", d: "Unggah bukti pengerjaan, disetujui, lalu ajukan pencairan dana." },
];

const LEVELS = [
  { emoji: "🥉", name: "Bronze", range: "0 – 10.000 followers" },
  { emoji: "🥈", name: "Silver", range: "10.001 – 50.000 followers" },
  { emoji: "🥇", name: "Gold", range: "50.001 – 100.000 followers" },
  { emoji: "💎", name: "Platinum", range: "100.001 – 500.000 followers" },
  { emoji: "👑", name: "Diamond", range: "500.000+ followers" },
];

function JadiBuzzerPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border">
        <img src={heroImg} alt="Kreator konten sedang membuat konten kampanye brand" className="absolute inset-0 h-full w-full object-cover opacity-20" loading="lazy" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6 text-muted-foreground hover:text-foreground">
            <Link to="/"><ArrowLeft className="mr-1 h-4 w-4" /> Kembali ke Beranda</Link>
          </Button>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold">
            <Rocket className="h-3.5 w-3.5 text-brand" /> Program Buzzer BuzzHub
          </span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-6xl">
            Ubah pengaruh Anda jadi <span className="text-gradient-brand">penghasilan</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Bergabunglah dengan jaringan buzzer terverifikasi. Ambil job dari brand, kerjakan sesuai brief, dan dapatkan bayaran sesuai level Anda.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="gradient-brand text-brand-foreground hover:opacity-90">
              <Link to="/register/buzzer">Daftar jadi Buzzer <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl font-bold">Kenapa jadi buzzer di BuzzHub?</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div key={b.t} className="rounded-2xl border border-border bg-card p-5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg gradient-brand text-brand-foreground"><b.i className="h-5 w-5" /></span>
              <h3 className="mt-3 font-display text-lg font-bold">{b.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-accent/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl font-bold">Cara kerjanya</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-2xl border border-border bg-card p-5">
                <span className="font-display text-2xl font-bold text-gradient-brand">{s.n}</span>
                <h3 className="mt-2 font-display text-lg font-bold">{s.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl font-bold">Sistem level buzzer</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Level ditentukan dari total followers akun media sosial yang telah diverifikasi admin. Nominal payout tiap level diatur oleh admin.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {LEVELS.map((l) => (
            <div key={l.name} className="rounded-2xl border border-border bg-card p-5 text-center">
              <div className="text-3xl">{l.emoji}</div>
              <h3 className="mt-2 font-display text-lg font-bold">{l.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{l.range}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <BadgeCheck className="h-4 w-4 text-brand" /> Level ditetapkan admin saat verifikasi dan tidak berubah otomatis.
        </p>
      </section>

    </div>
  );
}
