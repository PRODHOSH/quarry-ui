"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TESTIMONIALS = [
  { quote: "It cut our page weight in half overnight. No design changes, no refactoring, just automatic optimisation from day one.", name: "Priya Mehta", role: "Frontend Engineer, Northwind" },
  { quote: "We had no idea how much bandwidth we were wasting. It made the problem visible and fixed it at the same time.", name: "James Rucker", role: "CTO, GreenStack" },
  { quote: "Integration took under five minutes. Our Lighthouse score jumped from 62 to 94 and the hosting bill dropped by a third.", name: "Aiko Tanaka", role: "Indie builder and OSS maintainer" },
  { quote: "The before and after view sells itself to clients instantly. No spreadsheets, just clear visual proof.", name: "Lucas Ferreira", role: "Product Lead, Cloudify" },
];

const TINTS = ["bg-chart-1/15 text-chart-1", "bg-chart-2/15 text-chart-2", "bg-chart-3/15 text-chart-3", "bg-chart-4/15 text-chart-4"];

export function TestimonialCarousel({
  interval = 6000,
  className,
}: {
  interval?: number;
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const count = TESTIMONIALS.length;

  const go = useCallback(
    (to: number) => {
      setDirection(to > active || (active === count - 1 && to === 0) ? 1 : -1);
      setActive((to + count) % count);
    },
    [active, count]
  );

  useEffect(() => {
    const id = setTimeout(() => go(active + 1), interval);
    return () => clearTimeout(id);
  }, [active, go, interval]);

  const item = TESTIMONIALS[active];

  return (
    <section className={cn("w-full px-6 py-10", className)}>
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-primary">Testimonials</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Don&apos;t just take our word for it
        </h2>

        <div className="relative mt-10 min-h-56" aria-live="polite">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.figure
              key={active}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="rounded-2xl border bg-card p-8 text-left"
            >
              <blockquote className="text-lg font-medium leading-relaxed text-card-foreground">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className={cn("grid size-10 place-items-center rounded-full font-semibold", TINTS[active % TINTS.length])}>
                  {item.name[0]}
                </span>
                <span>
                  <span className="block text-sm font-medium text-card-foreground">{item.name}</span>
                  <span className="block text-xs text-muted-foreground">{item.role}</span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() => go(active - 1)}
            className="grid size-9 place-items-center rounded-full border bg-background text-foreground transition-colors hover:bg-muted"
          >
            <ChevronLeft className="size-4" />
          </button>
          <div className="flex items-center gap-1.5">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === active}
                onClick={() => go(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === active ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground/40"
                )}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => go(active + 1)}
            className="grid size-9 place-items-center rounded-full border bg-background text-foreground transition-colors hover:bg-muted"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
