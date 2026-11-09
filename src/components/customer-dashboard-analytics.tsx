import { useId, useMemo, type ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, ChevronRight, PieChart as PieChartIcon, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Campaign, CampaignJob } from "@/lib/campaign-store";
import {
  deriveCustomerCampaignStatus,
  type CustomerCampaignStatus,
} from "@/lib/customer-campaign-status";
import { formatIDR } from "@/lib/customer-store";
import { averageStars, useBuzzerRatings } from "@/lib/rating-store";
import { cn } from "@/lib/utils";

type StatusGroupKey =
  "Selesai" | "Dikerjakan" | "Menunggu Verifikasi" | "Menunggu Pembayaran" | "Dibatalkan";

const STATUS_GROUPS: Array<{ key: StatusGroupKey; label: string; color: string }> = [
  { key: "Selesai", label: "Selesai", color: "#10b981" },
  { key: "Dikerjakan", label: "Dikerjakan", color: "#3b82f6" },
  { key: "Menunggu Verifikasi", label: "Verifikasi", color: "#f59e0b" },
  { key: "Menunggu Pembayaran", label: "Belum Bayar", color: "#8b5cf6" },
  { key: "Dibatalkan", label: "Dibatalkan", color: "#f43f5e" },
];

function groupStatus(status: CustomerCampaignStatus): StatusGroupKey {
  switch (status) {
    case "Selesai":
      return "Selesai";
    case "Sedang Dikerjakan":
      return "Dikerjakan";
    case "Menunggu Verifikasi":
    case "Menunggu Verifikasi Admin":
      return "Menunggu Verifikasi";
    case "Menunggu Pembayaran":
    case "Menunggu Konfirmasi":
    case "Menunggu Buzzer":
      return "Menunggu Pembayaran";
    default:
      return "Dibatalkan";
  }
}

type StatusPoint = { status: StatusGroupKey; name: string; value: number; color: string };
type PlatformPoint = { platform: string; amount: number; campaigns: number };

function AnalyticsCard({
  title,
  description,
  icon,
  action,
  children,
  className,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "flex min-w-0 flex-col rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
            {icon}
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-base font-bold tracking-tight sm:text-lg">{title}</h3>
            <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
              {description}
            </p>
          </div>
        </div>
        {action ? <div className="shrink-0 pt-0.5">{action}</div> : null}
      </div>
      <div className="mt-4 flex-1">{children}</div>
    </section>
  );
}

function AnalyticsEmpty({
  icon,
  message,
  action,
}: {
  icon: ReactNode;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-[170px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 p-5 text-center">
      <span className="text-muted-foreground">{icon}</span>
      <p className="max-w-[260px] text-xs leading-relaxed text-muted-foreground">{message}</p>
      {action}
    </div>
  );
}

function StatusTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload?: StatusPoint }>;
}) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;
  return (
    <div className="min-w-[130px] rounded-xl border border-border bg-popover/95 px-3 py-2 shadow-lg backdrop-blur">
      <p className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: point.color }} />
        {point.name}
      </p>
      <p className="mt-1 font-numeric text-lg font-bold leading-none tabular-nums">
        {point.value}
        <span className="ml-1 text-[11px] font-normal text-muted-foreground">campaign</span>
      </p>
    </div>
  );
}

function PlatformTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload?: PlatformPoint }>;
}) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;
  return (
    <div className="min-w-[150px] rounded-xl border border-border bg-popover/95 px-3 py-2 shadow-lg backdrop-blur">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {point.platform}
      </p>
      <p className="mt-1 font-numeric text-lg font-bold leading-none tabular-nums">
        {formatIDR(point.amount)}
      </p>
      <p className="mt-1 text-[11px] text-muted-foreground">{point.campaigns} campaign</p>
    </div>
  );
}

function StatusCampaignCard({
  campaigns,
  jobsByCampaign,
  onNavigatePesanan,
}: {
  campaigns: Campaign[];
  jobsByCampaign: Map<string, CampaignJob[]>;
  onNavigatePesanan?: () => void;
}) {
  const data = useMemo<StatusPoint[]>(() => {
    const counts = new Map<StatusGroupKey, number>();
    for (const campaign of campaigns) {
      const status = deriveCustomerCampaignStatus(campaign, jobsByCampaign.get(campaign.id) ?? []);
      const key = groupStatus(status);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return STATUS_GROUPS.map((meta) => ({
      status: meta.key,
      name: meta.label,
      value: counts.get(meta.key) ?? 0,
      color: meta.color,
    })).filter((item) => item.value > 0);
  }, [campaigns, jobsByCampaign]);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <AnalyticsCard
      title="Status Pesanan"
      description="Kondisi seluruh campaign yang kamu pesan"
      icon={<PieChartIcon className="h-[18px] w-[18px]" />}
      action={
        <span className="rounded-full border border-border bg-muted/40 px-2.5 py-1 font-numeric text-[11px] font-semibold tabular-nums">
          {total} campaign
        </span>
      }
    >
      {data.length === 0 ? (
        <AnalyticsEmpty
          icon={<PieChartIcon className="h-6 w-6" />}
          message="Belum ada campaign. Buat pesanan pertamamu untuk mulai memantau status di sini."
          action={
            onNavigatePesanan ? (
              <Button size="sm" variant="outline" onClick={onNavigatePesanan}>
                Lihat pesanan
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid min-w-0 gap-3 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center">
          <div className="relative mx-auto h-[180px] w-full max-w-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={54}
                  outerRadius={78}
                  paddingAngle={3}
                  stroke="none"
                  isAnimationActive={false}
                >
                  {data.map((item) => (
                    <Cell key={item.status} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={<StatusTooltip />}
                  wrapperStyle={{ outline: "none", zIndex: 20 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <div>
                <p className="font-numeric text-2xl font-bold leading-none tabular-nums">{total}</p>
                <p className="mt-1 max-w-[96px] text-[9px] uppercase leading-tight tracking-[0.08em] text-muted-foreground">
                  Total campaign
                </p>
              </div>
            </div>
          </div>
          <ul className="space-y-1.5">
            {data.map((item) => {
              const percent = Math.round((item.value / total) * 100);
              return (
                <li
                  key={item.status}
                  className="flex items-center justify-between gap-1.5 rounded-lg bg-muted/30 px-2 py-2 text-[11px]"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                      aria-hidden="true"
                    />
                    <span className="truncate text-muted-foreground">{item.name}</span>
                  </span>
                  <span className="shrink-0 text-[10px] font-semibold font-numeric tabular-nums">
                    {item.value}
                    <span className="ml-1 font-normal text-muted-foreground">({percent}%)</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </AnalyticsCard>
  );
}

function PlatformSpendCard({
  campaigns,
  jobsByCampaign,
}: {
  campaigns: Campaign[];
  jobsByCampaign: Map<string, CampaignJob[]>;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const data = useMemo<PlatformPoint[]>(() => {
    const map = new Map<string, PlatformPoint>();
    for (const campaign of campaigns) {
      const status = deriveCustomerCampaignStatus(campaign, jobsByCampaign.get(campaign.id) ?? []);
      if (status === "Dibatalkan" || status === "Pembayaran Ditolak") continue;
      const amount = Number(
        campaign.total_amount ?? campaign.package_price ?? campaign.budget ?? 0,
      );
      if (!Number.isFinite(amount) || amount <= 0) continue;
      const platform = campaign.platform || "Lainnya";
      const row = map.get(platform) ?? { platform, amount: 0, campaigns: 0 };
      row.amount += amount;
      row.campaigns += 1;
      map.set(platform, row);
    }
    return [...map.values()].sort((a, b) => b.amount - a.amount).slice(0, 6);
  }, [campaigns, jobsByCampaign]);

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <AnalyticsCard
      title="Pengeluaran per Platform"
      description="Total budget campaign yang kamu pesan"
      icon={<BarChart3 className="h-[18px] w-[18px]" />}
      action={
        <span className="rounded-full border border-border bg-muted/40 px-2.5 py-1 font-numeric text-[11px] font-semibold tabular-nums">
          {formatIDR(total)}
        </span>
      }
    >
      {data.length === 0 ? (
        <AnalyticsEmpty
          icon={<BarChart3 className="h-6 w-6" />}
          message="Belum ada budget campaign. Pengeluaran per platform akan muncul setelah kamu memesan layanan."
        />
      ) : (
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 0, right: 12, top: 4, bottom: 4 }}
            >
              <defs>
                <linearGradient id={`${uid}-platform-fill`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="var(--brand-glow)" stopOpacity={0.9} />
                </linearGradient>
              </defs>
              <CartesianGrid
                horizontal={false}
                stroke="rgba(148, 163, 184, 0.2)"
                strokeDasharray="3 6"
              />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="platform"
                width={90}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "currentColor" }}
                className="text-muted-foreground"
              />
              <Tooltip
                content={<PlatformTooltip />}
                cursor={{ fill: "color-mix(in oklab, var(--brand) 10%, transparent)" }}
                wrapperStyle={{ outline: "none", zIndex: 20 }}
              />
              <Bar
                dataKey="amount"
                name="Budget"
                fill={`url(#${uid}-platform-fill)`}
                radius={[0, 6, 6, 0]}
                barSize={16}
                isAnimationActive
                animationDuration={550}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </AnalyticsCard>
  );
}

function GivenRatingCard({
  email,
  onNavigateUlasan,
}: {
  email: string;
  onNavigateUlasan?: () => void;
}) {
  const { data: allRatings, loading } = useBuzzerRatings();
  const myRatings = useMemo(() => {
    const key = (email || "").trim().toLowerCase();
    return allRatings.filter(
      (rating) => (rating.customer_id || rating.customer_email || "").toLowerCase() === key,
    );
  }, [allRatings, email]);

  const average = myRatings.length > 0 ? averageStars(myRatings) : 0;
  const distribution = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((star) => {
        const count = myRatings.filter((rating) => Math.round(rating.stars) === star).length;
        return {
          star,
          count,
          percent: myRatings.length > 0 ? Math.round((count / myRatings.length) * 100) : 0,
        };
      }),
    [myRatings],
  );

  return (
    <AnalyticsCard
      title="Ulasan Diberikan"
      description="Penilaianmu untuk buzzer yang mengerjakan campaign"
      icon={<Star className="h-[18px] w-[18px]" />}
      action={
        onNavigateUlasan ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-0.5 px-2 text-xs"
            onClick={onNavigateUlasan}
          >
            Lihat <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        ) : undefined
      }
    >
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-4 w-40 rounded-full" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="font-numeric text-4xl font-bold leading-none tabular-nums">
                {average.toFixed(1)}
              </p>
              <div className="mt-1.5 flex items-center gap-0.5" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-4 w-4",
                      star <= Math.round(average)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted-foreground/40",
                    )}
                  />
                ))}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {myRatings.length > 0
                  ? `dari ${myRatings.length} ulasan yang kamu berikan`
                  : "Kamu belum memberikan ulasan"}
              </p>
            </div>
            <span className="rounded-full bg-amber-500/15 px-2.5 py-1 font-numeric text-[11px] font-semibold tabular-nums text-amber-600 dark:text-amber-300">
              / 5.0
            </span>
          </div>

          <div className="space-y-1.5 border-t border-border/70 pt-3">
            {distribution.map((row) => (
              <div key={row.star} className="flex items-center gap-2 text-[11px]">
                <span className="w-3 shrink-0 text-right font-numeric tabular-nums text-muted-foreground">
                  {row.star}
                </span>
                <Star
                  className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400"
                  aria-hidden="true"
                />
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
                    style={{ width: `${row.percent}%` }}
                  />
                </span>
                <span className="w-6 shrink-0 text-right font-numeric tabular-nums text-muted-foreground">
                  {row.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </AnalyticsCard>
  );
}

export function CustomerAnalyticsCards({
  campaigns,
  jobsByCampaign,
  email,
  onNavigatePesanan,
  onNavigateUlasan,
}: {
  campaigns: Campaign[];
  jobsByCampaign: Map<string, CampaignJob[]>;
  email: string;
  onNavigatePesanan?: () => void;
  onNavigateUlasan?: () => void;
}) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <StatusCampaignCard
        campaigns={campaigns}
        jobsByCampaign={jobsByCampaign}
        onNavigatePesanan={onNavigatePesanan}
      />
      <PlatformSpendCard campaigns={campaigns} jobsByCampaign={jobsByCampaign} />
      <GivenRatingCard email={email} onNavigateUlasan={onNavigateUlasan} />
    </section>
  );
}
