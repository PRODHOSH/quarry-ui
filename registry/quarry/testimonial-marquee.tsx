"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const TESTIMONIALS = [
  { name: "Sarah Jenkins", role: "Product Designer", quote: "This library changed how I build interfaces. The components are clean, accessible and look great out of the box." },
  { name: "Michael Chen", role: "Frontend Engineer", quote: "I was tired of fighting complex UI frameworks. This one is refreshingly simple and the motion is smooth." },
  { name: "Elena Rodriguez", role: "Startup Founder", quote: "We shipped our MVP in record time thanks to these ready-made blocks. The attention to detail is outstanding." },
  { name: "David Kim", role: "UX Researcher", quote: "Users love the interactions. It feels like a premium product without the premium development time." },
];

const AVATAR_TINTS = ["bg-muted text-foreground", "bg-primary/15 text-primary"];

export function TestimonialMarquee({ className }: { className?: string }) {
  return (
    <section className={cn("w-full overflow-hidden py-10", className)}>
      <div className="mx-auto mb-10 max-w-xl px-6 text-center">
        <p className="text-sm font-medium text-primary">Testimonials</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Loved by builders
        </h2>
        <p className="mt-3 text-muted-foreground">
          Here is what developers and designers say after shipping with it.
        </p>
      </div>

      <div className="[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <motion.div
          className="flex w-max gap-4 pr-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        >
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <figure
              key={i}
              className="flex w-80 shrink-0 flex-col justify-between rounded-2xl border bg-card p-6"
            >
              <Quote className="mb-3 size-5 text-muted-foreground/40" />
              <blockquote className="text-sm leading-relaxed text-card-foreground">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span
                  className={cn(
                    "grid size-9 place-items-center rounded-full text-sm font-semibold",
                    AVATAR_TINTS[i % AVATAR_TINTS.length]
                  )}
                >
                  {t.name[0]}
                </span>
                <span>
                  <span className="block text-sm font-medium text-card-foreground">{t.name}</span>
                  <span className="block text-xs text-muted-foreground">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
