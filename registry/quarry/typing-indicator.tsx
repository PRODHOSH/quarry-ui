"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function TypingIndicator({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Typing"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-muted px-4 py-3 text-muted-foreground",
        className
      )}
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-2 rounded-full bg-current"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.18 }}
        />
      ))}
    </div>
  );
}
