"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Code, Palette, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

export type TabItem = { id: string; label: string; icon?: ReactNode; title: string; text: string; points?: string[]; visual?: ReactNode };

const rise = (i: number) => ({ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.12 + i * 0.07, duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } });

function DesignVisual() {
  const swatches = ["bg-primary", "bg-foreground/70", "bg-muted-foreground/50", "bg-border", "bg-accent"];
  return (
    <div className="flex h-full flex-col justify-between p-5">
      <div className="flex gap-2">
        {swatches.map((c, i) => (
          <motion.span key={c} {...rise(i)} className={cn("size-9 rounded-full border border-foreground/10", c)} />
        ))}
      </div>
      <div>
        <motion.p {...rise(5)} className="text-6xl font-semibold leading-none tracking-tight">Aa</motion.p>
        <motion.div {...rise(6)} className="mt-4 space-y-2">
          <span className="block h-2 w-4/5 rounded-full bg-foreground/80" />
          <span className="block h-2 w-3/5 rounded-full bg-muted-foreground/40" />
          <span className="block h-2 w-2/5 rounded-full bg-muted-foreground/25" />
        </motion.div>
      </div>
    </div>
  );
}

function BuildVisual() {
  const lines = [["w-2/5", "bg-primary"], ["w-4/5", "bg-foreground/50"], ["w-3/5", "bg-foreground/30"], ["w-1/2", "bg-foreground/50"], ["w-2/3", "bg-foreground/30"], ["w-1/4", "bg-primary"]];
  return (
    <div className="flex h-full flex-col p-5">
      <motion.div {...rise(0)} className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 font-mono text-[11px] text-muted-foreground">
        <span className="text-foreground">$</span> npx shadcn add card
        <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} className="ml-0.5 inline-block h-3 w-1 bg-foreground" />
      </motion.div>
      <div className="mt-5 space-y-3">
        {lines.map(([w, c], i) => (
          <motion.span key={i} initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ delay: 0.2 + i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className={cn("block h-2 origin-left rounded-full", w, c)} />
        ))}
      </div>
    </div>
  );
}

function ShipVisual() {
  const steps = ["Types check", "Responsive", "Accessible", "Deployed"];
  return (
    <div className="flex h-full flex-col justify-between p-5">
      <ul className="space-y-3">
        {steps.map((s, i) => (
          <motion.li key={s} {...rise(i)} className="flex items-center gap-3 text-sm">
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.18, type: "spring", stiffness: 500, damping: 18 }} className="grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
              <Check className="size-3" strokeWidth={3} />
            </motion.span>
            {s}
          </motion.li>
        ))}
      </ul>
      <div className="h-1.5 overflow-hidden rounded-full bg-border">
        <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 0.3, duration: 0.9, ease: "easeOut" }} className="h-full rounded-full bg-primary" />
      </div>
    </div>
  );
}

const DEFAULT_TABS: TabItem[] = [
  { id: "design", label: "Design", icon: <Palette />, title: "Start from tokens, not pixels", text: "Every colour, radius and shadow comes from one place, so a change lands everywhere at once.", points: ["One source of truth", "Light and dark for free", "No one off values"], visual: <DesignVisual /> },
  { id: "build", label: "Build", icon: <Code />, title: "Components you own", text: "Each one is a single file. Install it with a command, or hand the prompt to your AI tool.", points: ["Copy, do not depend", "Plain React and Tailwind", "Edit anything you like"], visual: <BuildVisual /> },
  { id: "ship", label: "Ship", icon: <Rocket />, title: "Nothing left to fix on launch day", text: "Everything is type checked and responsive from the first render.", points: ["Checked before it ships", "Accessible by default", "Fast on real phones"], visual: <ShipVisual /> },
];

/**
 * A tabbed feature panel. A pill glides between the labels, and the panel beneath slides in the
 * direction you moved: copy and a checklist on the left, a small animated illustration on the right.
 * Arrow keys, Home and End work, and every tab is a real button with the right ARIA roles.
 */
export function AnimatedTabs({ tabs = DEFAULT_TABS, className }: { tabs?: TabItem[]; className?: string }) {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const uid = useId();
  const t = tabs[active];

  const select = (i: number) => {
    const n = (i + tabs.length) % tabs.length;
    setDir(n >= active ? 1 : -1);
    setActive(n);
  };

  return (
    <div className={cn("w-full max-w-3xl px-6 py-10", className)}>
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
        className="mx-auto flex w-fit rounded-full border bg-card p-1"
      >
        {tabs.map((tab, i) => {
          const on = i === active;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`${uid}-tab-${tab.id}`}
              aria-selected={on}
              aria-controls={`${uid}-panel`}
              tabIndex={on ? 0 : -1}
              onClick={() => select(i)}
              className={cn("relative z-10 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 sm:px-5", on ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              {on && <motion.span layoutId={`${uid}-pill`} transition={{ type: "spring", stiffness: 420, damping: 34 }} className="absolute inset-0 -z-10 rounded-full bg-primary" />}
              {tab.icon && <span className="[&_svg]:size-4">{tab.icon}</span>}
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="relative mt-6 overflow-hidden rounded-3xl border bg-card">
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={t.id}
            id={`${uid}-panel`}
            role="tabpanel"
            aria-labelledby={`${uid}-tab-${t.id}`}
            custom={dir}
            initial={{ opacity: 0, x: dir * 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -28 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="grid gap-6 p-6 sm:p-8 md:grid-cols-[1.1fr_1fr]"
          >
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl font-semibold tracking-tight">{t.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{t.text}</p>
              {t.points && (
                <ul className="mt-5 space-y-2.5">
                  {t.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-sm">
                      <span className="grid size-4 place-items-center rounded-full bg-primary/15 text-primary"><Check className="size-2.5" strokeWidth={3} /></span>
                      {p}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {t.visual && <div className="min-h-[13rem] overflow-hidden rounded-2xl border bg-muted/40">{t.visual}</div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
