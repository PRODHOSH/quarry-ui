"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function MomentumLoader({ className }: { className?: string }) {
  return (
    <motion.div
      role="status"
      aria-label="Loading"
      className={cn("relative size-12 text-foreground", className)}
      animate={{ rotate: 360 }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
    >
      <span className="absolute left-1/2 top-0 size-3.5 -translate-x-1/2 rounded-full bg-current" />
      <span className="absolute bottom-0 left-1/2 size-3.5 -translate-x-1/2 rounded-full bg-current opacity-40" />
    </motion.div>
  );
}
