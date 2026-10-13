"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function WaveformLoader({ className }: { className?: string }) {
  return (
    <div role="status" aria-label="Loading" className={cn("flex h-10 items-center gap-1 text-primary", className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={i}
          className="w-1.5 rounded-full bg-current"
          animate={{ height: [10, 34, 10] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }}
        />
      ))}
    </div>
  );
}
