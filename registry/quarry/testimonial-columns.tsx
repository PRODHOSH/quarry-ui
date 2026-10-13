"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Review = { name: string; handle: string; text: string };

const REVIEWS: Review[] = [
  { name: "Amara Okafor", handle: "Design lead", text: "We replaced three internal libraries with this. Everything just lines up." },
  { name: "Jonas Weber", handle: "Indie maker", text: "Shipped my landing page in an afternoon and it feels hand built." },
  { name: "Priya Nair", handle: "Staff engineer", text: "The motion is restrained, which is exactly why it feels expensive." },
  { name: "Tomás Rivera", handle: "Founder", text: "Our conversion rate went up the week we swapped our pricing section." },
  { name: "Lena Fischer", handle: "Product designer", text: "Finally a kit that respects my tokens instead of fighting them." },
  { name: "Kenji Mori", handle: "Frontend developer", text: "Copy, paste, done. I read the source and it was genuinely tidy." },
  { name: "Sofia Marin", handle: "Creative director", text: "Clients keep asking which agency built our site. It was a Friday." },
  { name: "Daniel Osei", handle: "CTO", text: "Accessible by default. That alone saved us a sprint of fixes." },
  { name: "Mei Lin", handle: "Engineering manager", text: "New hires are productive on day one because the code is predictable." },
];

function Card({ r }: { r: Review }) {
  return (
    <figure className="rounded-2xl border bg-card p-5 transition-colors hover:border-foreground/25">
      <div className="mb-3 flex gap-0.5 text-primary">
        {Array.from({ length: 5 }).map((_, n) => <Star key={n} className="size-3.5 fill-current" />)}
      </div>
      <blockquote className="text-sm leading-relaxed text-card-foreground">{r.text}</blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        <span className={"grid size-8 place-items-center rounded-full bg-muted text-xs font-semibold text-foreground"}>
          {r.name.split(" ").map((w) => w[0]).join("")}
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-medium">{r.name}</span>
          <span className="block text-xs text-muted-foreground">{r.handle}</span>
        </span>
      </figcaption>
    </figure>
  );
}

function Column({ items, duration, reverse, className }: { items: Review[]; duration: number; reverse?: boolean; className?: string }) {
  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        animate={{ y: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        className="flex flex-col gap-4 pb-4 hover:[animation-play-state:paused]"
      >
        {[...items, ...items].map((r, i) => <Card key={i} r={r} />)}
      </motion.div>
    </div>
  );
}

/**
 * A wall of reviews in three vertical columns that drift at different speeds and directions,
 * faded at the top and bottom edges.
 */
export function TestimonialColumns({ reviews = REVIEWS, className }: { reviews?: Review[]; className?: string }) {
  const third = Math.ceil(reviews.length / 3);
  const cols = [reviews.slice(0, third), reviews.slice(third, third * 2), reviews.slice(third * 2)];
  return (
    <section className={cn("w-full px-6 py-10", className)}>
      <div className="mx-auto mb-8 max-w-lg text-center">
        <p className="text-sm font-medium text-primary">Wall of love</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Teams ship faster with it</h2>
      </div>
      <div className="mx-auto grid h-[26rem] max-w-5xl gap-4 [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)] sm:grid-cols-2 lg:grid-cols-3">
        <Column items={cols[0]} duration={38} />
        <Column items={cols[1]} duration={46} reverse className="hidden sm:block" />
        <Column items={cols[2]} duration={42} className="hidden lg:block" />
      </div>
    </section>
  );
}
