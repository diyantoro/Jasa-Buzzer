import { Link } from "@tanstack/react-router";
import { LogOut, Megaphone, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type SidebarNavItem<K extends string = string> = { key: K; label: string; icon: ReactNode };

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
        "relative flex w-full items-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2",
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
      {!collapsed ? <span className="truncate">{item.label}</span> : null}
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
      <div className={cn("mb-6 flex items-center gap-2", collapsed ? "justify-center" : "px-1")}>
        <Link
          to="/"
          className={cn("flex min-w-0 items-center gap-2", collapsed && "justify-center")}
          title="BuzzHub"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand text-brand-foreground">
            <Megaphone className="h-[18px] w-[18px]" />
          </span>
          {!collapsed ? (
            <span className="truncate font-display text-lg font-bold tracking-tight">BuzzHub</span>
          ) : null}
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
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-9 w-9 border border-border">
              {user?.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt={user?.name ?? "Pengguna"} />
              ) : null}
              <AvatarFallback className="bg-muted text-[11px] font-bold text-foreground">
                {initials(user?.name ?? "")}
              </AvatarFallback>
            </Avatar>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="h-8 w-8 text-muted-foreground"
              aria-label="Keluar"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 px-1">
              <Avatar className="h-10 w-10 shrink-0 border border-border">
                {user?.avatarUrl ? (
                  <AvatarImage src={user.avatarUrl} alt={user?.name ?? "Pengguna"} />
                ) : null}
                <AvatarFallback className="bg-brand text-xs font-bold text-brand-foreground">
                  {initials(user?.name ?? "")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {user?.roleLabel ? `Masuk sebagai ${user.roleLabel}` : "Masuk sebagai"}
                </p>
                <p className="truncate text-sm font-semibold">{user?.name ?? "Tamu"}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email ?? ""}</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="mt-3 w-full" onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Keluar
            </Button>
          </>
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
            className="hidden h-9 w-9 shrink-0 md:inline-flex"
            aria-label={label}
            aria-expanded={!collapsed}
            title={label}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function MobileBottomNav<K extends string>({
  nav,
  activeKey,
  onNavigate,
}: {
  nav: SidebarNavItem<K>[];
  activeKey: K;
  onNavigate: (key: K) => void;
}) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl md:hidden"
      aria-label="Navigasi bawah"
    >
      <div className="flex items-stretch gap-1 overflow-x-auto px-2 py-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom))] scrollbar-none">
        {nav.map((item) => {
          const active = activeKey === item.key;
          return (
            <button
              key={item.key}
              type="button"
              data-section={item.key}
              onClick={() => onNavigate(item.key)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex min-w-[56px] flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1.5 py-1.5 text-[10px] font-medium transition-colors",
                active
                  ? "text-brand"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-0 h-[2px] w-6 rounded-full bg-brand transition-opacity",
                  active ? "opacity-100" : "opacity-0",
                )}
              />
              <span className="[&>svg]:h-[18px] [&>svg]:w-[18px]">{item.icon}</span>
              <span className="max-w-full truncate leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
