"use client";

import { useRef, type RefObject } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

export type PileCard = { title: string; text: string };

const CARDS: PileCard[] = [
  { title: "Talk", text: "We start with a conversation to understand your vision, your brand and your customers." },
  { title: "Create", text: "Our team researches, sketches and designs, never from a preset template." },
  { title: "Deliver", text: "We execute the plan across print, outdoor and digital, then check every detail." },
];
const ROT = [-4, 3, -2, 4, -3];
const OFF = [-72, 0, 72, 0, 0];
const SKIN = [
  "bg-card text-card-foreground",
  "bg-foreground text-background shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--background)_16%,transparent)]",
  "bg-primary text-primary-foreground",
];
const clamp = (v: number) => Math.min(1, Math.max(0, v));

function Card({ card, i, n, progress, stage }: { card: PileCard; i: number; n: number; progress: MotionValue<number>; stage: string }) {
  const seg = 0.84 / n;
  const t = useTransform(progress, (p) => clamp((p - 0.04 - i * seg) / seg));
  const y = useTransform(t, (v) => `calc(${(1 - v) * 1.15} * ${stage} + ${OFF[i % OFF.length] * v}px)`);
  const rotate = useTransform(t, (v) => ROT[i % ROT.length] * v);
  return (
    <motion.article
      style={{ y, rotate, zIndex: i }}
      className={cn("absolute left-1/2 top-1/2 w-[min(88%,26rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 shadow-[0_30px_60px_-24px_rgb(0_0_0/0.45)]", SKIN[i % SKIN.length])}
    >
      <span className="absolute right-4 top-4 text-xs font-semibold tabular-nums opacity-60">{String(i + 1).padStart(2, "0")}</span>
      <h3 className="text-2xl font-medium tracking-tight">{card.title}</h3>
      <p className="mt-2 text-sm leading-relaxed opacity-75">{card.text}</p>
    </motion.article>
  );
}

/**
 * A heading on the left and a deck on the right. As you scroll, each card flies up from below and
 * lands on the pile with its own tilt. The section pins while the deck builds. Give it a
 * `scrollContainer` and a matching `stageHeight` when it lives inside a scrolling box.
 */
export function CardPile({
  title = "How we work with you.",
  accent = "you.",
  lead = "Having your vision in mind, we power it with creativity and passion so the outcome is valued at all ends.",
  cards = CARDS,
  scrollContainer,
  stageHeight = "100svh",
  className,
}: {
  title?: string;
  /** The ending of the title that is shown in the accent colour. */
  accent?: string;
  lead?: string;
  cards?: PileCard[];
  scrollContainer?: RefObject<HTMLElement | null>;
  stageHeight?: string;
  className?: string;
}) {
  const root = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: root, container: scrollContainer, offset: ["start start", "end end"] });
  const head = accent && title.endsWith(accent) ? title.slice(0, -accent.length) : title;
  const tail = accent && title.endsWith(accent) ? accent : "";
  return (
    <section ref={root} className={cn("relative bg-foreground text-background", className)} style={{ height: `calc(${stageHeight} * 2.6)` }}>
      <div className="sticky top-0 grid items-center gap-8 overflow-hidden px-[clamp(1rem,3.2vw,3rem)] md:grid-cols-2" style={{ height: stageHeight }}>
        <div>
          <h2 className="max-w-[10ch] text-[clamp(2rem,1rem+3.4vw,4.2rem)] font-medium leading-[1.04] tracking-[-0.035em]">
            {head}
            <span className="text-primary">{tail}</span>
          </h2>
          <p className="mt-5 max-w-[34ch] text-background/65">{lead}</p>
        </div>
        <div className="relative h-full min-h-[18rem]">
          {cards.map((c, i) => (
            <Card key={c.title} card={c} i={i} n={cards.length} progress={scrollYProgress} stage={stageHeight} />
          ))}
        </div>
      </div>
    </section>
  );
}
