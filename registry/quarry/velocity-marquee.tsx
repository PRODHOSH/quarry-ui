"use client";

import { useRef, type RefObject } from "react";
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { cn } from "@/lib/utils";

const ITEMS = ["Brand identity", "Web design", "Packaging", "Print", "Social media", "Motion", "Signage"];
const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/**
 * A ticker of words that never stops. It speeds up when you scroll, flips direction when you scroll
 * the other way, settles back to a slow drift, and pauses while the pointer rests on it.
 */
export function VelocityMarquee({
  items = ITEMS,
  speed = 3,
  scrollContainer,
  className,
}: {
  items?: string[];
  /** Base drift, in percent of one group per second. */
  speed?: number;
  scrollContainer?: RefObject<HTMLElement | null>;
  className?: string;
}) {
  const x = useMotionValue(0);
  const { scrollY } = useScroll({ container: scrollContainer });
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const boost = useTransform(smooth, [0, 1500], [0, 5], { clamp: false });
  const xPct = useTransform(x, (v) => `${v}%`);
  const dir = useRef(1);
  const paused = useRef(false);

  useAnimationFrame((_, delta) => {
    if (paused.current) return;
    const b = boost.get();
    if (b < -0.05) dir.current = -1;
    else if (b > 0.05) dir.current = 1;
    const move = dir.current * speed * (1 + Math.abs(b)) * (delta / 1000);
    x.set(wrap(-50, 0, x.get() - move));
  });

  const group = (
    <div className="flex flex-none items-center" aria-hidden>
      {[...items, ...items].map((t, i) => (
        <span key={i} className="inline-flex items-center gap-[clamp(1.5rem,4vw,4rem)] whitespace-nowrap py-[clamp(0.9rem,2vw,1.4rem)] pr-[clamp(1.5rem,4vw,4rem)] text-[clamp(1.05rem,0.98rem+0.4vw,1.3rem)] font-medium">
          {t}
          <svg viewBox="0 0 24 24" className={cn("size-[1.15rem] flex-none", i % 2 ? "text-primary" : "text-foreground")}>
            <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="3" />
          </svg>
        </span>
      ))}
    </div>
  );

  return (
    <div
      role="marquee"
      aria-label={items.join(", ")}
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
      className={cn("overflow-hidden border-y border-primary bg-card text-foreground", className)}
    >
      <motion.div className="flex w-max" style={{ x: xPct }}>
        {group}
        {group}
      </motion.div>
    </div>
  );
}
