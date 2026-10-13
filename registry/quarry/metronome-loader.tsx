"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function MetronomeLoader({ className }: { className?: string }) {
  return (
    <div role="status" aria-label="Loading" className={cn("flex h-16 w-16 justify-center text-foreground", className)}>
      <motion.span
        className="relative block h-12 w-0.5 origin-top rounded-full bg-current opacity-80"
        animate={{ rotate: [-40, 40, -40] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="absolute -bottom-2 left-1/2 size-4 -translate-x-1/2 rounded-full bg-primary" />
      </motion.span>
    </div>
  );
}
