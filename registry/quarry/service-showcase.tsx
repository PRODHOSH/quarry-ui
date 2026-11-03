"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type ServiceRow = { title: string; text: string; items: string[]; /** A photo for the middle of the section. */ image?: string; art?: ReactNode; href?: string };

const ROWS: ServiceRow[] = [
  { title: "Brand identity", text: "A unique mark, a clear voice and stationery that tells your story.", items: ["Logo design", "Corporate identity", "Letterheads and envelopes", "Business cards"], image: "https://picsum.photos/id/20/1000/640" },
  { title: "Print and collateral", text: "Brochures, leaflets and printing that put your product in a hand.", items: ["Brochure design", "Leaflet design", "Offset and digital print", "Display stands"], image: "https://picsum.photos/id/24/1000/640" },
  { title: "Outdoor and signage", text: "Hoardings, banners and signs that follow your brand on the road.", items: ["Outdoor media", "Banner design", "Signage design", "LED and flex boards"], image: "https://picsum.photos/id/395/1000/640" },
  { title: "Web and digital", text: "Websites and research led marketing that grow revenue and reach.", items: ["Website design", "SEO and PPC", "Social media marketing", "Reputation management"], image: "https://picsum.photos/id/180/1000/640" },
];

function rng(seed: number) {
  let a = (seed * 2654435761) >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Generated art for a row: a gradient, a halftone field, a huge ring and some overlapping print dots. */
function RowArt({ seed }: { seed: number }) {
  const art = useMemo(() => {
    const r = rng(seed * 7 + 1);
    return {
      cx: 420 + r() * 480,
      cy: 150 + r() * 260,
      big: 380 + r() * 260,
      dots: Array.from({ length: 7 }, () => ({ x: r() * 1000, y: r() * 640, r: 20 + r() * 70, k: Math.floor(r() * 3) })),
    };
  }, [seed]);
  const id = `sa${seed}`;
  const tones = ["var(--primary)", "var(--background)", "var(--ring)"];
  return (
    <svg viewBox="0 0 1000 640" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden focusable="false">
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--ring)" }} />
          <stop offset="1" style={{ stopColor: "color-mix(in oklab, var(--ring) 45%, var(--foreground))" }} />
        </linearGradient>
        <pattern id={`${id}p`} width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="2" fill="#fff" />
        </pattern>
        <radialGradient id={`${id}m`} cx="0.75" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}k`}>
          <rect width="1000" height="640" fill={`url(#${id}m)`} />
        </mask>
      </defs>
      <rect width="1000" height="640" fill={`url(#${id}g)`} />
      <rect width="1000" height="640" fill={`url(#${id}p)`} opacity="0.2" mask={`url(#${id}k)`} />
      <circle cx={art.cx} cy={art.cy} r={art.big / 2} fill="none" stroke="#fff" strokeWidth="64" opacity="0.13" />
      {art.dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} style={{ fill: tones[d.k], mixBlendMode: "screen" }} opacity="0.26" />
      ))}
    </svg>
  );
}

function Visual({ row, seed }: { row: ServiceRow; seed: number }) {
  if (row.art) return <>{row.art}</>;
  if (row.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={row.image} alt="" draggable={false} className="size-full object-cover" />;
  }
  return <RowArt seed={seed} />;
}

/**
 * A services list with one sticky picture in the middle. The titles sit on the left and the details
 * on the right. As each row passes the middle of the screen the picture crossfades to match it and
 * the other rows dim. On a phone it becomes a simple stack. Give it a `scrollContainer` and a
 * matching `stageHeight` when it lives inside a scrolling box.
 */
export function ServiceShowcase({
  title = "What we do",
  rows = ROWS,
  scrollContainer,
  stageHeight = "100svh",
  className,
}: {
  title?: string;
  rows?: ServiceRow[];
  scrollContainer?: RefObject<HTMLElement | null>;
  stageHeight?: string;
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.row));
        });
      },
      { root: scrollContainer?.current ?? null, rootMargin: "-46% 0px -46% 0px" }
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [rows.length, scrollContainer]);

  return (
    <section className={cn("relative bg-foreground px-[clamp(1rem,3.2vw,3rem)] pb-[clamp(2rem,4vw,4rem)] pt-[clamp(3rem,6vw,6rem)] text-background", className)}>
      <h2 className="mb-[clamp(1.5rem,3vw,3rem)] text-center text-[clamp(2rem,1.1rem+3.4vw,4.2rem)] font-medium tracking-[-0.03em]">
        <span className="text-primary">{"{ "}</span>
        {title}
        <span className="text-primary">{" }"}</span>
      </h2>
      <div className="mx-auto grid max-w-[110rem] md:grid-cols-[1fr_minmax(0,1.25fr)_1fr] md:gap-8">
        <div className="hidden md:block">
          {rows.map((r, i) => (
            <div key={r.title} data-row={i} ref={(el) => void (refs.current[i] = el)} className="flex flex-col justify-center" style={{ minHeight: `calc(${stageHeight} * 0.62)` }}>
              <div className={cn("transition-opacity duration-500", i === active ? "opacity-100" : "opacity-30")}>
                <span className="text-xs font-semibold tabular-nums text-primary">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-[clamp(1.6rem,1rem+1.8vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.03em]">{r.title}</h3>
                <p className="mt-3 max-w-[30ch] text-background/65">{r.text}</p>
                <a href={r.href ?? "#"} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold underline underline-offset-4">
                  Explore <ArrowUpRight className="size-3.5 text-primary" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:block">
          <div className="sticky" style={{ top: `calc(${stageHeight} / 2 - 11rem)` }}>
            <div className="relative aspect-[10/6.4] w-full overflow-hidden rounded-2xl">
              {rows.map((r, i) => (
                <motion.div key={r.title} initial={false} animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1 : 1.07 }} transition={{ duration: 0.8, ease: "easeOut" }} className="absolute inset-0">
                  <Visual row={r} seed={i + 1} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          {rows.map((r, i) => (
            <div key={r.title} className="flex flex-col justify-center" style={{ minHeight: `calc(${stageHeight} * 0.62)` }}>
              <ul className={cn("space-y-2 text-sm text-background/70 transition-opacity duration-500", i === active ? "opacity-100" : "opacity-30")}>
                {r.items.map((it) => (
                  <li key={it} className="flex items-center gap-2.5">
                    <span className="size-1.5 rounded-full bg-primary" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="space-y-10 md:hidden">
          {rows.map((r, i) => (
            <div key={r.title}>
              <div className="aspect-[10/6.4] overflow-hidden rounded-2xl"><Visual row={r} seed={i + 1} /></div>
              <h3 className="mt-4 text-2xl font-medium tracking-tight">{r.title}</h3>
              <p className="mt-1.5 text-background/65">{r.text}</p>
              <ul className="mt-3 space-y-1.5 text-sm text-background/70">
                {r.items.map((it) => (
                  <li key={it} className="flex items-center gap-2.5">
                    <span className="size-1.5 rounded-full bg-primary" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
