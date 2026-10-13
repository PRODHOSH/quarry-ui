"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function OrbitLoader({ className }: { className?: string }) {
  return (
    <div role="status" aria-label="Loading" className={cn("relative grid size-16 place-items-center text-foreground", className)}>
      <span className="absolute size-5 rounded-full bg-current opacity-25" />
      <span className="absolute size-16 rounded-full border border-current opacity-15" />
      <motion.span
        className="absolute size-16"
        animate={{ rotate: 360 }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 rounded-full bg-primary" />
      </motion.span>
    </div>
  );
}
