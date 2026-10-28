import { Link } from "@tanstack/react-router";
import { LogOut, Megaphone, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type SidebarNavItem<K extends string = string> = {
  key: K;
  label: string;
  /** Label ringkas untuk bottom nav di layar kecil. */
  shortLabel?: string;
  icon: ReactNode;
  /** Jumlah pesan/badge yang belum dibaca. */
  badge?: number;
};

export type SidebarUser = {
  name: string;
  email: string;
  avatarUrl?: string | null;
  roleLabel?: string;
};

const STORAGE_PREFIX = "buzzhub.sidebar_collapsed.";

/** Status ciut/buka sidebar untuk desktop, diingat di browser. */
export function useSidebarCollapsed(storageKey: string) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(STORAGE_PREFIX + storageKey) === "1");
    } catch {
      /* localStorage tidak tersedia */
    }
  }, [storageKey]);

  const toggle = useCallback(() => {
    setCollapsed((current) => {
      const next = !current;
      try {
        localStorage.setItem(STORAGE_PREFIX + storageKey, next ? "1" : "0");
      } catch {
        /* localStorage tidak tersedia */
      }
      return next;
    });
  }, [storageKey]);

  return { collapsed, toggle };
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function NavButton<K extends string>({
  item,
  active,
  collapsed,
  onNavigate,
  onPrefetch,
}: {
  item: SidebarNavItem<K>;
  active: boolean;
  collapsed: boolean;
  onNavigate: (key: K) => void;
  onPrefetch?: (key: K) => void;
}) {
  const prefetchTimer = useRef<number | null>(null);

  const cancelPrefetch = useCallback(() => {
    if (prefetchTimer.current !== null) {
      window.clearTimeout(prefetchTimer.current);
      prefetchTimer.current = null;
    }
  }, []);

  const schedulePrefetch = useCallback(() => {
    if (!onPrefetch) return;
    cancelPrefetch();
    prefetchTimer.current = window.setTimeout(() => {
      prefetchTimer.current = null;
      onPrefetch(item.key);
    }, 140);
  }, [cancelPrefetch, item.key, onPrefetch]);

  useEffect(() => cancelPrefetch, [cancelPrefetch]);

  const button = (
    <button
      type="button"
      data-section={item.key}
      onClick={() => onNavigate(item.key)}
      onMouseEnter={schedulePrefetch}
      onMouseLeave={cancelPrefetch}
      onFocus={schedulePrefetch}
      onBlur={cancelPrefetch}
      aria-current={active ? "page" : undefined}
      aria-label={
        collapsed
          ? `${item.label}${item.badge ? `, ${item.badge} pesan belum dibaca` : ""}`
          : undefined
      }
      className={cn(
        "relative flex w-full items-center rounded-lg text-sm transition-[padding,gap,background-color,color] duration-300 ease-in-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
        collapsed ? "justify-center gap-0 px-0 py-2.5" : "gap-3 px-3 py-2",
        active
          ? "bg-white/15 font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
          : "font-medium text-white/70 hover:bg-white/10 hover:text-white",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-white transition-opacity",
          active ? "opacity-100" : "opacity-0",
        )}
      />
      <span
        className={cn(
          "relative shrink-0 [&>svg]:h-[18px] [&>svg]:w-[18px]",
          active && "text-white",
        )}
      >
        {item.icon}
        {collapsed && item.badge ? (
          <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-[#0b1220]">
            {item.badge > 99 ? "99+" : item.badge}
          </span>
        ) : null}
      </span>
      <span
        aria-hidden={collapsed}
        className={cn(
          "flex min-w-0 items-center overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ease-in-out motion-reduce:transition-none",
          collapsed ? "max-w-0 opacity-0" : "max-w-[190px] flex-1 opacity-100",
        )}
      >
        <span className="truncate">{item.label}</span>
        {!collapsed && item.badge ? (
          <span className="ml-auto shrink-0 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
            {item.badge > 99 ? "99+" : item.badge}
          </span>
        ) : null}
      </span>
    </button>
  );

  if (!collapsed) return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right">
        {item.label}
        {item.badge ? ` · ${item.badge} belum dibaca` : ""}
      </TooltipContent>
    </Tooltip>
  );
}

export function SidebarNav<K extends string>({
  nav,
  activeKey,
  onNavigate,
  onPrefetch,
  user,
  onLogout,
  collapsed = false,
  onToggleCollapse,
}: {
  nav: SidebarNavItem<K>[];
  activeKey: K;
  onNavigate: (key: K) => void;
  /** Dipanggil saat kursor berhenti sebentar di menu, untuk memuat data lebih awal. */
  onPrefetch?: (key: K) => void;
  user?: SidebarUser;
  onLogout: () => void;
  collapsed?: boolean;
  /** Bila diisi, tombol buka/ciutkan sidebar tampil di dalam header sidebar. */
  onToggleCollapse?: () => void;
}) {
  return (
    <div className="flex min-h-full flex-col text-white">
      <div
        className={cn(
          "mb-6 flex items-center gap-2 transition-[padding,gap] duration-300 ease-in-out motion-reduce:transition-none",
          collapsed ? "px-0" : "px-1",
          onToggleCollapse ? "justify-between" : collapsed ? "justify-center" : "",
        )}
      >
        <Link
          to="/"
          className={cn("flex min-w-0 items-center", collapsed ? "justify-center gap-0" : "gap-2")}
          title="BuzzHub"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-brand shadow-sm">
            <Megaphone className="h-[18px] w-[18px]" />
          </span>
          <span
            aria-hidden={collapsed}
            className={cn(
              "overflow-hidden whitespace-nowrap font-display text-lg font-bold tracking-tight text-white transition-[max-width,opacity] duration-300 ease-in-out motion-reduce:transition-none",
              collapsed ? "max-w-0 opacity-0" : "max-w-[160px] opacity-100",
            )}
          >
            BuzzHub
          </span>
        </Link>
        {onToggleCollapse && (
          <SidebarCollapseButton collapsed={collapsed} onToggle={onToggleCollapse} />
        )}
      </div>

      <nav className="flex flex-col gap-1" aria-label="Navigasi utama">
        <TooltipProvider delayDuration={200}>
          {nav.map((item) => (
            <NavButton
              key={item.key}
              item={item}
              active={activeKey === item.key}
              collapsed={collapsed}
              onNavigate={onNavigate}
              onPrefetch={onPrefetch}
            />
          ))}
        </TooltipProvider>
      </nav>

      <div className="mt-6 border-t border-white/15 pt-4">
        <div
          className={cn(
            "flex items-center transition-[padding,gap] duration-300 ease-in-out motion-reduce:transition-none",
            collapsed ? "justify-center gap-0" : "gap-3 px-1",
          )}
        >
          <Avatar
            className={cn(
              "shrink-0 border border-white/25 transition-[width,height] duration-300 ease-in-out motion-reduce:transition-none",
              collapsed ? "h-9 w-9" : "h-10 w-10",
            )}
          >
            {user?.avatarUrl ? (
              <AvatarImage src={user.avatarUrl} alt={user?.name ?? "Pengguna"} />
            ) : null}
            <AvatarFallback
              className={cn(
                "text-[11px] font-bold",
                collapsed ? "bg-white/20 text-white" : "bg-white/20 text-white",
              )}
            >
              {initials(user?.name ?? "")}
            </AvatarFallback>
          </Avatar>
          <div
            aria-hidden={collapsed}
            className={cn(
              "min-w-0 overflow-hidden transition-[max-width,opacity] duration-300 ease-in-out motion-reduce:transition-none",
              collapsed ? "max-w-0 opacity-0" : "max-w-[190px] flex-1 opacity-100",
            )}
          >
            <p className="whitespace-nowrap text-[11px] uppercase tracking-wide text-white/60">
              {user?.roleLabel ? `Masuk sebagai ${user.roleLabel}` : "Masuk sebagai"}
            </p>
            <p className="truncate text-sm font-semibold text-white">{user?.name ?? "Tamu"}</p>
            <p className="truncate text-xs text-white/60">{user?.email ?? ""}</p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={onLogout}
          aria-label="Keluar"
          className={cn(
            "mt-3 border-white/25 bg-white/10 text-white transition-[width,padding] duration-300 ease-in-out hover:bg-white/20 hover:text-white motion-reduce:transition-none",
            collapsed ? "mx-auto flex h-8 w-8 items-center justify-center px-0" : "w-full",
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span
            className={cn(
              "overflow-hidden whitespace-nowrap transition-[max-width,opacity,margin] duration-300 ease-in-out motion-reduce:transition-none",
              collapsed ? "ml-0 max-w-0 opacity-0" : "ml-2 max-w-[80px] opacity-100",
            )}
          >
            Keluar
          </span>
        </Button>
      </div>
    </div>
  );
}

export function SidebarCollapseButton({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const label = collapsed ? "Buka sidebar" : "Ciutkan sidebar";
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onToggle}
            className="hidden h-9 w-9 shrink-0 border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white md:inline-flex"
            aria-label={label}
            aria-expanded={!collapsed}
            title={label}
          >
            <span className="relative grid h-4 w-4 place-items-center">
              <PanelLeftClose
                className={cn(
                  "absolute h-4 w-4 transition-[transform,opacity] duration-300 ease-in-out motion-reduce:transition-none",
                  collapsed ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100",
                )}
                aria-hidden="true"
              />
              <PanelLeftOpen
                className={cn(
                  "absolute h-4 w-4 transition-[transform,opacity] duration-300 ease-in-out motion-reduce:transition-none",
                  collapsed ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0",
                )}
                aria-hidden="true"
              />
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const MAX_PRIMARY_NAV = 4;

export function MobileBottomNav<K extends string>({
  nav,
  activeKey,
  onNavigate,
  onPrefetch,
  primaryKeys,
}: {
  nav: SidebarNavItem<K>[];
  activeKey: K;
  onNavigate: (key: K) => void;
  /** Dipanggil saat menu disentuh, untuk memuat data lebih awal. */
  onPrefetch?: (key: K) => void;
  /** Menu yang tampil langsung di bottom nav. Sisanya masuk ke sheet "Lainnya". */
  primaryKeys?: K[];
}) {
  const [moreOpen, setMoreOpen] = useState(false);

  const primary = useMemo(() => {
    if (!primaryKeys?.length) return nav.slice(0, MAX_PRIMARY_NAV);
    const wanted = new Set(primaryKeys);
    const ordered = primaryKeys
      .map((key) => nav.find((item) => item.key === key))
      .filter((item): item is SidebarNavItem<K> => Boolean(item));
    return ordered.slice(0, MAX_PRIMARY_NAV);
  }, [nav, primaryKeys]);

  const overflow = useMemo(
    () => nav.filter((item) => !primary.some((p) => p.key === item.key)),
    [nav, primary],
  );
  const activeInOverflow = overflow.some((item) => item.key === activeKey);
  const overflowUnread = overflow.reduce((total, item) => total + (item.badge ?? 0), 0);

  const select = (key: K) => {
    onPrefetch?.(key);
    onNavigate(key);
    setMoreOpen(false);
  };

  const renderButton = (item: SidebarNavItem<K>, active: boolean) => (
    <button
      key={item.key}
      type="button"
      data-section={item.key}
      onClick={() => select(item.key)}
      onPointerDown={() => onPrefetch?.(item.key)}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] font-medium transition-colors min-[380px]:text-[11px]",
        active ? "text-brand" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-0 h-[2px] w-6 rounded-full bg-brand transition-opacity",
          active ? "opacity-100" : "opacity-0",
        )}
      />
      <span className="relative [&>svg]:h-[19px] [&>svg]:w-[19px]">
        {item.icon}
        {item.badge ? (
          <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-background">
            {item.badge > 99 ? "99+" : item.badge}
          </span>
        ) : null}
      </span>
      <span className="max-w-full truncate leading-tight">{item.shortLabel ?? item.label}</span>
    </button>
  );

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl md:hidden"
        aria-label="Navigasi bawah"
      >
        <div className="flex items-stretch gap-0.5 px-2 py-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
          {primary.map((item) => renderButton(item, activeKey === item.key))}
          {overflow.length > 0 && (
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={moreOpen}
              className={cn(
                "relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] font-medium transition-colors min-[380px]:text-[11px]",
                activeInOverflow
                  ? "text-brand"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-0 h-[2px] w-6 rounded-full bg-brand transition-opacity",
                  activeInOverflow ? "opacity-100" : "opacity-0",
                )}
              />
              <span className="relative">
                <Menu className="h-[19px] w-[19px]" aria-hidden="true" />
                {overflowUnread > 0 && (
                  <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-background">
                    {overflowUnread > 99 ? "99+" : overflowUnread}
                  </span>
                )}
              </span>
              <span className="max-w-full truncate leading-tight">Lainnya</span>
            </button>
          )}
        </div>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[80vh] overflow-y-auto rounded-t-2xl pb-[calc(1rem+env(safe-area-inset-bottom))] md:hidden"
        >
          <SheetHeader className="text-left">
            <SheetTitle>Menu Lainnya</SheetTitle>
            <SheetDescription>Pilih halaman yang ingin dibuka.</SheetDescription>
          </SheetHeader>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {overflow.map((item) => {
              const active = activeKey === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => select(item.key)}
                  onPointerDown={() => onPrefetch?.(item.key)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-colors",
                    active
                      ? "border-brand/40 bg-brand/10 text-brand"
                      : "border-border bg-card text-foreground hover:bg-muted/60",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid h-8 w-8 shrink-0 place-items-center rounded-lg [&>svg]:h-[18px] [&>svg]:w-[18px]",
                      active ? "bg-brand/15" : "bg-muted",
                    )}
                  >
                    {item.icon}
                  </span>
                  <span className="min-w-0 flex-1 text-[13px] leading-tight">{item.label}</span>
                  {item.badge ? (
                    <span className="ml-auto shrink-0 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
