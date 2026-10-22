"use client";

import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type StackItem = { title: string; tags: string; text: string; image: string; href?: string };

const ITEMS: StackItem[] = [
  { title: "Harbor Coffee Roasters", tags: "Brand identity, Packaging", text: "A warm identity for a neighbourhood roastery, from the logo to the bag on the shelf.", image: "https://picsum.photos/id/1060/1000/760" },
  { title: "Fieldnotes Journal", tags: "Web design, Development", text: "A reading app for long form writing, built to stay quiet while you think.", image: "https://picsum.photos/id/1048/1000/760" },
  { title: "Tidewater Studio", tags: "Art direction, Photography", text: "Campaign imagery for a coastal furniture maker, shot over one very windy weekend.", image: "https://picsum.photos/id/1039/1000/760" },
];

/**
 * Project cards that stack like a deck of paper. Each card sticks near the top while the next one
 * slides up and over it, and the ones underneath shrink slightly so the pile has depth. Works with
 * the page scroll or inside any scrolling box, because it only uses CSS sticky.
 */
export function StickyStack({ items = ITEMS, offset = 24, top = 24, className }: { items?: StackItem[]; offset?: number; top?: number; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-5xl px-6 pb-24 pt-6", className)}>
      {items.map((it, i) => (
        <article
          key={it.title}
          style={{ top: top + i * offset }}
          className="sticky mb-8 grid gap-8 overflow-hidden rounded-[2rem] border bg-card p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.35)] md:grid-cols-2 md:p-10"
        >
          <div className="flex flex-col justify-center">
            <span className="text-sm tabular-nums text-muted-foreground">{String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight">{it.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{it.tags}</p>
            <p className="mt-5 max-w-sm leading-relaxed text-muted-foreground">{it.text}</p>
            <a href={it.href ?? "#"} className="group mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform active:scale-95">
              View project <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-2xl border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.image} alt="" loading="lazy" className="size-full object-cover" />
          </div>
        </article>
      ))}
    </div>
  );
}
