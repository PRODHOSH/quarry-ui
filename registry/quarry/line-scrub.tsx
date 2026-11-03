"use client";

import { useRef, type RefObject } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

export type ScrubLine = { text: string; color: string };

const LINES: ScrubLine[] = [
  { text: "Quick to start.", color: "var(--primary)" },
  { text: "Careful to finish.", color: "var(--ring)" },
  { text: "Easy to love.", color: "var(--background)" },
];
const clamp = (v: number) => Math.min(1, Math.max(0, v));

function Line({ line, index, count, progress }: { line: ScrubLine; index: number; count: number; progress: MotionValue<number> }) {
  const seg = 0.78 / count;
  const start = 0.06 + index * seg;
  const lit = useTransform(progress, (p) => clamp((p - start) / seg));
  const opacity = useTransform(lit, (v) => 0.16 + 0.84 * v);
  const color = useTransform(lit, (v) => `color-mix(in oklab, ${line.color} ${Math.round(v * 100)}%, color-mix(in oklab, var(--background) 16%, var(--foreground)))`);
  const y = useTransform(lit, (v) => (1 - v) * 16);
  return (
    <motion.p style={{ opacity, color, y }} className="text-[clamp(2.2rem,1rem+6.2vw,6.4rem)] font-medium leading-[1.02] tracking-[-0.035em]">
      {line.text}
    </motion.p>
  );
}

/**
 * Three big lines that wake up one at a time as you scroll. Each starts as a dim ghost, then fills
 * with its own colour while it rises into place. The section pins while it plays. Give it a
 * `scrollContainer` if it lives inside a scrolling box, and a `stageHeight` that matches that box.
 */
export function LineScrub({
  eyebrow = "In three lines",
  lines = LINES,
  scrollContainer,
  stageHeight = "100svh",
  className,
}: {
  eyebrow?: string;
  lines?: ScrubLine[];
  scrollContainer?: RefObject<HTMLElement | null>;
  /** Height of the pinned stage. Use a fixed value inside a scrolling box. */
  stageHeight?: string;
  className?: string;
}) {
  const root = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: root, container: scrollContainer, offset: ["start start", "end end"] });
  return (
    <section ref={root} className={cn("relative bg-foreground text-background", className)} style={{ height: `calc(${stageHeight} * 2.4)` }}>
      <div className="sticky top-0 flex flex-col justify-center overflow-hidden px-[clamp(1rem,3.2vw,3rem)]" style={{ height: stageHeight }}>
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
        <div className="space-y-1">
          {lines.map((l, i) => (
            <Line key={l.text} line={l} index={i} count={lines.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}
