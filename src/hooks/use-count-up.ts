import * as React from "react";

type CountUpOptions = {
  /** Durasi animasi dalam ms. */
  duration?: number;
  /** Jumlah angka di belakang koma. */
  decimals?: number;
};

/**
 * Count-up sekali saat elemen masuk viewport (IntersectionObserver + rAF).
 * Otomatis menampilkan angka final bila pengguna memilih reduced motion.
 */
export function useCountUp(target: number, { duration = 1400, decimals = 0 }: CountUpOptions = {}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }

    let frame = 0;
    let startedAt = 0;
    let started = false;

    const tick = (now: number) => {
      if (!startedAt) startedAt = now;
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(Number((target * eased).toFixed(decimals)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      setValue(target);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (started || !entries[0]?.isIntersecting) return;
        started = true;
        observer.disconnect();
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, duration, decimals]);

  return { ref, value };
}
