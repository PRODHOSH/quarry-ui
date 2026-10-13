"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function CallToAction({
  title = "Start building something people love",
  description = "Join thousands of teams shipping faster, lighter and more consistent interfaces.",
  primaryLabel = "Get started",
  secondaryLabel = "Read the docs",
  className,
}: {
  title?: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  className?: string;
}) {
  return (
    <section className={cn("w-full px-6 py-10 sm:px-10", className)}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border bg-card px-8 py-10 text-center sm:px-14"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[28rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
        />
        <div className="relative">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-card-foreground sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">{description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#"
              className="group inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              {primaryLabel}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#"
              className="inline-flex items-center rounded-lg border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              {secondaryLabel}
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
