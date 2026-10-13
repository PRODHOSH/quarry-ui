"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const STEPS = [
  { title: "Create an account", description: "Sign up with email or a provider in seconds." },
  { title: "Choose a template", description: "Start from a polished layout made for your goal." },
  { title: "Customise the design", description: "Adjust colors, type and content to match your brand." },
  { title: "Publish your site", description: "Go live on a global network with one click." },
  { title: "Track analytics", description: "Watch visits and conversions as they happen." },
];

export function ProcessSteps({ className }: { className?: string }) {
  const [active, setActive] = useState(0);

  return (
    <section className={cn("w-full px-6 py-10 sm:px-10", className)}>
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-medium text-primary">The process</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          From idea to live in five steps
        </h2>

        <ol className="relative mt-12 grid gap-8 md:grid-cols-5 md:gap-4">
          <div className="absolute left-[19px] top-2 hidden h-[calc(100%-1rem)] w-px bg-border max-md:block" />
          <div className="absolute left-5 right-5 top-5 hidden h-px bg-border md:block" />
          <motion.div
            className="absolute left-5 top-5 hidden h-px origin-left bg-primary md:block"
            style={{ width: "calc(100% - 2.5rem)" }}
            animate={{ scaleX: active / (STEPS.length - 1) }}
            transition={{ type: "spring", stiffness: 160, damping: 26 }}
          />

          {STEPS.map((step, i) => {
            const reached = i <= active;
            return (
              <li key={step.title} className="relative pl-14 md:pl-0">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className="group block text-left outline-none"
                >
                  <span
                    className={cn(
                      "absolute left-0 top-0 grid size-10 place-items-center rounded-full border text-sm font-semibold transition-colors md:relative",
                      reached
                        ? "border-primary bg-primary text-primary-foreground"
                        : "bg-background text-muted-foreground group-hover:border-foreground/30"
                    )}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={cn(
                      "mt-0 block text-sm font-semibold transition-colors md:mt-4",
                      reached ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground md:pr-2">
                    {step.description}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
