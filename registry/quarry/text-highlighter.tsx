"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Style = "marker" | "underline" | "circle";

function Mark({ children, style, delay }: { children: string; style: Style; delay: number }) {
  return (
    <span className="relative isolate inline-block whitespace-nowrap">
      {style === "marker" && (
        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-[-0.15em] bottom-[0.05em] top-[0.2em] -z-10 origin-left -skew-x-6 rounded-sm bg-primary/30"
        />
      )}
      {style === "underline" && (
        <svg aria-hidden viewBox="0 0 100 8" preserveAspectRatio="none" className="absolute -bottom-1.5 left-0 h-2 w-full overflow-visible text-primary">
          <motion.path d="M1 5 C 20 1, 40 8, 60 4 S 90 3, 99 5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ delay, duration: 0.7, ease: "easeOut" }} />
        </svg>
      )}
      {style === "circle" && (
        <svg aria-hidden viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute -inset-x-3 -inset-y-1.5 h-[calc(100%+0.75rem)] w-[calc(100%+1.5rem)] overflow-visible text-primary">
          <motion.path d="M92 8 C 70 -2, 12 0, 6 20 C 2 38, 60 42, 90 30 C 100 24, 98 12, 82 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ delay, duration: 0.9, ease: "easeInOut" }} />
        </svg>
      )}
      <span className="relative">{children}</span>
    </span>
  );
}

/**
 * Paragraph copy with hand drawn emphasis. Marker highlights sweep in, underlines draw
 * themselves, and circles loop around a word, each starting when it scrolls into view.
 */
export function TextHighlighter({ className }: { className?: string }) {
  return (
    <p className={cn("mx-auto max-w-xl text-balance text-center text-2xl font-medium leading-[1.7] tracking-tight sm:text-3xl", className)}>
      Design is not decoration. It is the{" "}
      <Mark style="marker" delay={0.1}>quiet logic</Mark>{" "}
      that makes software feel{" "}
      <Mark style="underline" delay={0.5}>effortless</Mark>{" "}
      and the small details people{" "}
      <Mark style="circle" delay={0.9}>remember</Mark>{" "}
      long after they close the tab.
    </p>
  );
}
