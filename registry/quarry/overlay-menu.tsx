"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type MenuLink = { label: string; href: string };
export type MenuFact = { value: string; label: string };

const LINKS: MenuLink[] = [
  { label: "Home", href: "#" },
  { label: "About", href: "#" },
  { label: "Solutions", href: "#" },
  { label: "Projects", href: "#" },
  { label: "Journal", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Contact", href: "#" },
];
const FACTS: MenuFact[] = [
  { value: "86", label: "Components in the library" },
  { value: "4", label: "Full app templates" },
];
const ease = [0.22, 1, 0.36, 1] as const;

/**
 * A top bar with a Menu button that opens a full screen menu. The panel wipes down, the links rise
 * out of masks one after another, and a side column holds a short pitch, a button and two facts.
 * Escape closes it, focus stays inside while it is open, and the page behind stops scrolling.
 */
export function OverlayMenu({
  brand = "Northwind",
  links = LINKS,
  current = 0,
  eyebrow = "Start here",
  lead = "Tell us what you are building and we will show you the shortest path from idea to launch.",
  cta = { label: "Start a project", href: "#" },
  facts = FACTS,
  actions = [{ label: "Our work", href: "#" }],
  position = "fixed",
  className,
}: {
  brand?: ReactNode;
  links?: MenuLink[];
  /** Index of the page that is open now. It stays highlighted. */
  current?: number;
  eyebrow?: string;
  lead?: string;
  cta?: { label: string; href: string };
  facts?: MenuFact[];
  /** Small buttons shown on the right of the top bar. */
  actions?: MenuLink[];
  /** Use `absolute` to keep the menu inside a relatively positioned box. */
  position?: "fixed" | "absolute";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const pos = position === "fixed" ? "fixed" : "absolute";

  const toggle = useCallback((next: boolean) => {
    setOpen(next);
    if (next) setShown(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (position === "fixed") {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open, position]);

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        toggle(false);
        btn.current?.focus();
      }
      if (e.key === "Tab" && panel.current) {
        const items = [btn.current!, ...Array.from(panel.current.querySelectorAll<HTMLElement>("a"))];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, toggle]);

  const glass = "bg-foreground/60 text-background shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--background)_14%,transparent)] backdrop-blur-xl";

  return (
    <div className={cn("pointer-events-none inset-0 z-50", pos, className)}>
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 grid h-[4.5rem] grid-cols-[1fr_auto_1fr] items-center px-[clamp(1rem,3.2vw,3rem)]">
        <button
          ref={btn}
          type="button"
          onClick={() => toggle(!open)}
          aria-expanded={open}
          aria-controls="overlay-menu-panel"
          className="pointer-events-auto inline-flex h-11 items-center gap-2.5 justify-self-start rounded-xl bg-card px-4 pl-3.5 text-sm font-medium text-foreground shadow-[0_6px_24px_-12px_rgb(0_0_0/0.45)] transition-transform active:scale-95"
        >
          <span aria-hidden className="relative h-3 w-[18px]">
            <motion.i animate={open ? { top: 5, rotate: 45 } : { top: 1, rotate: 0 }} transition={{ duration: 0.45, ease }} className="absolute left-0 h-[1.6px] w-full rounded bg-current" />
            <motion.i animate={open ? { top: 5, rotate: -45, width: "100%" } : { top: 9, rotate: 0, width: "70%" }} transition={{ duration: 0.45, ease }} className="absolute left-0 h-[1.6px] rounded bg-current" />
          </span>
          {open ? "Close" : "Menu"}
        </button>

        <span className={cn("pointer-events-auto inline-flex h-11 items-center rounded-xl px-4 text-[1.05rem] font-semibold tracking-tight", glass)}>{brand}</span>

        <div className="pointer-events-auto flex items-center gap-2 justify-self-end">
          {actions.map((a) => (
            <a key={a.label} href={a.href} className={cn("hidden h-11 items-center rounded-xl px-4 text-sm font-medium transition-colors hover:bg-foreground/80 sm:inline-flex", glass)}>
              {a.label}
            </a>
          ))}
          <a href={cta.href} className="inline-flex h-11 items-center gap-2.5 rounded-xl bg-primary pl-4 pr-2 text-sm font-semibold text-primary-foreground transition-transform active:scale-95">
            {cta.label}
            <span className="grid size-7 place-items-center rounded-lg bg-foreground text-primary"><ArrowUpRight className="size-3.5" /></span>
          </a>
        </div>
      </header>

      <motion.nav
        ref={panel}
        id="overlay-menu-panel"
        aria-label="Main menu"
        inert={!open}
        initial={false}
        animate={{ clipPath: open ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)" }}
        transition={{ duration: 0.8, ease }}
        onAnimationComplete={() => !open && setShown(false)}
        style={{ visibility: shown ? "visible" : "hidden" }}
        className={cn("pointer-events-auto absolute inset-0 z-10 overflow-y-auto overscroll-contain bg-foreground text-background [container-type:size]")}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(60% 50% at 85% 8%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 70%), radial-gradient(50% 50% at 8% 100%, color-mix(in oklab, var(--primary) 10%, transparent), transparent 70%)" }}
        />
        <div className="relative mx-auto grid min-h-full max-w-[110rem] items-center gap-[clamp(1.5rem,5vw,6rem)] px-[clamp(1rem,3.2vw,3rem)] pb-7 pt-[5.25rem] md:grid-cols-[1.3fr_0.7fr]">
          <ol>
            {links.map((l, i) => (
              <li key={l.label} className="overflow-hidden border-t border-background/10 last:border-b">
                <motion.a
                  href={l.href}
                  onClick={() => toggle(false)}
                  aria-current={i === current ? "page" : undefined}
                  animate={{ y: open ? "0%" : "105%" }}
                  transition={{ duration: open ? 0.9 : 0.3, ease, delay: open ? 0.12 + i * 0.05 : 0 }}
                  className="group flex items-baseline gap-4 py-[clamp(0.3rem,1.4cqh,0.75rem)] font-medium leading-[1.1] tracking-[-0.03em] transition-[color,padding] duration-500 hover:pl-3.5 hover:text-primary aria-[current=page]:text-primary"
                  style={{ fontSize: "clamp(1.5rem, min(5.4cqw, 8.4cqh), 4.2rem)" }}
                >
                  <span className="min-w-[2ch] -translate-y-[0.9em] text-[0.75rem] font-medium tracking-[0.14em] text-primary">{String(i + 1).padStart(2, "0")}</span>
                  {l.label}
                </motion.a>
              </li>
            ))}
          </ol>

          <aside className="grid content-end gap-5 pb-1.5">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-background/55">{eyebrow}</p>
            <p className="max-w-[34ch] text-[1.15rem] leading-snug text-background/75">{lead}</p>
            <a href={cta.href} className="inline-flex h-11 w-full items-center justify-between rounded-xl bg-primary pl-4 pr-2 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98]">
              {cta.label}
              <span className="grid size-7 place-items-center rounded-lg bg-foreground text-primary"><ArrowUpRight className="size-3.5" /></span>
            </a>
            <dl className="mt-3 grid grid-cols-2 gap-4 border-t border-background/12 pt-5">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-[clamp(1.4rem,1rem+1.6vw,2.4rem)] font-medium leading-none tracking-tight text-primary">{f.value}</dt>
                  <dd className="mt-1.5 text-sm text-background/60">{f.label}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </motion.nav>
    </div>
  );
}
