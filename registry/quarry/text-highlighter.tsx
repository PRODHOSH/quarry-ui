"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type Style = "marker" | "underline" | "circle";

const draw = (delay: number, duration: number): Variants => ({
  hide: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { delay, duration, ease: "easeInOut" } },
});

/** One emphasised word. The mark draws itself once the word is mostly on screen. */
function Mark({ children, style, delay }: { children: string; style: Style; delay: number }) {
  return (
    <motion.span
      initial="hide"
      whileInView="show"
      viewport={{ once: true, amount: 0.9 }}
      className={cn("relative isolate mx-1 inline-block whitespace-nowrap", style === "marker" && "px-1.5", style === "circle" && "px-1")}
    >
      {style === "marker" && (
        <motion.span
          aria-hidden
          variants={{ hide: { scaleX: 0 }, show: { scaleX: 1, transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
          className="absolute inset-x-0 bottom-[0.08em] top-[0.18em] -z-10 origin-left -skew-x-6 rounded-[3px] bg-primary/30"
        />
      )}

      {style === "underline" && (
        <svg aria-hidden viewBox="0 0 100 10" preserveAspectRatio="none" className="absolute inset-x-0 -bottom-[0.28em] h-[0.3em] w-full overflow-visible text-primary">
          <motion.path d="M2 6 C 18 1.5, 34 9, 52 4.5 S 84 3, 98 6" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" variants={draw(delay, 0.7)} />
        </svg>
      )}

      {style === "circle" && (
        <svg
          aria-hidden
          viewBox="0 0 120 50"
          preserveAspectRatio="none"
          className="absolute -z-10 overflow-visible text-primary"
          style={{ left: "-0.35em", right: "-0.35em", top: "-0.2em", bottom: "-0.2em", width: "calc(100% + 0.7em)", height: "calc(100% + 0.4em)" }}
        >
          <motion.path d="M22 9 C 48 -1, 104 3, 113 22 C 121 40, 70 49, 34 45 C 6 41, -3 20, 26 8" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" variants={draw(delay, 0.9)} />
        </svg>
      )}

      <span className="relative">{children}</span>
    </motion.span>
  );
}

/**
 * Paragraph copy with hand drawn emphasis. A marker sweeps behind a phrase, a wavy underline draws
 * itself under a word, and a loose circle loops around another, each starting once it is on screen.
 */
export function TextHighlighter({ className }: { className?: string }) {
  return (
    <p className={cn("mx-auto max-w-xl text-balance text-center text-2xl font-medium leading-[1.9] tracking-tight sm:text-3xl", className)}>
      Design is not decoration. It is the
      <Mark style="marker" delay={0.1}>quiet logic</Mark>
      that makes software feel
      <Mark style="underline" delay={0.5}>effortless</Mark>
      and the small details people
      <Mark style="circle" delay={0.9}>remember</Mark>
      long after they close the tab.
    </p>
  );
}
