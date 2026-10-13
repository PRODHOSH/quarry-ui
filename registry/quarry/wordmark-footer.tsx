"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A quiet footer that ends on an oversized wordmark. A soft spotlight follows the pointer across
 * the letters, so the brand name lights up under the cursor.
 */
export function WordmarkFooter({
  word = "northwind",
  links = ["Product", "Pricing", "Docs", "Journal", "Contact"],
  className,
}: {
  word?: string;
  links?: string[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-300);
  const y = useMotionValue(-300);
  const sx = useSpring(x, { stiffness: 220, damping: 28 });
  const sy = useSpring(y, { stiffness: 220, damping: 28 });
  const mask = useMotionTemplate`radial-gradient(220px circle at ${sx}px ${sy}px, black, transparent 70%)`;

  return (
    <footer className={cn("w-full overflow-hidden border-t bg-background text-foreground", className)}>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6">
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {links.map((l) => (
            <a key={l} href="#" className="transition-colors hover:text-foreground">{l}</a>
          ))}
        </nav>
        <p className="text-xs text-muted-foreground">Made with care, somewhere warm.</p>
      </div>

      <div
        ref={ref}
        onPointerMove={(e) => {
          const r = ref.current!.getBoundingClientRect();
          x.set(e.clientX - r.left);
          y.set(e.clientY - r.top);
        }}
        onPointerLeave={() => {
          x.set(-300);
          y.set(-300);
        }}
        className="relative select-none px-4 pb-2 pt-4"
      >
        <p aria-hidden className="text-center text-[clamp(4rem,19vw,15rem)] font-semibold lowercase leading-[0.82] tracking-tighter text-foreground/[0.08]">
          {word}
        </p>
        <motion.p
          aria-hidden
          style={{ WebkitMaskImage: mask, maskImage: mask }}
          className="pointer-events-none absolute inset-x-4 top-4 bg-gradient-to-b from-primary to-foreground bg-clip-text text-center text-[clamp(4rem,19vw,15rem)] font-semibold lowercase leading-[0.82] tracking-tighter text-transparent"
        >
          {word}
        </motion.p>
        <span className="sr-only">{word}</span>
      </div>
    </footer>
  );
}
