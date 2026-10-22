"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A row of squares that light up one after another and fade out, like a progress wave. Quick and
 * quiet, good for inline and button loading states.
 */
export function FadeSquares({
  count = 6,
  size = 18,
  duration = 0.9,
  className,
}: {
  count?: number;
  size?: number;
  /** Seconds for the wave to pass through every square. */
  duration?: number;
  className?: string;
}) {
  return (
    <span role="status" aria-label="Loading" className={cn("inline-flex items-center text-foreground", className)} style={{ gap: size * 0.45 }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          className="rounded-[3px] bg-current"
          style={{ width: size, height: size }}
          animate={{ opacity: [1, 0.12, 1] }}
          transition={{ duration, repeat: Infinity, ease: "easeInOut", delay: (i / count) * duration * 0.8 }}
        />
      ))}
    </span>
  );
}
