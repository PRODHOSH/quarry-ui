"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function TailspinLoader({ className }: { className?: string }) {
  const id = useId();
  return (
    <motion.svg
      role="status"
      aria-label="Loading"
      viewBox="0 0 50 50"
      className={cn("size-12 text-foreground", className)}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity={1} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d="M 25,5 A 20,20 0 1,1 5,25" fill="none" stroke={`url(#${id})`} strokeWidth={4} strokeLinecap="round" />
    </motion.svg>
  );
}
