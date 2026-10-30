import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";
const KEY = "buzzhub.theme";

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> };
};

let activeThemeTransitions = 0;

function getInitial(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem(KEY) as Theme | null;
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function apply(theme: Theme, animate = false) {
  const root = document.documentElement;
  const commit = () => {
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  };

  const doc = document as ViewTransitionDocument;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (animate && doc.startViewTransition && !reduceMotion) {
    activeThemeTransitions += 1;
    // Freeze CSS transitions so the new snapshot is captured in its final state.
    root.classList.add("theme-transitioning");

    let cleanedUp = false;
    const cleanup = () => {
      if (cleanedUp) return;
      cleanedUp = true;
      activeThemeTransitions = Math.max(0, activeThemeTransitions - 1);
      if (activeThemeTransitions === 0) root.classList.remove("theme-transitioning");
    };

    try {
      const transition = doc.startViewTransition(commit);
      const fallback = window.setTimeout(cleanup, 1000);
      const finish = () => {
        window.clearTimeout(fallback);
        cleanup();
      };
      void transition.finished.then(finish, finish);
    } catch {
      cleanup();
      commit();
    }
    return;
  }

  commit();
}

// Apply as early as possible to avoid FOUC on client nav.
if (typeof window !== "undefined") {
  try { apply(getInitial()); } catch { /* noop */ }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light");
  useEffect(() => {
    const t = getInitial();
    setThemeState(t);
    apply(t);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (!localStorage.getItem(KEY)) {
        const sys: Theme = mq.matches ? "dark" : "light";
        setThemeState(sys);
        apply(sys, true);
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  const setTheme = (t: Theme) => {
    localStorage.setItem(KEY, t);
    setThemeState(t);
    apply(t, true);
  };
  return { theme, setTheme, toggle: () => setTheme(theme === "dark" ? "light" : "dark") };
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggle}
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      title={isDark ? "Mode terang" : "Mode gelap"}
      className={cn("relative h-9 w-9 overflow-hidden rounded-full border-border bg-card", className)}
    >
      <Sun
        className={cn(
          "absolute h-4 w-4 transition-all duration-300",
          isDark ? "-translate-y-6 rotate-90 opacity-0" : "translate-y-0 rotate-0 opacity-100",
        )}
      />
      <Moon
        className={cn(
          "absolute h-4 w-4 transition-all duration-300",
          isDark ? "translate-y-0 rotate-0 opacity-100" : "translate-y-6 -rotate-90 opacity-0",
        )}
      />
    </Button>
  );
}
