"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Reward = { tag: string; title: string; description: string };

const REWARDS: Reward[] = [
  { tag: "Top 10", title: "Premium digital identity", description: "The top 10 members receive a free year of a custom domain to launch their portfolio." },
  { tag: "Weekly", title: "Exclusive event swag", description: "Weekly top performers get partner goodies: t-shirts for the top three, books for the rest." },
  { tag: "Finalists", title: "Limited edition swag kit", description: "Official tees, personalised notebooks and premium notes for everyone who reaches the final round." },
  { tag: "Finalists", title: "A mentor in your corner", description: "Finalists book a one on one session with an industry mentor of their choice." },
  { tag: "Winners", title: "A place on the wall", description: "Winners are featured on the public hall of fame for the whole year." },
];

/** The nearest ancestor that scrolls, or the window. */
function scrollParent(el: HTMLElement | null): HTMLElement | Window {
  let p = el?.parentElement ?? null;
  while (p) {
    const o = getComputedStyle(p).overflowY;
    if ((o === "auto" || o === "scroll") && p.scrollHeight > p.clientHeight) return p;
    p = p.parentElement;
  }
  return window;
}

/**
 * A sticky story. The heading column stays put while the rewards scroll past on the right. The
 * reward closest to the heading lights up, a counter and progress bar follow along, and the rest
 * dim. It finds whichever element scrolls, so it works in a page or inside a scroll area.
 * On small screens the two columns simply stack.
 */
export function RewardsList({
  eyebrow = "Leaderboard",
  title = "Climb the ranks, earn real rewards",
  text = "Every action counts toward your score. Rankings update live, and the best performers are recognised at the end of the programme.",
  rewards = REWARDS,
  cta = "See the leaderboard",
  stickyTop = 96,
  className,
}: {
  eyebrow?: string;
  title?: string;
  text?: string;
  rewards?: Reward[];
  cta?: string;
  /** Distance from the top of the scroll area where the heading sticks, in pixels. */
  stickyTop?: number;
  className?: string;
}) {
  const root = useRef<HTMLElement>(null);
  const left = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const scroller = scrollParent(root.current);
    let raf = 0;
    const measure = () => {
      raf = 0;
      const l = left.current;
      if (!l) return;
      const lr = l.getBoundingClientRect();
      // when the columns stack there is nothing sticky, so use the middle of the visible area
      const sticky = getComputedStyle(l).position === "sticky";
      const view = scroller instanceof Window ? { top: 0, h: window.innerHeight } : (() => { const r = scroller.getBoundingClientRect(); return { top: r.top, h: r.height }; })();
      const ref = sticky ? lr.top + lr.height / 2 : view.top + view.h / 2;
      let best = 0, bestD = Infinity;
      items.current.forEach((li, i) => {
        if (!li) return;
        const r = li.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - ref);
        if (d < bestD) { bestD = d; best = i; }
      });
      setActive(best);
      const list = root.current?.querySelector("ol");
      if (list) {
        const r = list.getBoundingClientRect();
        const total = r.height - Math.min(r.height, view.h) * 0.4;
        setProgress(Math.min(1, Math.max(0, (ref - r.top) / Math.max(1, r.height))));
        void total;
      }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(measure); };
    scroller.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    measure();
    return () => {
      scroller.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  const n = rewards.length;
  const pad = (v: number) => String(v).padStart(2, "0");

  return (
    <section ref={root} className={cn("w-full px-6 py-16 sm:px-10", className)}>
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[5fr_6fr] lg:gap-20">
        <div ref={left} style={{ top: stickyTop }} className="self-start lg:sticky">
          <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p>
          <h2 className="mt-3 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">{title}</h2>
          <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">{text}</p>

          <div className="mt-8 hidden items-end gap-3 lg:flex">
            <div className="relative h-14 w-16 overflow-hidden text-5xl font-semibold tabular-nums tracking-tight">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={active} initial={{ y: "60%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-60%", opacity: 0 }} transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }} className="absolute inset-0">
                  {pad(active + 1)}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="pb-1.5 text-lg tabular-nums text-muted-foreground">/ {pad(n)}</span>
          </div>
          <div className="mt-4 hidden h-px w-full max-w-xs overflow-hidden rounded-full bg-border lg:block">
            <motion.div className="h-full origin-left bg-foreground" animate={{ scaleX: Math.max(0.04, progress) }} transition={{ type: "spring", stiffness: 160, damping: 26 }} />
          </div>

          <a href="#" className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-transform active:scale-95">
            {cta} <ArrowRight className="size-4" />
          </a>
        </div>

        <ol className="space-y-4 pb-8 lg:space-y-6 lg:pb-[28vh] lg:pt-6">
          {rewards.map((r, i) => {
            const on = i === active;
            return (
              <li key={r.title} ref={(el) => { items.current[i] = el; }}>
                <motion.div
                  animate={{ opacity: on ? 1 : 0.4, scale: on ? 1 : 0.98 }}
                  transition={{ duration: 0.3 }}
                  className={cn("flex min-h-[13rem] flex-col justify-between rounded-3xl border bg-card p-6 transition-shadow duration-300 sm:p-8", on && "shadow-[0_20px_50px_-24px_rgba(0,0,0,0.25)]")}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn("grid size-10 place-items-center rounded-full text-sm font-semibold tabular-nums transition-colors duration-300", on ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>{i + 1}</span>
                    <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">{r.tag}</span>
                  </div>
                  <div className="mt-10">
                    <h3 className="text-xl font-semibold tracking-tight">{r.title}</h3>
                    <p className="mt-2 max-w-md leading-relaxed text-muted-foreground">{r.description}</p>
                  </div>
                </motion.div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
