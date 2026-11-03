"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { animate, motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export type StairStat = { value: number; suffix: string; text: string; color?: string; ink?: string };

const STATS: StairStat[] = [
  { value: 14, suffix: "+ years", text: "Designing, printing and promoting brands since 2012." },
  { value: 15, suffix: "services", text: "From logos and print to films and digital marketing, in one studio." },
  { value: 60, suffix: "+ projects", text: "Brand work shown in our portfolio across retail, finance, food and more." },
];
const COLORS = [
  { bg: "var(--ring)", fg: "#fff" },
  { bg: "var(--primary)", fg: "var(--primary-foreground)" },
  { bg: "color-mix(in oklab, var(--ring) 55%, #29b6ff)", fg: "#fff" },
];

function Count({ to, seen }: { to: number; seen: boolean }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const r = requestAnimationFrame(() => setV(to));
      return () => cancelAnimationFrame(r);
    }
    const c = animate(0, to, { duration: 2, ease: [0.22, 1, 0.36, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [seen, to]);
  return <span className="tabular-nums">{new Intl.NumberFormat("en-US").format(v)}</span>;
}

/** One bar. The in view check sits on the wrapper, because a clipped element can never count as visible. */
function Step({ stat, index, root }: { stat: StairStat; index: number; root?: RefObject<HTMLElement | null> }) {
  const wrap = useRef<HTMLDivElement>(null);
  const seen = useInView(wrap, { once: true, amount: 0.2, root });
  const c = COLORS[index % COLORS.length];
  return (
    <div ref={wrap}>
      <motion.div
        initial={false}
        animate={{ clipPath: seen ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
        className="flex min-h-[clamp(9rem,17vw,15.5rem)] flex-col flex-wrap items-start justify-between gap-3 px-[clamp(1.4rem,3.4vw,4rem)] py-[clamp(1.75rem,4vw,4rem)] [margin-left:calc(var(--n)*6%)] sm:flex-row sm:flex-nowrap sm:items-center sm:gap-6 sm:[margin-left:calc(14%+var(--n)*17%)]"
        style={{ ["--n" as string]: index, background: stat.color ?? c.bg, color: stat.ink ?? c.fg }}
      >
        <b className="whitespace-nowrap text-[clamp(3rem,1rem+7.2vw,9.5rem)] font-medium leading-[0.95] tracking-[-0.055em]">
          <Count to={stat.value} seen={seen} />
          <small className="ml-2.5 text-[0.34em] font-medium tracking-[-0.01em]">{stat.suffix}</small>
        </b>
        <p className="min-w-0 max-w-[34ch] text-[clamp(0.9rem,0.8rem+0.35vw,1.15rem)] leading-[1.35] opacity-90 sm:max-w-[28ch] sm:text-right">{stat.text}</p>
      </motion.div>
    </div>
  );
}

/**
 * Big figures on a staircase of coloured bars. Each bar sits further right than the one above it,
 * wipes in from the left as it scrolls into view, and counts up to its number. On a phone the steps
 * shrink to a small indent and stack their text under the figure.
 */
export function StairStats({
  eyebrow = "Northwind in numbers",
  title = "A studio you can count on.",
  stats = STATS,
  scrollContainer,
  className,
}: {
  eyebrow?: string;
  title?: string;
  stats?: StairStat[];
  /** Set this when the section lives inside a scrolling box. */
  scrollContainer?: RefObject<HTMLElement | null>;
  className?: string;
}) {
  return (
    <section className={cn("bg-background px-[clamp(1rem,3.2vw,3rem)] py-[clamp(3.5rem,6.5vw,7rem)] text-foreground", className)}>
      <div className="mx-auto max-w-[110rem]">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{eyebrow}</p>
        <h2 className="mb-[clamp(1.5rem,3vw,2.5rem)] mt-2.5 max-w-[16ch] text-[clamp(1.9rem,1rem+3.4vw,4.2rem)] font-medium leading-[1.04] tracking-[-0.035em]">{title}</h2>
        <div>
          {stats.map((s, i) => (
            <Step key={s.suffix} stat={s} index={i} root={scrollContainer} />
          ))}
        </div>
      </div>
    </section>
  );
}
