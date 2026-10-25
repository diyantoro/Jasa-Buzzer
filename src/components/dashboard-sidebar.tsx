import { Link } from "@tanstack/react-router";
import { LogOut, Megaphone, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
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
}: {
  item: SidebarNavItem<K>;
  active: boolean;
  collapsed: boolean;
  onNavigate: (key: K) => void;
}) {
  const button = (
    <button
      type="button"
      data-section={item.key}
      onClick={() => onNavigate(item.key)}
      aria-current={active ? "page" : undefined}
      aria-label={collapsed ? item.label : undefined}
      className={cn(
        "relative flex w-full items-center rounded-lg text-sm transition-[padding,gap,background-color,color] duration-300 ease-in-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        collapsed ? "justify-center gap-0 px-0 py-2.5" : "gap-3 px-3 py-2",
        active
          ? "bg-muted font-semibold text-foreground"
          : "font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-brand transition-opacity",
          active ? "opacity-100" : "opacity-0",
        )}
      />
      <span className={cn("shrink-0 [&>svg]:h-[18px] [&>svg]:w-[18px]", active && "text-brand")}>
        {item.icon}
      </span>
      <span
        aria-hidden={collapsed}
        className={cn(
          "overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ease-in-out motion-reduce:transition-none",
          collapsed ? "max-w-0 opacity-0" : "max-w-[190px] opacity-100",
        )}
      >
        {item.label}
      </span>
    </button>
  );

  if (!collapsed) return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}

export function SidebarNav<K extends string>({
  nav,
  activeKey,
  onNavigate,
  user,
  onLogout,
  collapsed = false,
}: {
  nav: SidebarNavItem<K>[];
  activeKey: K;
  onNavigate: (key: K) => void;
  user?: SidebarUser;
  onLogout: () => void;
  collapsed?: boolean;
}) {
  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "mb-6 flex items-center transition-[padding,gap] duration-300 ease-in-out motion-reduce:transition-none",
          collapsed ? "justify-center gap-0" : "gap-2 px-1",
        )}
      >
        <Link
          to="/"
          className={cn("flex min-w-0 items-center gap-2", collapsed && "justify-center")}
          title="BuzzHub"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand text-brand-foreground">
            <Megaphone className="h-[18px] w-[18px]" />
          </span>
          <span
            aria-hidden={collapsed}
            className={cn(
              "overflow-hidden whitespace-nowrap font-display text-lg font-bold tracking-tight transition-[max-width,opacity] duration-300 ease-in-out motion-reduce:transition-none",
              collapsed ? "max-w-0 opacity-0" : "max-w-[160px] opacity-100",
            )}
          >
            BuzzHub
          </span>
        </Link>
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
            />
          ))}
        </TooltipProvider>
      </nav>

      <div className="mt-6 border-t border-border pt-4">
        <div
          className={cn(
            "flex items-center transition-[padding,gap] duration-300 ease-in-out motion-reduce:transition-none",
            collapsed ? "justify-center gap-0" : "gap-3 px-1",
          )}
        >
          <Avatar
            className={cn(
              "shrink-0 border border-border transition-[width,height] duration-300 ease-in-out motion-reduce:transition-none",
              collapsed ? "h-9 w-9" : "h-10 w-10",
            )}
          >
            {user?.avatarUrl ? (
              <AvatarImage src={user.avatarUrl} alt={user?.name ?? "Pengguna"} />
            ) : null}
            <AvatarFallback
              className={cn(
                "text-[11px] font-bold",
                collapsed ? "bg-muted text-foreground" : "bg-brand text-brand-foreground",
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
            <p className="whitespace-nowrap text-[11px] uppercase tracking-wide text-muted-foreground">
              {user?.roleLabel ? `Masuk sebagai ${user.roleLabel}` : "Masuk sebagai"}
            </p>
            <p className="truncate text-sm font-semibold">{user?.name ?? "Tamu"}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email ?? ""}</p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={onLogout}
          aria-label="Keluar"
          className={cn(
            "mt-3 transition-[width,padding] duration-300 ease-in-out motion-reduce:transition-none",
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
            className="hidden h-9 w-9 shrink-0 md:inline-flex"
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
  primaryKeys,
}: {
  nav: SidebarNavItem<K>[];
  activeKey: K;
  onNavigate: (key: K) => void;
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

  const select = (key: K) => {
    onNavigate(key);
    setMoreOpen(false);
  };

  const renderButton = (item: SidebarNavItem<K>, active: boolean) => (
    <button
      key={item.key}
      type="button"
      data-section={item.key}
      onClick={() => select(item.key)}
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
      <span className="[&>svg]:h-[19px] [&>svg]:w-[19px]">{item.icon}</span>
      <span className="max-w-full truncate leading-tight">
        {item.shortLabel ?? item.label}
      </span>
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
              <Menu className="h-[19px] w-[19px]" aria-hidden="true" />
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
                  <span className="min-w-0 text-[13px] leading-tight">{item.label}</span>
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
