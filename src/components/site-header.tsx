import { Link } from "@tanstack/react-router";
import { Megaphone, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, clearSession } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  const session = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl gradient-brand text-brand-foreground shadow-glow">
            <Megaphone className="h-5 w-5" />
          </span>
          <span className="truncate font-display text-lg font-bold tracking-tight sm:text-xl">
            Buzz<span className="text-gradient-brand">Hub</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="/#layanan" className="text-sm font-medium text-muted-foreground hover:text-foreground">Layanan</a>
          <a href="/#proses" className="text-sm font-medium text-muted-foreground hover:text-foreground">Proses</a>
          <a href="/#testimoni" className="text-sm font-medium text-muted-foreground hover:text-foreground">Testimoni</a>
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 sm:flex">
          <ThemeToggle />
          {session ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to={`/${session.role}` as never}>Dashboard</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={clearSession}>
                <LogOut className="mr-1 h-4 w-4" /> Keluar
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Masuk</Link>
              </Button>
              <Button asChild size="sm" className="gradient-brand text-brand-foreground hover:opacity-90">
                <Link to="/register">Daftar</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 sm:hidden">
          <ThemeToggle />
          {session ? (
            <>
              <Button asChild size="sm" className="gradient-brand text-brand-foreground">
                <Link to={`/${session.role}` as never}>Dashboard</Link>
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9" aria-label="Keluar" onClick={clearSession}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="gradient-brand text-brand-foreground">
              <Link to="/login">Masuk</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
