"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A first visit intro. A counter runs from 0 to 100 beside a thin progress line, then the whole
 * curtain lifts away to reveal the page. It only plays when `show` is true, so you decide how often
 * (for example once per session). `contained` keeps it inside a relatively positioned parent.
 */
export function PagePreloader({
  show,
  onDone,
  logo = <span className="text-3xl font-semibold tracking-tight">Northwind</span>,
  duration = 1.8,
  contained = false,
  className,
}: {
  show: boolean;
  onDone?: () => void;
  logo?: ReactNode;
  duration?: number;
  contained?: boolean;
  className?: string;
}) {
  const [leaving, setLeaving] = useState(false);
  const n = useMotionValue(0);
  const label = useTransform(n, (v) => String(Math.round(v)).padStart(3, "0"));
  const bar = useTransform(n, (v) => v / 100);

  useEffect(() => {
    if (!show) return;
    n.set(0);
    const c = animate(n, 100, { duration, ease: [0.65, 0, 0.35, 1], onComplete: () => { setLeaving(true); } });
    return () => c.stop();
  }, [show, duration, n]);

  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(() => { setLeaving(false); onDone?.(); }, 900);
    return () => clearTimeout(t);
  }, [leaving, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: leaving ? "-100%" : 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className={cn(contained ? "absolute" : "fixed", "inset-0 z-[90] flex flex-col items-center justify-center bg-foreground text-background", className)}
        >
          <motion.div animate={{ opacity: leaving ? 0 : 1, y: leaving ? -12 : 0 }} transition={{ duration: 0.4 }} className="flex flex-col items-center">
            {logo}
            <div className="mt-8 h-px w-56 overflow-hidden bg-background/20">
              <motion.div style={{ scaleX: bar }} className="h-full origin-left bg-background" />
            </div>
            <motion.p className="mt-3 text-sm tabular-nums tracking-[0.3em] opacity-70">{label}</motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
