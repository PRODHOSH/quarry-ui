"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function NewtonsCradle({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("inline-flex items-start pt-7 text-foreground", className)}
    >
      <motion.span
        className="size-4 origin-[50%_-28px] rounded-full bg-current"
        animate={{ rotate: [0, 40, 0, 0, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
      {[0, 1, 2].map((i) => (
        <span key={i} className="size-4 rounded-full bg-current" />
      ))}
      <motion.span
        className="size-4 origin-[50%_-28px] rounded-full bg-current"
        animate={{ rotate: [0, 0, 0, -40, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
