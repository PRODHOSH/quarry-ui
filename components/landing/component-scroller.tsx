"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ComponentCard } from "@/components/site/component-card";

type Item = { name: string; title: string; stage: "center" | "fill" };

/** Vertical scroll drives a horizontal walk through the library, pinned in place. */
export function ComponentScroller({ items, total }: { items: Item[]; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useSpring(useTransform(scrollYProgress, [0.04, 0.96], [0, -range]), { stiffness: 120, damping: 28, mass: 0.3 });
  const bar = useTransform(scrollYProgress, [0.04, 0.96], ["0%", "100%"]);
  const count = useTransform(scrollYProgress, [0.04, 0.96], [1, items.length]);
  const [shown, setShown] = useState(1);

  useEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setRange(Math.max(0, track.current.scrollWidth - window.innerWidth + 48));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [items.length]);

  useEffect(() => count.on("change", (v) => setShown(Math.max(1, Math.round(v)))), [count]);

  return (
    <div ref={ref} className="relative" style={{ height: `${Math.max(260, items.length * 24)}vh` }}>
      <div className="sticky top-16 flex h-[calc(100svh-4rem)] flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-8 flex w-full max-w-6xl items-end justify-between gap-6 px-6">
          <div>
            <h2 className="text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.03em] sm:text-5xl">
              {total} components, one scroll.
            </h2>
            <p className="mt-3 max-w-md text-base font-normal text-muted-foreground">
              Every card is the real component, running. Open one to preview, copy or install it.
            </p>
          </div>
          <Link href="/components" className="group hidden shrink-0 items-center gap-1.5 text-sm font-normal text-muted-foreground transition-colors hover:text-foreground sm:inline-flex">
            Browse them all
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <motion.div ref={track} style={{ x }} className="flex w-max gap-6 px-6 sm:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]">
          {items.map((item) => (
            <div key={item.name} className="w-[min(78vw,30rem)] shrink-0">
              <ComponentCard name={item.name} title={item.title} stage={item.stage} />
            </div>
          ))}
          <div className="grid w-[min(78vw,30rem)] shrink-0 place-items-center self-start rounded-xl border border-dashed text-center" style={{ aspectRatio: "16/10" }}>
            <div>
              <p className="text-xl font-semibold">Templates</p>
              <p className="mt-1 text-sm font-normal text-muted-foreground">Full pages, coming soon.</p>
            </div>
          </div>
        </motion.div>

        <div className="mx-auto mt-8 flex w-full max-w-6xl items-center gap-4 px-6">
          <span className="w-16 text-sm font-normal tabular-nums text-muted-foreground">
            {String(shown).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
          <div className="relative h-px flex-1 bg-border">
            <motion.span className="absolute inset-y-0 left-0 bg-foreground" style={{ width: bar }} />
          </div>
        </div>
      </div>
    </div>
  );
}
