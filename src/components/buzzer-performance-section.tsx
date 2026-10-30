import { useId, useMemo, useState, type ReactNode } from "react";
import {
  Area,
  AreaChart,
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
import { BarChart3, CheckCircle2, DollarSign, Star, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { StatCard } from "@/components/dashboard-shell";
import { formatIDR, type BuzzerJob, type BuzzerState, type JobStatus } from "@/lib/buzzer-store";
import { averageStars, useBuzzerRatings } from "@/lib/rating-store";
import { cn } from "@/lib/utils";

const PERIODS = [
  { key: "30d", label: "30 hari", monthly: false },
  { key: "3m", label: "3 bulan", monthly: true },
  { key: "6m", label: "6 bulan", monthly: true },
  { key: "12m", label: "12 bulan", monthly: true },
] as const;

type PeriodKey = (typeof PERIODS)[number]["key"];

const PERIOD_MONTHS: Record<Exclude<PeriodKey, "30d">, number> = {
  "3m": 3,
  "6m": 6,
  "12m": 12,
};

const JOB_STATUS_META: Record<Exclude<JobStatus, "Tersedia">, { label: string; color: string }> = {
  Selesai: { label: "Selesai", color: "#10b981" },
  Review: { label: "Review", color: "#3b82f6" },
  Diambil: { label: "Diambil", color: "#8b5cf6" },
  Upload: { label: "Upload", color: "#06b6d4" },
  Revisi: { label: "Revisi", color: "#f59e0b" },
  Ditolak: { label: "Ditolak", color: "#f43f5e" },
};

const revenueChartConfig = {
  revenue: { label: "Pendapatan", color: "#8b5cf6" },
} satisfies ChartConfig;

const platformChartConfig = {
  amount: { label: "Pendapatan", color: "#8b5cf6" },
} satisfies ChartConfig;

type RevenuePoint = {
  key: string;
  label: string;
  fullLabel: string;
  amount: number;
  jobs: number;
};

type PlatformPoint = {
  platform: string;
  amount: number;
  jobs: number;
};

type StatusPoint = {
  status: Exclude<JobStatus, "Tersedia">;
  name: string;
  value: number;
  color: string;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function parseDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function dayKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

function compactIDR(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "Rp0";
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    const formatted =
      millions >= 10
        ? Math.round(millions).toString()
        : millions.toFixed(1).replace(".0", "").replace(".", ",");
    return `Rp${formatted}jt`;
  }
  if (value >= 1_000) return `Rp${Math.round(value / 1_000)}rb`;
  return `Rp${Math.round(value)}`;
}

function PerformanceCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="font-display text-base font-bold tracking-tight sm:text-lg">{title}</h2>
          <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
            {description}
          </p>
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ChartEmpty({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
      <BarChart3 className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
      <p className="text-sm font-medium">{message}</p>
      {action}
    </div>
  );
}

function RevenueTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload?: RevenuePoint }>;
}) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;

  return (
    <div className="min-w-[150px] rounded-xl border border-border bg-popover/95 px-3 py-2.5 shadow-lg backdrop-blur">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {point.fullLabel}
      </p>
      <p className="mt-1 font-display text-lg font-bold leading-none tabular-nums">
        {formatIDR(point.amount)}
      </p>
      <p className="mt-1 text-[11px] text-muted-foreground">{point.jobs} pembayaran berhasil</p>
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
    <div className="min-w-[150px] rounded-xl border border-border bg-popover/95 px-3 py-2.5 shadow-lg backdrop-blur">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {point.platform}
      </p>
      <p className="mt-1 font-display text-lg font-bold leading-none tabular-nums">
        {formatIDR(point.amount)}
      </p>
      <p className="mt-1 text-[11px] text-muted-foreground">{point.jobs} job berhasil</p>
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
    <div className="min-w-[130px] rounded-xl border border-border bg-popover/95 px-3 py-2.5 shadow-lg backdrop-blur">
      <p className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: point.color }} />
        {point.name}
      </p>
      <p className="mt-1 font-display text-lg font-bold leading-none tabular-nums">
        {point.value} <span className="text-[11px] font-normal text-muted-foreground">job</span>
      </p>
    </div>
  );
}

export function BuzzerPerformanceSection({
  state,
  jobs,
  onGoJobs,
}: {
  state: BuzzerState;
  jobs: BuzzerJob[];
  onGoJobs: () => void;
}) {
  const [period, setPeriod] = useState<PeriodKey>("30d");
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const { data: allRatings } = useBuzzerRatings();

  const activePeriod = PERIODS.find((item) => item.key === period) ?? PERIODS[0];

  const range = useMemo(() => {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (period === "30d") {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      start.setDate(start.getDate() - 29);
      return { start, end, monthly: false };
    }

    const months = PERIOD_MONTHS[period];
    const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
    return { start, end, monthly: true };
  }, [period]);

  const revenueSeries = useMemo<RevenuePoint[]>(() => {
    const buckets = new Map<string, RevenuePoint>();
    const cursor = new Date(range.start);

    if (range.monthly) {
      while (cursor <= range.end) {
        const key = monthKey(cursor);
        buckets.set(key, {
          key,
          label: cursor.toLocaleDateString("id-ID", { month: "short", year: "2-digit" }),
          fullLabel: cursor.toLocaleDateString("id-ID", { month: "long", year: "numeric" }),
          amount: 0,
          jobs: 0,
        });
        cursor.setMonth(cursor.getMonth() + 1);
      }
    } else {
      while (cursor <= range.end) {
        const key = dayKey(cursor);
        buckets.set(key, {
          key,
          label: cursor.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
          fullLabel: cursor.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          amount: 0,
          jobs: 0,
        });
        cursor.setDate(cursor.getDate() + 1);
      }
    }

    for (const earning of state.earnings) {
      if (earning.status !== "Berhasil") continue;
      const date = parseDate(earning.date);
      if (!date || date < range.start || date > range.end) continue;
      const key = range.monthly ? monthKey(date) : dayKey(date);
      const bucket = buckets.get(key);
      if (!bucket) continue;
      bucket.amount += Number(earning.amount) || 0;
      bucket.jobs += 1;
    }

    return [...buckets.values()];
  }, [range, state.earnings]);

  const periodEarnings = useMemo(
    () =>
      state.earnings.filter((earning) => {
        if (earning.status !== "Berhasil") return false;
        const date = parseDate(earning.date);
        return !!date && date >= range.start && date <= range.end;
      }),
    [range, state.earnings],
  );

  const totalRevenue = periodEarnings.reduce(
    (total, earning) => total + (Number(earning.amount) || 0),
    0,
  );
  const totalPaidJobs = periodEarnings.length;

  const platformData = useMemo<PlatformPoint[]>(() => {
    const map = new Map<string, PlatformPoint>();
    for (const earning of periodEarnings) {
      const platform = earning.platform || "Lainnya";
      const row = map.get(platform) ?? { platform, amount: 0, jobs: 0 };
      row.amount += Number(earning.amount) || 0;
      row.jobs += 1;
      map.set(platform, row);
    }
    return [...map.values()].sort((a, b) => b.amount - a.amount).slice(0, 6);
  }, [periodEarnings]);

  const jobStatusData = useMemo<StatusPoint[]>(() => {
    const counts = new Map<JobStatus, number>();
    for (const job of jobs) {
      if (job.status === "Tersedia") continue;
      counts.set(job.status, (counts.get(job.status) ?? 0) + 1);
    }

    return (
      Object.entries(JOB_STATUS_META) as Array<
        [Exclude<JobStatus, "Tersedia">, { label: string; color: string }]
      >
    )
      .map(([status, meta]) => ({
        status,
        name: meta.label,
        value: counts.get(status) ?? 0,
        color: meta.color,
      }))
      .filter((item) => item.value > 0);
  }, [jobs]);

  const totalCurrentJobs = jobStatusData.reduce((total, item) => total + item.value, 0);

  const myRatings = useMemo(() => {
    const email = (state.profile.email || "").toLowerCase();
    return allRatings.filter((rating) => (rating.buzzer_email || "").toLowerCase() === email);
  }, [allRatings, state.profile.email]);

  const rating = myRatings.length > 0 ? averageStars(myRatings) : state.profile.rating;
  const completedJobs = jobs.filter((job) => job.status === "Selesai").length;
  const careerJobsDone = state.profile.jobsCompleted + completedJobs;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Periode analisis
          </p>
          <p className="mt-0.5 text-sm font-medium">{activePeriod.label} terakhir</p>
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Pilih periode grafik">
          {PERIODS.map((item) => (
            <Button
              key={item.key}
              type="button"
              size="sm"
              variant={period === item.key ? "default" : "outline"}
              onClick={() => setPeriod(item.key)}
              className={cn(
                "h-8 px-3 text-xs",
                period === item.key && "gradient-brand border-transparent text-brand-foreground",
              )}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Pendapatan Periode"
          value={formatIDR(totalRevenue)}
          hint={`${totalPaidJobs} pembayaran berhasil`}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          label="Job Selesai"
          value={careerJobsDone.toLocaleString("id-ID")}
          hint="Total karier"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          label="Rating"
          value={rating.toFixed(1)}
          hint={myRatings.length > 0 ? `${myRatings.length} ulasan` : "dari 5.0"}
          icon={<Star className="h-5 w-5" />}
        />
        <StatCard
          label="Saldo"
          value={formatIDR(state.balance)}
          hint="Siap dicairkan"
          icon={<Wallet className="h-5 w-5" />}
        />
      </div>

      <PerformanceCard
        title="Tren Pendapatan"
        description={`Pendapatan berhasil per ${range.monthly ? "bulan" : "hari"} pada ${activePeriod.label} terakhir`}
        action={
          <span className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-foreground">
            {formatIDR(totalRevenue)}
          </span>
        }
      >
        {totalRevenue > 0 ? (
          <>
            <ChartContainer config={revenueChartConfig} className="h-[260px] w-full">
              <AreaChart data={revenueSeries} margin={{ left: 4, right: 12, top: 12, bottom: 0 }}>
                <defs>
                  <linearGradient id={`${uid}-revenue-fill`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.45} />
                    <stop offset="55%" stopColor="#a855f7" stopOpacity={0.14} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.01} />
                  </linearGradient>
                  <linearGradient id={`${uid}-revenue-line`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="52%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#d946ef" />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke="rgba(148, 163, 184, 0.22)"
                  strokeDasharray="3 6"
                />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  minTickGap={24}
                  interval="preserveStartEnd"
                  tick={{ fontSize: 10, fill: "currentColor" }}
                  className="text-muted-foreground"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  width={52}
                  allowDecimals={false}
                  tickFormatter={compactIDR}
                  tick={{ fontSize: 10, fill: "currentColor" }}
                  className="text-muted-foreground"
                />
                <Tooltip
                  content={<RevenueTooltip />}
                  cursor={{
                    stroke: "rgba(139, 92, 246, 0.35)",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                  wrapperStyle={{ outline: "none", zIndex: 20 }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  name="Pendapatan"
                  stroke={`url(#${uid}-revenue-line)`}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill={`url(#${uid}-revenue-fill)`}
                  fillOpacity={1}
                  dot={
                    revenueSeries.length <= 12
                      ? { r: 3, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 1.5 }
                      : false
                  }
                  activeDot={{ r: 5.5, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }}
                  isAnimationActive
                  animationDuration={550}
                />
              </AreaChart>
            </ChartContainer>
            <p className="mt-3 border-t border-border/70 pt-3 text-[11px] leading-relaxed text-muted-foreground">
              Hanya pembayaran berstatus Berhasil yang dihitung. Arahkan kursor ke titik untuk
              melihat nominal dan jumlah pembayaran.
            </p>
          </>
        ) : (
          <ChartEmpty message="Belum ada pendapatan berhasil pada periode ini. Coba periode lain atau ambil job baru." />
        )}
      </PerformanceCard>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <PerformanceCard
          title="Status Job"
          description="Status job yang sedang dan sudah kamu kerjakan"
          action={
            <span className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-foreground">
              {totalCurrentJobs} job
            </span>
          }
        >
          {jobStatusData.length > 0 ? (
            <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,210px)_1fr] sm:items-center">
              <div className="relative mx-auto h-[200px] w-full max-w-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={jobStatusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={56}
                      outerRadius={82}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {jobStatusData.map((item) => (
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
                    <p className="font-display text-2xl font-bold leading-none">
                      {totalCurrentJobs}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                      Total job
                    </p>
                  </div>
                </div>
              </div>
              <ul className="space-y-2">
                {jobStatusData.map((item) => {
                  const percent = Math.round((item.value / totalCurrentJobs) * 100);
                  return (
                    <li
                      key={item.status}
                      className="flex items-center justify-between gap-3 rounded-lg bg-muted/30 px-3 py-2 text-xs"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: item.color }}
                          aria-hidden="true"
                        />
                        <span className="truncate text-muted-foreground">{item.name}</span>
                      </span>
                      <span className="shrink-0 font-semibold tabular-nums">
                        {item.value}
                        <span className="ml-1 font-normal text-muted-foreground">({percent}%)</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <ChartEmpty
              message="Belum ada job yang dikerjakan. Ambil job pertamamu untuk mulai membangun performa."
              action={
                <Button size="sm" variant="outline" onClick={onGoJobs}>
                  Ambil job
                </Button>
              }
            />
          )}
        </PerformanceCard>

        <PerformanceCard
          title="Pendapatan per Platform"
          description="Platform yang paling menghasilkan pada periode ini"
          action={
            <span className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-foreground">
              {platformData.length} platform
            </span>
          }
        >
          {platformData.length > 0 ? (
            <>
              <ChartContainer config={platformChartConfig} className="h-[240px] w-full">
                <BarChart
                  data={platformData}
                  layout="vertical"
                  margin={{ left: 0, right: 12, top: 4, bottom: 4 }}
                >
                  <defs>
                    <linearGradient id={`${uid}-platform-fill`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.85} />
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
                    width={88}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "currentColor" }}
                    className="text-muted-foreground"
                  />
                  <Tooltip
                    content={<PlatformTooltip />}
                    cursor={{ fill: "rgba(139, 92, 246, 0.08)" }}
                    wrapperStyle={{ outline: "none", zIndex: 20 }}
                  />
                  <Bar
                    dataKey="amount"
                    name="Pendapatan"
                    fill={`url(#${uid}-platform-fill)`}
                    radius={[0, 6, 6, 0]}
                    barSize={18}
                    isAnimationActive
                    animationDuration={550}
                  />
                </BarChart>
              </ChartContainer>
              <p className="mt-3 border-t border-border/70 pt-3 text-[11px] leading-relaxed text-muted-foreground">
                Berdasarkan pembayaran berhasil. Arahkan kursor ke batang untuk melihat nominal dan
                jumlah job.
              </p>
            </>
          ) : (
            <ChartEmpty message="Belum ada pendapatan per platform pada periode ini." />
          )}
        </PerformanceCard>
      </div>
    </div>
  );
}
