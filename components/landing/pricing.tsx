"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Currency = "USD" | "INR";

const PRICES: Record<Currency, { symbol: string; free: string; pro: string; note: string }> = {
  USD: { symbol: "$", free: "0", pro: "39", note: "Billed once in US dollars." },
  INR: { symbol: "₹", free: "0", pro: "3,499", note: "Priced for India. Billed once in rupees." },
};

const FREE = [
  "Every free component and loader",
  "One-command shadcn install",
  "A tuned prompt for every AI tool",
  "Themed by your own tokens",
  "Personal and commercial use",
];
const PRO = [
  "Everything in Free",
  "Advanced components: rich, animated, production grade",
  "Advanced templates: complete pages, ready to ship",
  "Full source for everything, no lock-in",
  "Lifetime updates, no subscription",
];

const EASE = [0.23, 1, 0.32, 1] as const;

function Price({ value, symbol, className }: { value: string; symbol: string; className?: string }) {
  return (
    <div className={cn("flex items-baseline gap-1", className)}>
      <span className="text-2xl font-normal opacity-60">{symbol}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={`${symbol}${value}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="text-6xl font-normal tracking-[-0.04em]"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function Plan({
  name,
  blurb,
  price,
  note,
  cta,
  features,
  badge,
  highlight = false,
}: {
  name: string;
  blurb: string;
  price: React.ReactNode;
  note: string;
  cta: React.ReactNode;
  features: string[];
  badge?: string;
  highlight?: boolean;
}) {
  return (
    <div className={cn("flex flex-col rounded-3xl border bg-card/40 p-2", highlight && "border-brand bg-brand text-white")}>
      <div className={cn("rounded-2xl p-6 sm:p-7", highlight ? "bg-white/15" : "bg-muted/40")}>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-medium">{name}</h3>
          {badge && <span className="font-label rounded-md bg-white/20 px-2.5 py-1 text-[11px] uppercase text-white">{badge}</span>}
        </div>
        <p className={cn("mt-1 text-sm", highlight ? "text-white/75" : "text-muted-foreground")}>{blurb}</p>
        <div className="mt-7 min-h-24">
          {price}
          <p className={cn("mt-2 text-sm", highlight ? "text-white/75" : "text-muted-foreground")}>{note}</p>
        </div>
        <div className="mt-5">{cta}</div>
      </div>
      <div className="px-6 pb-6 pt-6 sm:px-7">
        <p className="text-sm font-medium">Features</p>
        <ul className="mt-4 space-y-3.5">
          {features.map((f) => (
            <li key={f} className="flex gap-3 text-sm">
              <Check className="mt-0.5 size-4 shrink-0" strokeWidth={2.5} />
              <span className={highlight ? "text-white/90" : "text-foreground/80"}>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Pricing() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const p = PRICES[currency];

  return (
    <div className="mx-auto max-w-4xl px-6">
      <div className="mb-10 flex justify-center">
        <div role="radiogroup" aria-label="Currency" className="flex rounded-full border p-1">
          {(Object.keys(PRICES) as Currency[]).map((c) => (
            <button
              key={c}
              role="radio"
              type="button"
              aria-checked={currency === c}
              onClick={() => setCurrency(c)}
              className={cn(
                "rounded-full px-5 py-1.5 text-sm font-normal transition-colors duration-300",
                currency === c ? "bg-brand text-white" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {c === "USD" ? "USD $" : "INR ₹"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Plan
          name="Free"
          blurb="For side projects and shipping fast."
          price={<Price value={p.free} symbol={p.symbol} />}
          note="Free forever"
          cta={
            <Link href="/components" className="font-label inline-flex h-11 w-full items-center justify-center rounded-lg border bg-background text-[13px] uppercase transition-colors hover:bg-accent">
              Browse components
            </Link>
          }
          features={FREE}
        />
        <Plan
          highlight
          name="Pro"
          badge="Launching soon"
          blurb="Advanced components and templates."
          price={<Price value={p.pro} symbol={p.symbol} />}
          note={`One-time payment. ${p.note}`}
          cta={
            <Link href="#waitlist" className="font-label inline-flex h-11 w-full items-center justify-center rounded-lg bg-white text-[13px] uppercase text-black transition-opacity hover:opacity-90">
              Get early access
            </Link>
          }
          features={PRO}
        />
      </div>

      <p className="mt-8 text-center text-sm font-normal text-muted-foreground">
        Pay once, keep it forever. No seats, no subscriptions.
      </p>
    </div>
  );
}
