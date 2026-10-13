"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function LineSpinner({ className }: { className?: string }) {
  return (
    <div role="status" aria-label="Loading" className={cn("relative size-12 text-foreground", className)}>
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} className="absolute inset-0" style={{ transform: `rotate(${i * 30}deg)` }}>
          <motion.span
            className="mx-auto mt-0.5 block h-3 w-1 rounded-full bg-current"
            animate={{ opacity: [1, 0.15] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear", delay: -(11 - i) / 12 }}
          />
        </span>
      ))}
    </div>
  );
}
