import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type PremiumStatCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon: ReactNode;
  tone: string;
  cta?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

export function PremiumStatCard({
  label,
  value,
  hint,
  icon,
  tone,
  cta,
  onClick,
  ariaLabel,
}: PremiumStatCardProps) {
  const content = (
    <>
      <span
        aria-hidden="true"
        className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-80", tone)}
      />
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full bg-gradient-to-br opacity-10 blur-2xl transition-opacity group-hover:opacity-20",
          tone,
        )}
      />
      <div className="relative flex items-start justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">
          {label}
        </p>
        <span
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white shadow-sm",
            tone,
          )}
        >
          {icon}
        </span>
      </div>
      <p className="relative mt-2 font-numeric text-lg font-bold tracking-tight tabular-nums sm:text-2xl">
        {value}
      </p>
      {hint && (
        <p className="relative mt-1 line-clamp-2 min-h-[2.4em] text-[11px] text-muted-foreground">
          {hint}
        </p>
      )}
      {cta && (
        <span className="relative mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-brand opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
          {cta} <ChevronRight className="h-3 w-3" />
        </span>
      )}
    </>
  );

  const className =
    "group relative w-full overflow-hidden rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel ?? `${label}: ${cta ?? label}`}
        className={className}
      >
        {content}
      </button>
    );
  }

  return <div className={className}>{content}</div>;
}
