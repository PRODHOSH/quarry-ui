"use client";

import { useEffect, useState, type RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type NavLink = { label: string; href: string };

const DEFAULT_LINKS: NavLink[] = [
  { label: "Events", href: "#events" },
  { label: "Team", href: "#team" },
  { label: "Sponsors", href: "#sponsors" },
  { label: "Gallery", href: "#gallery" },
  { label: "About", href: "#about" },
];

/**
 * A navbar that floats as a rounded pill at the top, then settles into a full width bar once you scroll.
 * Below the md breakpoint it collapses to a button that morphs into a close icon and opens a stacked menu.
 */
export function MorphingNavbar({
  brand = "Technovit",
  links = DEFAULT_LINKS,
  cta = "Register",
  ctaHref = "#register",
  threshold = 60,
  scrollContainer,
  position = "fixed",
  className,
}: {
  brand?: string;
  links?: NavLink[];
  cta?: string;
  ctaHref?: string;
  threshold?: number;
  /** Track a scrollable element instead of the window. */
  scrollContainer?: RefObject<HTMLElement | null>;
  position?: "fixed" | "absolute";
  className?: string;
}) {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const target: HTMLElement | Window = scrollContainer?.current ?? window;
    const read = () => (target instanceof Window ? target.scrollY : (target as HTMLElement).scrollTop);
    const onScroll = () => setStuck(read() > threshold);
    onScroll();
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => target.removeEventListener("scroll", onScroll);
  }, [scrollContainer, threshold]);

  return (
    <motion.header
      initial={false}
      animate={{
        top: stuck ? 0 : 16,
        width: stuck ? "100%" : "min(92%, 60rem)",
        borderRadius: stuck ? 0 : 20,
      }}
      transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
      className={cn("inset-x-0 z-50 mx-auto border bg-card/85 backdrop-blur-md", stuck ? "border-x-0 border-t-0" : "shadow-lg", position, className)}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <a href="#" className="text-base font-semibold tracking-tight">{brand}</a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={ctaHref} className="hidden h-9 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex">
            {cta}
          </a>
          <button type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)} className="relative grid size-9 place-items-center rounded-full border md:hidden">
            <span className={cn("absolute h-px w-4 bg-foreground transition-transform duration-300", open ? "rotate-45" : "-translate-y-1")} />
            <span className={cn("absolute h-px w-4 bg-foreground transition-opacity duration-200", open && "opacity-0")} />
            <span className={cn("absolute h-px w-4 bg-foreground transition-transform duration-300", open ? "-rotate-45" : "translate-y-1")} />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden md:hidden"
            aria-label="Mobile"
          >
            <ul className="border-t px-5 py-3">
              {links.map((l, i) => (
                <motion.li key={l.href} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                  <a href={l.href} onClick={() => setOpen(false)} className="block py-3 text-lg">{l.label}</a>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
