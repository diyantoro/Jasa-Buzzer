import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Megaphone,
  Rocket,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { services, testimonials, stats, formatIDR } from "@/lib/mock-data";
import heroIllustration from "@/assets/hero-illustration.png";
import heroBgTexture from "@/assets/hero-bg-texture.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BuzzHub — Platform Jasa Buzzer & Viral Marketing #1 Indonesia" },
      {
        name: "description",
        content:
          "Naikkan brand Anda ke trending topic dengan ribuan buzzer terverifikasi. Layanan Instagram, TikTok, X, YouTube, Facebook.",
      },
      {
        property: "og:title",
        content: "BuzzHub — Platform Jasa Buzzer & Viral Marketing #1 Indonesia",
      },
      {
        property: "og:description",
        content:
          "Naikkan brand Anda ke trending topic dengan ribuan buzzer terverifikasi. Layanan Instagram, TikTok, X, YouTube, Facebook.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/50 via-background to-background" />
        <div className="absolute -top-40 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 -z-10 h-[400px] w-[400px] rounded-full bg-brand-glow/20 blur-3xl" />

        <div className="mx-auto flex w-full max-w-7xl items-center px-4 py-8 sm:px-6 sm:py-10 lg:min-h-[calc(100svh-var(--navbar-height))] lg:py-6 [@media(max-height:640px)]:py-3">
          <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-[clamp(1.5rem,3vw,3.5rem)]">
            <div className="min-w-0 max-w-[680px]">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-3 py-1.5 text-xs font-semibold text-foreground shadow-xs sm:px-4 sm:text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
                </span>
                <span className="font-semibold tracking-wide">
                  8.420 Buzzer aktif siap kampanye minggu ini
                </span>
              </span>
              <h1 className="mt-4 font-display text-[clamp(1.9rem,min(3.4vw,6.4svh),3.25rem)] leading-[1.05] font-extrabold tracking-[-0.035em] text-balance text-foreground [@media(max-height:640px)]:text-[clamp(1.65rem,min(3vw,5.4svh),2.5rem)]">
                Buat Brand Anda Lebih Ramai,{" "}
                <span className="text-gradient-brand">Lebih Dikenal, Lebih Dipercaya</span>
              </h1>
              <p className="mt-4 max-w-[56ch] text-pretty text-base leading-[1.7] text-foreground/75 sm:text-[1.05rem] [@media(max-height:640px)]:mt-3 [@media(max-height:640px)]:text-sm">
                Tingkatkan popularitas bisnis lewat strategi buzzer online dan offline. Jangkau lebih
                banyak audiens, bangun kepercayaan, dan ciptakan dampak nyata untuk bisnis Anda.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 [@media(max-height:640px)]:mt-4">
                <Button
                  asChild
                  size="lg"
                  className="gradient-brand h-12 w-full text-brand-foreground shadow-glow hover:opacity-90 hover:shadow-glow-active sm:w-auto font-display text-base font-bold"
                >
                  <Link to="/register">
                    Mulai Kampanye <ArrowRight className="ml-1.5 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 w-full font-display text-base font-bold sm:w-auto"
                >
                  <Link to="/register/buzzer">Daftar jadi Buzzer</Link>
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground sm:text-sm [@media(max-height:640px)]:hidden">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-brand" /> Konsultasi gratis
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-brand" /> Tanpa kontrak panjang
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-brand" /> Garansi 100% refund
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-3 [@media(max-height:640px)]:mt-4">
                {[
                  { l: "Kampanye", v: stats.totalCampaigns.toLocaleString("id-ID"), i: Megaphone },
                  { l: "Buzzer Aktif", v: stats.activeBuzzers.toLocaleString("id-ID"), i: Users },
                  { l: "Klien Puas", v: stats.satisfiedClients.toLocaleString("id-ID"), i: Star },
                  {
                    l: "Trending #1",
                    v: stats.trendingHits.toLocaleString("id-ID"),
                    i: TrendingUp,
                  },
                ].map((s) => (
                  <div
                    key={s.l}
                    className="flex h-full flex-col gap-1.5 rounded-xl border border-border bg-muted p-3 shadow-md transition-colors hover:border-brand/40"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand/15 text-brand">
                      <s.i className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <dt className="font-display text-[0.6rem] font-extrabold uppercase leading-none tracking-[0.12em] text-muted-foreground">
                      {s.l}
                    </dt>
                    <dd className="mt-auto font-numeric text-xl font-bold tracking-tight text-foreground">
                      {s.v}
                    </dd>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex min-w-0 items-center justify-center lg:-translate-y-4">
              <div className="w-full max-w-[min(480px,calc(100svh-var(--navbar-height)-4rem))] overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-md sm:p-2.5">
                <img
                  src={heroIllustration}
                  alt="Ilustrasi kampanye viral di Instagram, TikTok, X, YouTube, dan Facebook dengan ribuan buzzer terverifikasi"
                  width={1024}
                  height={1024}
                  className="block aspect-square h-auto w-full rounded-xl object-contain"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="layanan" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-brand">Paket &amp; Harga</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
            Pilih paket sesuai tujuan
          </h2>
          <p className="mt-3 text-muted-foreground">
            Harga transparan, hasil terukur, buzzer real people.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <div
              key={s.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
            >
              {i === 2 && (
                <span className="absolute right-4 top-4 rounded-full gradient-brand px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-brand-foreground shadow-glow">
                  Popular
                </span>
              )}
              <span
                className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${
                  s.type === "Offline"
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                    : "bg-accent text-accent-foreground"
                }`}
              >
                {s.type === "Offline" ? "Offline" : s.platform}
              </span>
              <h3 className="mt-4 font-display text-xl font-bold leading-snug">{s.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              <div className="mt-5 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Mulai dari
                  </p>
                  <p className="font-numeric text-[1.45rem] font-bold leading-tight text-gradient-brand">
                    {formatIDR(s.price)}
                  </p>
                  <p className="text-xs text-muted-foreground">{s.buzzers} buzzer terlibat</p>
                </div>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="font-display font-bold group-hover:gradient-brand group-hover:border-transparent group-hover:text-brand-foreground"
                >
                  <Link to="/login">Pesan</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section id="proses" className="bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-brand">Cara Kerja</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
              Proses simpel, hasil maksimal
            </h2>
            <p className="mt-3 text-muted-foreground">
              Dari brief sampai laporan, semua diurus campaign manager Anda.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {[
              { i: Rocket, t: "Pilih Paket", d: "Tentukan platform & target campaign Anda." },
              {
                i: Users,
                t: "Buzzer Matching",
                d: "Sistem alokasi buzzer sesuai niche & audiens.",
              },
              { i: Megaphone, t: "Eksekusi Serentak", d: "Kampanye live dengan jadwal terkurasi." },
              { i: BarChart3, t: "Laporan Real-time", d: "Pantau reach, engagement, & sentiment." },
            ].map((p, idx) => (
              <div
                key={p.t}
                className="relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
              >
                <span className="absolute -top-3 left-6 grid h-7 w-7 place-items-center rounded-full gradient-brand font-numeric text-sm font-bold text-brand-foreground">
                  {idx + 1}
                </span>
                <p.i className="mb-3 h-6 w-6 text-brand" />
                <h3 className="font-display text-lg font-bold">{p.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimoni" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-brand">Testimoni</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
            Dipercaya Brand dan Figur Publik
          </h2>
          <p className="mt-3 text-muted-foreground">
            {stats.satisfiedClients}+ klien puas dengan kampanye yang terukur.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex gap-0.5 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 text-base">"{t.quote}"</blockquote>
              <figcaption className="mt-4 text-sm">
                <p className="font-semibold">{t.name}</p>
                <p className="text-muted-foreground">{t.company}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl gradient-brand p-10 text-center text-brand-foreground shadow-glow sm:p-16">
          <img
            src={heroBgTexture}
            alt=""
            width={1920}
            height={1080}
            className="absolute inset-0 h-full w-full object-cover opacity-40"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent)]" />
          <div className="relative">
            <p className="eyebrow text-brand-foreground/75">Mulai Sekarang</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
              Siap viral minggu ini?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-brand-foreground/85">
              Konsultasi gratis dengan campaign manager kami. Tanpa kontrak panjang.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="font-display font-bold shadow-lg"
              >
                <Link to="/register">Daftar sebagai Customer</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent font-display font-bold text-brand-foreground hover:bg-white/10"
              >
                <Link to="/login">Sudah punya akun? Masuk</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Buzzer terverifikasi KYC
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Garansi 100% refund
              </span>
              <span className="inline-flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Laporan real-time
              </span>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground sm:px-6">
          © 2026 BuzzHub Indonesia. Semua hak dilindungi.
        </div>
      </footer>
    </div>
  );
}
