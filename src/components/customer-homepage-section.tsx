import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,

  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Eye,
  Facebook,
  Flame,
  Inbox,
  Instagram,
  Loader2,
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
import { StatCard } from "@/components/dashboard-shell";
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
} from "@/lib/campaign-store";
import { SERVICES, formatIDR, type Platform, type Service } from "@/lib/customer-store";
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

const SERVICE_PLATFORM_ICON: Record<Platform, React.ReactNode> = {
  Instagram: <Instagram className="h-5 w-5" />,
  TikTok: <Music2 className="h-5 w-5" />,
  "X (Twitter)": <Twitter className="h-5 w-5" />,
  Facebook: <Facebook className="h-5 w-5" />,
  YouTube: <Youtube className="h-5 w-5" />,
  Telegram: <Send className="h-5 w-5" />,
};

type DerivedStatus =
  | "Menunggu Pembayaran"
  | "Menunggu Verifikasi Admin"
  | "Pembayaran Ditolak"
  | "Menunggu Konfirmasi"
  | "Dibatalkan"
  | "Menunggu Buzzer"
  | "Sedang Dikerjakan"
  | "Menunggu Verifikasi"
  | "Selesai";

function deriveStatus(campaign: Campaign, jobs: CampaignJob[]): DerivedStatus {
  if (campaign.payment_status === "Menunggu Pembayaran") return "Menunggu Pembayaran";
  if (campaign.payment_status === "Menunggu Verifikasi" || campaign.payment_status === "Menunggu Verifikasi Admin") {
    return "Menunggu Verifikasi Admin";
  }
  if (campaign.payment_status === "Pembayaran Ditolak") return "Pembayaran Ditolak";
  if (campaign.status === "Draft") return "Menunggu Konfirmasi";
  if (campaign.status === "Dibatalkan") return "Dibatalkan";
  if (campaign.status === "Selesai") return "Selesai";
  if (jobs.length && jobs.every((j) => j.status === "Selesai")) return "Selesai";
  if (jobs.some((j) => j.status === "Review")) return "Menunggu Verifikasi";
  if (jobs.some((j) => j.status === "Diambil" || j.status === "Revisi")) return "Sedang Dikerjakan";
  return "Menunggu Buzzer";
}

const STATUS_STYLES: Record<DerivedStatus, string> = {
  "Menunggu Pembayaran": "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  "Menunggu Verifikasi Admin": "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  "Pembayaran Ditolak": "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  "Menunggu Konfirmasi": "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
  Dibatalkan: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  "Menunggu Buzzer": "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-200",
  "Sedang Dikerjakan": "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  "Menunggu Verifikasi": "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  Selesai: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
};

function StatusBadge({ status }: { status: DerivedStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        STATUS_STYLES[status],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function startingPrice(svc: Service) {
  return Math.min(...svc.packages.map((p) => p.price));
}

export function CustomerHomepageSection({
  email,
  name,
  onOrder,
  onGoPesanan,
}: {
  email: string;
  name?: string;
  onOrder?: (service?: Service) => void;
  onGoPesanan?: () => void;
}) {
  const campaignsQuery = useCampaigns();
  const jobsQuery = useCampaignJobs();
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
      const status = deriveStatus(c, jobs);
      if (status === "Selesai") selesai++;
      else aktif++;
      dikerjakan += jobs.filter((j) => j.status === "Diambil" || j.status === "Revisi").length;
      verifikasi += jobs.filter((j) => j.status === "Review").length;
    }
    return { aktif, dikerjakan, verifikasi, selesai };
  }, [myCampaigns, jobsByCampaign]);

  // Sinkronisasi data layanan dengan database katalog Supabase secara realtime
  const dynamicServices = useMemo(() => {
    if (!catalogsQuery.data || catalogsQuery.data.length === 0) return SERVICES;
    const catMap = new Map<string, (typeof catalogsQuery.data)[0]>();
    for (const c of catalogsQuery.data) {
      if (c.status === "Aktif") {
        catMap.set(c.title.trim().toLowerCase(), c);
      }
    }
    return SERVICES.map((s) => {
      const match = catMap.get(s.name.trim().toLowerCase());
      if (!match) return s;
      const basePrice = Number(match.price);
      const baseSlots = Number(match.slots);
      return {
        ...s,
        catalogId: match.id,
        catalogPricePerBuzzer: basePrice,
        catalogSlotsAvailable: baseSlots,
        thumbnailUrl: match.thumbnail_url || s.thumbnailUrl,
        packages: [
          { tier: "Basic", price: basePrice, buzzers: baseSlots, reach: `${baseSlots} peserta`, benefits: s.packages[0]?.benefits || [] },
          { tier: "Professional", price: Math.round(basePrice * 2.2), buzzers: Math.round(baseSlots * 2.4), reach: `${Math.round(baseSlots * 2.4)} peserta`, benefits: s.packages[1]?.benefits || [] },
          { tier: "Enterprise", price: Math.round(basePrice * 4.5), buzzers: Math.round(baseSlots * 6), reach: `${Math.round(baseSlots * 6)} peserta`, benefits: s.packages[2]?.benefits || [] },
        ],
      };
    });
  }, [catalogsQuery.data]);

  // Layanan populer: dihitung dari platform kampanye seluruh database (realtime).
  const popularServices = useMemo(() => {
    const count = new Map<string, number>();
    for (const c of campaignsQuery.data) {
      count.set(c.platform, (count.get(c.platform) ?? 0) + 1);
    }
    const score = (s: Service) =>
      s.platforms.reduce((acc, p) => acc + (count.get(p) ?? 0), 0);
    return [...dynamicServices].sort((a, b) => score(b) - score(a) || b.rating - a.rating).slice(0, 4);
  }, [campaignsQuery.data, dynamicServices]);

  // Rekomendasi: berdasarkan platform yang paling sering dipakai customer ini.
  const recommendedServices = useMemo(() => {
    const count = new Map<string, number>();
    for (const c of myCampaigns) count.set(c.platform, (count.get(c.platform) ?? 0) + 1);
    if (count.size === 0) {
      return [...dynamicServices].sort((a, b) => b.rating - a.rating).slice(4, 8);
    }
    const score = (s: Service) =>
      s.platforms.reduce((acc, p) => acc + (count.get(p) ?? 0), 0);
    return [...dynamicServices]
      .filter((s) => score(s) > 0)
      .sort((a, b) => score(b) - score(a) || b.rating - a.rating)
      .slice(0, 4);
  }, [myCampaigns, dynamicServices]);

  const quickServices = useMemo(() => popularServices.slice(0, 3), [popularServices]);

  const ongoing = useMemo(
    () =>
      myCampaigns.filter((c) => deriveStatus(c, jobsByCampaign.get(c.id) ?? []) !== "Selesai"),
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

  return (
    <div className="space-y-8">
      {/* Hero greeting */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-4 sm:p-8">
        <div className="absolute inset-x-0 top-0 h-1.5 gradient-brand" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full gradient-brand opacity-15 blur-2xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              Data realtime
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
              Halo, {firstName} 👋
            </h2>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              {ongoing.length > 0
                ? `Ada ${ongoing.length} pesanan sedang berjalan dan ${stats.selesai} pesanan selesai.`
                : "Belum ada pesanan berjalan. Yuk mulai campaign pertama Anda hari ini."}
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Button className="w-full sm:w-auto gradient-brand text-brand-foreground" onClick={() => onOrder?.()}>
                <Plus className="mr-1.5 h-4 w-4" /> Buat Pesanan Baru
              </Button>
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => onGoPesanan?.()}>
                Lihat semua pesanan <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* Ringkasan */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Pesanan Aktif" value={stats.aktif.toString()} hint="Sedang berjalan" icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard label="Sedang Dikerjakan" value={stats.dikerjakan.toString()} hint="Buzzer aktif mengerjakan" icon={<Loader2 className="h-5 w-5" />} />
        <StatCard label="Menunggu Verifikasi" value={stats.verifikasi.toString()} hint="Bukti perlu direview" icon={<ClipboardCheck className="h-5 w-5" />} />
        <StatCard label="Selesai" value={stats.selesai.toString()} hint="Kampanye tuntas" icon={<CheckCircle2 className="h-5 w-5" />} />
      </div>

      {/* Mau pesan apa hari ini? */}
      <section>
        <SectionHeader
          title="Mau pesan apa hari ini?"
          subtitle="Rekomendasi cepat untuk langsung membuat pesanan"
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {quickServices.map((svc) => (
            <ServiceCard key={svc.id} service={svc} onOrder={onOrder} highlight />
          ))}
        </div>
      </section>

      {/* Layanan populer */}
      <section>
        <SectionHeader
          title="Layanan Populer"
          subtitle="Paling banyak dipesan di platform BuzzHub"
          icon={<Flame className="h-4 w-4 text-orange-500" />}
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {popularServices.map((svc) => (
            <ServiceCard key={svc.id} service={svc} onOrder={onOrder} compact />
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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {recommendedServices.map((svc) => (
            <ServiceCard key={svc.id} service={svc} onOrder={onOrder} compact />
          ))}
        </div>
      </section>

      {/* Riwayat pesanan terakhir */}
      <section>
        <SectionHeader title="Riwayat Pesanan Terakhir" subtitle="5 pesanan terbaru dari akun Anda" />
        {recentOrders.length === 0 ? (
          <EmptyState
            title="Riwayat masih kosong"
            desc="Setiap pesanan yang Anda buat akan tercatat di sini."
          />
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {recentOrders.map((c) => {
              const jobs = jobsByCampaign.get(c.id) ?? [];
              const status = deriveStatus(c, jobs);
              return (
                <li key={c.id} className="flex cursor-pointer items-center gap-3 p-3.5 sm:p-4 transition-colors hover:bg-muted/40" onClick={() => setDetail(c)}>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                    {PLATFORM_ICON[c.platform] ?? <Sparkles className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{c.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {c.platform} • {format(new Date(c.created_at), "d MMM yyyy", { locale: idLocale })}
                    </p>
                  </div>
                  <div className="shrink-0"><StatusBadge status={status} /></div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:inline-flex h-8 w-8 p-0"
                    title="Detail"
                    aria-label="Detail"
                    onClick={() => setDetail(c)}
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
        jobs={detail ? jobsByCampaign.get(detail.id) ?? [] : []}
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
    <div className="mb-4 flex items-center gap-2">
      {icon}
      <div>
        <h2 className="font-display text-lg font-bold">{title}</h2>
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
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
      <div className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
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
  onOrder,
  compact,
  highlight,
}: {
  service: Service;
  onOrder?: (svc?: Service) => void;
  compact?: boolean;
  highlight?: boolean;
}) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg",
      )}
    >
      <div className={cn("relative overflow-hidden", highlight ? "h-36" : "h-28")}>
        <img
          src={serviceImage(service)}
          alt={`Ilustrasi layanan ${service.name} kategori ${service.category}`}
          loading="lazy"
          width={820}
          height={512}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50 mix-blend-multiply", service.image)} />
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/10 to-transparent" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 text-white">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/20 backdrop-blur">
            {SERVICE_PLATFORM_ICON[service.platforms[0]] ?? <Sparkles className="h-5 w-5" />}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[11px] font-semibold backdrop-blur">
            <Star className="h-3 w-3 fill-current" /> {service.rating}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <Badge variant="secondary" className="mb-2 w-fit text-[10px]">{service.category}</Badge>
        <h3 className="font-display text-sm font-bold leading-tight">{service.name}</h3>
        <p className={cn("mt-1 text-xs text-muted-foreground", compact ? "line-clamp-2" : "line-clamp-3")}>
          {service.desc}
        </p>
        <div className="mt-3 flex-1" />
        <p className="text-[11px] text-muted-foreground">Harga Pesanan</p>
        <p className="font-display text-base font-bold">{formatIDR(startingPrice(service))}</p>
        <Button
          size="sm"
          className="mt-3 w-full gradient-brand text-brand-foreground"
          onClick={() => onOrder?.(service)}
        >
          Pesan Sekarang
        </Button>
      </div>
    </article>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
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
  const status = deriveStatus(campaign, jobs);
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
          <DialogDescription className="whitespace-pre-line">
            {campaign.brief}
          </DialogDescription>
          {campaign.payment_status === "Pembayaran Ditolak" && campaign.payment_rejection_reason && (
            <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              Alasan penolakan pembayaran: {campaign.payment_rejection_reason}
            </p>
          )}
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-3">
          <MiniStat icon={<Target className="h-3.5 w-3.5" />} label="Target Buzzer" value={campaign.slots.toString()} />
          <MiniStat icon={<Users className="h-3.5 w-3.5" />} label="Diambil" value={jobs.filter((j) => j.status !== "Tersedia").length.toString()} />
          <MiniStat icon={<ClipboardCheck className="h-3.5 w-3.5" />} label="Selesai" value={done.toString()} />
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
              {jobs.filter((j) => j.buzzer_email).map((j) => (
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
                        j.status === "Selesai" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
                        j.status === "Review" && "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
                        j.status === "Diambil" && "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
                        j.status === "Revisi" && "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
                        j.status === "Ditolak" && "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
                        j.status === "Tersedia" && "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-200",
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
