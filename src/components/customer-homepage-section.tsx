import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  CreditCard,
  Eye,
  Facebook,
  Flame,
  Inbox,
  Instagram,
  Loader2,
  MapPin,
  Megaphone,
  Music2,
  Plus,
  Send,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Twitter,
  Youtube,
} from "lucide-react";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PremiumStatCard } from "@/components/premium-stat-card";
import { CustomerAnalyticsCards } from "@/components/customer-dashboard-analytics";
import { serviceImage } from "@/lib/service-images";

import { cn } from "@/lib/utils";
import {
  useCampaigns,
  useCampaignJobs,
  useCampaignMessages,
  useServiceCatalogs,
  type Campaign,
  type CampaignJob,
  type CampaignPlatform,
  useServicePricings,
} from "@/lib/campaign-store";
import {
  CUSTOMER_CAMPAIGN_STATUS_STYLES,
  deriveCustomerCampaignStatus,
  type CustomerCampaignStatus,
} from "@/lib/customer-campaign-status";
import { SERVICES, formatIDR, type Platform, type Service } from "@/lib/customer-store";
import {
  buildServicePricingIndex,
  normalizeCatalogService,
  servicePriceInfo,
} from "@/lib/service-catalog";
import { Textarea } from "@/components/ui/textarea";

const PLATFORM_ICON: Record<CampaignPlatform, React.ReactNode> = {
  Instagram: <Instagram className="h-4 w-4" />,
  TikTok: <Music2 className="h-4 w-4" />,
  "X (Twitter)": <Twitter className="h-4 w-4" />,
  Facebook: <Facebook className="h-4 w-4" />,
  YouTube: <Youtube className="h-4 w-4" />,
  Telegram: <Send className="h-4 w-4" />,
  LinkedIn: <Megaphone className="h-4 w-4" />,
};

const PLATFORM_TONE: Record<CampaignPlatform, string> = {
  Instagram: "from-fuchsia-500 to-rose-500",
  TikTok: "from-slate-700 to-slate-900",
  "X (Twitter)": "from-sky-500 to-blue-600",
  Facebook: "from-blue-500 to-indigo-600",
  YouTube: "from-red-500 to-rose-600",
  Telegram: "from-sky-400 to-cyan-500",
  LinkedIn: "from-blue-600 to-sky-700",
};

const SERVICE_PLATFORM_ICON: Record<Platform, React.ReactNode> = {
  Instagram: <Instagram className="h-5 w-5" />,
  TikTok: <Music2 className="h-5 w-5" />,
  "X (Twitter)": <Twitter className="h-5 w-5" />,
  Facebook: <Facebook className="h-5 w-5" />,
  YouTube: <Youtube className="h-5 w-5" />,
  Telegram: <Send className="h-5 w-5" />,
};

type DerivedStatus = CustomerCampaignStatus;

function StatusBadge({ status }: { status: DerivedStatus }) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1 truncate rounded-full px-2.5 py-0.5 text-xs font-semibold",
        CUSTOMER_CAMPAIGN_STATUS_STYLES[status],
      )}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
      <span className="truncate">{status}</span>
    </span>
  );
}

function initialsOf(value: string) {
  const initials = value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return initials || "C";
}

function greetingForHour(hour: number) {
  if (hour < 11) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 18) return "Selamat sore";
  return "Selamat malam";
}

function startingPrice(svc: Service, pricingIndex?: Map<string, number>) {
  return servicePriceInfo(svc, pricingIndex).amount;
}

export function CustomerHomepageSection({
  email,
  name,
  onOrder,
  onGoPesanan,
  onNavigate,
  onDetail,
}: {
  email: string;
  name?: string;
  onOrder?: (service?: Service) => void;
  onGoPesanan?: () => void;
  onNavigate?: (
    key: "homepage" | "pesanan" | "katalog" | "pembayaran" | "ulasan" | "bantuan" | "pengaturan",
  ) => void;
  onDetail?: (service: Service) => void;
}) {
  const campaignsQuery = useCampaigns();
  const jobsQuery = useCampaignJobs();
  const servicePricingsQuery = useServicePricings();
  const catalogsQuery = useServiceCatalogs();

  const [detail, setDetail] = useState<Campaign | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loading = campaignsQuery.loading || jobsQuery.loading;

  const myCampaigns = useMemo(
    () =>
      campaignsQuery.data.filter(
        (c) => (c.customer_email || "").toLowerCase() === (email || "").toLowerCase(),
      ),
    [campaignsQuery.data, email],
  );

  const jobsByCampaign = useMemo(() => {
    const map = new Map<string, CampaignJob[]>();
    for (const c of myCampaigns) map.set(c.id, []);
    for (const j of jobsQuery.data) {
      if (map.has(j.campaign_id)) map.get(j.campaign_id)!.push(j);
    }
    return map;
  }, [jobsQuery.data, myCampaigns]);

  const myJobs = useMemo(
    () => jobsQuery.data.filter((j) => jobsByCampaign.has(j.campaign_id)),
    [jobsQuery.data, jobsByCampaign],
  );

  // Realtime notifications: fire toasts when new events happen for my campaigns.
  const seenJobs = useRef<Map<string, string>>(new Map());
  const seenDone = useRef<Set<string>>(new Set());
  const primed = useRef(false);

  useEffect(() => {
    if (loading) return;
    if (!primed.current) {
      for (const j of myJobs) seenJobs.current.set(j.id, j.status);
      for (const c of myCampaigns) if (c.status === "Selesai") seenDone.current.add(c.id);
      primed.current = true;
      return;
    }
    for (const j of myJobs) {
      const prev = seenJobs.current.get(j.id);
      if (prev === undefined) {
        if (j.status === "Diambil" && j.buzzer_name) {
          toast.success(`${j.buzzer_name} menerima pekerjaan`, {
            description: j.campaign_title,
          });
        }
      } else if (prev !== j.status) {
        if (j.status === "Review") {
          toast.info("Bukti pengerjaan baru", {
            description: `${j.buzzer_name ?? "Buzzer"} — ${j.campaign_title}`,
          });
        } else if (j.status === "Diambil" && prev === "Tersedia") {
          toast.success(`${j.buzzer_name ?? "Buzzer"} menerima pekerjaan`, {
            description: j.campaign_title,
          });
        }
      }
      seenJobs.current.set(j.id, j.status);
    }
    for (const c of myCampaigns) {
      if (c.status === "Selesai" && !seenDone.current.has(c.id)) {
        seenDone.current.add(c.id);
        toast.success("Campaign selesai", { description: c.title });
      }
    }
  }, [myJobs, myCampaigns, loading]);

  const stats = useMemo(() => {
    let aktif = 0;
    let dikerjakan = 0;
    let verifikasi = 0;
    let selesai = 0;
    for (const c of myCampaigns) {
      const jobs = jobsByCampaign.get(c.id) ?? [];
      const status = deriveCustomerCampaignStatus(c, jobs);
      if (status === "Selesai") selesai++;
      else aktif++;
      dikerjakan += jobs.filter((j) => j.status === "Diambil" || j.status === "Revisi").length;
      verifikasi += jobs.filter((j) => j.status === "Review").length;
    }
    return { aktif, dikerjakan, verifikasi, selesai };
  }, [myCampaigns, jobsByCampaign]);

  const totalBudget = useMemo(
    () =>
      myCampaigns.reduce(
        (sum, campaign) =>
          sum + Number(campaign.total_amount ?? campaign.package_price ?? campaign.budget ?? 0),
        0,
      ),
    [myCampaigns],
  );

  const overallProgress = useMemo(() => {
    if (myJobs.length === 0) return 0;
    const done = myJobs.filter((job) => job.status === "Selesai").length;
    return Math.round((done / myJobs.length) * 100);
  }, [myJobs]);

  // Gabungkan katalog admin (produk nyata) dengan layanan bawaan sebagai pelengkap.
  // Layanan admin menang jika judulnya sama, supaya harga & kuota tetap dari DB.
  const dynamicServices = useMemo(() => {
    const adminServices = (catalogsQuery.data ?? [])
      .filter((c) => c.status === "Aktif")
      .map((c) => normalizeCatalogService(c));
    const adminTitles = new Set(adminServices.map((s) => s.name.trim().toLowerCase()));
    const builtInServices = SERVICES.filter(
      (s) => !adminTitles.has(s.name.trim().toLowerCase()),
    );
    return [...adminServices, ...builtInServices];
  }, [catalogsQuery.data]);

  const pricingIndex = useMemo(
    () => buildServicePricingIndex(servicePricingsQuery.data),
    [servicePricingsQuery.data],
  );

  // Layanan populer: dihitung dari platform kampanye seluruh database (realtime).
  const popularServices = useMemo(() => {
    const count = new Map<string, number>();
    for (const c of campaignsQuery.data) {
      count.set(c.platform, (count.get(c.platform) ?? 0) + 1);
    }
    const score = (s: Service) => s.platforms.reduce((acc, p) => acc + (count.get(p) ?? 0), 0);
    return [...dynamicServices]
      .sort((a, b) => score(b) - score(a) || b.rating - a.rating)
      .slice(0, 4);
  }, [campaignsQuery.data, dynamicServices]);

  // Rekomendasi: berdasarkan platform yang paling sering dipakai customer ini.
  const recommendedServices = useMemo(() => {
    const count = new Map<string, number>();
    for (const c of myCampaigns) count.set(c.platform, (count.get(c.platform) ?? 0) + 1);
    if (count.size === 0) {
      return [...dynamicServices].sort((a, b) => b.rating - a.rating).slice(4, 8);
    }
    const score = (s: Service) => s.platforms.reduce((acc, p) => acc + (count.get(p) ?? 0), 0);
    return [...dynamicServices]
      .filter((s) => score(s) > 0)
      .sort((a, b) => score(b) - score(a) || b.rating - a.rating)
      .slice(0, 4);
  }, [myCampaigns, dynamicServices]);

  const quickServices = useMemo(() => popularServices.slice(0, 3), [popularServices]);

  const offlineServices = useMemo(
    () =>
      dynamicServices
        .filter((s) => s.category === "Offline Buzzer")
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4),
    [dynamicServices],
  );

  const ongoing = useMemo(
    () =>
      myCampaigns.filter(
        (c) => deriveCustomerCampaignStatus(c, jobsByCampaign.get(c.id) ?? []) !== "Selesai",
      ),
    [myCampaigns, jobsByCampaign],
  );

  const recentOrders = useMemo(() => myCampaigns.slice(0, 5), [myCampaigns]);

  useEffect(() => {
    setError(null);
  }, [campaignsQuery.data, jobsQuery.data]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-44 rounded-3xl" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center">
        <AlertCircle className="mb-3 h-10 w-10 text-destructive" />
        <p className="font-semibold text-destructive">Gagal memuat data</p>
        <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => {
            campaignsQuery.refetch();
            jobsQuery.refetch();
          }}
        >
          Coba lagi
        </Button>
      </div>
    );
  }

  const firstName = (name || (email || "").split("@")[0] || "Customer").split(" ")[0];
  const greeting = greetingForHour(new Date().getHours());
  const initials = initialsOf(name || email || "Customer");

  const statCards = [
    {
      label: "Total Campaign",
      value: myCampaigns.length.toString(),
      hint: "Semua campaign di akunmu",
      icon: <Target className="h-5 w-5" />,
      tone: "from-sky-500 to-blue-600",
      cta: "Lihat pesanan",
    },
    {
      label: "Sedang Dikerjakan",
      value: stats.dikerjakan.toString(),
      hint: "Buzzer aktif mengerjakan",
      icon: <Loader2 className="h-5 w-5" />,
      tone: "from-indigo-500 to-blue-600",
      cta: "Pantau progress",
    },
    {
      label: "Menunggu Verifikasi",
      value: stats.verifikasi.toString(),
      hint: "Bukti perlu direview",
      icon: <ClipboardCheck className="h-5 w-5" />,
      tone: "from-amber-500 to-orange-500",
      cta: "Lihat bukti",
    },
    {
      label: "Campaign Selesai",
      value: stats.selesai.toString(),
      hint: "Campaign tuntas",
      icon: <CheckCircle2 className="h-5 w-5" />,
      tone: "from-emerald-500 to-teal-500",
      cta: "Beri ulasan",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero greeting */}
      <section className="dashboard-hero relative overflow-hidden rounded-3xl p-5 text-white shadow-glow sm:p-6">
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-accent-warm/25 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-3.5 sm:items-center">
            <Avatar className="h-16 w-16 shrink-0 border-2 border-white/40 shadow-lg ring-4 ring-white/10 sm:h-[72px] sm:w-[72px]">
              <AvatarFallback className="bg-white/20 text-base font-bold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white/75">{greeting},</p>
              <h2 className="truncate font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                {firstName}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ring-white/25">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  Data realtime
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ring-white/25">
                  <Users className="h-3 w-3" /> {myCampaigns.length} campaign
                </span>
                {stats.aktif > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ring-white/25">
                    <TrendingUp className="h-3 w-3" /> {stats.aktif} aktif
                  </span>
                )}
                {stats.selesai > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ring-white/25">
                    <CheckCircle2 className="h-3 w-3" /> {stats.selesai} selesai
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="w-full rounded-2xl border border-white/20 bg-white/10 p-3.5 backdrop-blur-md sm:p-4 lg:w-[340px]">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70">
                  Total Budget Campaign
                </p>
                <p className="truncate font-numeric text-lg font-bold tabular-nums text-white">
                  {formatIDR(totalBudget)}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-white/15 px-2 py-0.5 font-numeric text-[11px] font-semibold tabular-nums">
                {overallProgress}% selesai
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-[10px] text-white/75">
                <span>
                  {ongoing.length > 0
                    ? `${ongoing.length} campaign berjalan`
                    : "Belum ada campaign berjalan"}
                </span>
                <span className="font-numeric tabular-nums">
                  {myJobs.filter((job) => job.status === "Selesai").length}/{myJobs.length} job
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white transition-[width] duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-white/80">
              <span className="inline-flex items-center gap-1">
                <Loader2 className="h-3 w-3" />
                <span className="font-numeric font-semibold tabular-nums">{stats.dikerjakan}</span>
                dikerjakan
              </span>
              <span className="inline-flex items-center gap-1">
                <ClipboardCheck className="h-3 w-3" />
                <span className="font-numeric font-semibold tabular-nums">{stats.verifikasi}</span>
                menunggu verifikasi
              </span>
            </div>
          </div>
        </div>

        <div className="relative mt-4 flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => onOrder?.()}
            className="w-full gap-1.5 bg-white text-brand shadow-sm hover:bg-white/90 sm:w-auto"
          >
            <Plus className="h-4 w-4" /> Buat Pesanan Baru
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onGoPesanan?.()}
            className="w-full gap-1.5 border border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white sm:w-auto"
          >
            <ArrowRight className="h-4 w-4" /> Lihat Pesanan
          </Button>
          {onNavigate && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onNavigate("pembayaran")}
              className="w-full gap-1.5 border border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white sm:w-auto"
            >
              <CreditCard className="h-4 w-4" /> Pembayaran
            </Button>
          )}
        </div>
      </section>

      {/* Ringkasan */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <PremiumStatCard
            key={card.label}
            label={card.label}
            value={card.value}
            hint={card.hint}
            icon={card.icon}
            tone={card.tone}
            cta={card.cta}
            onClick={
              onNavigate
                ? () =>
                    card.label === "Campaign Selesai" ? onNavigate("ulasan") : onNavigate("pesanan")
                : undefined
            }
          />
        ))}
      </section>

      <CustomerAnalyticsCards
        campaigns={myCampaigns}
        jobsByCampaign={jobsByCampaign}
        email={email}
        onNavigatePesanan={onNavigate ? () => onNavigate("pesanan") : onGoPesanan}
        onNavigateUlasan={onNavigate ? () => onNavigate("ulasan") : undefined}
      />

      {/* Mau pesan apa hari ini? */}
      <section>
        <SectionHeader
          title="Mau pesan apa hari ini?"
          subtitle="Rekomendasi cepat untuk langsung membuat pesanan"
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {quickServices.map((svc) => (
            <ServiceCard
              key={svc.id}
              service={svc}
              pricingIndex={pricingIndex}
              onOrder={onOrder}
              onDetail={onDetail}
              highlight
            />
          ))}
        </div>
      </section>

      {/* Layanan offline / event */}
      {offlineServices.length > 0 && (
        <section>
          <SectionHeader
            title="Buzzer Offline untuk Event"
            subtitle="Ramai kan event, booth, dan grand opening dengan buzzer di lokasi"
            icon={<MapPin className="h-4 w-4 text-amber-500" />}
          />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {offlineServices.map((svc) => (
              <ServiceCard
                key={svc.id}
                service={svc}
                onOrder={onOrder}
                onDetail={onDetail}
                compact
              />
            ))}
          </div>
        </section>
      )}

      {/* Layanan populer */}
      <section>
        <SectionHeader
          title="Layanan Populer"
          subtitle="Paling banyak dipesan di platform BuzzHub"
          icon={<Flame className="h-4 w-4 text-orange-500" />}
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {popularServices.map((svc) => (
            <ServiceCard key={svc.id} service={svc} pricingIndex={pricingIndex} onOrder={onOrder} onDetail={onDetail} compact />
          ))}
        </div>
      </section>

      {/* Rekomendasi */}
      <section>
        <SectionHeader
          title="Rekomendasi Untuk Anda"
          subtitle={
            myCampaigns.length > 0
              ? "Berdasarkan platform yang sering Anda gunakan"
              : "Pilihan terbaik untuk memulai campaign pertama"
          }
          icon={<Sparkles className="h-4 w-4 text-violet-500" />}
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {recommendedServices.map((svc) => (
            <ServiceCard key={svc.id} service={svc} pricingIndex={pricingIndex} onOrder={onOrder} onDetail={onDetail} compact />
          ))}
        </div>
      </section>

      {/* Riwayat pesanan terakhir */}
      <section>
        <SectionHeader
          title="Riwayat Pesanan Terakhir"
          subtitle="5 pesanan terbaru dari akun Anda"
        />
        {recentOrders.length === 0 ? (
          <EmptyState
            title="Riwayat masih kosong"
            desc="Setiap pesanan yang Anda buat akan tercatat di sini."
            action={
              <Button
                size="sm"
                className="gradient-brand text-brand-foreground"
                onClick={() => onOrder?.()}
              >
                <Plus className="mr-1.5 h-4 w-4" /> Buat Pesanan Pertama
              </Button>
            }
          />
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            {recentOrders.map((c) => {
              const jobs = jobsByCampaign.get(c.id) ?? [];
              const status = deriveCustomerCampaignStatus(c, jobs);
              const done = jobs.filter((job) => job.status === "Selesai").length;
              const progress = jobs.length > 0 ? Math.round((done / jobs.length) * 100) : 0;
              return (
                <li
                  key={c.id}
                  className="group flex cursor-pointer items-start gap-3 p-3.5 transition-colors hover:bg-muted/40 sm:items-center sm:p-4"
                  onClick={() => setDetail(c)}
                >
                  <span
                    className={cn(
                      "mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white shadow-sm sm:mt-0",
                      PLATFORM_TONE[c.platform] ?? "from-brand to-brand-glow",
                    )}
                  >
                    {PLATFORM_ICON[c.platform] ?? <Sparkles className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold">{c.title}</p>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:hidden" />
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {c.platform} ·{" "}
                      {format(new Date(c.created_at), "d MMM yyyy", { locale: idLocale })}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <span
                          className="block h-full rounded-full gradient-brand transition-[width] duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </span>
                      <span className="shrink-0 font-numeric text-[10px] tabular-nums text-muted-foreground">
                        {progress}%
                      </span>
                    </div>
                    <div className="mt-2 sm:hidden">
                      <StatusBadge status={status} />
                    </div>
                  </div>
                  <div className="hidden shrink-0 sm:block">
                    <StatusBadge status={status} />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden h-8 w-8 p-0 sm:inline-flex"
                    title="Detail"
                    aria-label="Detail"
                    onClick={(event) => {
                      event.stopPropagation();
                      setDetail(c);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <CampaignDetailDialog
        campaign={detail}
        jobs={detail ? (jobsByCampaign.get(detail.id) ?? []) : []}
        customerEmail={email}
        customerName={name ?? email}
        onOpenChange={(v) => !v && setDetail(null)}
      />
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      {icon ? (
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
          {icon}
        </span>
      ) : (
        <span aria-hidden="true" className="h-8 w-1.5 shrink-0 rounded-full gradient-brand" />
      )}
      <div className="min-w-0">
        <h2 className="font-display text-lg font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}

function EmptyState({
  title,
  desc,
  action,
}: {
  title: string;
  desc: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center sm:p-12">
      <div className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand/15 to-brand-glow/10 text-brand">
        <Inbox className="h-7 w-7" />
      </div>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{desc}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

function ServiceCard({
  service,
  pricingIndex,
  onOrder,
  onDetail,
  compact,
  highlight,
}: {
  service: Service;
  pricingIndex?: Map<string, number>;
  onOrder?: (svc?: Service) => void;
  onDetail?: (svc: Service) => void;
  compact?: boolean;
  highlight?: boolean;
}) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg",
      )}
    >
      <div className={cn("relative overflow-hidden", highlight ? "h-28 sm:h-36" : "h-24 sm:h-28")}>
        <img
          src={serviceImage(service)}
          alt={`Ilustrasi layanan ${service.name} kategori ${service.category}`}
          loading="lazy"
          width={820}
          height={512}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-50 mix-blend-multiply",
            service.image,
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/10 to-transparent" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-3 py-2 text-white sm:px-4 sm:py-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/20 backdrop-blur sm:h-10 sm:w-10 sm:rounded-xl">
            {service.category === "Offline Buzzer" ? (
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              (SERVICE_PLATFORM_ICON[service.platforms[0]] ?? (
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              ))
            )}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-1.5 py-0.5 text-[10px] font-semibold backdrop-blur sm:px-2 sm:text-[11px]">
            <Star className="h-3 w-3 fill-current" /> {service.rating}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className="text-[9px] sm:text-[10px]">
            {service.category}
          </Badge>
          <span className="hidden rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
            {service.category === "Offline Buzzer" ? "Event" : service.platforms[0]}
          </span>
        </div>
        <h3 className="mt-2 line-clamp-2 font-display text-[13px] font-bold leading-tight sm:text-sm">
          {service.name}
        </h3>
        <div className="mt-1 hidden sm:block">
          <p
            className={cn(
              "text-xs text-muted-foreground",
              compact ? "line-clamp-2" : "line-clamp-3",
            )}
          >
            {service.desc}
          </p>
        </div>
        <div className="mt-3 flex-1" />
        <p className="text-[10px] text-muted-foreground sm:text-[11px]">Harga Pesanan</p>
        <p className="font-numeric text-base font-bold tabular-nums text-gradient-brand sm:text-lg">
          {servicePriceInfo(service, pricingIndex).prefix ? `${servicePriceInfo(service, pricingIndex).prefix} ` : ""}
          {formatIDR(startingPrice(service, pricingIndex))}{servicePriceInfo(service, pricingIndex).unit ? ` ${servicePriceInfo(service, pricingIndex).unit}` : ""}
        </p>
        <div className="mt-3 flex items-center gap-1.5 sm:gap-2">
          {onDetail && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 shrink-0 p-0 sm:h-9 sm:w-9"
              title="Lihat detail layanan"
              aria-label={`Lihat detail ${service.name}`}
              onClick={() => onDetail(service)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="sm"
            className="h-8 flex-1 gap-1 text-xs gradient-brand text-brand-foreground sm:h-9 sm:text-sm"
            onClick={() => onOrder?.(service)}
          >
            Pesan <ArrowRight className="hidden h-3.5 w-3.5 sm:inline" />
          </Button>
        </div>
      </div>
    </article>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-2 text-center">
      <div className="mb-0.5 flex items-center justify-center gap-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="font-display text-base font-bold leading-none">{value}</p>
    </div>
  );
}

function CampaignDetailDialog({
  campaign,
  jobs,
  customerEmail,
  customerName,
  onOpenChange,
}: {
  campaign: Campaign | null;
  jobs: CampaignJob[];
  customerEmail: string;
  customerName: string;
  onOpenChange: (open: boolean) => void;
}) {
  if (!campaign) return null;
  const status = deriveCustomerCampaignStatus(campaign, jobs);
  const done = jobs.filter((j) => j.status === "Selesai").length;
  const slots = Math.max(campaign.slots, 1);
  const progress = Math.min(100, Math.round((done / slots) * 100));

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <StatusBadge status={status} />
            <Badge variant="secondary" className="gap-1">
              {PLATFORM_ICON[campaign.platform] ?? <Sparkles className="h-3.5 w-3.5" />}
              {campaign.platform}
            </Badge>
          </div>
          <DialogTitle className="mt-2 font-display text-xl">{campaign.title}</DialogTitle>
          <DialogDescription className="whitespace-pre-line">{campaign.brief}</DialogDescription>
          {campaign.payment_status === "Pembayaran Ditolak" &&
            campaign.payment_rejection_reason && (
              <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                Alasan penolakan pembayaran: {campaign.payment_rejection_reason}
              </p>
            )}
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-3">
          <MiniStat
            icon={<Target className="h-3.5 w-3.5" />}
            label="Target Buzzer"
            value={campaign.slots.toString()}
          />
          <MiniStat
            icon={<Users className="h-3.5 w-3.5" />}
            label="Diambil"
            value={jobs.filter((j) => j.status !== "Tersedia").length.toString()}
          />
          <MiniStat
            icon={<ClipboardCheck className="h-3.5 w-3.5" />}
            label="Selesai"
            value={done.toString()}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">Progress Campaign</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold">Daftar Pekerjaan</h4>
          {jobs.filter((j) => j.buzzer_email).length === 0 ? (
            <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
              Belum ada buzzer yang mengambil job ini.
            </p>
          ) : (
            <ul className="space-y-2">
              {jobs
                .filter((j) => j.buzzer_email)
                .map((j) => (
                  <li key={j.id} className="rounded-lg border border-border bg-card p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {j.buzzer_name ?? "Menunggu buzzer"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {j.buzzer_email ?? "—"}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          j.status === "Selesai" &&
                            "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
                          j.status === "Review" &&
                            "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
                          j.status === "Diambil" &&
                            "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
                          j.status === "Revisi" &&
                            "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
                          j.status === "Ditolak" &&
                            "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
                          j.status === "Tersedia" &&
                            "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-200",
                        )}
                      >
                        {j.status}
                      </span>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
