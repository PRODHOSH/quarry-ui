"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, MessageSquare, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = { icon: ReactNode; title: string; text: string; image: string };

const TABS: Tab[] = [
  { icon: <Zap />, title: "Automate the busywork", text: "Describe the routine once and let it run on its own, every time.", image: "https://picsum.photos/seed/quarry-ft1/960/640" },
  { icon: <MessageSquare />, title: "Talk to your data", text: "Ask questions in plain language and get answers with sources.", image: "https://picsum.photos/seed/quarry-ft2/960/640" },
  { icon: <BarChart3 />, title: "See what is working", text: "Live dashboards that show what moved the number, not just the number.", image: "https://picsum.photos/seed/quarry-ft3/960/640" },
];

/**
 * Feature tabs that advance on their own. The active tab shows a progress line, the matching image
 * crossfades with a small zoom, and hovering a tab pauses the timer so people can read.
 */
export function FeatureTabs({ tabs = TABS, duration = 5000, className }: { tabs?: Tab[]; duration?: number; className?: string }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setI((v) => (v + 1) % tabs.length), duration);
    return () => clearTimeout(t);
  }, [i, paused, duration, tabs.length]);

  return (
    <div className={cn("mx-auto grid w-full max-w-4xl items-center gap-6 px-6 md:grid-cols-[1fr_1.35fr]", className)} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div role="tablist" className="flex flex-col gap-1">
        {tabs.map((t, n) => {
          const active = n === i;
          return (
            <button
              key={t.title}
              role="tab"
              aria-selected={active}
              onClick={() => setI(n)}
              className={cn("relative rounded-xl p-4 text-left transition-colors", active ? "bg-card" : "hover:bg-card/50")}
            >
              <div className="flex items-center gap-3">
                <span className={cn("grid size-8 place-items-center rounded-lg border transition-colors [&_svg]:size-4", active ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground")}>{t.icon}</span>
                <span className={cn("text-sm font-medium", !active && "text-muted-foreground")}>{t.title}</span>
              </div>
              <AnimatePresence initial={false}>
                {active && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                    <p className="pb-2 pl-11 pt-2 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              {active && (
                <span className="absolute inset-x-4 bottom-0 h-px overflow-hidden rounded-full bg-border">
                  <motion.span
                    key={`${i}-${paused}`}
                    initial={{ scaleX: paused ? 1 : 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: paused ? 0 : duration / 1000, ease: "linear" }}
                    className="block h-full origin-left bg-primary"
                  />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border bg-muted">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.img
            key={i}
            src={tabs[i].image}
            alt={tabs[i].title}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 size-full object-cover"
          />
        </AnimatePresence>
      </div>
    </div>
  );
}
