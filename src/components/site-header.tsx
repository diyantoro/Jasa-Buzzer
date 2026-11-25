import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, LogOut, Megaphone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, clearSession } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "layanan", label: "Layanan" },
  { id: "proses", label: "Proses" },
  { id: "testimoni", label: "Testimoni" },
] as const;

export function SiteHeader() {
  const session = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Sorot section yang sedang terlihat supaya menu punya penanda aktif.
  useEffect(() => {
    const elements = SECTIONS.map((section) => document.getElementById(section.id)).filter(
      (element): element is HTMLElement => Boolean(element),
    );
    if (elements.length === 0 || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  // Tutup menu saat tekan Escape, klik di luar, atau layar melebar ke desktop.
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      // Tombol toggle punya handler sendiri; jangan ditutup dulu di sini
      // supaya klik kedua benar-benar menutup menu.
      if (target?.closest('[aria-controls="site-mobile-nav"]')) return;
      if (menuRef.current && !menuRef.current.contains(target as Node)) {
        setMenuOpen(false);
      }
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = () => {
      if (desktop.matches) setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [menuOpen]);

  const goToSection = (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    setMenuOpen(false);
    setActiveSection(id);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:px-6 md:gap-4 sm:py-4">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl gradient-brand text-brand-foreground shadow-glow">
            <Megaphone className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="truncate font-display text-lg font-bold tracking-tight sm:text-xl">
            Buzz<span className="text-gradient-brand">Hub</span>
          </span>
        </Link>

        {/* Navigasi desktop */}
        <nav className="hidden items-center gap-1 md:flex">
          {SECTIONS.map((section) => {
            const active = activeSection === section.id;
            return (
              <a
                key={section.id}
                href={`/#${section.id}`}
                onClick={goToSection(section.id)}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand/10 text-brand"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {section.label}
              </a>
            );
          })}
        </nav>

        {/* Aksi desktop */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {session ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to={`/${session.role}` as never}>Dashboard</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={clearSession}>
                <LogOut className="mr-1 h-4 w-4" aria-hidden="true" /> Keluar
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Masuk</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="gradient-brand text-brand-foreground hover:opacity-90"
              >
                <Link to="/register">Daftar</Link>
              </Button>
            </>
          )}
        </div>

        {/* Aksi mobile — tema dipindah ke dalam panel agar header lega di layar 320px */}
        <div className="flex items-center gap-1.5 md:hidden">
          {session ? (
            <Button asChild size="sm" className="gradient-brand text-brand-foreground">
              <Link to={`/${session.role}` as never}>Dashboard</Link>
            </Button>
          ) : (
            <Button asChild size="sm" className="gradient-brand text-brand-foreground">
              <Link to="/login">Masuk</Link>
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn(
              "h-9 w-9 shrink-0 rounded-xl shadow-sm transition-all duration-200 active:scale-95",
              menuOpen
                ? "border-brand/30 gradient-cta text-white shadow-glow hover:text-white"
                : "bg-card text-foreground hover:border-brand/40 hover:bg-brand/5 hover:text-brand",
            )}
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
            aria-controls="site-mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </div>

        {/* Panel menu mobile — latar solid agar tidak menyatu dengan konten */}
        {menuOpen && (
          <div
            id="site-mobile-nav"
            ref={menuRef}
            className="absolute inset-x-3 top-[calc(100%+0.4rem)] z-50 overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-[0_24px_60px_-24px_rgba(2,6,23,0.55)] md:hidden"
          >
            <nav className="grid gap-1" aria-label="Navigasi seluler">
              {SECTIONS.map((section) => {
                const active = activeSection === section.id;
                return (
                  <a
                    key={section.id}
                    href={`/#${section.id}`}
                    onClick={goToSection(section.id)}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.99]",
                      active
                        ? "gradient-cta text-white shadow-[0_10px_24px_-12px_rgba(2,6,23,0.65)] ring-1 ring-white/25"
                        : "bg-muted/40 text-foreground hover:bg-brand/5 hover:text-brand",
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "h-2 w-2 shrink-0 rounded-full",
                          active
                            ? "bg-white shadow-[0_0_0_3px_rgba(255,255,255,0.25)]"
                            : "bg-muted-foreground/50",
                        )}
                      />
                      {section.label}
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      {active ? (
                        <span className="text-[0.58rem] font-bold uppercase tracking-[0.1em] text-white/85">
                          Aktif
                        </span>
                      ) : null}
                      <ArrowRight
                        aria-hidden="true"
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          active
                            ? "translate-x-0.5 text-white"
                            : "text-muted-foreground/60 group-hover:translate-x-0.5 group-hover:text-brand",
                        )}
                      />
                    </span>
                  </a>
                );
              })}
            </nav>

            <div className="mt-2 border-t border-border/70 p-1 pt-3">
              <div className="grid grid-cols-2 gap-2">
                {session ? (
                  <>
                    <Button asChild variant="outline" size="sm" className="rounded-xl">
                      <Link
                        to={`/${session.role}` as never}
                        onClick={() => setMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      onClick={() => {
                        setMenuOpen(false);
                        clearSession();
                      }}
                    >
                      <LogOut className="mr-1 h-4 w-4" aria-hidden="true" /> Keluar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" size="sm" className="rounded-xl">
                      <Link to="/login" onClick={() => setMenuOpen(false)}>
                        Masuk
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className="rounded-xl gradient-brand text-brand-foreground hover:opacity-90"
                    >
                      <Link to="/register" onClick={() => setMenuOpen(false)}>
                        Daftar
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              <div className="mt-2 flex items-center justify-between gap-2 rounded-xl bg-muted/40 px-3 py-1.5">
                <span className="text-xs font-medium text-muted-foreground">Tema tampilan</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
