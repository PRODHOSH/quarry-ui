"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Bot, Code2, Palette, Search, Smartphone, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type PathService = { words: [string, string]; icon: ReactNode; body: string; tags: string[] };

const SERVICES: PathService[] = [
  { words: ["Websites", "and apps"], icon: <Code2 />, body: "Fast, accessible sites and web apps, built to last and easy to change.", tags: ["Next.js", "React", "TypeScript"] },
  { words: ["Mobile", "apps"], icon: <Smartphone />, body: "One codebase for iOS and Android that feels native on both.", tags: ["React Native", "Expo"] },
  { words: ["AI", "features"], icon: <Bot />, body: "Chat, search and automation wired in where they actually help.", tags: ["LLMs", "RAG", "Agents"] },
  { words: ["Brand", "and design"], icon: <Palette />, body: "Logos, systems and interfaces with a point of view.", tags: ["Identity", "UI", "Prototypes"] },
  { words: ["Search", "and growth"], icon: <Search />, body: "Technical SEO and performance work that gets you found.", tags: ["SEO", "Analytics"] },
  { words: ["Custom", "software"], icon: <Sparkles />, body: "Internal tools and platforms that fit how your team works.", tags: ["Postgres", "APIs"] },
];

type V = { x: number; y: number };
const PW = 1440;
const SEG = 430;
const TOP = 300;
const lerp = (a: V, b: V, t: number): V => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
const bez = (p: V[], t: number): V => {
  const u = 1 - t;
  return { x: u ** 3 * p[0].x + 3 * u * u * t * p[1].x + 3 * u * t * t * p[2].x + t ** 3 * p[3].x, y: u ** 3 * p[0].y + 3 * u * u * t * p[1].y + 3 * u * t * t * p[2].y + t ** 3 * p[3].y };
};
const split = (p: V[], t: number): [V[], V[]] => {
  const a = lerp(p[0], p[1], t), b = lerp(p[1], p[2], t), c = lerp(p[2], p[3], t);
  const d = lerp(a, b, t), e = lerp(b, c, t), f = lerp(d, e, t);
  return [[p[0], a, d, f], [f, e, c, p[3]]];
};
const cub = (p: V[]) => ` C ${p[1].x} ${p[1].y} ${p[2].x} ${p[2].y} ${p[3].x} ${p[3].y}`;

/** A loop that leaves and rejoins the line with the same heading, so it never kinks. */
function loop(m: V, tx: number, ty: number, r: number, drift: number): V[] {
  const pts: V[] = [];
  for (let k = 1; k <= 90; k++) {
    const f = (k / 90) * Math.PI * 2;
    const fwd = (drift * k) / 90 + r * Math.sin(f);
    const side = r * (1 - Math.cos(f));
    pts.push({ x: m.x + tx * fwd + ty * side, y: m.y + ty * fwd - tx * side });
  }
  return pts;
}

function build(n: number) {
  const way = Array.from({ length: n }, (_, i) => ({ x: i % 2 ? 470 : 960, y: TOP + i * SEG }));
  const H = TOP + n * SEG;
  const start: V = { x: -140, y: 70 };
  let d = `M ${start.x} ${start.y}` + cub([start, { x: start.x + 360, y: start.y }, { x: way[0].x, y: way[0].y - 200 }, way[0]]);
  for (let i = 1; i < n; i++) {
    const a = way[i - 1], b = way[i], k = SEG * 0.64;
    const c: V[] = [a, { x: a.x, y: a.y + k }, { x: b.x, y: b.y - k }, b];
    if (i === 3 || i === 6) {
      const [l] = split(c, 0.36);
      const m = l[3], m2 = bez(c, 0.47);
      const dist = Math.hypot(m2.x - m.x, m2.y - m.y);
      d += cub(l) + loop(m, (m2.x - m.x) / dist, (m2.y - m.y) / dist, 84, dist).map((q) => ` L ${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join("");
      d += cub(split(c, 0.47)[1]);
    } else d += cub(c);
  }
  const last = way[n - 1], end: V = { x: PW + 200, y: H - 80 };
  d += cub([last, { x: last.x, y: last.y + 300 }, { x: end.x - 520, y: end.y }, end]);
  return { way, H, d };
}

function Title({ s }: { s: PathService }) {
  return (
    <h3 className="font-[family-name:var(--font-anton)] text-[clamp(2.2rem,5.4vw,5rem)] uppercase leading-[0.95]">
      {s.words[0]} <span className="mx-1 inline-grid size-[0.85em] -translate-y-[0.06em] -rotate-6 place-items-center rounded-[0.22em] bg-primary align-middle text-[0.5em] text-primary-foreground [&_svg]:size-[0.6em]">{s.icon}</span> {s.words[1]}
    </h3>
  );
}

function Bubble({ s, tilt }: { s: PathService; tilt: number }) {
  return (
    <div style={{ rotate: `${tilt}deg` }} className="mt-4 max-w-sm rounded-3xl border-2 border-foreground bg-card p-5 shadow-[5px_5px_0_0_var(--foreground)]">
      <p className="leading-relaxed">{s.body}</p>
      <ul className="mt-3.5 flex flex-wrap gap-1.5">{s.tags.map((t) => <li key={t} className="rounded-full border-2 border-foreground bg-accent px-3 py-0.5 text-xs font-semibold text-accent-foreground">{t}</li>)}</ul>
    </div>
  );
}

/**
 * Explain what you do with a line that draws itself down the page as you scroll. It winds from side
 * to side, throws in a loop-the-loop, and picks up one service at a time, popping each title and
 * card in as it arrives. On small screens it becomes a simple stack. Pass `container` when it sits
 * inside a scrolling box.
 */
export function ServicePath({ services = SERVICES, eyebrow = "Services, open for freelance", title = ["This is", "my thing"], lead = "Hire me for the whole thing or just the part you are stuck on. One person from first sketch to production, so nothing gets lost in handover.", container, className }: { services?: PathService[]; eyebrow?: string; title?: [string, string]; lead?: string; container?: RefObject<HTMLElement | null>; className?: string }) {
  const n = services.length;
  const { way, H, d } = useMemo(() => build(n), [n]);
  const scene = useRef<HTMLDivElement>(null);
  const ghost = useRef<SVGPathElement>(null);
  const pen = useRef<SVGGElement>(null);
  const [at, setAt] = useState<number[]>([]);
  const [len, setLen] = useState(0);
  const { scrollYProgress } = useScroll({ target: scene, container, offset: ["start 72%", "end 62%"] });

  // how far along the line each stop sits, found once by scanning the path
  useEffect(() => {
    const g = ghost.current;
    if (!g) return;
    const total = g.getTotalLength();
    setAt(way.map((w) => {
      let best = 0, bd = Infinity;
      for (let l = 0; l <= total; l += 6) {
        const p = g.getPointAtLength(l);
        const dd = (p.x - w.x) ** 2 + (p.y - w.y) ** 2;
        if (dd < bd) { bd = dd; best = l; }
      }
      return best;
    }));
  }, [way]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const g = ghost.current;
    if (!g) return;
    const l = Math.min(1, Math.max(0, p)) * g.getTotalLength();
    const pt = g.getPointAtLength(l);
    pen.current?.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
    setLen(l);
  });

  const head = (
    <header className="mx-auto max-w-4xl px-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">{eyebrow}</p>
      <h2 className="mt-4 font-[family-name:var(--font-anton)] text-[clamp(3rem,10vw,8rem)] uppercase leading-[0.92]"><span className="block">{title[0]}</span><span className="block text-primary">{title[1]}</span></h2>
      <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">{lead}</p>
    </header>
  );

  return (
    <section className={cn("w-full overflow-hidden py-16", className)}>
      {head}
      <div ref={scene} style={{ aspectRatio: `${PW} / ${H}` }} className="relative mx-auto mt-10 hidden w-full max-w-[90rem] md:block">
        <svg viewBox={`0 0 ${PW} ${H}`} className="absolute inset-0 size-full overflow-visible" aria-hidden>
          <path ref={ghost} d={d} fill="none" stroke="var(--accent)" strokeWidth="30" strokeLinecap="round" />
          <motion.path d={d} fill="none" stroke="var(--primary)" strokeWidth="30" strokeLinecap="round" style={{ pathLength: scrollYProgress }} />
          <g ref={pen} transform="translate(-140 70)"><circle r="26" fill="var(--foreground)" /><circle r="9" fill="var(--primary)" /></g>
        </svg>
        {services.map((s, i) => {
          const on = at.length > 0 && len >= at[i] - (i === 0 ? 900 : 300);
          const x = way[i].x === 960 ? 470 : 960;
          return (
            <motion.div key={s.words.join()} animate={on ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }} transition={{ type: "spring", stiffness: 160, damping: 18 }} style={{ left: `${(x / PW) * 100}%`, top: `${(way[i].y / H) * 100}%` }} className="absolute w-[34%] -translate-x-1/2 -translate-y-1/2">
              <Title s={s} />
              <Bubble s={s} tilt={i % 2 ? -3 : 3} />
            </motion.div>
          );
        })}
      </div>

      <ul className="mx-auto mt-10 grid max-w-xl gap-10 px-6 md:hidden">
        {services.map((s, i) => <li key={s.words.join()}><Title s={s} /><Bubble s={s} tilt={i % 2 ? -2 : 2} /></li>)}
      </ul>
    </section>
  );
}
