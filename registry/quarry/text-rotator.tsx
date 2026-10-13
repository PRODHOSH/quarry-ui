"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A headline with one rotating word. Each word enters letter by letter with a soft blur and
 * leaves upward, and the slot resizes smoothly so the sentence never jumps.
 */
export function TextRotator({
  before = "Build something",
  words = ["beautiful", "useful", "fast", "yours"],
  after = "in minutes.",
  interval = 2400,
  className,
}: {
  before?: string;
  words?: string[];
  after?: string;
  interval?: number;
  className?: string;
}) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval]);

  return (
    <h2 className={cn("flex flex-wrap items-baseline justify-center gap-x-3 text-center text-4xl font-semibold tracking-tight sm:text-6xl", className)}>
      <span>{before}</span>
      <motion.span layout transition={{ type: "spring", stiffness: 300, damping: 30 }} className="relative inline-flex overflow-hidden pb-2 text-primary">
        <span className="sr-only">{words[i]}</span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={words[i]} aria-hidden className="inline-flex" exit={{ y: "-60%", opacity: 0, filter: "blur(6px)", transition: { duration: 0.28 } }}>
            {words[i].split("").map((ch, n) => (
              <motion.span
                key={n}
                initial={{ y: "70%", opacity: 0, filter: "blur(6px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{ delay: n * 0.03, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block"
              >
                {ch}
              </motion.span>
            ))}
          </motion.span>
        </AnimatePresence>
      </motion.span>
      <span>{after}</span>
    </h2>
  );
}
