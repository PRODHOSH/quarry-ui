"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Metric = { label: string; value: number; prefix?: string; suffix?: string; decimals?: number; change: number; data: number[] };

const METRICS: Metric[] = [
  { label: "Revenue", value: 48210, prefix: "$", change: 12.4, data: [12, 18, 15, 24, 22, 31, 29, 38, 42] },
  { label: "Active users", value: 8.4, suffix: "k", decimals: 1, change: 5.1, data: [20, 24, 23, 28, 27, 30, 34, 33, 37] },
  { label: "Churn", value: 1.8, suffix: "%", decimals: 1, change: -0.6, data: [30, 28, 29, 24, 25, 20, 21, 17, 16] },
];

function Counter({ to, prefix = "", suffix = "", decimals = 0 }: { to: number; prefix?: string; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const v = useMotionValue(0);
  const text = useTransform(v, (n) => prefix + n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix);
  useEffect(() => {
    if (!inView) return;
    const c = animate(v, to, { duration: 1.4, ease: [0.22, 1, 0.36, 1] });
    return () => c.stop();
  }, [inView, to, v]);
  return <motion.span ref={ref}>{text}</motion.span>;
}

function Spark({ data }: { data: number[] }) {
  const w = 120, h = 40;
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((d, i) => [(i / (data.length - 1)) * w, h - 4 - ((d - min) / (max - min || 1)) * (h - 8)] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const id = `g${data.join("")}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={cn("h-10 w-full", "text-primary")} preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path d={`${line} L${w},${h} L0,${h} Z`} fill={`url(#${id})`} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.8 }} />
      <motion.path d={line} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut" }} />
    </svg>
  );
}

/**
 * Dashboard stat cards. Numbers count up when scrolled into view, the sparkline draws itself in,
 * and the trend badge colours itself by whether the change is good news.
 */
export function MetricCards({ metrics = METRICS, className }: { metrics?: Metric[]; className?: string }) {
  return (
    <div className={cn("mx-auto grid w-full max-w-4xl gap-4 sm:grid-cols-3", className)}>
      {metrics.map((m, i) => {
        const up = m.change >= 0;
        const good = m.label === "Churn" ? !up : up;
        return (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.45 }}
            className="rounded-2xl border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{m.label}</p>
              <span className={cn("flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium", good ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground")}>
                {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                {Math.abs(m.change)}%
              </span>
            </div>
            <p className="mt-3 text-3xl font-semibold tabular-nums tracking-tight">
              <Counter to={m.value} prefix={m.prefix} suffix={m.suffix} decimals={m.decimals} />
            </p>
            <div className="mt-4"><Spark data={m.data} /></div>
          </motion.div>
        );
      })}
    </div>
  );
}
