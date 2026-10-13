"use client";

import { useEffect, useState, type RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A slim pill that rises from the bottom edge once you have scrolled a little. It carries a status,
 * a short message and one action, and can be dismissed. Nothing in it ever wraps.
 */
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
    const read = () => (target instanceof Window ? target.scrollY : (target as HTMLElement).scrollTop);
    const onScroll = () => setScrolled(read() > threshold);
    onScroll();
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => target.removeEventListener("scroll", onScroll);
  }, [scrollContainer, threshold]);

  return (
    <AnimatePresence>
      {scrolled && !dismissed && (
        <motion.div
          initial={{ y: 48, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 48, opacity: 0, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className={cn("bottom-6 left-1/2 z-50 w-max max-w-[calc(100%-2rem)] -translate-x-1/2", position === "fixed" ? "fixed" : "absolute", className)}
        >
          <div className="flex items-center gap-1 whitespace-nowrap rounded-full border bg-card/90 p-1.5 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <span className="flex items-center gap-2 rounded-full bg-primary/10 py-2 pl-3 pr-3.5 text-[13px] font-medium text-primary">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              {label}
            </span>
            <span className="hidden px-3 text-[13px] text-muted-foreground md:block">{message}</span>
            <a
              href={href}
              className="group ml-1 inline-flex items-center gap-1.5 rounded-full bg-foreground py-2 pl-4 pr-3 text-[13px] font-medium text-background transition-transform duration-300 active:scale-[0.97]"
            >
              {cta}
              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px" />
            </a>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => setDismissed(true)}
              className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
