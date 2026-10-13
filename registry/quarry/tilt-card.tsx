"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A card that leans toward the pointer in 3D, with a soft glare that follows it. The content sits a
 * little above the surface, so it shifts against the card and feels layered. Pass your own children
 * or use it as is.
 */
export function TiltCard({
  eyebrow = "Featured",
  title = "Layered depth, with no images",
  description = "Move over the card. The surface leans, the light follows and the text floats above it.",
  max = 10,
  children,
  className,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Maximum tilt in degrees. */
  max?: number;
  children?: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateY = useSpring(useTransform(x, [0, 1], [-max, max]), { stiffness: 200, damping: 20 });
  const rotateX = useSpring(useTransform(y, [0, 1], [max, -max]), { stiffness: 200, damping: 20 });
  const gx = useTransform(x, (v) => `${v * 100}%`);
  const gy = useTransform(y, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${gx} ${gy}, color-mix(in oklab, var(--primary) 22%, transparent), transparent 65%)`;

  return (
    <div className={cn("[perspective:1000px]", className)}>
      <motion.div
        ref={ref}
        onPointerMove={(e) => {
          const r = ref.current!.getBoundingClientRect();
          x.set((e.clientX - r.left) / r.width);
          y.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          x.set(0.5);
          y.set(0.5);
        }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative w-[min(22rem,86vw)] overflow-hidden rounded-[2rem] border bg-card p-7 shadow-2xl"
      >
        <motion.div aria-hidden style={{ background: glare }} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative [transform:translateZ(40px)]">
          {children ?? (
            <>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">{eyebrow}</p>
              <h3 className="mt-4 text-balance text-3xl font-medium leading-tight tracking-tight">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
              <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform duration-300 group-hover:translate-x-1">
                Explore <ArrowUpRight className="size-4" />
              </span>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
