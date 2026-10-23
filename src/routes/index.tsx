import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, CheckCircle2, Megaphone, Rocket, ShieldCheck, Sparkles, Star, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { services, testimonials, stats, formatIDR } from "@/lib/mock-data";
import heroIllustration from "@/assets/hero-illustration.png";
import heroBgTexture from "@/assets/hero-bg-texture.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BuzzHub — Platform Jasa Buzzer & Viral Marketing #1 Indonesia" },
      { name: "description", content: "Naikkan brand Anda ke trending topic dengan ribuan buzzer terverifikasi. Layanan Instagram, TikTok, X, YouTube, Facebook." },
      { property: "og:title", content: "BuzzHub — Platform Jasa Buzzer & Viral Marketing #1 Indonesia" },
      { property: "og:description", content: "Naikkan brand Anda ke trending topic dengan ribuan buzzer terverifikasi. Layanan Instagram, TikTok, X, YouTube, Facebook." },
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

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-brand" />
                8.420 Buzzer aktif tersebar di Indonesia
              </span>
              <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Jadikan brand Anda <span className="text-gradient-brand">trending topic</span> hari ini juga.
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">
                BuzzHub menghubungkan brand, partai, dan UMKM dengan ribuan buzzer terverifikasi
                untuk kampanye viral di Instagram, TikTok, X, YouTube, dan Facebook.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="gradient-brand text-brand-foreground shadow-glow hover:opacity-90">
                  <Link to="/register">Mulai Kampanye <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/register/buzzer">Daftar jadi Buzzer</Link>
                </Button>
              </div>
              <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-border shadow-sm">
                <dl className="grid grid-cols-2 gap-px sm:grid-cols-4">
                  {[
                    { l: "Kampanye", v: stats.totalCampaigns.toLocaleString("id-ID"), i: Megaphone },
                    { l: "Buzzer Aktif", v: stats.activeBuzzers.toLocaleString("id-ID"), i: Users },
                    { l: "Klien Puas", v: stats.satisfiedClients.toLocaleString("id-ID"), i: Star },
                    { l: "Trending #1", v: stats.trendingHits.toLocaleString("id-ID"), i: TrendingUp },
                  ].map((s) => (
                    <div key={s.l} className="flex flex-col gap-1.5 bg-card px-5 py-4">
                      <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        <s.i className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden="true" />
                        {s.l}
                      </dt>
                      <dd className="font-display text-2xl font-bold leading-none tabular-nums">{s.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl border border-border bg-card/50 p-4 shadow-glow backdrop-blur-sm">
                <img
                  src={heroIllustration}
                  alt="Ilustrasi kampanye viral di Instagram, TikTok, X, YouTube, dan Facebook dengan ribuan buzzer terverifikasi"
                  width={1024}
                  height={1024}
                  className="rounded-2xl"
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
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Pilih paket sesuai tujuan</h2>
          <p className="mt-3 text-muted-foreground">Harga transparan, hasil terukur, buzzer real people.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <div key={s.id} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-glow">
              {i === 2 && (
                <span className="absolute right-4 top-4 rounded-full gradient-brand px-2.5 py-0.5 text-xs font-bold text-brand-foreground">Popular</span>
              )}
              <span className="inline-flex rounded-lg bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">{s.platform}</span>
              <h3 className="mt-4 font-display text-xl font-bold">{s.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="font-display text-2xl font-bold text-gradient-brand">{formatIDR(s.price)}</p>
                  <p className="text-xs text-muted-foreground">{s.buzzers} buzzer terlibat</p>
                </div>
                <Button asChild size="sm" variant="outline" className="group-hover:gradient-brand group-hover:border-transparent group-hover:text-brand-foreground">
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
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Proses simpel, hasil maksimal</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {[
              { i: Rocket, t: "Pilih Paket", d: "Tentukan platform & target campaign Anda." },
              { i: Users, t: "Buzzer Matching", d: "Sistem alokasi buzzer sesuai niche & audiens." },
              { i: Megaphone, t: "Eksekusi Serentak", d: "Kampanye live dengan jadwal terkurasi." },
              { i: BarChart3, t: "Laporan Real-time", d: "Pantau reach, engagement, & sentiment." },
            ].map((p, idx) => (
              <div key={p.t} className="relative rounded-2xl border border-border bg-card p-6">
                <span className="absolute -top-3 left-6 grid h-7 w-7 place-items-center rounded-full gradient-brand text-sm font-bold text-brand-foreground">{idx + 1}</span>
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
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Dipercaya brand & figur publik</h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex gap-0.5 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
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
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Siap viral minggu ini?</h2>
            <p className="mx-auto mt-3 max-w-xl opacity-90">Konsultasi gratis dengan campaign manager kami. Tanpa kontrak panjang.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link to="/register">Daftar sebagai Customer</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-transparent text-brand-foreground hover:bg-white/10">
                <Link to="/login">Sudah punya akun? Masuk</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Buzzer terverifikasi KYC</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Garansi 100% refund</span>
              <span className="inline-flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Laporan real-time</span>
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
