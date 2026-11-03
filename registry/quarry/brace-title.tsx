"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

const PATH = "M17 2C9 2 8 8 8 18L8 38C8 46 5 50 2 50C5 50 8 54 8 62L8 82C8 92 9 98 17 98";

function Brace({ flip }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 20 100"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
      className={cn("inline-block h-[1.05em] w-[0.34em] shrink-0 align-middle text-primary", flip && "-scale-x-100")}
    >
      <path d={PATH} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/**
 * A heading wrapped in curly braces that types itself out with a blinking caret once it scrolls
 * into view. The braces are drawn as SVG strokes, so they stay crisp at any size and never move
 * while the text types. Screen readers get the full title straight away.
 */
export function BraceTitle({
  text = "Our services",
  speed = 60,
  as: Tag = "h2",
  className,
}: {
  text?: string;
  /** Milliseconds per character. */
  speed?: number;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const [count, setCount] = useState(0);
  const shown = Math.min(count, text.length);

  useEffect(() => {
    if (!seen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const r = requestAnimationFrame(() => setCount(text.length));
      return () => cancelAnimationFrame(r);
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
  }, [seen, text, speed]);

  return (
    <Tag ref={ref} className={cn("inline-flex max-w-full items-center justify-center gap-[0.18em] text-center text-[clamp(2rem,1.1rem+3.8vw,4.4rem)] font-medium leading-[1.05] tracking-[-0.03em] text-foreground", className)}>
      <span className="sr-only">{text}</span>
      <Brace />
      <span aria-hidden className="relative text-balance">
        <span className="invisible">{text}</span>
        <span className="absolute inset-0 text-left">
          {text.slice(0, shown)}
          {shown < text.length ? <i className="ml-[0.06em] inline-block h-[0.8em] w-[0.06em] translate-y-[0.06em] animate-[brace-blink_0.7s_steps(1)_infinite] bg-primary align-baseline" /> : null}
        </span>
      </span>
      <Brace flip />
      <style>{`@keyframes brace-blink{50%{opacity:0}}`}</style>
    </Tag>
  );
}
