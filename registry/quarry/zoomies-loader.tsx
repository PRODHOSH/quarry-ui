"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ZoomiesLoader({ className }: { className?: string }) {
  return (
    <div
      role="progressbar"
      aria-label="Loading"
      className={cn("relative h-1 w-32 overflow-hidden rounded-full bg-primary/15", className)}
    >
      <motion.span
        className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-primary"
        animate={{ x: ["-100%", "300%"] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
