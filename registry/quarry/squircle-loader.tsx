"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const PATH =
  "M 50,5 C 80,5 95,20 95,50 C 95,80 80,95 50,95 C 20,95 5,80 5,50 C 5,20 20,5 50,5 Z";

export function SquircleLoader({ className }: { className?: string }) {
  return (
    <svg role="status" aria-label="Loading" viewBox="0 0 100 100" className={cn("size-12 text-primary", className)}>
      <path d={PATH} fill="none" stroke="currentColor" strokeOpacity={0.18} strokeWidth={8} />
      <motion.path
        d={PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth={8}
        strokeLinecap="round"
        style={{ pathLength: 0.25 }}
        animate={{ pathOffset: [0, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  );
}
