import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut, Megaphone, Menu } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { clearSession, useSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type NavItem = { label: string; to: string; icon: ReactNode };

export function DashboardShell({
  title,
  subtitle,
  nav,
  children,
}: {
  title: string;
  subtitle: string;
  nav: NavItem[];
  children: ReactNode;
}) {
  const session = useSession();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [logoutOpen, setLogoutOpen] = useState(false);

  const roleLabel = (() => {
    switch (session?.role) {
      case "admin": return "admin";
      case "buzzer": return "buzzer";
      case "customer": return "customer";
      default: return "akun";
    }
  })();

  const doLogout = () => {
    clearSession();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/30">
      <div className="mx-auto flex max-w-[1400px] gap-6 px-3 py-4 sm:px-6 lg:px-8">
        {/* Sidebar Desktop */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-6 rounded-2xl border border-border bg-sidebar p-4 shadow-sm">
            <Link to="/" className="mb-6 flex items-center gap-2 px-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-brand-foreground">
                <Megaphone className="h-5 w-5" />
              </span>
              <span className="font-display text-lg font-bold">Buzz<span className="text-gradient-brand">Hub</span></span>
            </Link>
            <nav className="space-y-1">
              {nav.map((item) => {
                const active = path === item.to;
                return (
                  <a
                    key={item.to}
                    href={item.to}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "gradient-brand text-brand-foreground shadow-glow-active"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </a>
                );
              })}
            </nav>
            <div className="mt-6 rounded-xl border border-border bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground">Masuk sebagai</p>
              <p className="truncate text-sm font-semibold">{session?.name ?? "Tamu"}</p>
              <p className="truncate text-xs text-muted-foreground">{session?.email}</p>
              <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => setLogoutOpen(true)}>
                <LogOut className="mr-2 h-4 w-4" /> Keluar
              </Button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          <header className="mb-5 sm:mb-6 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 sm:gap-3">
            {/* Mobile hamburger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden h-9 w-9 shrink-0" aria-label="Buka menu">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <div className="flex h-full flex-col overflow-x-hidden overflow-y-auto p-4">
                  <Link to="/" className="mb-6 flex items-center gap-2 px-2">
                    <span className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-brand-foreground">
                      <Megaphone className="h-5 w-5" />
                    </span>
                    <span className="font-display text-lg font-bold">Buzz<span className="text-gradient-brand">Hub</span></span>
                  </Link>
                  <nav className="space-y-1">
                    {nav.map((item) => {
                      const active = path === item.to;
                      return (
                        <a
                          key={item.to}
                          href={item.to}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            active
                              ? "gradient-brand text-brand-foreground shadow-glow-active"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          )}
                        >
                          {item.icon}
                          {item.label}
                        </a>
                      );
                    })}
                  </nav>
                  <div className="mt-6 rounded-xl border border-border bg-muted/40 p-3">
                    <p className="text-xs text-muted-foreground">Masuk sebagai</p>
                    <p className="truncate text-sm font-semibold">{session?.name ?? "Tamu"}</p>
                    <p className="truncate text-xs text-muted-foreground">{session?.email}</p>
                    <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => setLogoutOpen(true)}>
                      <LogOut className="mr-2 h-4 w-4" /> Keluar
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="min-w-0">
              <h1 className="truncate font-display text-xl font-bold sm:text-2xl lg:text-3xl">{title}</h1>
              <p className="truncate text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <ThemeToggle />
              <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setLogoutOpen(true)}>
                <LogOut className="mr-1 h-4 w-4" /> <span className="hidden xs:inline">Keluar</span>
              </Button>
            </div>
          </header>

          <div className="pb-24 lg:pb-0">{children}</div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-[1400px] items-stretch justify-around gap-1 px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
          {nav.map((item) => {
            const active = path === item.to;
            return (
              <a
                key={item.to}
                href={item.to}
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-medium transition-colors",
                  active
                    ? "gradient-brand text-brand-foreground shadow-glow-active"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <span className="[&>svg]:h-5 [&>svg]:w-5">{item.icon}</span>
                <span className="truncate max-w-full">{item.label}</span>
              </a>
            );
          })}
        </div>
      </nav>

      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Keluar akun {roleLabel}?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan keluar dari sesi saat ini. Pastikan pekerjaan telah disimpan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={doLogout} className="gradient-brand text-brand-foreground">
              Keluar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
}: { label: string; value: string; hint?: string; icon: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-medium uppercase leading-tight tracking-wide text-muted-foreground sm:text-xs">
          {label}
        </p>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground sm:h-9 sm:w-9">
          {icon}
        </span>
      </div>
      <p className="mt-2.5 font-display text-xl font-bold leading-tight break-words sm:mt-3 sm:text-2xl">
        {value}
      </p>
      {hint && (
        <p className="mt-1 text-[11px] leading-snug text-muted-foreground sm:text-xs">{hint}</p>
      )}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Aktif: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    Berjalan: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    Selesai: "bg-zinc-200 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-200",
    Review: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    Verifikasi: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    "Menunggu Verifikasi Admin": "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    "Menunggu Verifikasi": "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    Menunggu: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    Pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    Diproses: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    Disetujui: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    Berhasil: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    Lunas: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    Ditolak: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
    Gagal: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
    Refund: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
    Nonaktif: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  };
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", map[status] ?? "bg-muted text-muted-foreground")}>
      {status}
    </span>
  );
}
