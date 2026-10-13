"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ShimmerText({
  children = "Loading",
  className,
}: {
  children?: string;
  className?: string;
}) {
  return (
    <span
      role="status"
      className={cn("relative inline-block text-2xl font-medium tracking-tight text-muted-foreground/50", className)}
    >
      {children}
      <motion.span
        aria-hidden
        className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap text-foreground"
        initial={{ width: "0%" }}
        animate={{ width: ["0%", "100%", "100%"] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        {children}
      </motion.span>
    </span>
  );
}
