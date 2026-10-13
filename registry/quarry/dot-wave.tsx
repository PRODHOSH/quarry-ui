"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function DotWave({ className }: { className?: string }) {
  return (
    <div role="status" aria-label="Loading" className={cn("flex h-10 items-center gap-1.5 text-chart-2", className)}>
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          className="size-3 rounded-full bg-current"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
        />
      ))}
    </div>
  );
}
