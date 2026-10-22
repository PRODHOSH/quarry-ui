"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Row = { eyebrow?: string; title: string; text: string; points?: string[]; link?: string; illustration?: ReactNode };

const ROWS: Row[] = [
  { eyebrow: "Plan", title: "Everything starts as a plain sentence", text: "Write what you want to happen. The rest of the team can read it, question it and build on it.", points: ["Docs and tasks in one place", "Comments that stay attached", "Nothing lost in chat"], link: "See planning" },
  { eyebrow: "Ship", title: "Release without the ceremony", text: "Small changes go out on their own. Bigger ones get a checklist, and the checklist runs itself.", points: ["One click previews", "Safe rollbacks", "Release notes written for you"], link: "See releases" },
  { eyebrow: "Learn", title: "Know what actually worked", text: "Simple numbers after every launch, so the next decision starts from evidence instead of opinion.", points: ["Weekly summary by email", "Compare any two releases", "Share a link, not a deck"], link: "See insights" },
];

function Placeholder({ i }: { i: number }) {
  return (
    <div className="grid size-full place-items-center p-8">
      <div className="w-full max-w-xs space-y-3">
        {[0, 1, 2].map((n) => (
          <div key={n} className={cn("flex items-center gap-3 rounded-xl border bg-card p-3", n === i % 3 && "border-foreground/30 shadow-sm")}>
            <span className={cn("size-8 rounded-lg", n === i % 3 ? "bg-primary" : "bg-muted")} />
            <span className="space-y-1.5"><span className="block h-2 w-24 rounded-full bg-foreground/70" /><span className="block h-1.5 w-16 rounded-full bg-muted-foreground/30" /></span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Alternating feature rows. Each row pairs copy, a short checklist and a link with an illustration,
 * and the sides swap down the page. Rows rise into view as you scroll. Pass an `illustration` per
 * row, or rely on the neutral placeholder.
 */
export function FeatureRows({ rows = ROWS, className }: { rows?: Row[]; className?: string }) {
  return (
    <section className={cn("mx-auto w-full max-w-6xl space-y-20 px-6 py-16 lg:space-y-28 lg:py-24", className)}>
      {rows.map((r, i) => {
        const flip = i % 2 === 1;
        return (
          <motion.div key={r.title} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
            <div className={cn(flip && "md:order-2")}>
              {r.eyebrow && (
                <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <span className="grid size-6 place-items-center rounded-full border text-xs tabular-nums">{i + 1}</span>
                  {r.eyebrow}
                </p>
              )}
              <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{r.title}</h2>
              <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">{r.text}</p>
              {r.points && (
                <ul className="mt-6 space-y-3">
                  {r.points.map((p) => (
                    <li key={p} className="flex items-center gap-3 text-sm">
                      <span className="grid size-5 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="size-3" strokeWidth={3} /></span>
                      {p}
                    </li>
                  ))}
                </ul>
              )}
              {r.link && (
                <a href="#" className="group mt-7 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline">
                  {r.link} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              )}
            </div>
            <div className={cn("relative aspect-[5/4] overflow-hidden rounded-[2rem] border bg-muted/60", flip && "md:order-1")}>
              <div aria-hidden className="absolute inset-0 [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:20px_20px]" />
              <div className="absolute inset-0 grid place-items-center p-6 [&_img]:max-h-full [&_img]:w-full [&_img]:object-contain [&_svg]:max-h-full">{r.illustration ?? <Placeholder i={i} />}</div>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
}
