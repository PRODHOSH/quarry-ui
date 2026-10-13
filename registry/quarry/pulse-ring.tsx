"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function PulseRing({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("relative grid size-14 place-items-center text-primary", className)}
    >
      {[0, 0.6].map((delay) => (
        <motion.span
          key={delay}
          className="absolute inset-0 rounded-full border-2 border-current"
          animate={{ scale: [0.5, 1.4], opacity: [0.8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay }}
        />
      ))}
      <span className="size-3 rounded-full bg-current" />
    </div>
  );
}
