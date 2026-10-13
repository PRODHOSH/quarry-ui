"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function DotSpinner({ className }: { className?: string }) {
  return (
    <div role="status" aria-label="Loading" className={cn("relative size-12 text-foreground", className)}>
      {Array.from({ length: 8 }).map((_, i) => (
        <span key={i} className="absolute inset-0" style={{ transform: `rotate(${i * 45}deg)` }}>
          <motion.span
            className="mx-auto block size-2 rounded-full bg-current"
            animate={{ opacity: [1, 0.15] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear", delay: -(7 - i) / 8 }}
          />
        </span>
      ))}
    </div>
  );
}
