"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { Heart, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type StackCard = { src: string; title: string; meta?: string };

const photo = (id: number) => `https://picsum.photos/id/${id}/700/900`;
const DEFAULT_CARDS: StackCard[] = [
  { src: photo(1015), title: "Fjord light", meta: "Norway · 3 nights" },
  { src: photo(1018), title: "High pasture", meta: "Switzerland · 5 nights" },
  { src: photo(1036), title: "First snow", meta: "Iceland · 4 nights" },
  { src: photo(1039), title: "Hidden falls", meta: "Canada · 6 nights" },
  { src: photo(1043), title: "Granite wall", meta: "California · 2 nights" },
];

function Top({ card, onSwipe }: { card: StackCard; onSwipe: () => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-14, 14]);
  const save = useTransform(x, [20, 120], [0, 1]);
  const skip = useTransform(x, [-120, -20], [1, 0]);
  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      style={{ x, rotate }}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 110 || Math.abs(info.velocity.x) > 600) onSwipe();
      }}
      initial={{ scale: 0.94, y: 18, opacity: 0.6 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ x: 420, opacity: 0, transition: { duration: 0.3 } }}
      className="absolute inset-0 cursor-grab overflow-hidden rounded-3xl border bg-card shadow-2xl active:cursor-grabbing"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={card.src} alt={card.title} draggable={false} className="size-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
      <motion.span style={{ opacity: save }} className="absolute left-5 top-5 -rotate-12 rounded-lg border-2 border-primary px-3 py-1 text-sm font-semibold uppercase tracking-widest text-primary">Save</motion.span>
      <motion.span style={{ opacity: skip }} className="absolute right-5 top-5 rotate-12 rounded-lg border-2 border-white px-3 py-1 text-sm font-semibold uppercase tracking-widest text-white">Skip</motion.span>
      <div className="absolute inset-x-5 bottom-5 text-white">
        <p className="text-2xl font-medium tracking-tight">{card.title}</p>
        {card.meta && <p className="mt-1 text-sm text-white/70">{card.meta}</p>}
      </div>
    </motion.div>
  );
}

/** A swipeable stack. Drag a card left to skip or right to save, or use the buttons under it. */
export function CardStack({ cards = DEFAULT_CARDS, className }: { cards?: StackCard[]; className?: string }) {
  const [i, setI] = useState(0);
  const done = i >= cards.length;
  const next = () => setI((v) => v + 1);
  const behind = cards.slice(i + 1, i + 3).reverse();

  return (
    <div className={cn("flex w-full flex-col items-center px-6 py-10", className)}>
      <div className="relative h-[24rem] w-[17rem] sm:h-[27rem] sm:w-[19rem]">
        {behind.map((c, k) => {
          const depth = behind.length - k;
          return (
            <div key={c.src} className="absolute inset-0 overflow-hidden rounded-3xl border bg-card" style={{ transform: `translateY(${depth * 12}px) scale(${1 - depth * 0.05})`, opacity: 1 - depth * 0.25 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.src} alt="" draggable={false} className="size-full object-cover brightness-75" />
            </div>
          );
        })}
        <AnimatePresence>{!done && <Top key={cards[i].src} card={cards[i]} onSwipe={next} />}</AnimatePresence>
        {done && (
          <div className="absolute inset-0 grid place-items-center rounded-3xl border border-dashed text-center">
            <div>
              <p className="text-lg font-medium">That is the stack</p>
              <button type="button" onClick={() => setI(0)} className="mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors hover:bg-accent">
                <RotateCcw className="size-4" /> Start again
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-10 flex items-center gap-4">
        <button type="button" aria-label="Skip" disabled={done} onClick={next} className="grid size-12 place-items-center rounded-full border bg-card transition-all hover:scale-105 hover:bg-accent disabled:opacity-30">
          <X className="size-5" />
        </button>
        <button type="button" aria-label="Save" disabled={done} onClick={next} className="grid size-14 place-items-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 disabled:opacity-30">
          <Heart className="size-5" />
        </button>
      </div>
    </div>
  );
}
