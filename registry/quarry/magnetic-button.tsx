"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A button that is pulled toward the pointer as it gets close, with its label moving a little further
 * than the shell so the two feel separate. It snaps back when the pointer leaves.
 */
export function MagneticButton({
  children = "Start a project",
  href,
  onClick,
  strength = 0.35,
  className,
}: {
  children?: ReactNode;
  href?: string;
  onClick?: () => void;
  /** How far it follows, as a fraction of the pointer distance. */
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 });
  const tx = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 });
  const ty = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 });

  const move = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
    tx.set(dx * strength * 0.6);
    ty.set(dy * strength * 0.6);
  };
  const leave = () => [x, y, tx, ty].forEach((v) => v.set(0));

  const Tag = href ? "a" : "button";
  return (
    // The wrapper is larger than the button so the pull begins before the pointer touches it.
    <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={cn("inline-grid p-8", className)}>
      <motion.div style={{ x, y }}>
        <Tag
          {...(href ? { href } : { type: "button" as const })}
          onClick={onClick}
          className="group relative inline-flex h-14 items-center gap-3 overflow-hidden rounded-full bg-primary pl-7 pr-2 text-[15px] font-medium text-primary-foreground outline-none focus-visible:ring-4 focus-visible:ring-ring/30"
        >
          <span aria-hidden className="absolute inset-0 -translate-x-full rounded-full bg-foreground/15 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0" />
          <motion.span style={{ x: tx, y: ty }} className="relative">{children}</motion.span>
          <span className="relative grid size-10 place-items-center rounded-full bg-background/20 transition-transform duration-500 group-hover:rotate-45">
            <ArrowUpRight className="size-4" />
          </span>
        </Tag>
      </motion.div>
    </div>
  );
}
