"use client";

import { useRef, useState, type RefObject } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

const STATEMENT = "I am Sam Rivera, a freelance developer and designer. I turn ideas into websites, apps and software that look sharp, scale well and actually ship.";
const PILLS = ["Open for freelance", "Allergic to generic", "Ships, then polishes"];
const POS = ["left-[2%] top-[4%]", "right-[0%] top-[44%]", "left-[10%] bottom-[2%]"];
const ROT = [-5, 4, -3];

const clamp = (v: number) => Math.min(1, Math.max(0, v));
/** Peach, then the accent, then the ink colour, mixed in the browser so it follows any theme. */
function wordColor(t: number) {
  return t < 0.5
    ? `color-mix(in oklab, var(--primary) ${Math.round(t * 200)}%, var(--accent))`
    : `color-mix(in oklab, var(--foreground) ${Math.round((t - 0.5) * 200)}%, var(--primary))`;
}

function Pill({ progress, at, rotate, className, children }: { progress: MotionValue<number>; at: number; rotate: number; className: string; children: React.ReactNode }) {
  const scale = useTransform(progress, [at, at + 0.1, at + 0.14], [0, 1.12, 1]);
  const turn = useTransform(progress, [at, at + 0.14], [0, rotate]);
  return (
    <motion.span style={{ scale, rotate: turn }} className={cn("absolute hidden sm:block", className)}>
      <motion.span animate={{ y: [0, -10, 0] }} transition={{ duration: 3 + at * 3, repeat: Infinity, ease: "easeInOut" }} className="block whitespace-nowrap rounded-full border-2 border-foreground bg-card px-4 py-1.5 text-sm font-semibold shadow-[3px_3px_0_0_var(--foreground)]">
        {children}
      </motion.span>
    </motion.span>
  );
}

/**
 * A pinned statement that fills in word by word as you scroll. Each word moves from a pale tint to
 * the accent colour to solid ink, and badges pop in around it and keep bobbing. The screen holds
 * still while it plays, then lets go. Pass `container` when it sits inside a scrolling box.
 */
export function ScrollStatement({
  eyebrow = "A bit about me",
  statement = STATEMENT,
  pills = PILLS,
  container,
  stage = "100vh",
  track = 3,
  className,
}: {
  eyebrow?: string;
  statement?: string;
  pills?: string[];
  container?: RefObject<HTMLElement | null>;
  /** Height of the pinned screen. Any CSS length. */
  stage?: string;
  /** Scroll distance, as a multiple of the stage height. */
  track?: number;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrap, container, offset: ["start start", "end end"] });
  const [p, setP] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", setP);
  const words = statement.split(" ");
  // the words finish at 80% of the scroll, leaving a moment where the finished sentence rests
  const fill = clamp(p / 0.8) * words.length;

  return (
    <div ref={wrap} style={{ height: `calc(${stage} * ${track})` }} className={cn("relative w-full", className)}>
      <div style={{ height: stage }} className="sticky top-0 grid place-items-center overflow-hidden px-6">
        <div className="w-full max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">{eyebrow}</p>
          <div className="relative mt-6 pb-8 pt-4">
            <p className="font-[family-name:var(--font-anton)] text-[clamp(1.9rem,5vw,3.9rem)] leading-[1.12] tracking-tight">
              {words.map((w, i) => (
                <span key={i} style={{ color: wordColor(clamp(fill - i)) }}>{w} </span>
              ))}
            </p>
            {pills.slice(0, 3).map((t, i) => (
              <Pill key={t} progress={scrollYProgress} at={[0.24, 0.48, 0.7][i]} rotate={ROT[i]} className={POS[i]}>{t}</Pill>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
