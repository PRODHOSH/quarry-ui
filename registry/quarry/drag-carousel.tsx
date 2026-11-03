"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export type CarouselCard = { role: string; name: string; blurb?: string; art?: ReactNode; initial?: string };

const CARDS: CarouselCard[] = [
  { role: "Creative director", name: "Anika Rao", blurb: "Leads every brief from the first sketch to the final proof." },
  { role: "Brand designer", name: "Marcus Lee", blurb: "Turns a rough idea into an identity that holds up in print." },
  { role: "Web developer", name: "Priya Nair", blurb: "Builds fast, accessible sites that are easy to keep updated." },
  { role: "Print specialist", name: "Tomás Silva", blurb: "Knows every paper, finish and press in the shop." },
  { role: "Motion designer", name: "Hana Sato", blurb: "Adds movement where it explains something." },
  { role: "Account lead", name: "Daniel Okoye", blurb: "Keeps projects calm, clear and on time." },
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

/** Generated brand art: a halftone dot field, one huge ring and a few overlapping print dots. */
function Halftone({ seed }: { seed: number }) {
  const art = useMemo(() => {
    const r = rng(seed);
    return {
      cx: 220 + r() * 160,
      cy: 120 + r() * 120,
      big: 300 + r() * 180,
      dots: Array.from({ length: 6 }, () => ({ x: r() * 400, y: r() * 520, r: 14 + r() * 56, k: Math.floor(r() * 3) })),
    };
  }, [seed]);
  const id = `hd${seed}`;
  const tones = ["var(--ring)", "var(--primary)", "var(--foreground)"];
  return (
    <svg viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden focusable="false">
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--ring)" }} />
          <stop offset="1" style={{ stopColor: "color-mix(in oklab, var(--ring) 50%, var(--foreground))" }} />
        </linearGradient>
        <pattern id={`${id}p`} width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="7" cy="7" r="1.6" fill="#fff" />
        </pattern>
        <radialGradient id={`${id}m`} cx="0.8" cy="0.25" r="0.8">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}k`}>
          <rect width="400" height="520" fill={`url(#${id}m)`} />
        </mask>
      </defs>
      <rect width="400" height="520" fill={`url(#${id}g)`} />
      <rect width="400" height="520" fill={`url(#${id}p)`} opacity="0.2" mask={`url(#${id}k)`} />
      <circle cx={art.cx} cy={art.cy} r={art.big / 2} fill="none" stroke="#fff" strokeWidth="46" opacity="0.14" />
      {art.dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} style={{ fill: tones[d.k], mixBlendMode: "screen" }} opacity="0.3" />
      ))}
    </svg>
  );
}

/**
 * A row of tall portrait cards. With a mouse you drag the row and it glides on with inertia while a
 * round "Drag" chip follows the pointer. On touch screens it becomes a normal swipe carousel with
 * snap points, so vertical scrolling stays natural.
 */
export function DragCarousel({ cards = CARDS, chip = "Drag", className }: { cards?: CarouselCard[]; chip?: string; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [range, setRange] = useState(0);
  const [fine, setFine] = useState(false);
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const cx = useMotionValue(0);
  const cy = useMotionValue(0);
  const sx = useSpring(cx, { stiffness: 260, damping: 28 });
  const sy = useSpring(cy, { stiffness: 260, damping: 28 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setFine(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const measure = () => {
      if (wrap.current && track.current) setRange(Math.max(0, track.current.scrollWidth - wrap.current.clientWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    if (wrap.current) ro.observe(wrap.current);
    return () => ro.disconnect();
  }, [cards.length]);

  return (
    <div
      ref={wrap}
      onPointerMove={(e) => {
        const r = wrap.current!.getBoundingClientRect();
        cx.set(e.clientX - r.left);
        cy.set(e.clientY - r.top);
      }}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      className={cn("relative overflow-hidden", fine ? "cursor-none" : "overflow-x-auto snap-x snap-mandatory scrollbar-none", className)}
    >
      <motion.ul
        ref={track}
        drag={fine ? "x" : false}
        dragConstraints={{ left: -range, right: 0 }}
        dragElastic={0.12}
        dragTransition={{ power: 0.35, timeConstant: 260 }}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onDragEnd={() => setPressed(false)}
        className="flex w-max gap-4 px-[clamp(1rem,3.2vw,3rem)] py-2"
      >
        {cards.map((c, i) => (
          <li key={c.name} className="w-[clamp(15rem,24vw,20rem)] shrink-0 snap-start select-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-muted">
              <div className="pointer-events-none size-full">{c.art ?? <Halftone seed={i + 3} />}</div>
              <span aria-hidden className="pointer-events-none absolute bottom-3 left-4 text-[clamp(4rem,9vw,7rem)] font-semibold leading-none tracking-tighter text-white/25">
                {c.initial ?? c.name.charAt(0)}
              </span>
            </div>
            <div className="pt-3.5">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{c.role}</span>
              <b className="mt-1 block text-xl font-medium tracking-tight text-foreground">{c.name}</b>
              {c.blurb && <p className="mt-1 max-w-[30ch] text-sm leading-relaxed text-muted-foreground">{c.blurb}</p>}
            </div>
          </li>
        ))}
      </motion.ul>
      {fine && (
        <motion.div
          aria-hidden
          animate={{ opacity: hover ? 1 : 0, scale: hover ? (pressed ? 0.82 : 1) : 0.6 }}
          transition={{ duration: 0.25 }}
          style={{ x: sx, y: sy }}
          className="pointer-events-none absolute left-0 top-0 z-10 -ml-9 -mt-9 grid size-[4.5rem] place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-lg"
        >
          {chip}
        </motion.div>
      )}
    </div>
  );
}
