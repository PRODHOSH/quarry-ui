"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Plan = { name: string; blurb: string; monthly: number; features: string[]; featured?: boolean };

const PLANS: Plan[] = [
  { name: "Starter", blurb: "For side projects and early ideas.", monthly: 0, features: ["3 projects", "Community support", "Basic analytics"] },
  { name: "Pro", blurb: "For teams shipping every week.", monthly: 24, featured: true, features: ["Unlimited projects", "Priority support", "Advanced analytics", "Custom domains"] },
  { name: "Scale", blurb: "For organisations with real needs.", monthly: 79, features: ["Everything in Pro", "SSO and audit logs", "99.9% uptime SLA", "Dedicated manager"] },
];

function Price({ value }: { value: number }) {
  return (
    <span className="relative inline-flex h-12 items-baseline overflow-hidden text-4xl font-semibold tabular-nums tracking-tight">
      <span className="mr-0.5 text-xl text-muted-foreground">$</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={value} initial={{ y: "70%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-70%", opacity: 0 }} transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}>
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/**
 * Three pricing plans with a billing toggle. Prices roll when you switch between monthly and
 * yearly, and the featured plan lifts with a soft glow.
 */
export function PricingCards({ plans = PLANS, discount = 0.2, className }: { plans?: Plan[]; discount?: number; className?: string }) {
  const [yearly, setYearly] = useState(true);

  return (
    <section className={cn("mx-auto w-full max-w-4xl px-6 py-8", className)}>
      <div className="flex justify-center">
        <div role="tablist" className="relative flex rounded-full border bg-card p-1">
          {[false, true].map((y) => (
            <button
              key={String(y)}
              role="tab"
              aria-selected={yearly === y}
              onClick={() => setYearly(y)}
              className={cn("relative z-10 rounded-full px-4 py-1.5 text-sm font-medium transition-colors", yearly === y ? "text-primary-foreground" : "text-muted-foreground")}
            >
              {yearly === y && <motion.span layoutId="bill-pill" className="absolute inset-0 -z-10 rounded-full bg-primary" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              {y ? "Yearly" : "Monthly"}
              {y && <span className="ml-1.5 text-[11px] opacity-80">−{Math.round(discount * 100)}%</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {plans.map((p) => {
          const price = Math.round(p.monthly * (yearly ? 1 - discount : 1));
          return (
            <motion.div
              key={p.name}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card p-6",
                p.featured && "border-primary/60 shadow-[0_0_0_1px_var(--primary),0_24px_60px_-24px_color-mix(in_oklab,var(--primary)_55%,transparent)]"
              )}
            >
              {p.featured && <span className="absolute -top-3 left-6 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-medium text-primary-foreground">Most popular</span>}
              <h3 className="text-sm font-medium text-muted-foreground">{p.name}</h3>
              <div className="mt-2 flex items-baseline gap-1.5">
                <Price value={price} />
                <span className="text-sm text-muted-foreground">/ month</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <span className="grid size-4 place-items-center rounded-full bg-primary/15 text-primary"><Check className="size-2.5" strokeWidth={3} /></span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={cn(
                  "mt-7 h-10 rounded-xl text-sm font-medium transition-transform active:scale-[0.98]",
                  p.featured ? "bg-primary text-primary-foreground" : "border bg-background hover:bg-muted"
                )}
              >
                {p.monthly === 0 ? "Start free" : "Choose " + p.name}
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
