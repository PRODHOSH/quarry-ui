"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type FanCard = { art?: ReactNode; seed?: number; mood?: "dawn" | "dusk" | "night" | "noon" };

const PALETTES = {
  dawn: { sky: ["#0b2b22", "#1f6b4b", "#bdd88a", "#f4c789"], sun: "#fff3c4", ridges: ["#7fb58a", "#58a06f", "#3a8460", "#216049", "#0f4130", "#062b1e"] },
  noon: { sky: ["#0f4a52", "#2f9a86", "#a7dfc0", "#eaf6cf"], sun: "#ffffff", ridges: ["#8ccaa0", "#5fb184", "#3d9468", "#237153", "#124d39", "#07301f"] },
  night: { sky: ["#030d11", "#0a2a30", "#14564f", "#2c8a6f"], sun: "#dcefe6", ridges: ["#2b6f60", "#1e5a4d", "#134738", "#0c3529", "#06241b", "#03150f"] },
  dusk: { sky: ["#1a1420", "#6b3a3a", "#e0805a", "#ffd08a"], sun: "#fff0c8", ridges: ["#9b6a55", "#7a5a4c", "#4f4a3c", "#2f3a2c", "#18281d", "#0a1710"] },
};
const MOODS = ["dawn", "dusk", "night", "noon", "dawn", "dusk", "noon"] as const;

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

/** A small generated landscape: sky, a sun and layered hills with tree lines. */
function Landscape({ seed, mood }: { seed: number; mood: keyof typeof PALETTES }) {
  const W = 400;
  const H = 520;
  const id = `fh${seed}${mood}`;
  const p = PALETTES[mood];
  const art = useMemo(() => {
    const r = rng(seed);
    const sunX = 90 + r() * 220;
    const sunY = 170 + r() * 50;
    const ridges = p.ridges.map((color, i) => {
      const base = 250 + i * 52;
      const amp = 34 - i * 3;
      const ph = [r() * 6, r() * 6];
      const fq = [1 + r(), 2.6 + r() * 1.5];
      const fn = (x: number) => base - amp * (0.6 * Math.sin((x / W) * fq[0] * Math.PI + ph[0]) + 0.35 * Math.sin((x / W) * fq[1] * Math.PI + ph[1]));
      let d = `M-10 ${H + 10} L-10 ${fn(-10).toFixed(1)}`;
      for (let x = 0; x <= W + 10; x += 10) d += ` L${x} ${fn(x).toFixed(1)}`;
      d += ` L${W + 10} ${H + 10} Z`;
      let trees = "";
      if (i >= 1) {
        const scale = 0.5 + i * 0.22;
        for (let x = -5; x < W + 10; x += 9 + r() * (16 - i)) {
          const h = (20 + r() * 26) * scale;
          const w = h * 0.3;
          const y = fn(x) + 4;
          trees += `M${x.toFixed(1)} ${(y - h).toFixed(1)}L${(x + w).toFixed(1)} ${y.toFixed(1)}L${(x - w).toFixed(1)} ${y.toFixed(1)}Z`;
        }
      }
      return { d, trees, color, shade: p.ridges[Math.min(i + 1, 5)] };
    });
    return { sunX, sunY, ridges };
  }, [seed, p]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden focusable="false">
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          {p.sky.map((c, i) => <stop key={i} offset={[0, 0.42, 0.78, 1][i]} stopColor={c} />)}
        </linearGradient>
        <radialGradient id={`${id}g`} cx={art.sunX / W} cy={art.sunY / H} r="0.5">
          <stop offset="0" stopColor={p.sun} stopOpacity="0.85" />
          <stop offset="0.4" stopColor={p.sun} stopOpacity="0.2" />
          <stop offset="1" stopColor={p.sun} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}s)`} />
      <rect width={W} height={H} fill={`url(#${id}g)`} />
      <circle cx={art.sunX} cy={art.sunY} r="30" fill={p.sun} opacity="0.92" />
      {art.ridges.map((r, i) => (
        <g key={i}>
          <path d={r.d} fill={r.color} />
          {r.trees && <path d={r.trees} fill={r.shade} />}
        </g>
      ))}
    </svg>
  );
}

/**
 * A hero where a spread of picture cards fans out on an arc above the headline. They rise into
 * place one after another, then keep bobbing slowly out of step with each other. Pass your own
 * cards (any node, such as a photo) or let it draw its own landscapes.
 */
export function FanHero({
  cards = MOODS.map((mood, i) => ({ seed: i + 3, mood })),
  title = "Integrated solutions for planetary repair.",
  lead = "We join field work and open data so every project can be checked, from the first seed to the last tonne.",
  cta = { label: "See how it works", href: "#" },
  spread = 62,
  className,
}: {
  cards?: FanCard[];
  title?: string;
  lead?: string;
  cta?: { label: string; href: string };
  /** Half the angle of the arc, in degrees. */
  spread?: number;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0, t: 0 });

  useEffect(() => {
    const el = host.current!;
    const tx = text.current!;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight, t: tx.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(tx);
    return () => ro.disconnect();
  }, []);

  const narrow = size.w < 760;
  const shown = narrow ? cards.filter((_, i) => i % 2 === 0 || i === cards.length - 1).slice(0, 5) : cards;
  const n = shown.length;
  // The cards live in the space above the text block, so they can never sit on top of the title.
  const pad = Math.max(24, size.h * 0.05);
  const zone = Math.max(110, size.h - size.t - pad * 2 - 12);
  const cw = Math.max(70, Math.min(size.w * 0.15, zone * 0.52, 190));
  const ch = cw * 1.28;
  const rad = (spread * Math.PI) / 180;
  const Ry = Math.max(0, (zone - ch * 1.12) / Math.max(0.2, 1 - Math.cos(rad)));
  const Rx = Math.min(size.w * 0.4, size.w / 2 - cw * 0.95);

  return (
    <section ref={host} className={cn("relative isolate flex min-h-[34rem] w-full flex-col items-center justify-end overflow-hidden bg-background px-[clamp(1rem,3.2vw,3rem)] pb-[clamp(2rem,5vw,4.5rem)] text-center", className)}>
      {size.w > 0 && (
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0" style={{ height: zone + pad }}>
          {shown.map((c, i) => {
            const th = n > 1 ? -spread + (i / (n - 1)) * spread * 2 : 0;
            const r = (th * Math.PI) / 180;
            const x = size.w / 2 + Rx * Math.sin(r);
            const y = pad + ch / 2 + Ry * (1 - Math.cos(r));
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.6, y: y + 90, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, y, rotate: th * 0.9 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.07 }}
                className="absolute left-0 top-0"
                style={{ x: x - cw / 2, width: cw, height: ch, marginTop: -ch / 2 }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 1.6 + Math.abs(i - (n - 1) / 2) * 0.35 }}
                  className="size-full overflow-hidden rounded-[1.1rem] shadow-[0_24px_50px_-18px_rgb(0_0_0/0.45)] ring-1 ring-foreground/10"
                >
                  {c.art ?? <Landscape seed={c.seed ?? i + 1} mood={c.mood ?? "dawn"} />}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      )}
      <div ref={text} className="relative z-10">
        <h1 className="mx-auto max-w-[16ch] text-balance text-[clamp(2.1rem,1rem+4.2vw,4.8rem)] font-medium leading-[1.02] tracking-[-0.035em] text-foreground">{title}</h1>
        <p className="mx-auto mt-5 max-w-[46ch] text-[clamp(1rem,0.95rem+0.4vw,1.25rem)] leading-relaxed text-muted-foreground">{lead}</p>
        <a href={cta.href} className="mt-7 inline-flex h-11 items-center gap-2.5 rounded-xl bg-foreground pl-4 pr-2 text-sm font-semibold text-background transition-transform active:scale-95">
          {cta.label}
          <span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground"><ArrowUpRight className="size-3.5" /></span>
        </a>
      </div>
    </section>
  );
}
