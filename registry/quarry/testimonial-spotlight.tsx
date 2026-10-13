"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Person = { name: string; role: string; company: string; quote: string };

const PEOPLE: Person[] = [
  { name: "Ava Lindqvist", role: "Head of Design", company: "Fjord", quote: "It gave our small team the polish of a studio ten times our size, and we kept full control of the code." },
  { name: "Marcus Bell", role: "Founder", company: "Tidewater", quote: "I stopped worrying about the front end. Every section looked considered the moment I pasted it in." },
  { name: "Noor Haddad", role: "Engineering Lead", company: "Parallel", quote: "The accessibility and the motion are both right. That combination is rarer than it should be." },
  { name: "Hiro Tanaka", role: "Product Manager", company: "Lumen", quote: "We went from a rough prototype to a launch-ready page in two days, and nobody could tell it was fast." },
];

/**
 * One large quote at a time. Pick a person from the avatar row and the quote crossfades with a
 * small blur and slide, while a shared outline glides to the active avatar.
 */
export function TestimonialSpotlight({ people = PEOPLE, className }: { people?: Person[]; className?: string }) {
  const [i, setI] = useState(0);
  const p = people[i];

  return (
    <section className={cn("mx-auto w-full max-w-2xl px-6 py-10 text-center", className)}>
      <div className="relative min-h-[11rem]">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={i}
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
            transition={{ duration: 0.32 }}
            className="text-balance text-2xl font-medium leading-snug tracking-tight sm:text-3xl"
          >
            “{p.quote}”
          </motion.blockquote>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2" role="tablist">
          {people.map((q, n) => (
            <button
              key={q.name}
              role="tab"
              aria-selected={n === i}
              aria-label={q.name}
              onClick={() => setI(n)}
              className="relative grid size-12 place-items-center rounded-full"
            >
              {n === i && (
                <motion.span layoutId="spot-ring" transition={{ type: "spring", stiffness: 420, damping: 32 }} className="absolute inset-0 rounded-full border-2 border-primary" />
              )}
              <span className={cn("grid size-9 place-items-center rounded-full text-xs font-semibold transition-colors", n === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                {q.name.split(" ").map((w) => w[0]).join("")}
              </span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="text-sm">
            <span className="font-medium">{p.name}</span>
            <span className="text-muted-foreground"> · {p.role}, {p.company}</span>
          </motion.p>
        </AnimatePresence>
      </div>
    </section>
  );
}
