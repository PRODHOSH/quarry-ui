"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function HelixLoader({ className }: { className?: string }) {
  return (
    <div role="status" aria-label="Loading" className={cn("relative grid size-12 place-items-center text-foreground", className)}>
      <motion.span
        className="absolute size-3.5 rounded-full bg-primary"
        animate={{ y: [-16, 16, -16], scale: [1, 0.6, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="absolute size-3.5 rounded-full bg-current"
        animate={{ y: [16, -16, 16], scale: [0.6, 1, 0.6] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
