"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useSpring, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

const DIGIT = 56; // px height of one digit cell, matches the h-14 class below

function Digit({ place, value }: { place: number; value: MotionValue<number> }) {
  const y = useTransform(value, (v) => {
    // a digit holds still and only rolls during the final unit before it carries, like an odometer
    const base = Math.floor(v / place);
    const roll = Math.max(0, (v % place) - (place - 1));
    return -((base % 10) + roll) * DIGIT;
  });
  return (
    <span className="relative h-14 w-[0.62em] overflow-hidden">
      <motion.span style={{ y }} className="absolute inset-x-0 top-0 flex flex-col items-center">
        {Array.from({ length: 11 }).map((_, n) => (
          <span key={n} className="grid h-14 place-items-center">{n % 10}</span>
        ))}
      </motion.span>
    </span>
  );
}

/**
 * A rolling odometer. Each digit is its own reel that spins to its place, so the number rolls up
 * when it enters view and re-rolls whenever the value changes. Use the buttons or set `value`.
 */
export function NumberTicker({
  value = 12840,
  prefix = "",
  suffix = "",
  interactive = true,
  className,
}: {
  value?: number;
  prefix?: string;
  suffix?: string;
  interactive?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [delta, setDelta] = useState(0);
  const target = Math.max(0, value + delta);
  const spring = useSpring(0, { stiffness: 55, damping: 18 });

  useEffect(() => { if (inView) spring.set(target); }, [inView, target, spring]);

  const digits = String(Math.max(0, Math.round(target))).length;
  const places = Array.from({ length: digits }, (_, i) => 10 ** (digits - 1 - i));

  return (
    <div ref={ref} className={cn("flex flex-col items-center gap-6", className)}>
      <div aria-label={`${prefix}${target.toLocaleString()}${suffix}`} className="flex items-center text-5xl font-semibold tabular-nums tracking-tight">
        {prefix && <span className="mr-1 text-muted-foreground">{prefix}</span>}
        {places.map((p, i) => {
          const fromRight = digits - 1 - i;
          return (
            <span key={p} className="flex items-center">
              <Digit place={p} value={spring} />
              {fromRight > 0 && fromRight % 3 === 0 && <span className="px-0.5 text-muted-foreground">,</span>}
            </span>
          );
        })}
        {suffix && <span className="ml-1 text-muted-foreground">{suffix}</span>}
      </div>
      {interactive && (
        <div className="flex gap-2">
          {[["−1,000", -1000], ["+2,500", 2500], ["+10,000", 10000]].map(([label, d]) => (
            <button key={label as string} onClick={() => setDelta((x) => x + (d as number))} className="rounded-lg border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted active:scale-95">
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
