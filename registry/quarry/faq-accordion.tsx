"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    question: "How do I add a component to my project?",
    answer:
      "Run the install command shown on the component page, or copy the source into your project. Either way you own the code.",
  },
  {
    question: "Does it work with my existing theme?",
    answer:
      "Yes. Every component reads shadcn style tokens such as background, foreground and primary, so it follows your theme automatically.",
  },
  {
    question: "Is it responsive and accessible?",
    answer:
      "Components are built mobile first, keyboard friendly and use the correct ARIA roles for their pattern.",
  },
  {
    question: "Can I use it in commercial projects?",
    answer: "Absolutely. Everything is free to use in personal and commercial work.",
  },
];

export function FaqAccordion({ className }: { className?: string }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className={cn("mx-auto w-full max-w-2xl px-6 py-10", className)}>
      <div className="mb-8 text-center">
        <p className="text-sm font-medium text-primary">FAQ</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          Common questions
        </h2>
      </div>

      <div className="divide-y rounded-2xl border bg-card">
        {FAQS.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div key={faq.question}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-card-foreground transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {faq.question}
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground"
                >
                  <Plus className="size-3.5" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
