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
          className="text-6xl font-semibold tracking-[-0.04em]"
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
    <div
      className={cn(
        "flex flex-col rounded-2xl border bg-card/50 p-8",
        highlight && "border-brand/60 bg-brand/[0.06] shadow-[0_0_0_1px_color-mix(in_oklab,var(--brand)_35%,transparent)]"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">{name}</h3>
        {badge && <span className="rounded-full bg-brand/15 px-3 py-1 text-xs font-medium text-[#8fb0ff]">{badge}</span>}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{blurb}</p>

      <div className="mt-8 min-h-28">
        {price}
        <p className="mt-2 text-sm text-muted-foreground">{note}</p>
      </div>

      <div className="mt-6">{cta}</div>

      <ul className="mt-8 space-y-3.5 border-t pt-8">
        {features.map((f) => (
          <li key={f} className="flex gap-3 text-sm text-muted-foreground">
            <span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full", highlight ? "bg-brand text-white" : "bg-muted text-foreground")}>
              <Check className="size-3" strokeWidth={3} />
            </span>
            <span className="text-foreground/80">{f}</span>
          </li>
        ))}
      </ul>
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
            <Link href="/components" className="inline-flex h-11 w-full items-center justify-center rounded-full border text-sm font-medium transition-colors hover:bg-accent">
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
            <Link href="#waitlist" className="inline-flex h-11 w-full items-center justify-center rounded-full bg-brand text-sm font-medium text-white transition-opacity hover:opacity-90">
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
