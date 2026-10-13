"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function LeapfrogLoader({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("inline-flex items-center gap-2 text-primary", className)}
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-3 rounded-full bg-current"
          animate={{ y: [0, -14, 0], opacity: [1, 0.45, 1] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
