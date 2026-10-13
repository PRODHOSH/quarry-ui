"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const WORDS = ["Innovation", "Performance", "Scalability", "Design", "Security", "Accessibility", "Speed"];

export function TextMarquee({
  words = WORDS,
  duration = 40,
  className,
}: {
  words?: string[];
  duration?: number;
  className?: string;
}) {
  const group = (suffix: string) =>
    words.map((word) => (
      <span key={`${suffix}-${word}`} className="flex items-center gap-8">
        <span className="text-xl font-medium tracking-tight text-foreground/80">{word}</span>
        <Sparkles className="size-4 text-primary" />
      </span>
    ));

  return (
    <div
      className={cn(
        "w-full overflow-hidden border-y bg-background py-5 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className
      )}
    >
      <motion.div
        className="flex w-max items-center gap-8"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {group("a")}
        {group("b")}
        {group("c")}
        {group("d")}
      </motion.div>
    </div>
  );
}
