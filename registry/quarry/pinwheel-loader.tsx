"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function PinwheelLoader({ className }: { className?: string }) {
  return (
    <motion.div
      role="status"
      aria-label="Loading"
      className={cn("grid size-11 grid-cols-2 gap-1 text-primary", className)}
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <span className="rounded-tl-full bg-current" />
      <span className="rounded-tr-full bg-current opacity-70" />
      <span className="rounded-bl-full bg-current opacity-40" />
      <span className="rounded-br-full bg-current opacity-20" />
    </motion.div>
  );
}
