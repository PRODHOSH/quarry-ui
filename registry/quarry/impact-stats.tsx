"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const STATS = [
  { value: "80%", label: "Smaller media", sub: "Average size reduction per asset", bar: 80, color: "bg-chart-1" },
  { value: "3×", label: "Faster loads", sub: "Typical page load improvement", bar: 75, color: "bg-chart-2" },
  { value: "68%", label: "Less bandwidth", sub: "Fewer bytes sent to users", bar: 68, color: "bg-chart-3" },
  { value: "18g", label: "CO₂ saved", sub: "Carbon avoided per page load", bar: 60, color: "bg-chart-4" },
];

export function ImpactStats({ className }: { className?: string }) {
  return (
    <section className={cn("w-full px-6 py-10 sm:px-10", className)}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            The numbers speak for themselves
          </h2>
          <p className="mt-3 text-muted-foreground">Better performance. Lower cost. Smaller footprint.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="rounded-2xl border bg-card p-5"
            >
              <p className="text-4xl font-semibold tracking-tight text-card-foreground">{stat.value}</p>
              <p className="mt-2 text-sm font-medium text-card-foreground">{stat.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{stat.sub}</p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className={cn("h-full rounded-full", stat.color)}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${stat.bar}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.2 + i * 0.08, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
