"use client";

import { useEffect, useState, type RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollRevealPill({
  threshold = 120,
  scrollContainer,
  position = "fixed",
  label = "Available for work",
  message = "Looking for a product engineer?",
  cta = "Get in touch",
  href = "#contact",
  className,
}: {
  /** Pixels scrolled before the pill appears. */
  threshold?: number;
  /** Track a scrollable element instead of the window. */
  scrollContainer?: RefObject<HTMLElement | null>;
  position?: "fixed" | "absolute";
  label?: string;
  message?: string;
  cta?: string;
  href?: string;
  className?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const target: HTMLElement | Window = scrollContainer?.current ?? window;
    const read = () =>
      target instanceof Window ? target.scrollY : (target as HTMLElement).scrollTop;
    const onScroll = () => setScrolled(read() > threshold);
    onScroll();
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => target.removeEventListener("scroll", onScroll);
  }, [scrollContainer, threshold]);

  return (
    <AnimatePresence>
      {scrolled && !dismissed && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className={cn(
            "bottom-6 left-1/2 z-50 -translate-x-1/2",
            position === "fixed" ? "fixed" : "absolute",
            className
          )}
        >
          <div className="flex items-center gap-3 rounded-full border bg-card/95 p-1.5 pr-2 shadow-xl backdrop-blur">
            <span className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              {label}
            </span>
            <span className="hidden whitespace-nowrap text-sm text-muted-foreground sm:block">
              {message}
            </span>
            <a
              href={href}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              {cta}
              <ArrowRight className="size-3.5" />
            </a>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => setDismissed(true)}
              className="grid size-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
