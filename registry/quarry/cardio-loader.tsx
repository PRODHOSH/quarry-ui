"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const PATH = "M 0,25 L 20,25 L 30,6 L 45,44 L 60,14 L 70,25 L 100,25";

export function CardioLoader({ className }: { className?: string }) {
  return (
    <svg
      role="status"
      aria-label="Loading"
      viewBox="0 0 100 50"
      className={cn("h-10 w-20 overflow-visible text-chart-5", className)}
    >
      <path d={PATH} fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      <motion.path
        d={PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 1 }}
        animate={{ pathLength: [0, 1, 1], opacity: [1, 1, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}
