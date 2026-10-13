"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function HourglassLoader({ className }: { className?: string }) {
  return (
    <motion.svg
      role="status"
      aria-label="Loading"
      viewBox="0 0 24 24"
      className={cn("size-10 text-foreground", className)}
      animate={{ rotate: [0, 0, 180, 180] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.8, 1] }}
    >
      <path
        d="M6 2h12v5.5L13.5 12l4.5 4.5V22H6v-5.5L10.5 12 6 7.5V2z"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <path d="M9 19.5h6L12 15.5l-3 4z" fill="currentColor" />
    </motion.svg>
  );
}
