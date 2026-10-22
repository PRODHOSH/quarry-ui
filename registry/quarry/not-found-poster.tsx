"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

const WOBBLE = [-4, 3, -2, 4, -3, 2, -4, 3, -2];

/**
 * A loud, friendly 404 poster. A giant ghost word fills the background, and a tilted card with
 * chunky stacked lettering sits on top. Both lean toward the pointer, and each letter on the card
 * wobbles when you touch it. The background is your `primary` colour.
 */
export function NotFoundPoster({
  ghost = "WHOA!",
  lines = ["WRONG", "TURN"],
  hint = "Nothing lives at this address.",
  cta = "Take me home",
  href = "/",
  className,
}: {
  ghost?: string;
  lines?: string[];
  hint?: string;
  cta?: string;
  href?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 18 });
  const sy = useSpring(py, { stiffness: 90, damping: 18 });
  const cardRotate = useTransform(sx, [-1, 1], [-5, -1]);
  const cardY = useTransform(sy, [-1, 1], [-8, 8]);
  const ghostX = useTransform(sx, [-1, 1], [24, -24]);
  const ghostY = useTransform(sy, [-1, 1], [14, -14]);

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width) * 2 - 1);
        py.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      className={cn("relative isolate flex min-h-[32rem] w-full items-center justify-center overflow-hidden bg-primary px-6 py-16 text-primary-foreground", className)}
    >
      <motion.span
        aria-hidden
        style={{ x: ghostX, y: ghostY }}
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 select-none text-center text-[clamp(7rem,30vw,26rem)] font-black leading-none tracking-tighter text-black/[0.1]"
      >
        {ghost}
      </motion.span>

      <motion.div
        initial={{ opacity: 0, y: 60, rotate: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        style={{ rotate: cardRotate, y: cardY }}
        className="relative w-full max-w-xl rounded-[2rem] bg-background px-8 pb-10 pt-14 text-center text-foreground shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)] sm:px-14"
      >
        <motion.svg aria-hidden viewBox="0 0 60 60" className="absolute right-[26%] top-5 w-10 text-primary" initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.5, type: "spring" }}>
          <path d="M30 4 L36 22 L56 18 L42 32 L52 52 L32 42 L14 56 L18 34 L4 22 L24 22 Z" fill="currentColor" />
        </motion.svg>
        <motion.svg aria-hidden viewBox="0 0 40 40" className="absolute bottom-24 left-[9%] w-9 text-primary" animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }}>
          <path d="M20 2 L24 14 L38 12 L28 22 L36 34 L22 28 L12 38 L14 24 L2 18 L16 16 Z" fill="currentColor" />
        </motion.svg>

        <h1 className="relative text-[clamp(3rem,11vw,6rem)] font-black uppercase leading-[0.86] tracking-tighter">
          {lines.map((word, li) => (
            <span key={li} className={cn("block", li % 2 === 1 && "sm:translate-x-8")}>
              {word.split("").map((ch, i) => (
                <motion.span
                  key={i}
                  whileHover={{ y: -10, rotate: WOBBLE[(i + 3) % WOBBLE.length] * 3, scale: 1.12 }}
                  transition={{ type: "spring", stiffness: 500, damping: 14 }}
                  style={{ rotate: WOBBLE[(i + li * 4) % WOBBLE.length] }}
                  className="inline-block cursor-default"
                >
                  {ch}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>

        <p className="mt-6 text-sm text-muted-foreground">{hint}</p>
        <a href={href} className="mt-6 inline-flex h-12 items-center rounded-full bg-foreground px-8 text-sm font-semibold text-background transition-transform hover:scale-105 active:scale-95">
          {cta}
        </a>
      </motion.div>

      <span className="absolute bottom-5 left-6 text-sm font-medium">Status</span>
      <span className="absolute bottom-5 right-6 text-sm font-medium tabular-nums">404</span>
    </div>
  );
}
