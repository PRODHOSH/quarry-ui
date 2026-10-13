"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function MorphingShapes({ className }: { className?: string }) {
  return (
    <div role="status" aria-label="Loading" className={cn("grid size-12 place-items-center text-primary", className)}>
      <motion.span
        className="size-8 bg-current"
        animate={{
          borderRadius: ["50%", "22%", "50%", "10%", "50%"],
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.15, 1, 0.85, 1],
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
