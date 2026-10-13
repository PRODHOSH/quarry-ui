"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function RadarPing({ className }: { className?: string }) {
  return (
    <div role="status" aria-label="Loading" className={cn("relative grid size-16 place-items-center text-primary", className)}>
      <span className="z-10 size-2.5 rounded-full bg-current" />
      {[0, 0.6, 1.2].map((delay) => (
        <motion.span
          key={delay}
          className="absolute inset-0 rounded-full border border-current"
          animate={{ scale: [0.1, 1], opacity: [0.7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay }}
        />
      ))}
    </div>
  );
}
