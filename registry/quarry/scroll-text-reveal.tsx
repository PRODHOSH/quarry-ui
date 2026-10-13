"use client";

import { useRef, type RefObject } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

function Word({ word, range, progress }: { word: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [6, 0]);
  return (
    <span className="relative mr-[0.28em] inline-block">
      <motion.span style={{ opacity, y }} className="inline-block">
        {word}
      </motion.span>
    </span>
  );
}

/**
 * A paragraph that reads itself in as you scroll. Each word brightens in turn, so the eye is led
 * through the sentence at the pace of your scroll. Pass scrollContainer to track a scrollable element.
 */
export function ScrollTextReveal({
  text = "Good material is quiet. It does not shout for attention, it earns it, one clear word after another, until the whole idea is simply there.",
  scrollContainer,
  className,
}: {
  text?: string;
  scrollContainer?: RefObject<HTMLElement | null>;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, container: scrollContainer, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={cn("mx-auto max-w-3xl text-balance px-6 text-3xl font-medium leading-[1.25] tracking-tight sm:text-5xl", className)}>
      {words.map((w, i) => (
        <Word key={`${w}-${i}`} word={w} range={[i / words.length, (i + 1) / words.length]} progress={scrollYProgress} />
      ))}
    </p>
  );
}
