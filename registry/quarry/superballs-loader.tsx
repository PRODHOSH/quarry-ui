"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SuperballsLoader({ className }: { className?: string }) {
  return (
    <div role="status" aria-label="Loading" className={cn("relative h-5 w-14", className)}>
      <motion.span
        className="absolute left-0 top-0 size-5 rounded-full bg-primary"
        animate={{ x: [0, 34, 0], scaleX: [1, 1.25, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="absolute top-0 size-5 rounded-full bg-foreground/70"
        style={{ left: 34 }}
        animate={{ x: [0, -34, 0], scaleX: [1, 1.25, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
