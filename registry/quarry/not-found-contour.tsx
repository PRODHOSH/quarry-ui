"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const RINGS = Array.from({ length: 14 }, (_, i) => i);

/** One closed wobbly loop, centred on 0,0. Each ring is a bit larger and phase shifted. */
const loop = (r: number, k: number) => {
  const pts = 8;
  const p = Array.from({ length: pts }, (_, i) => {
    const a = (i / pts) * Math.PI * 2;
    const wob = 1 + 0.16 * Math.sin(a * 2 + k) + 0.1 * Math.cos(a * 3 - k * 1.3);
    return [Math.cos(a) * r * wob * 1.35, Math.sin(a) * r * wob] as const;
  });
  const mid = (a: readonly number[], b: readonly number[]) => `${((a[0] + b[0]) / 2).toFixed(1)} ${((a[1] + b[1]) / 2).toFixed(1)}`;
  let d = `M ${mid(p[0], p[1])}`;
  for (let i = 1; i <= pts; i++) d += ` Q ${p[i % pts][0].toFixed(1)} ${p[i % pts][1].toFixed(1)} ${mid(p[i % pts], p[(i + 1) % pts])}`;
  return d + " Z";
};

/**
 * A moody 404 on a field of slowly drifting contour lines. The huge serif numerals sit above the
 * map and the lines breathe behind them, like a topographic chart of somewhere you cannot reach.
 */
export function NotFoundContour({
  title = "No trail leads here",
  message = "The path you followed has ended. Let us get you back on solid ground.",
  href = "/",
  cta = "Back to base",
  className,
}: {
  title?: string;
  message?: string;
  href?: string;
  cta?: string;
  className?: string;
}) {
  return (
    <section className={cn("relative isolate flex min-h-[32rem] w-full flex-col items-center justify-center overflow-hidden bg-background px-6 py-16 text-center text-foreground", className)}>
      <svg aria-hidden viewBox="-400 -250 800 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 -z-10 size-full text-foreground">
        {RINGS.map((i) => (
          <motion.path
            key={i}
            d={loop(14 + i * 19, i * 0.5)}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity={0.14 + (1 - i / RINGS.length) * 0.3}
            animate={{ d: [loop(14 + i * 19, i * 0.5), loop(14 + i * 19, i * 0.5 + 1.6), loop(14 + i * 19, i * 0.5)] }}
            transition={{ duration: 16 + i * 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </svg>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--background)_85%)]" />

      <motion.h1
        initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="font-serif text-[clamp(8rem,32vw,22rem)] leading-[0.85] tracking-tight"
      >
        404
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 font-serif text-2xl sm:text-3xl">
        {title}
      </motion.p>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }} className="mt-2 max-w-sm text-sm text-muted-foreground">
        {message}
      </motion.p>
      <motion.a
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        href={href}
        className="mt-8 inline-flex h-11 items-center rounded-md bg-primary px-6 font-mono text-xs uppercase tracking-[0.16em] text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95"
      >
        {cta}
      </motion.a>
    </section>
  );
}
