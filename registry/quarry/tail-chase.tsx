"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function TailChase({ className }: { className?: string }) {
  return (
    <div role="status" aria-label="Loading" className={cn("relative size-12 text-foreground", className)}>
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear", delay: i * -0.14 }}
        >
          <span
            className="absolute left-1/2 top-0 size-3 rounded-full bg-current"
            style={{ opacity: 1 - i * 0.22, transform: `translateX(-50%) scale(${1 - i * 0.15})` }}
          />
        </motion.span>
      ))}
    </div>
  );
}
