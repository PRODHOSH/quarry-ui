"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

const GLYPHS = "!<>-_\\/[]{}=+*^?#abcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Text that decodes itself: every letter flickers through random glyphs and settles from left to
 * right. It plays once when scrolled into view and again on hover. Reduced motion shows the text at once.
 */
export function TextScramble({
  text = "Decoded on arrival",
  duration = 1100,
  as: Tag = "span",
  className,
}: {
  text?: string;
  /** Milliseconds for the whole word to settle. */
  duration?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true });
  const [out, setOut] = useState(text);
  const raf = useRef(0);

  const play = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOut(text);
      return;
    }
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const settled = Math.floor(t * text.length);
      setOut(
        text
          .split("")
          .map((ch, i) => (ch === " " || i < settled ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join("")
      );
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf.current = requestAnimationFrame(tick);
  }, [text, duration]);

  useEffect(() => {
    // Start on the next frame, so the first state update is not made inside the effect itself.
    const id = inView ? requestAnimationFrame(() => play()) : 0;
    return () => {
      cancelAnimationFrame(id);
      cancelAnimationFrame(raf.current);
    };
  }, [inView, play]);

  return (
    <Tag ref={ref as never} onMouseEnter={play} aria-label={text} className={cn("inline-block font-mono text-3xl tabular-nums sm:text-5xl", className)}>
      <span aria-hidden>{out}</span>
    </Tag>
  );
}
