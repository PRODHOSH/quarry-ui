"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Column = { title: string; links: { label: string; href: string }[] };

const COLUMNS: Column[] = [
  { title: "Product", links: [{ label: "Features", href: "#" }, { label: "Integrations", href: "#" }, { label: "Pricing", href: "#" }, { label: "Changelog", href: "#" }] },
  { title: "Company", links: [{ label: "About", href: "#" }, { label: "Careers", href: "#" }, { label: "Blog", href: "#" }, { label: "Contact", href: "#" }] },
  { title: "Resources", links: [{ label: "Documentation", href: "#" }, { label: "Guides", href: "#" }, { label: "Community", href: "#" }, { label: "Status", href: "#" }] },
];

/**
 * A full site footer: brand blurb, a newsletter field that confirms in place, three link columns
 * whose links nudge on hover, and a legal row with a live status dot.
 */
export function MegaFooter({
  brand = "Northwind",
  blurb = "Tools that help small teams ship calm, considered software.",
  columns = COLUMNS,
  className,
}: {
  brand?: string;
  blurb?: string;
  columns?: Column[];
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <footer className={cn("w-full border-t bg-background text-foreground", className)}>
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-14 lg:grid-cols-[1.4fr_2fr]">
        <div className="max-w-sm">
          <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <span className="grid size-7 place-items-center rounded-lg bg-primary text-sm text-primary-foreground">{brand[0]}</span>
            {brand}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{blurb}</p>

          <form
            className="relative mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (email.includes("@")) setDone(true);
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setDone(false);
              }}
              placeholder="you@company.com"
              aria-label="Email address"
              className="h-11 w-full rounded-xl border bg-card pl-4 pr-28 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground transition-transform active:scale-95"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={done ? "ok" : "go"}
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -8, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-1.5"
                >
                  {done ? <><Check className="size-3.5" /> Subscribed</> : <>Subscribe <ArrowRight className="size-3.5" /></>}
                </motion.span>
              </AnimatePresence>
            </button>
          </form>
          <p className="mt-2 text-xs text-muted-foreground">One email a month. Unsubscribe any time.</p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="group inline-flex items-center text-sm text-foreground/80 transition-colors hover:text-foreground">
                      <span className="mr-0 w-0 overflow-hidden opacity-0 transition-all duration-200 group-hover:mr-1.5 group-hover:w-3 group-hover:opacity-100">
                        <ArrowRight className="size-3" />
                      </span>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-6 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {brand}, Inc. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <span className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              All systems normal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
