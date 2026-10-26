import { useEffect, useId, useRef, useState, type ReactNode } from "react";
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
import { ArrowDownRight, ArrowUpRight, Inbox, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const num = (value: number) => value.toLocaleString("id-ID");

/* ------------------------------------------------------------------ *
 * Palette (selaras identitas BuzzHub: biru → violet → pink)
 * ------------------------------------------------------------------ */
export const CHART_COLORS = {
  blue: "#60A5FA",
  violet: "#8B5CF6",
  purple: "#A855F7",
  pink: "#D946EF",
  cyan: "#22D3EE",
} as const;

/* ------------------------------------------------------------------ *
 * Ukur ukuran container supaya gradient bisa dibuat dengan koordinat
 * userSpaceOnUse (tetap benar walau data datar / nilai nol semua) dan
 * otomatis dibuat ulang saat chart berubah ukuran.
 * ------------------------------------------------------------------ */
function useMeasuredSize() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = () => {
      const rect = element.getBoundingClientRect();
      setSize((prev) =>
        Math.abs(prev.width - rect.width) < 1 && Math.abs(prev.height - rect.height) < 1
          ? prev
          : { width: Math.round(rect.width), height: Math.round(rect.height) },
      );
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, size };
}

/* ------------------------------------------------------------------ *
 * Kartu metrik
 * ------------------------------------------------------------------ */
type AccentKey = "blue" | "violet" | "cyan" | "pink" | "indigo";

const ACCENTS: Record<AccentKey, { chip: string; glow: string; dot: string }> = {
  blue: {
    chip: "bg-blue-500/12 text-blue-600 dark:bg-blue-400/15 dark:text-blue-300",
    glow: "from-blue-500/60",
    dot: "bg-blue-500",
  },
  violet: {
    chip: "bg-violet-500/12 text-violet-600 dark:bg-violet-400/15 dark:text-violet-300",
    glow: "from-violet-500/60",
    dot: "bg-violet-500",
  },
  cyan: {
    chip: "bg-cyan-500/12 text-cyan-600 dark:bg-cyan-400/15 dark:text-cyan-300",
    glow: "from-cyan-500/60",
    dot: "bg-cyan-500",
  },
  pink: {
    chip: "bg-pink-500/12 text-pink-600 dark:bg-pink-400/15 dark:text-pink-300",
    glow: "from-pink-500/60",
    dot: "bg-pink-500",
  },
  indigo: {
    chip: "bg-indigo-500/12 text-indigo-600 dark:bg-indigo-400/15 dark:text-indigo-300",
    glow: "from-indigo-500/60",
    dot: "bg-indigo-500",
  },
};

export function ActivityMetricCard({
  label,
  value,
  hint,
  icon,
  accent,
  deltaText,
  deltaDirection,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: ReactNode;
  accent: AccentKey;
  deltaText?: string;
  deltaDirection?: "up" | "down" | "flat";
}) {
  const accentStyle = ACCENTS[accent];
  const DeltaIcon =
    deltaDirection === "up" ? ArrowUpRight : deltaDirection === "down" ? ArrowDownRight : Minus;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r to-transparent opacity-70",
          accentStyle.glow,
        )}
      />
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase leading-tight tracking-[0.08em] text-muted-foreground sm:text-[11px]">
          {label}
        </p>
        <span
          className={cn(
            "grid h-7 w-7 shrink-0 place-items-center rounded-lg sm:h-8 sm:w-8",
            accentStyle.chip,
          )}
        >
          {icon}
        </span>
      </div>
      <p className="mt-2.5 font-display text-xl font-bold leading-none tracking-tight tabular-nums break-words sm:text-2xl">
        {value}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
        {deltaText && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold sm:text-[11px]",
              deltaDirection === "up" && "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400",
              deltaDirection === "down" && "bg-rose-500/12 text-rose-600 dark:text-rose-400",
              (!deltaDirection || deltaDirection === "flat") && "bg-muted text-muted-foreground",
            )}
          >
            <DeltaIcon className="h-3 w-3" aria-hidden="true" />
            {deltaText}
          </span>
        )}
        {hint && <span className="text-[10px] leading-snug text-muted-foreground sm:text-[11px]">{hint}</span>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Shell kartu chart
 * ------------------------------------------------------------------ */
export function ChartCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "@container flex flex-col rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5",
        className,
      )}
    >
      <header className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="font-display text-base font-semibold tracking-tight">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

export function ChartEmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 bg-muted/20 px-6 text-center">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-muted text-muted-foreground">
        <Inbox className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="text-sm font-medium text-foreground">Belum ada data</p>
      <p className="max-w-xs text-xs text-muted-foreground">{message}</p>
    </div>
  );
}

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-xl bg-muted/60", className)} aria-hidden="true" />
  );
}

export function ChartErrorState({
  message,
  onRetry,
  compact,
}: {
  message: string;
  onRetry?: () => void;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border/70 bg-muted/20 px-6 text-center">
        <p className="text-sm font-medium text-foreground">Grafik tidak dapat ditampilkan</p>
        <p className="max-w-xs text-xs text-muted-foreground">{message}</p>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className="flex h-full min-h-[220px] flex-col items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/70 px-6 text-center dark:border-rose-500/30 dark:bg-rose-500/10"
    >
      <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">
        Gagal memuat data aktivitas
      </p>
      <p className="max-w-sm text-xs text-rose-600/80 dark:text-rose-300/80">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 rounded-lg border border-rose-300 bg-card px-3 py-1.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100 dark:border-rose-500/40 dark:text-rose-200 dark:hover:bg-rose-500/20"
        >
          Coba lagi
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 1. Tren Aktivitas — gradient area + gradient garis horizontal
 * ------------------------------------------------------------------ */
export type TrendPoint = {
  key: string;
  label: string;
  fullLabel: string;
  total: number;
  pembayaran: number;
  pekerjaan: number;
  payout: number;
  komisi: number;
};

const TREND_MARGIN = { top: 16, right: 18, left: 0, bottom: 0 };
const X_AXIS_HEIGHT = 26;

function TrendTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload?: TrendPoint }>;
}) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;

  const rows = [
    { label: "Pembayaran masuk", value: point.pembayaran, color: CHART_COLORS.blue },
    { label: "Pekerjaan", value: point.pekerjaan, color: CHART_COLORS.violet },
    { label: "Payout buzzer", value: point.payout, color: CHART_COLORS.purple },
    { label: "Komisi admin", value: point.komisi, color: CHART_COLORS.pink },
  ].filter((row) => row.value > 0);

  return (
    <div className="min-w-[168px] rounded-xl border border-border bg-popover/95 px-3 py-2.5 shadow-lg backdrop-blur">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {point.fullLabel}
      </p>
      <p className="mt-1 flex items-baseline gap-1.5">
        <span className="font-display text-xl font-bold leading-none tabular-nums">
          {num(point.total)}
        </span>
        <span className="text-[11px] text-muted-foreground">aktivitas</span>
      </p>
      {rows.length > 0 && (
        <ul className="mt-2 space-y-1 border-t border-border/70 pt-2">
          {rows.map((row) => (
            <li key={row.label} className="flex items-center justify-between gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: row.color }}
                  aria-hidden="true"
                />
                {row.label}
              </span>
              <span className="font-semibold tabular-nums text-foreground">{num(row.value)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ActivityTrendChart({
  data,
  loading,
}: {
  data: TrendPoint[];
  loading?: boolean;
}) {
  const { ref, size } = useMeasuredSize();
  const uid = `trend-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const showDots = data.length > 0 && data.length <= 31;
  const plotBottom = Math.max(size.height - X_AXIS_HEIGHT, 1);

  return (
    <div ref={ref} className="relative h-[260px] w-full sm:h-[330px]">
      {loading && <ChartSkeleton className="absolute inset-0 h-full w-full" />}
      {!loading && size.width > 0 && (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={TREND_MARGIN}>
            <defs>
              {/* Gradient area: ungu pekat di dekat garis → transparan di bawah */}
              <linearGradient
                id={`${uid}-area`}
                gradientUnits="userSpaceOnUse"
                x1={0}
                y1={TREND_MARGIN.top}
                x2={0}
                y2={plotBottom}
              >
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.42} />
                <stop offset="45%" stopColor="#A855F7" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
              {/* Gradient garis: biru → violet → pink */}
              <linearGradient
                id={`${uid}-line`}
                gradientUnits="userSpaceOnUse"
                x1={0}
                y1={0}
                x2={Math.max(size.width, 1)}
                y2={0}
              >
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#D946EF" />
              </linearGradient>
              <linearGradient id={`${uid}-dot`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#D946EF" />
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
              minTickGap={26}
              interval="preserveStartEnd"
              tick={{ fontSize: 11, fill: "currentColor" }}
              className="text-muted-foreground"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={38}
              allowDecimals={false}
              domain={[0, (max: number) => Math.max(4, Math.ceil(max * 1.2))]}
              tick={{ fontSize: 11, fill: "currentColor" }}
              className="text-muted-foreground"
            />
            <Tooltip
              content={<TrendTooltip />}
              cursor={{
                stroke: "rgba(139, 92, 246, 0.35)",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
              wrapperStyle={{ outline: "none", zIndex: 20 }}
            />
            <Area
              type="monotone"
              dataKey="total"
              name="Aktivitas"
              stroke={`url(#${uid}-line)`}
              strokeWidth={2.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={`url(#${uid}-area)`}
              fillOpacity={1}
              dot={
                showDots
                  ? {
                      r: 3.2,
                      fill: `url(#${uid}-dot)`,
                      stroke: "#ffffff",
                      strokeWidth: 1.4,
                    }
                  : false
              }
              activeDot={{
                r: 5.5,
                fill: "#8B5CF6",
                stroke: "#fff",
                strokeWidth: 2,
              }}
              isAnimationActive
              animationDuration={550}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 2. Distribusi Aktivitas — donut
 * ------------------------------------------------------------------ */
export type ActivitySlice = { name: string; value: number; color: string };

function DonutTooltip({
  active,
  payload,
  total,
}: {
  active?: boolean;
  payload?: Array<{ payload?: ActivitySlice }>;
  total: number;
}) {
  const slice = payload?.[0]?.payload;
  if (!active || !slice) return null;
  const percent = total > 0 ? (slice.value / total) * 100 : 0;

  return (
    <div className="rounded-xl border border-border bg-popover/95 px-3 py-2 shadow-lg backdrop-blur">
      <p className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: slice.color }}
          aria-hidden="true"
        />
        {slice.name}
      </p>
      <p className="mt-1 text-sm font-semibold tabular-nums text-foreground">
        {num(slice.value)}{" "}
        <span className="text-[11px] font-normal text-muted-foreground">
          ({percent.toFixed(1).replace(".", ",")}%)
        </span>
      </p>
    </div>
  );
}

export function ActivityDistributionChart({
  data,
  total,
  loading,
  height = 236,
}: {
  data: ActivitySlice[];
  total: number;
  loading?: boolean;
  height?: number;
}) {
  const visible = data.filter((slice) => slice.value > 0);

  return (
    <div className="flex flex-col gap-4 @md:flex-row @md:items-center">
      <div className="relative mx-auto w-full max-w-[240px] shrink-0" style={{ height }}>
        {loading ? (
          <ChartSkeleton className="h-full w-full rounded-full" />
        ) : visible.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-28 w-28 rounded-full border-[14px] border-dashed border-border/70" />
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={visible}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="63%"
                  outerRadius="92%"
                  paddingAngle={3}
                  cornerRadius={7}
                  stroke="none"
                  isAnimationActive
                  animationDuration={550}
                >
                  {visible.map((slice) => (
                    <Cell key={slice.name} fill={slice.color} />
                  ))}
                </Pie>
                <Tooltip content={<DonutTooltip total={total} />} wrapperStyle={{ zIndex: 20 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-2xl font-bold leading-none tabular-nums">
                {num(total)}
              </span>
              <span className="mt-1 text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                Total aktivitas
              </span>
            </div>
          </>
        )}
      </div>

      <ul className="min-w-0 flex-1 space-y-2">
        {loading &&
          Array.from({ length: 4 }).map((_, index) => (
            <li key={index} className="animate-pulse rounded-lg bg-muted/60 p-2.5" />
          ))}
        {!loading &&
          data.map((slice) => {
            const percent = total > 0 ? (slice.value / total) * 100 : 0;
            return (
              <li
                key={slice.name}
                className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/50"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: slice.color }}
                    aria-hidden="true"
                  />
                  <span className="truncate text-xs font-medium text-foreground">{slice.name}</span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="text-xs font-semibold tabular-nums text-foreground">
                    {num(slice.value)}
                  </span>
                  <span className="ml-1.5 text-[11px] text-muted-foreground">
                    {percent.toFixed(1).replace(".", ",")}%
                  </span>
                </span>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 3. Perbandingan Aktivitas — bar chart
 * ------------------------------------------------------------------ */
export type ActivityBarPoint = { label: string; fullLabel: string; total: number };

function BarTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload?: ActivityBarPoint }>;
}) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;
  return (
    <div className="rounded-xl border border-border bg-popover/95 px-3 py-2 shadow-lg backdrop-blur">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {point.fullLabel}
      </p>
      <p className="mt-1 text-sm font-semibold tabular-nums text-foreground">
        {num(point.total)}{" "}
        <span className="text-[11px] font-normal text-muted-foreground">aktivitas</span>
      </p>
    </div>
  );
}

export function ActivityComparisonChart({
  data,
  loading,
  height = 236,
}: {
  data: ActivityBarPoint[];
  loading?: boolean;
  height?: number;
}) {
  const uid = `bar-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  if (loading) return <ChartSkeleton className="w-full" />;

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          barCategoryGap="26%"
        >
          <defs>
            <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.95} />
              <stop offset="60%" stopColor="#7C8CF8" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.85} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(148, 163, 184, 0.2)" strokeDasharray="3 6" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            minTickGap={16}
            interval="preserveStartEnd"
            tick={{ fontSize: 11, fill: "currentColor" }}
            className="text-muted-foreground"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={34}
            allowDecimals={false}
            domain={[0, (max: number) => Math.max(4, Math.ceil(max * 1.2))]}
            tick={{ fontSize: 11, fill: "currentColor" }}
            className="text-muted-foreground"
          />
          <Tooltip
            content={<BarTooltip />}
            cursor={{ fill: "rgba(139, 92, 246, 0.08)" }}
            wrapperStyle={{ outline: "none", zIndex: 20 }}
          />
          <Bar
            dataKey="total"
            radius={[7, 7, 0, 0]}
            maxBarSize={38}
            isAnimationActive
            animationDuration={550}
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={[CHART_COLORS.violet, CHART_COLORS.pink, CHART_COLORS.blue, CHART_COLORS.cyan][index % 4]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
