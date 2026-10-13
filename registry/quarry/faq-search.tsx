"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { q: string; a: string; topic: string };

const ITEMS: Item[] = [
  { topic: "Billing", q: "Can I change plans at any time?", a: "Yes. Upgrades apply immediately and downgrades take effect at the end of your billing period, with no fees either way." },
  { topic: "Billing", q: "Do you offer refunds?", a: "If it isn't right for you, write to us within 30 days of purchase and we'll refund you in full, no questions asked." },
  { topic: "Product", q: "Does it work with my existing stack?", a: "It is plain React and Tailwind, so it drops into Next.js, Vite, Remix or any setup that already uses either." },
  { topic: "Product", q: "Can I customise the look?", a: "Everything reads your theme tokens. Change a colour or radius once and every component follows." },
  { topic: "Account", q: "How do I invite my team?", a: "Open Settings, choose Members and send invites by email. People join with the role you pick." },
  { topic: "Account", q: "Where is my data stored?", a: "Data is encrypted at rest in your chosen region, and you can export or delete it whenever you like." },
];

/**
 * An FAQ with a live search and topic filters. Results filter as you type with matches
 * highlighted, rows expand with smooth height animation, and an empty state guides recovery.
 */
export function FaqSearch({ items = ITEMS, className }: { items?: Item[]; className?: string }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All");
  const [open, setOpen] = useState<string | null>(items[0]?.q ?? null);

  const topics = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.topic)))], [items]);
  const results = items.filter(
    (i) => (topic === "All" || i.topic === topic) && (i.q + i.a).toLowerCase().includes(query.trim().toLowerCase())
  );

  const mark = (text: string) => {
    const t = query.trim();
    if (!t) return text;
    const at = text.toLowerCase().indexOf(t.toLowerCase());
    if (at < 0) return text;
    return (
      <>
        {text.slice(0, at)}
        <mark className="rounded bg-primary/20 px-0.5 text-foreground">{text.slice(at, at + t.length)}</mark>
        {text.slice(at + t.length)}
      </>
    );
  };

  return (
    <section className={cn("mx-auto w-full max-w-2xl px-6 py-8", className)}>
      <h2 className="text-center text-3xl font-semibold tracking-tight">Questions, answered</h2>

      <div className="relative mt-6">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions"
          aria-label="Search questions"
          className="h-11 w-full rounded-xl border bg-card pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            className={cn(
              "relative rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
              topic === t ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {topic === t && <motion.span layoutId="faq-topic" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
            <span className="relative">{t}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 divide-y rounded-2xl border bg-card">
        <AnimatePresence initial={false} mode="popLayout">
          {results.map((r) => {
            const isOpen = open === r.q;
            return (
              <motion.div key={r.q} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <button onClick={() => setOpen(isOpen ? null : r.q)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                  <span className="text-sm font-medium">{mark(r.q)}</span>
                  <Plus className={cn("size-4 shrink-0 text-muted-foreground transition-transform duration-300", isOpen && "rotate-45 text-foreground")} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }} className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{mark(r.a)}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {results.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground">
            Nothing matches “{query}”.{" "}
            <button onClick={() => { setQuery(""); setTopic("All"); }} className="text-foreground underline underline-offset-4">Clear filters</button>
          </div>
        )}
      </div>
    </section>
  );
}
