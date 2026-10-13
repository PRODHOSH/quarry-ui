"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";

function Count({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const v = useMotionValue(0);
  const text = useTransform(v, (n) => `${Math.round(n)}${suffix}`);
  useEffect(() => {
    if (!inView) return;
    const c = animate(v, to, { duration: 1.6, ease: [0.32, 0.72, 0, 1] });
    return () => c.stop();
  }, [inView, to, v]);
  return <motion.span ref={ref}>{text}</motion.span>;
}

export function StatsBand({ stats }: { stats: { n: number; suffix?: string; label: string; note: string }[] }) {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <dl className="grid divide-y rounded-2xl border bg-card/30 md:grid-cols-3 md:divide-x md:divide-y-0">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.32, 0.72, 0, 1] }}
            className="px-8 py-9"
          >
            <dt className="text-6xl font-normal tracking-[-0.04em] sm:text-7xl">
              <Count to={s.n} suffix={s.suffix} />
            </dt>
            <dd className="mt-3 text-base">{s.label}</dd>
            <dd className="mt-1 text-sm text-muted-foreground">{s.note}</dd>
          </motion.div>
        ))}
      </dl>
    </div>
  );
}
