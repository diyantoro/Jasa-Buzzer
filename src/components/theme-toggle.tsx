import { Moon, Sun } from "lucide-react";
import { useCallback, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

const KEY = "buzzhub.theme";

/*
 * Satu sumber kebenaran untuk tema.
 *
 * Sebelumnya setiap <ThemeToggle /> menyimpan state sendiri-sendiri, padahal
 * header merender dua toggle (versi desktop & mobile). Akibatnya state toggle
 * yang tidak terlihat jadi basi: setelah tema diganti lewat satu tombol,
 * tombol lain masih mengira tema lama, sehingga klik pertama padanya tidak
 * mengubah apa pun ("macet"). Store module-level ini menyinkronkan semuanya,
 * termasuk antar-tab lewat event `storage`.
 */
const listeners = new Set<() => void>();
let current: Theme = "light";
/** Tema terakhir yang diminta. Dipakai toggle agar klik cepat tetap bergantian. */
let target: Theme = "light";
let initialized = false;
let activeTransitions = 0;

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> };
};

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function storedTheme(): Theme | null {
  try {
    const saved = localStorage.getItem(KEY);
    return saved === "light" || saved === "dark" ? saved : null;
  } catch {
    return null;
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function commit(theme: Theme) {
  current = theme;
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  emit();
}

function finishTransition(root: HTMLElement) {
  activeTransitions = Math.max(0, activeTransitions - 1);
  if (activeTransitions === 0) root.classList.remove("theme-transitioning");
}

/**
 * Ganti tema.
 *
 * `animate` memakai View Transitions untuk crossfade seluruh halaman. Bedanya
 * dengan versi lama: tema tetap diterapkan walau callback transisi tidak pernah
 * dipanggil (mis. transisi di-skip browser), lewat fallback di bawah.
 */
function requestTheme(theme: Theme, persist = false, animate = true) {
  target = theme;

  if (persist) {
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* localStorage bisa diblokir (mode privat) — tema tetap jalan. */
    }
  }

  const root = document.documentElement;
  const doc = document as ViewTransitionDocument;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!animate || !doc.startViewTransition || reduceMotion) {
    commit(theme);
    return;
  }

  activeTransitions += 1;
  // Bekukan transisi CSS per-elemen agar snapshot baru langsung berwarna final.
  root.classList.add("theme-transitioning");

  let committed = false;
  const apply = () => {
    if (committed) return;
    committed = true;
    commit(theme);
  };

  try {
    const transition = doc.startViewTransition(apply);
    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      finishTransition(root);
    };

    // Jaring pengaman: kalau callback transisi tidak jalan, tema tetap berubah.
    window.setTimeout(() => {
      if (!committed && target === theme) apply();
    }, 300);
    // Jaring pengaman untuk class `theme-transitioning` yang tertinggal.
    window.setTimeout(cleanup, 1500);

    void transition.finished.then(cleanup, cleanup);
  } catch {
    finishTransition(root);
    apply();
  }
}

function init() {
  if (initialized) return;
  initialized = true;

  /*
   * Inline script di __root.tsx sudah menerapkan tema tersimpan/sebelum paint,
   * jadi class di <html> adalah kondisi paling akurat saat modul ini dimuat.
   */
  const fromDom: Theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
  commit(storedTheme() ?? fromDom);
  target = current;

  // Ikuti preferensi OS selama pengguna belum memilih tema sendiri.
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (!storedTheme()) requestTheme(systemTheme());
  });

  // Sinkronkan antar-tab.
  window.addEventListener("storage", (event) => {
    if (event.key !== KEY) return;
    if (event.newValue === "light" || event.newValue === "dark") requestTheme(event.newValue);
    else requestTheme(systemTheme());
  });

  /*
   * Overlay View Transition menangkap klik selama ~320ms. Supaya toggle tidak
   * terasa "macet" saat diklik cepat, klik yang jatuh di area tombol tema
   * diteruskan manual ke logika toggle selama transisi berjalan.
   */
  window.addEventListener(
    "click",
    (event) => {
      if (activeTransitions === 0) return;
      // Kalau browser sudah meneruskan klik ke tombol (overlay tidak memblokir),
      // biarkan handler normal yang menangani — jangan sampai dobel toggle.
      if (event.target instanceof Element && event.target.closest("[data-theme-toggle]")) return;
      const hit = Array.from(document.querySelectorAll<HTMLElement>("[data-theme-toggle]")).some(
        (el) => {
          const rect = el.getBoundingClientRect();
          return (
            rect.width > 0 &&
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom
          );
        },
      );
      if (!hit) return;
      event.preventDefault();
      event.stopPropagation();
      requestTheme(target === "dark" ? "light" : "dark", true);
    },
    true,
  );
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Theme {
  return current;
}

function getServerSnapshot(): Theme {
  return "light";
}

if (typeof window !== "undefined") {
  init();
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    requestTheme(next, true);
  }, []);

  const toggle = useCallback(() => {
    // Pakai `target`, bukan class DOM: kalau diklik cepat sebelum transisi
    // selesai, arah toggle tetap benar dan tidak terasa "macet".
    requestTheme(target === "dark" ? "light" : "dark", true);
  }, []);

  return { theme, setTheme, toggle };
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
      data-theme-toggle=""
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      aria-pressed={isDark}
      title={isDark ? "Mode terang" : "Mode gelap"}
      className={cn(
        "relative h-9 w-9 overflow-hidden rounded-full border-border bg-card",
        className,
      )}
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
