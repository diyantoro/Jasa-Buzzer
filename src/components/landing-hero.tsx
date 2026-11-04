import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  Instagram,
  Megaphone,
  MessageCircle,
  Music2,
  Star,
  Target,
  TrendingUp,
  Twitter,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useCountUp } from "@/hooks/use-count-up";
import { stats } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import creatorIllustration from "@/assets/hero-illustration.png";

/* -------------------------------------------------------------------------- */
/* Placeholder yang mudah diganti                                             */
/* -------------------------------------------------------------------------- */

/**
 * Avatar bukti sosial. Tambahkan `src: "/nama-file.jpg"` (taruh di `public/`)
 * untuk memakai foto asli; tanpa `src` akan tampil inisial + gradient.
 */
const SOCIAL_AVATARS: { initials: string; gradient: string; src?: string }[] = [
  { initials: "RA", gradient: "from-sky-400 to-blue-600" },
  { initials: "DP", gradient: "from-cyan-400 to-teal-500" },
  { initials: "SW", gradient: "from-indigo-400 to-brand" },
  { initials: "NF", gradient: "from-accent-warm to-amber-500" },
  { initials: "BK", gradient: "from-blue-500 to-cyan-400" },
];

/** Angka bukti sosial — ganti sesuai data asli. */
const SOCIAL_PROOF = {
  brands: "300+",
  buzzers: "8.000+",
  rating: "4.9/5",
  reviews: "dari 300+ ulasan",
};

/** Angka pada kartu visual kanan — ganti sesuai data kampanye. */
const LIVE_METRICS = {
  reach: "+12.4K",
  reachChange: "+38% vs kemarin",
  engagement: "2.1K",
  chartGrowth: "+64%",
};

/** Statistik utama. Nilai diambil dari `src/lib/mock-data.ts`. */
const HERO_STATS = [
  { label: "Kampanye Selesai", value: stats.totalCampaigns, icon: Megaphone },
  { label: "Buzzer Aktif", value: stats.activeBuzzers, icon: Users },
  { label: "Klien Puas", value: stats.satisfiedClients, icon: Star },
  { label: "Target Tercapai", value: stats.trendingHits, suffix: "%", icon: Target },
] as const;

/* -------------------------------------------------------------------------- */
/* Sub-komponen                                                               */
/* -------------------------------------------------------------------------- */

function StatCard({ stat }: { stat: (typeof HERO_STATS)[number] }) {
  const { ref, value } = useCountUp(stat.value);
  const Icon = stat.icon;

  return (
    <div className="group flex h-full flex-col gap-1.5 rounded-2xl border border-border/70 bg-card/75 p-2.5 shadow-sm backdrop-blur-md transition-[transform,box-shadow,border-color] duration-300 hover:border-brand/40 hover:shadow-lg motion-safe:hover:-translate-y-1">
      <span className="grid h-8 w-8 place-items-center rounded-full gradient-brand text-brand-foreground shadow-glow">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <p className="font-display text-[0.6rem] font-extrabold uppercase leading-tight tracking-[0.1em] text-muted-foreground">
        {stat.label}
      </p>
      <p className="mt-auto font-numeric text-[1.45rem] font-bold leading-none tracking-tight text-foreground sm:text-[1.55rem]">
        <span ref={ref}>{value.toLocaleString("id-ID")}</span>
        {"suffix" in stat ? stat.suffix : null}
      </p>
    </div>
  );
}

function FloatingCard({
  className,
  delay,
  slow = false,
  children,
}: {
  className?: string;
  delay: string;
  slow?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "glass-float absolute rounded-2xl p-3",
        slow ? "motion-safe:animate-float-slow" : "motion-safe:animate-float",
        className,
      )}
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  );
}

function SocialChip({
  className,
  delay,
  children,
}: {
  className?: string;
  delay: string;
  children: ReactNode;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "glass-float absolute grid h-10 w-10 place-items-center rounded-full text-brand motion-safe:animate-float-slow dark:text-brand-glow",
        className,
      )}
      style={{ animationDelay: delay }}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

export function LandingHero() {
  return (
    <section className="hero-mesh relative overflow-hidden">
      {/* Blob dekoratif: bagian dari gradient mesh, bukan konten. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 right-[-6%] h-[420px] w-[420px] rounded-full bg-brand-glow/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-[-8%] h-[360px] w-[360px] rounded-full bg-accent-warm/10 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:flex lg:min-h-[90svh] lg:items-center lg:py-6 [@media(max-height:720px)]:py-3">
        <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-[clamp(2rem,4vw,4rem)]">
          {/* Kolom kiri: copy, CTA, bukti sosial, statistik */}
          <div className="min-w-0 max-w-[660px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-card/70 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm backdrop-blur-md sm:px-4 sm:text-sm">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent-warm opacity-75 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-warm" />
              </span>
              <span className="font-semibold tracking-wide">
                {stats.activeBuzzers.toLocaleString("id-ID")} Buzzer aktif siap kampanye minggu ini
              </span>
            </span>

            <h1 className="mt-4 font-display text-[clamp(1.85rem,min(3.4vw,5.5svh),3.1rem)] font-extrabold leading-[1.08] tracking-[-0.035em] text-balance text-foreground">
              Buat Brand Anda Lebih{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="text-gradient-buzz">Ramai,</span>
                {/* Garis bawah bergelombang: dekoratif, warnanya ikut aksen hangat. */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 120 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1.5 left-0 h-2.5 w-[82%] text-accent-warm"
                >
                  <path
                    d="M2 8.5c14-7 28-7 42 0s28 7 42 0 14-6 32-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              <span className="text-gradient-brand">Lebih Dikenal, Lebih Dipercaya</span>
            </h1>

            <p className="mt-4 max-w-[54ch] text-pretty text-base leading-[1.65] text-foreground/75 sm:text-[1rem]">
              Jangkau ribuan audiens lewat buzzer terkurasi di Instagram, TikTok, dan X. Pantau
              hasilnya real-time.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button
                asChild
                size="lg"
                className="group gradient-cta h-12 w-full rounded-xl px-6 font-display text-[1.19rem] font-bold text-white shadow-glow transition-all duration-300 hover:shadow-glow-active motion-safe:hover:-translate-y-0.5 sm:w-auto"
              >
                <Link to="/register">
                  Mulai Kampanye
                  <ArrowRight className="ml-1 transition-transform duration-300 motion-safe:group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 w-full rounded-xl border-border bg-card/60 px-6 font-display text-base font-bold backdrop-blur-sm transition-all duration-300 hover:border-accent-warm/40 hover:bg-accent-warm/10 hover:text-foreground sm:w-auto"
              >
                <Link to="/register/buzzer">Daftar jadi Buzzer</Link>
              </Button>
            </div>

            {/* Bukti sosial di atas lipatan */}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2.5">
              <div className="flex -space-x-3" aria-hidden="true">
                {SOCIAL_AVATARS.map((avatar) => (
                  <span
                    key={avatar.initials}
                    className={cn(
                      "relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-gradient-to-br text-[0.58rem] font-bold text-white shadow-sm sm:h-9 sm:w-9",
                      avatar.gradient,
                    )}
                  >
                    {avatar.src ? (
                      <img
                        src={avatar.src}
                        alt=""
                        width={72}
                        height={72}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      avatar.initials
                    )}
                  </span>
                ))}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  Dipercaya <span className="font-numeric">{SOCIAL_PROOF.brands}</span> brand &amp;{" "}
                  <span className="font-numeric">{SOCIAL_PROOF.buzzers}</span> buzzer
                </p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="flex items-center gap-0.5 text-accent-warm" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </span>
                  <span className="font-numeric text-xs font-bold text-foreground">
                    {SOCIAL_PROOF.rating}
                  </span>
                  <span className="text-xs text-muted-foreground">{SOCIAL_PROOF.reviews}</span>
                </div>
              </div>
            </div>

            {/* Trust markers lama tetap dipertahankan */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-muted-foreground sm:text-[0.78rem]">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-brand" aria-hidden="true" /> Konsultasi gratis
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-brand" aria-hidden="true" /> Tanpa kontrak
                panjang
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-brand" aria-hidden="true" /> Garansi 100%
                refund
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
              {HERO_STATS.map((stat) => (
                <StatCard key={stat.label} stat={stat} />
              ))}
            </div>
          </div>

          {/* Kolom kanan: komposisi visual bebas tanpa bingkai putih */}
          <div className="relative mx-auto w-full max-w-[520px] px-4 sm:px-6">
            <div className="relative mx-auto w-full max-w-[420px]">
              {/* Glow di belakang ilustrasi */}
              <div
                aria-hidden="true"
                className="absolute -inset-5 rounded-[3rem] bg-gradient-to-tr from-brand/35 via-brand-glow/25 to-accent-warm/25 blur-2xl"
              />

              {/* Ilustrasi utama — ganti `creatorIllustration` di bagian import. */}
              <div className="relative rounded-[2rem] bg-gradient-to-br from-brand/70 via-brand-glow/70 to-accent-warm/70 p-[2px] shadow-2xl">
                <div className="overflow-hidden rounded-[calc(2rem-2px)] bg-muted">
                  <img
                    src={creatorIllustration}
                    alt="Ilustrasi kampanye viral BuzzHub di Instagram, TikTok, X, dan platform sosial lainnya"
                    width={1024}
                    height={1024}
                    loading="eager"
                    fetchPriority="high"
                    className="block aspect-square h-auto w-full object-cover object-center dark:brightness-[0.94]"
                  />
                </div>
              </div>

              {/* Ikon sosmed kecil sebagai pelengkap */}
              <SocialChip className="left-[1%] top-[1%]" delay="0.4s">
                <Instagram className="h-4 w-4" />
              </SocialChip>
              <SocialChip className="right-[1%] top-[30%]" delay="1.6s">
                <Music2 className="h-4 w-4" />
              </SocialChip>
              <SocialChip className="right-[5%] top-[0%]" delay="0.9s">
                <Twitter className="h-4 w-4" />
              </SocialChip>

              {/* Reach hari ini */}
              <FloatingCard
                className="-left-2 top-[14%] w-[9rem] sm:-left-4 sm:w-[10.25rem]"
                delay="0s"
              >
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full gradient-brand text-brand-foreground">
                    <TrendingUp className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-numeric text-lg font-bold leading-none text-foreground">
                      {LIVE_METRICS.reach}
                    </p>
                    <p className="mt-0.5 text-[0.62rem] font-medium text-muted-foreground">
                      reach hari ini
                    </p>
                  </div>
                </div>
                <p className="mt-1.5 text-[0.6rem] font-semibold text-brand dark:text-brand-glow">
                  ▲ {LIVE_METRICS.reachChange}
                </p>
              </FloatingCard>

              {/* Campaign live */}
              <FloatingCard
                className="-right-2 top-[42%] w-[9rem] sm:-right-3 sm:w-[10rem]"
                delay="1.3s"
                slow
              >
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-accent-warm opacity-70 motion-safe:animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-warm" />
                  </span>
                  <p className="font-display text-[0.66rem] font-extrabold uppercase tracking-[0.1em] text-accent-warm-ink">
                    Campaign Live
                  </p>
                </div>
                <p className="mt-1.5 font-numeric text-xl font-bold leading-none text-foreground">
                  {LIVE_METRICS.engagement}
                </p>
                <p className="text-[0.62rem] text-muted-foreground">engagement</p>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[72%] rounded-full gradient-brand" />
                </div>
              </FloatingCard>

              {/* Notifikasi komentar */}
              <FloatingCard
                className="-left-2 bottom-[18%] hidden w-[10rem] sm:-left-4 sm:block sm:w-[11.5rem]"
                delay="0.7s"
              >
                <div className="flex items-start gap-2">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-glow text-[0.6rem] font-bold text-white">
                    RA
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[0.65rem] font-semibold text-foreground">
                      rani_amelia
                    </p>
                    <p className="text-[0.62rem] leading-snug text-muted-foreground">
                      "Keren banget, langsung checkout! 🔥"
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[0.58rem] text-muted-foreground">
                      <span className="inline-flex items-center gap-0.5 text-accent-warm">
                        <Heart className="h-3 w-3 fill-current" /> 214
                      </span>
                      <span className="inline-flex items-center gap-0.5">
                        <MessageCircle className="h-3 w-3" /> 32
                      </span>
                      <span>baru saja</span>
                    </div>
                  </div>
                </div>
              </FloatingCard>

              {/* Mini grafik engagement */}
              <FloatingCard
                className="-right-2 bottom-[2%] hidden w-[8.75rem] sm:-right-3 sm:block sm:w-[10rem]"
                delay="2s"
                slow
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[0.62rem] font-semibold text-muted-foreground">Engagement</p>
                  <span className="rounded-full bg-brand/10 px-1.5 py-0.5 font-numeric text-[0.6rem] font-bold text-brand dark:text-brand-glow">
                    {LIVE_METRICS.chartGrowth}
                  </span>
                </div>
                <svg viewBox="0 0 120 44" className="mt-1 h-11 w-full" aria-hidden="true">
                  <defs>
                    <linearGradient id="buzzhub-hero-spark" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M2 36C14 34 20 30 30 31S48 24 58 25 74 15 84 17 104 8 118 5"
                    fill="none"
                    stroke="var(--brand)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M2 36C14 34 20 30 30 31S48 24 58 25 74 15 84 17 104 8 118 5L118 44L2 44Z"
                    fill="url(#buzzhub-hero-spark)"
                  />
                  <circle cx="118" cy="5" r="3" fill="var(--accent-warm)" />
                </svg>
                <p className="text-[0.58rem] text-muted-foreground">7 hari terakhir</p>
              </FloatingCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
