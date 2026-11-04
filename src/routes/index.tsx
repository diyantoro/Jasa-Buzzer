import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Megaphone,
  Quote,
  Rocket,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { LandingHero } from "@/components/landing-hero";
import { services, testimonials, stats, formatIDR } from "@/lib/mock-data";
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

/* -------------------------------------------------------------------------- */
/* Potongan UI yang dipakai berulang agar semua section terasa satu keluarga   */
/* -------------------------------------------------------------------------- */

function SectionHeading({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-card/70 px-3 py-1.5 shadow-sm backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-accent-warm" aria-hidden="true" />
        <span className="eyebrow text-brand dark:text-brand-glow">{kicker}</span>
      </span>
      <h2 className="mt-4 font-display text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold leading-[1.12] tracking-[-0.03em] text-foreground">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-pretty text-[0.95rem] leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

const testimonialGradients = [
  "from-brand to-brand-glow",
  "from-brand-glow to-accent-warm",
  "from-accent-warm to-brand",
];

const processSteps = [
  { icon: Rocket, title: "Pilih Paket", desc: "Tentukan platform & target campaign Anda." },
  {
    icon: Users,
    title: "Buzzer Matching",
    desc: "Sistem alokasi buzzer sesuai niche & audiens.",
  },
  {
    icon: Megaphone,
    title: "Eksekusi Serentak",
    desc: "Kampanye live dengan jadwal terkurasi.",
  },
  {
    icon: BarChart3,
    title: "Laporan Real-time",
    desc: "Pantau reach, engagement, & sentiment.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <LandingHero />

      {/* Services */}
      <section id="layanan" className="relative scroll-mt-24 overflow-hidden py-16 sm:py-24">
        {/* Aksen latar agar transisi dari hero tidak terasa datar */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-[-10%] h-[320px] w-[320px] rounded-full bg-brand-glow/12 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-[-10%] h-[280px] w-[280px] rounded-full bg-brand/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            kicker="Paket & Harga"
            title="Pilih paket sesuai tujuan"
            description="Harga transparan, hasil terukur, buzzer real people."
          />

          <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {services.map((s, i) => (
              <article
                key={s.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur-md transition-[transform,box-shadow,border-color] duration-300 hover:border-brand/40 hover:shadow-lg motion-safe:hover:-translate-y-1 sm:p-6"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-brand/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                />

                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.66rem] font-bold uppercase tracking-[0.1em] ${
                      s.type === "Offline"
                        ? "border-accent-warm/30 bg-accent-warm/12 text-accent-warm-ink"
                        : "border-brand/25 bg-brand/10 text-brand dark:text-brand-glow"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full ${
                        s.type === "Offline" ? "bg-accent-warm" : "bg-brand dark:bg-brand-glow"
                      }`}
                    />
                    {s.type === "Offline" ? "Offline" : s.platform}
                  </span>
                  {i === 2 && (
                    <span className="rounded-full gradient-brand px-2.5 py-0.5 text-[0.6rem] font-extrabold uppercase tracking-[0.12em] text-[#061a2e] shadow-glow">
                      Popular
                    </span>
                  )}
                </div>

                <h3 className="mt-4 font-display text-lg font-bold leading-snug text-foreground sm:text-xl">
                  {s.name}
                </h3>
                <p className="mb-5 mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>

                <div className="mt-auto flex items-end justify-between gap-3 border-t border-border/60 pt-4">
                  <div className="min-w-0">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Mulai dari
                    </p>
                    <p className="font-numeric text-[1.4rem] font-bold leading-tight text-brand dark:text-brand-glow">
                      {formatIDR(s.price)}
                    </p>
                    <p className="text-xs text-muted-foreground">{s.buzzers} buzzer terlibat</p>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="shrink-0 rounded-xl border-border/80 font-display font-bold transition-colors group-hover:gradient-brand group-hover:border-transparent group-hover:text-[#061a2e]"
                  >
                    <Link to="/login">Pesan</Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section
        id="proses"
        className="relative scroll-mt-24 overflow-hidden bg-muted/40 py-16 sm:py-24"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-40 w-[85%] -translate-x-1/2 rounded-full bg-brand-glow/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            kicker="Cara Kerja"
            title="Proses simpel, hasil maksimal"
            description="Dari brief sampai laporan, semua diurus campaign manager Anda."
          />

          <div className="relative mt-10 sm:mt-12">
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-4">
              {processSteps.map((step, idx) => (
                <div
                  key={step.title}
                  className="group relative rounded-2xl border border-border/70 bg-card/85 p-5 pt-7 shadow-sm backdrop-blur-md transition-[transform,box-shadow,border-color] duration-300 hover:border-brand/40 hover:shadow-lg motion-safe:hover:-translate-y-1"
                >
                  <span className="absolute -top-3 left-5 grid h-6 w-6 place-items-center rounded-full gradient-brand font-numeric text-[0.7rem] font-bold text-[#061a2e] shadow-glow">
                    {idx + 1}
                  </span>
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand dark:text-brand-glow">
                    <step.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 font-display text-base font-bold leading-snug text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimoni" className="relative scroll-mt-24 py-16 sm:py-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            kicker="Testimoni"
            title="Dipercaya Brand dan Figur Publik"
            description={`${stats.satisfiedClients}+ klien puas dengan kampanye yang terukur.`}
          />

          <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-5 md:grid-cols-3">
            {testimonials.map((t, idx) => (
              <figure
                key={t.name}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur-md transition-[transform,box-shadow,border-color] duration-300 hover:border-brand/40 hover:shadow-lg motion-safe:hover:-translate-y-1 sm:p-6"
              >
                <Quote
                  aria-hidden="true"
                  className="absolute right-5 top-5 h-8 w-8 text-brand/10"
                />
                <div className="flex gap-0.5 text-accent-warm">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="mb-5 mt-4 text-[0.95rem] leading-relaxed text-foreground/85">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-3 border-t border-border/60 pt-4">
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br text-[0.65rem] font-bold text-[#061a2e] ${
                      testimonialGradients[idx % testimonialGradients.length]
                    }`}
                    aria-hidden="true"
                  >
                    {initials(t.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{t.company}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="relative overflow-hidden rounded-3xl gradient-brand px-6 py-12 text-center shadow-glow sm:px-10 sm:py-16">
          <img
            src={heroBgTexture}
            alt=""
            width={1920}
            height={1080}
            className="absolute inset-0 h-full w-full object-cover opacity-30"
            loading="lazy"
          />
          {/* Overlay gelap tipis supaya teks putih tetap lulus kontras di seluruh gradient */}
          <div aria-hidden="true" className="absolute inset-0 bg-[#061a2e]/35" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_60%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-accent-warm/35 blur-3xl"
          />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-warm" aria-hidden="true" />
              Mulai Sekarang
            </span>
            <h2 className="mt-4 font-display text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold leading-[1.12] tracking-[-0.03em] text-white">
              Siap viral minggu ini?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-pretty text-sm leading-relaxed text-white/90 sm:text-base">
              Konsultasi gratis dengan campaign manager kami. Tanpa kontrak panjang.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="rounded-xl bg-white font-display font-bold text-brand shadow-lg hover:bg-white/90"
              >
                <Link to="/register">Daftar sebagai Customer</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-xl border-white/40 bg-white/5 font-display font-bold text-white backdrop-blur-sm hover:bg-white/15 hover:text-white"
              >
                <Link to="/login">Sudah punya akun? Masuk</Link>
              </Button>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/90 sm:text-sm">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" /> Buzzer terverifikasi KYC
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Garansi 100% refund
              </span>
              <span className="inline-flex items-center gap-2">
                <TrendingUp className="h-4 w-4" aria-hidden="true" /> Laporan real-time
              </span>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/70 bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm">
              <Link to="/" className="flex items-center gap-2">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl gradient-brand text-brand-foreground shadow-glow">
                  <Megaphone className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-display text-lg font-bold tracking-tight">
                  Buzz<span className="text-gradient-brand">Hub</span>
                </span>
              </Link>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Platform jasa buzzer online &amp; offline untuk brand yang ingin lebih ramai, lebih
                dikenal, dan lebih dipercaya.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6 text-sm sm:grid-cols-3">
              <div>
                <p className="font-display text-xs font-extrabold uppercase tracking-[0.16em] text-foreground">
                  Jelajahi
                </p>
                <ul className="mt-3 space-y-2 text-muted-foreground">
                  <li>
                    <a href="/#layanan" className="hover:text-foreground">
                      Layanan
                    </a>
                  </li>
                  <li>
                    <a href="/#proses" className="hover:text-foreground">
                      Proses
                    </a>
                  </li>
                  <li>
                    <a href="/#testimoni" className="hover:text-foreground">
                      Testimoni
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-display text-xs font-extrabold uppercase tracking-[0.16em] text-foreground">
                  Mulai
                </p>
                <ul className="mt-3 space-y-2 text-muted-foreground">
                  <li>
                    <Link to="/register" className="hover:text-foreground">
                      Daftar Customer
                    </Link>
                  </li>
                  <li>
                    <Link to="/register/buzzer" className="hover:text-foreground">
                      Daftar Buzzer
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="hover:text-foreground">
                      Masuk
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="font-display text-xs font-extrabold uppercase tracking-[0.16em] text-foreground">
                  Terhubung
                </p>
                <ul className="mt-3 space-y-2 text-muted-foreground">
                  <li>hello@buzzhub.id</li>
                  <li>Jakarta, Indonesia</li>
                  <li>Senin–Jumat, 09.00–18.00</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 BuzzHub Indonesia. Semua hak dilindungi.</p>
            <p className="inline-flex items-center gap-1.5">
              Dibuat untuk brand yang ingin lebih ramai
              <ArrowRight className="h-3.5 w-3.5 text-accent-warm" aria-hidden="true" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
