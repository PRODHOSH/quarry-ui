"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const PATH =
  "M 25,25 C 25,10 45,10 50,25 C 55,40 75,40 75,25 C 75,10 55,10 50,25 C 45,40 25,40 25,25 Z";

export function InfinitySpinner({ className }: { className?: string }) {
  return (
    <svg
      role="status"
      aria-label="Loading"
      viewBox="0 0 100 50"
      className={cn("h-10 w-20 overflow-visible text-primary", className)}
    >
      <path d={PATH} fill="none" stroke="currentColor" strokeOpacity={0.18} strokeWidth={6} strokeLinecap="round" />
      <motion.path
        d={PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth={6}
        strokeLinecap="round"
        style={{ pathLength: 0.22 }}
        animate={{ pathOffset: [0, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  );
}
