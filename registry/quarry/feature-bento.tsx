"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { BarChart3, Layers, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type Feature = {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
  tint: string;
};

const FEATURES: Feature[] = [
  {
    icon: <Zap className="size-5" />,
    title: "Ready in minutes",
    description:
      "Drop a component into your project and ship. No configuration, no setup, no waiting on a design handoff.",
    className: "md:col-span-2",
    tint: "bg-chart-1/10 text-chart-1",
  },
  {
    icon: <ShieldCheck className="size-5" />,
    title: "Accessible by default",
    description: "Keyboard friendly, screen reader aware and contrast checked.",
    tint: "bg-chart-2/10 text-chart-2",
  },
  {
    icon: <Layers className="size-5" />,
    title: "Composable",
    description: "Small, focused pieces that combine into pages instead of fighting you.",
    tint: "bg-chart-3/10 text-chart-3",
  },
  {
    icon: <BarChart3 className="size-5" />,
    title: "Built to scale",
    description:
      "Tokens drive every color, radius and shadow, so one change updates the whole product.",
    className: "md:col-span-2",
    tint: "bg-chart-4/10 text-chart-4",
  },
];

export function FeatureBento({ className }: { className?: string }) {
  return (
    <section className={cn("w-full px-6 py-10 sm:px-10", className)}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 max-w-xl">
          <p className="text-sm font-medium text-primary">Why teams choose us</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Everything you need to build interfaces that last
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className={cn(
                "group rounded-2xl border bg-card p-5 transition-colors hover:border-foreground/20",
                feature.className
              )}
            >
              <div className={cn("mb-4 grid size-9 place-items-center rounded-xl", feature.tint)}>
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-card-foreground">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
