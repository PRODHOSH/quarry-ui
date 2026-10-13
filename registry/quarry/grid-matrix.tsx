"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function GridMatrix({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("grid size-10 grid-cols-3 gap-1 text-foreground", className)}
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <motion.span
          key={i}
          className="rounded-[3px] bg-current"
          animate={{ opacity: [1, 0.15, 1] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: ((i % 3) + Math.floor(i / 3)) * 0.15,
          }}
        />
      ))}
    </div>
  );
}
