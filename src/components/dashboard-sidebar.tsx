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
  /**
   * Judul kelompok menu. Item yang berurutan dengan grup sama akan digabung
   * di bawah satu judul kecil, sehingga sidebar lebih mudah dipindai.
   */
  group?: string;
};

export type SidebarUser = {
  name: string;
  email: string;
  avatarUrl?: string | null;
  roleLabel?: string;
};

const STORAGE_PREFIX = "buzzhub.sidebar_collapsed.";

/** Judul ruang kerja yang tampil di bawah logo sesuai role. */
const ROLE_TITLES: Record<string, string> = {
  admin: "Admin Console",
  buzzer: "Buzzer Workspace",
  customer: "Customer Portal",
};

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
        "group/nav relative flex w-full items-center rounded-xl text-[13px] outline-none transition-[background-color,color,padding,gap] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:ring-2 focus-visible:ring-white/70 motion-reduce:transition-none",
        collapsed ? "justify-center gap-0 px-0 py-1.5" : "gap-2.5 px-2 py-1.5",
        active
          ? "bg-white/20 font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_8px_20px_-16px_rgba(0,0,0,0.9)]"
          : "font-medium text-white/85 hover:bg-white/10 hover:text-white",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-white via-white/80 to-white/25 transition-opacity duration-300",
          active ? "opacity-100" : "opacity-0",
        )}
      />
      <span
        className={cn(
          "relative grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors duration-200 [&>svg]:h-[17px] [&>svg]:w-[17px]",
          active
            ? "bg-white/25 text-white"
            : "bg-white/10 text-white/80 group-hover/nav:bg-white/20 group-hover/nav:text-white",
        )}
      >
        {item.icon}
        {collapsed && item.badge ? (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-[#0b1220]">
            {item.badge > 99 ? "99+" : item.badge}
          </span>
        ) : null}
      </span>
      <span
        aria-hidden={collapsed}
        className={cn(
          "flex min-w-0 items-center overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
          collapsed ? "max-w-0 opacity-0" : "max-w-[190px] flex-1 opacity-100",
        )}
      >
        <span className="truncate">{item.label}</span>
        {!collapsed && item.badge ? (
          <span className="ml-auto shrink-0 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white shadow-sm">
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
      <TooltipContent side="right" sideOffset={10}>
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
  const navRef = useRef<HTMLElement | null>(null);

  // Kelompokkan item berdasarkan properti `group` (urutan tetap dipertahankan).
  const groups = useMemo(() => {
    const out: { group?: string; items: SidebarNavItem<K>[] }[] = [];
    for (const item of nav) {
      const last = out[out.length - 1];
      if (last && (last.group ?? "") === (item.group ?? "")) last.items.push(item);
      else out.push({ group: item.group, items: [item] });
    }
    return out;
  }, [nav]);

  // Pastikan menu aktif selalu terlihat saat sidebar di-scroll.
  useEffect(() => {
    const container = navRef.current;
    if (!container) return;
    const active = container.querySelector<HTMLElement>('[aria-current="page"]');
    active?.scrollIntoView({ block: "nearest" });
  }, [activeKey]);

  const roleTitle = user?.roleLabel ? (ROLE_TITLES[user.roleLabel] ?? "Workspace") : "Workspace";

  const userBlock = (
    <div
      className={cn(
        "flex min-w-0 items-center rounded-xl border border-white/15 bg-white/10 transition-[padding,gap] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
        collapsed ? "justify-center gap-0 p-1.5" : "gap-2.5 p-2",
      )}
    >
      <Avatar
        className={cn(
          "shrink-0 ring-2 ring-white/20 transition-[width,height] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
          collapsed ? "h-9 w-9" : "h-9 w-9",
        )}
      >
        {user?.avatarUrl ? (
          <AvatarImage src={user.avatarUrl} alt={user?.name ?? "Pengguna"} />
        ) : null}
        <AvatarFallback className="bg-white/20 text-[11px] font-bold text-white">
          {initials(user?.name ?? "")}
        </AvatarFallback>
      </Avatar>
      <div
        aria-hidden={collapsed}
        className={cn(
          "min-w-0 overflow-hidden transition-[max-width,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
          collapsed ? "max-w-0 opacity-0" : "max-w-[190px] flex-1 opacity-100",
        )}
      >
        <p className="truncate text-[13px] font-semibold leading-tight text-white">
          {user?.name ?? "Tamu"}
        </p>
        <p className="truncate text-[11px] leading-tight text-white/70">{user?.email ?? ""}</p>
      </div>
    </div>
  );

  const logoutButton = (
    <div className="mt-2 flex justify-center">
      <button
        type="button"
        onClick={onLogout}
        aria-label="Keluar"
        className={cn(
          "flex h-9 items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/20 bg-white/10 text-[12.5px] font-semibold text-white/85 transition-[width,padding,background-color,border-color,color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-white/35 hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 motion-reduce:transition-none",
          collapsed ? "w-9 shrink-0 px-0" : "w-full px-3",
        )}
      >
        <LogOut className="h-4 w-4 shrink-0" />
        <span
          className={cn(
            "overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
            collapsed ? "max-w-0 opacity-0" : "max-w-[80px] opacity-100",
          )}
        >
          Keluar
        </span>
      </button>
    </div>
  );

  return (
    <div className="flex h-full min-h-0 flex-col text-white">
      {/* Brand — layout tetap satu baris di kedua state supaya tombol tidak berpindah */}
      <div className="mb-4 flex shrink-0 items-center justify-between gap-1.5 px-1">
        <Link
          to="/"
          className={cn(
            "group flex min-w-0 items-center transition-[gap] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
            collapsed ? "gap-0" : "gap-2.5",
          )}
          title={roleTitle}
          aria-label={`BuzzHub · ${roleTitle}`}
        >
          <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-brand shadow-[0_8px_20px_-10px_rgba(0,0,0,0.8)] ring-1 ring-white/70 transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transition-none">
            <Megaphone className="h-[18px] w-[18px]" />
          </span>
          <span
            aria-hidden={collapsed}
            className={cn(
              "min-w-0 overflow-hidden transition-[max-width,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
              collapsed ? "max-w-0 opacity-0" : "max-w-[160px] opacity-100",
            )}
          >
            <span className="block truncate font-display text-[17px] font-bold leading-tight tracking-tight text-white">
              BuzzHub
            </span>
            <span className="mt-0.5 block truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60">
              {roleTitle}
            </span>
          </span>
        </Link>
        {onToggleCollapse && (
          <SidebarCollapseButton collapsed={collapsed} onToggle={onToggleCollapse} />
        )}
      </div>

      {/* Navigasi */}
      <nav
        ref={navRef}
        aria-label="Navigasi utama"
        className="scrollbar-slim flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain pr-0.5"
      >
        <TooltipProvider delayDuration={200}>
          {groups.map((group, index) => (
            <div
              key={group.group ?? `g-${index}`}
              className={cn("flex flex-col gap-0.5", index > 0 && "mt-2")}
            >
              {group.group ? (
                <div
                  aria-hidden={collapsed}
                  className={cn(
                    "overflow-hidden transition-[max-height,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
                    collapsed ? "max-h-0 opacity-0" : "max-h-8 opacity-100",
                  )}
                >
                  <p className="px-2.5 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/60">
                    {group.group}
                  </p>
                </div>
              ) : null}
              {group.items.map((item) => (
                <NavButton
                  key={item.key}
                  item={item}
                  active={activeKey === item.key}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                  onPrefetch={onPrefetch}
                />
              ))}
            </div>
          ))}
        </TooltipProvider>
      </nav>

      {/* Akun */}
      <div className="mt-3 shrink-0 border-t border-white/15 pt-3">
        {collapsed ? (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>{userBlock}</TooltipTrigger>
              <TooltipContent side="right" sideOffset={10}>
                <span className="font-semibold">{user?.name ?? "Tamu"}</span>
                <span className="block text-[11px] opacity-80">{roleTitle}</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          userBlock
        )}
        {collapsed ? (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>{logoutButton}</TooltipTrigger>
              <TooltipContent side="right" sideOffset={10}>
                Keluar
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          logoutButton
        )}
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
            className="hidden h-8 w-8 shrink-0 rounded-lg border-white/25 bg-white/15 text-white transition-colors hover:border-white/40 hover:bg-white/25 hover:text-white md:inline-flex"
            aria-label={label}
            aria-expanded={!collapsed}
            title={label}
          >
            <span className="relative grid h-4 w-4 place-items-center">
              <PanelLeftClose
                className={cn(
                  "absolute h-4 w-4 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
                  collapsed ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100",
                )}
                aria-hidden="true"
              />
              <PanelLeftOpen
                className={cn(
                  "absolute h-4 w-4 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
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
  maxPrimary = MAX_PRIMARY_NAV,
  featuredKey,
  showMore = true,
}: {
  nav: SidebarNavItem<K>[];
  activeKey: K;
  onNavigate: (key: K) => void;
  /** Dipanggil saat menu disentuh, untuk memuat data lebih awal. */
  onPrefetch?: (key: K) => void;
  /** Menu yang tampil langsung di bottom nav. Sisanya masuk ke sheet "Lainnya". */
  primaryKeys?: K[];
  /** Jumlah maksimum menu utama (default 4). */
  maxPrimary?: number;
  /** Menu yang ikonnya ditonjolkan dengan lingkaran penuh. */
  featuredKey?: K;
  /** Tampilkan tombol "Lainnya" untuk sisa navigasi. */
  showMore?: boolean;
}) {
  const [moreOpen, setMoreOpen] = useState(false);

  const primary = useMemo(() => {
    if (!primaryKeys?.length) return nav.slice(0, maxPrimary);
    const ordered = primaryKeys
      .map((key) => nav.find((item) => item.key === key))
      .filter((item): item is SidebarNavItem<K> => Boolean(item));
    return ordered.slice(0, maxPrimary);
  }, [nav, primaryKeys, maxPrimary]);

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

  const renderButton = (item: SidebarNavItem<K>, active: boolean) => {
    const featured = featuredKey === item.key;
    return (
      <button
        key={item.key}
        type="button"
        data-section={item.key}
        onClick={() => select(item.key)}
        onPointerDown={() => onPrefetch?.(item.key)}
        aria-current={active ? "page" : undefined}
        className={cn(
          "relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1 text-[10px] font-medium transition-colors duration-200 min-[380px]:text-[11px]",
          active ? "text-brand" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        )}
      >
        <span
          className={cn(
            "relative grid place-items-center transition-colors duration-200 [&>svg]:h-[19px] [&>svg]:w-[19px]",
            featured
              ? "h-11 w-11 -translate-y-2.5 rounded-full bg-brand text-white shadow-lg ring-4 ring-background [&>svg]:h-5 [&>svg]:w-5"
              : cn("h-8 w-8 rounded-xl", active ? "bg-brand/12 text-brand" : "text-muted-foreground"),
            featured && active && "bg-brand-glow",
          )}
        >
          {item.icon}
          {item.badge ? (
            <span className="absolute -right-1.5 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-background">
              {item.badge > 99 ? "99+" : item.badge}
            </span>
          ) : null}
        </span>
        <span className={cn("max-w-full truncate leading-tight", featured && "-mt-1.5")}>
          {item.shortLabel ?? item.label}
        </span>
      </button>
    );
  };

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/90 shadow-[0_-12px_32px_-24px_rgba(2,6,23,0.55)] backdrop-blur-xl md:hidden"
        aria-label="Navigasi bawah"
      >
        <div className="flex items-stretch gap-1 px-2 pt-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
          {primary.map((item) => renderButton(item, activeKey === item.key))}
          {showMore && overflow.length > 0 && (
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={moreOpen}
              className={cn(
                "relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1 text-[10px] font-medium transition-colors duration-200 min-[380px]:text-[11px]",
                activeInOverflow
                  ? "text-brand"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "relative grid h-8 w-8 place-items-center rounded-xl transition-colors duration-200",
                  activeInOverflow ? "bg-brand/12 text-brand" : "text-muted-foreground",
                )}
              >
                <Menu className="h-[19px] w-[19px]" aria-hidden="true" />
                {overflowUnread > 0 && (
                  <span className="absolute -right-1.5 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-background">
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
        {showMore && (
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
                      "flex items-center gap-2.5 rounded-2xl border px-3 py-2.5 text-left text-sm font-medium transition-colors duration-200",
                      active
                        ? "border-brand/40 bg-brand/10 text-brand"
                        : "border-border bg-card text-foreground hover:bg-muted/60",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-xl [&>svg]:h-[18px] [&>svg]:w-[18px]",
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
        )}
      </Sheet>
    </>
  );
}
