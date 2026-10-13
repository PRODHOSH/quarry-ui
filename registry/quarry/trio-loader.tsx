"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function TrioLoader({ className }: { className?: string }) {
  return (
    <div role="status" aria-label="Loading" className={cn("relative size-12 text-foreground", className)}>
      <motion.span
        className="absolute left-1/2 top-0 size-3.5 -translate-x-1/2 rounded-full bg-current"
        animate={{ y: [0, 14, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="absolute bottom-0 left-0 size-3.5 rounded-full bg-current"
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      />
      <motion.span
        className="absolute bottom-0 right-0 size-3.5 rounded-full bg-current"
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      />
    </div>
  );
}
