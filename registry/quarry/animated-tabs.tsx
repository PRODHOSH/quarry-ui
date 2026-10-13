"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type TabItem = { id: string; label: string; content: ReactNode };

const DEFAULT_TABS: TabItem[] = [
  { id: "design", label: "Design", content: <p>Start from tokens, not pixels. Every colour, radius and shadow comes from one place, so a change lands everywhere at once.</p> },
  { id: "build", label: "Build", content: <p>Components are single files you own. Install one with a command, or hand the prompt to your AI tool and it does the same.</p> },
  { id: "ship", label: "Ship", content: <p>Everything is type checked and responsive from the first render, so there is nothing left to fix on the day you launch.</p> },
];

/**
 * Tabs with a highlight that glides between labels and content that slides in the direction you moved.
 * Arrow keys, Home and End all work, and every tab is a real button with the right ARIA roles.
 */
export function AnimatedTabs({ tabs = DEFAULT_TABS, className }: { tabs?: TabItem[]; className?: string }) {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const uid = useId();

  const select = (i: number) => {
    const n = (i + tabs.length) % tabs.length;
    setDir(n >= active ? 1 : -1);
    setActive(n);
  };

  return (
    <div className={cn("w-full max-w-xl px-6 py-10", className)}>
      <div
        role="tablist"
        aria-label="Sections"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") select(active + 1);
          else if (e.key === "ArrowLeft") select(active - 1);
          else if (e.key === "Home") select(0);
          else if (e.key === "End") select(tabs.length - 1);
          else return;
          e.preventDefault();
        }}
        className="relative inline-flex rounded-full border bg-card p-1"
      >
        {tabs.map((t, i) => {
          const on = i === active;
          return (
            <button
              key={t.id}
              role="tab"
              id={`${uid}-tab-${t.id}`}
              aria-selected={on}
              aria-controls={`${uid}-panel-${t.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => select(i)}
              className={cn("relative z-10 rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300", on ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              {on && <motion.span layoutId={`${uid}-pill`} transition={{ type: "spring", stiffness: 420, damping: 34 }} className="absolute inset-0 -z-10 rounded-full bg-primary" />}
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="relative mt-6 min-h-28 overflow-hidden rounded-3xl border bg-card p-6 text-[15px] leading-relaxed text-muted-foreground">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.div
            key={tabs[active].id}
            role="tabpanel"
            id={`${uid}-panel-${tabs[active].id}`}
            aria-labelledby={`${uid}-tab-${tabs[active].id}`}
            custom={dir}
            initial={{ opacity: 0, x: dir * 28, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: dir * -28, filter: "blur(4px)" }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          >
            {tabs[active].content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
