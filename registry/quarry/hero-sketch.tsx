"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Card = { title: string; text: string; href?: string };

const CARDS: Card[] = [
  { title: "Selected work", text: "A few projects I am proud of." },
  { title: "How I work", text: "From first sketch to launch." },
  { title: "Say hello", text: "Open for new projects this autumn." },
];
const PILLS = [
  { label: "Brand design", cls: "left-[3%] top-[26%] -rotate-12" },
  { label: "Web development", cls: "right-[3%] top-[56%] rotate-[12deg]" },
];

/**
 * A friendly, hand made feeling hero. The headline has a round blob dropped into the sentence,
 * two tags float and bob at the sides, and three cards tilt in underneath, then straighten as you
 * hover. Good for portfolios and personal sites. Everything is a prop.
 */
export function HeroSketch({
  greeting = "Hello",
  name = "I am Sam Rivera,",
  role = "a product designer.",
  text = "I design calm, useful software for small teams, and I like to explain how things work along the way.",
  cards = CARDS,
  className,
}: {
  greeting?: string;
  name?: string;
  role?: string;
  text?: string;
  cards?: Card[];
  className?: string;
}) {
  return (
    <section className={cn("relative w-full overflow-hidden px-4 pb-20 pt-24 text-center", className)}>
      {PILLS.map((p, i) => (
        <motion.span
          key={p.label}
          className={cn("absolute hidden rounded-full border-2 border-foreground bg-accent px-4 py-1.5 text-sm font-medium shadow-[3px_3px_0_0_var(--foreground)] xl:block", p.cls)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
          transition={{ opacity: { delay: 0.5 + i * 0.2 }, scale: { delay: 0.5 + i * 0.2 }, y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: i } }}
        >
          {p.label}
        </motion.span>
      ))}

      <div className="mx-auto max-w-4xl">
        <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="text-balance text-5xl font-medium leading-[1.06] tracking-tight sm:text-7xl">
          {greeting}<span className="italic">!</span>{" "}
          <motion.span aria-hidden animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="mx-1 inline-block size-12 translate-y-1.5 rounded-full border-2 border-foreground bg-primary align-middle sm:size-16" />{" "}
          {name}
          <br />
          {role}
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35, duration: 0.8 }} className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">{text}</motion.p>
      </div>

      <div className="mx-auto mt-14 grid max-w-4xl gap-4 md:grid-cols-3">
        {cards.map((c, i) => (
          <motion.a
            key={c.title}
            href={c.href ?? "#"}
            initial={{ opacity: 0, y: 36, rotate: i === 1 ? 0 : i === 0 ? -2.5 : 2.5 }}
            animate={{ opacity: 1, y: 0, rotate: i === 1 ? 0 : i === 0 ? -2.5 : 2.5 }}
            transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
            whileHover={{ y: -6, rotate: 0 }}
            className="group flex flex-col items-center rounded-2xl border-2 border-foreground bg-card px-6 py-7 shadow-[4px_4px_0_0_var(--foreground)]"
          >
            <h3 className="text-lg font-semibold">{c.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{c.text}</p>
            <span className="mt-5 grid h-8 w-11 place-items-center rounded-full border-2 border-foreground bg-primary text-primary-foreground transition-transform group-hover:translate-x-1"><ArrowRight className="size-4" /></span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
