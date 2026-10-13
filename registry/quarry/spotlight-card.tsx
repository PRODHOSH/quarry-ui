"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { Boxes, Gauge, Lock, Workflow } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { icon: ReactNode; title: string; text: string };

const ITEMS: Item[] = [
  { icon: <Gauge />, title: "Fast by default", text: "Server friendly code with nothing blocking the first paint." },
  { icon: <Lock />, title: "Private", text: "Your data stays in your region and under your keys." },
  { icon: <Workflow />, title: "Composable", text: "Small parts that fit together however you need them to." },
  { icon: <Boxes />, title: "Portable", text: "Plain files you own. No lock in, no runtime to ship." },
];

/**
 * A grid of cards that share one pointer spotlight. Each card receives the pointer position in its
 * own coordinates, so the glow flows across borders and surfaces as if the grid were one sheet.
 */
export function SpotlightCard({ items = ITEMS, className }: { items?: Item[]; className?: string }) {
  const grid = useRef<HTMLDivElement>(null);

  const move = (e: React.PointerEvent) => {
    grid.current?.querySelectorAll<HTMLElement>("[data-spot]").forEach((el) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
      el.style.setProperty("--on", "1");
    });
  };
  const leave = () =>
    grid.current?.querySelectorAll<HTMLElement>("[data-spot]").forEach((el) => el.style.setProperty("--on", "0"));

  return (
    <div ref={grid} onPointerMove={move} onPointerLeave={leave} className={cn("mx-auto grid w-full max-w-3xl gap-4 sm:grid-cols-2", className)}>
      {items.map((it) => (
        <div
          key={it.title}
          data-spot
          style={{ "--mx": "-999px", "--my": "-999px", "--on": "0" } as CSSProperties}
          className="group relative overflow-hidden rounded-2xl border bg-card p-6"
        >
          {/* surface glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              opacity: "var(--on)",
              background: "radial-gradient(280px circle at var(--mx) var(--my), color-mix(in oklab, var(--primary) 16%, transparent), transparent 70%)",
            }}
          />
          {/* border glow: a bright ring masked to the 1px edge */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl p-px transition-opacity duration-300"
            style={{
              opacity: "var(--on)",
              background: "radial-gradient(200px circle at var(--mx) var(--my), var(--primary), transparent 70%)",
              WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
            }}
          />
          <div className="relative">
            <div className="grid size-10 place-items-center rounded-xl border bg-background [&_svg]:size-5">{it.icon}</div>
            <h3 className="mt-5 text-base font-semibold tracking-tight">{it.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{it.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
