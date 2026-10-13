"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, Leaf, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type Card = {
  icon: ReactNode;
  stat: string;
  title: string;
  body: string;
  rotate: number;
  offset: number;
  tint: string;
};

const CARDS: Card[] = [
  { icon: <ImageIcon className="size-5" />, stat: "70%", title: "Of page weight is media", body: "Images and video make up most of a page's transfer size, and most of it is never optimised.", rotate: -4, offset: 16, tint: "bg-chart-1/10 text-chart-1" },
  { icon: <Zap className="size-5" />, stat: "3×", title: "Slower to load", body: "Heavy assets inflate bandwidth costs and drag down performance scores with every extra second.", rotate: 0, offset: -8, tint: "bg-chart-3/10 text-chart-3" },
  { icon: <Leaf className="size-5" />, stat: "18g", title: "CO₂ per heavy page", body: "Every unnecessary megabyte burns energy in transit. Smarter delivery shrinks the footprint.", rotate: 4, offset: 16, tint: "bg-chart-2/10 text-chart-2" },
];

export function TiltedFeatureCards({ className }: { className?: string }) {
  return (
    <section className={cn("w-full overflow-hidden px-6 py-10", className)}>
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Most websites are heavier than they need to be
        </h2>
        <p className="mt-3 text-muted-foreground">
          The problem is not your content. It is how it is delivered.
        </p>
      </div>

      <div className="mx-auto mt-14 flex max-w-4xl flex-col items-center gap-5 md:flex-row md:items-end md:justify-center md:gap-0">
        {CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 30, rotate: 0 }}
            whileInView={{ opacity: 1, y: card.offset, rotate: card.rotate }}
            viewport={{ once: true, margin: "-40px" }}
            whileHover={{ y: card.offset - 12, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: i * 0.08 }}
            style={{ zIndex: i === 1 ? 10 : 1 }}
            className={cn(
              "w-full max-w-xs rounded-2xl border bg-card p-6 shadow-sm md:w-72",
              i === 1 && "shadow-xl md:mx-[-1.25rem]"
            )}
          >
            <div className={cn("mb-4 grid size-10 place-items-center rounded-xl", card.tint)}>
              {card.icon}
            </div>
            <p className="text-3xl font-semibold tracking-tight text-card-foreground">{card.stat}</p>
            <p className="mt-1 text-sm font-medium text-card-foreground">{card.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
