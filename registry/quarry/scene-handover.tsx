"use client";

import { useMemo, useRef, type ReactNode, type RefObject } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type Panel = { kicker: string; title: string; accent: string; text: string; caption?: string; cta?: string; mood?: Mood; seed?: number; art?: ReactNode; accentColor?: string };
type Mood = "dawn" | "dusk" | "night" | "noon" | "tide";

const PALETTES: Record<Mood, { sky: string[]; sun: string; ridges: string[] }> = {
  dawn: { sky: ["#0b2b22", "#1f6b4b", "#bdd88a", "#f4c789"], sun: "#fff3c4", ridges: ["#7fb58a", "#58a06f", "#3a8460", "#216049", "#0f4130", "#062b1e"] },
  noon: { sky: ["#0f4a52", "#2f9a86", "#a7dfc0", "#eaf6cf"], sun: "#ffffff", ridges: ["#8ccaa0", "#5fb184", "#3d9468", "#237153", "#124d39", "#07301f"] },
  night: { sky: ["#030d11", "#0a2a30", "#14564f", "#2c8a6f"], sun: "#dcefe6", ridges: ["#2b6f60", "#1e5a4d", "#134738", "#0c3529", "#06241b", "#03150f"] },
  dusk: { sky: ["#0b1c33", "#3a4f7a", "#e27d7b", "#ffd1a1"], sun: "#fff1d6", ridges: ["#d68a88", "#a3607a", "#6a4b78", "#3d3b6e", "#1c2a55", "#0b1c33"] },
  tide: { sky: ["#04303a", "#0e7b80", "#8fd6cc", "#f2f0c4"], sun: "#fffbe0", ridges: ["#6cc8c0", "#2fb0a8", "#1b8e92", "#0f6c76", "#074b57", "#04303a"] },
};

const DEFAULT_PANELS: Panel[] = [
  { kicker: "01 / 02", title: "Highlands", accent: "Highlands", text: "Slow growth, steady shade and a canopy you can check from space.", caption: "Restored land, checked from orbit.", cta: "See more", mood: "dawn", seed: 4 },
  { kicker: "02 / 02", title: "Coastline", accent: "Coastline", text: "Mangroves and seagrass that protect the shore and the people who live on it.", caption: "Measured by the tonne, not the tree.", cta: "See more", mood: "dusk", seed: 9, accentColor: "var(--primary)" },
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

/** A generated landscape with a sun, six layered ridges and tree lines on the nearer ones. */
function Landscape({ seed, mood }: { seed: number; mood: Mood }) {
  const W = 1600;
  const H = 900;
  const p = PALETTES[mood];
  const id = `sh${seed}${mood}`;
  const art = useMemo(() => {
    const r = rng(seed);
    const sunX = 380 + r() * 840;
    const sunY = 300 + r() * 110;
    const bases = [480, 560, 640, 722, 800, 900];
    const amps = [70, 64, 58, 52, 44, 34];
    const ridges = p.ridges.map((color, i) => {
      const ph = [r() * 6, r() * 6, r() * 6];
      const fq = [1 + r(), 2.4 + r() * 1.5, 5 + r() * 3];
      const rough = 0.1 + i * 0.03;
      const fn = (x: number) => bases[i] - amps[i] * (0.55 * Math.sin((x / W) * fq[0] * Math.PI + ph[0]) + 0.3 * Math.sin((x / W) * fq[1] * Math.PI + ph[1]) + rough * Math.sin((x / W) * fq[2] * Math.PI + ph[2]));
      let d = `M-40 ${H + 40} L-40 ${fn(-40).toFixed(1)}`;
      for (let x = -20; x <= W + 40; x += 20) d += ` L${x} ${fn(x).toFixed(1)}`;
      d += ` L${W + 40} ${H + 40} Z`;
      let trees = "";
      if (i >= 1 && mood !== "tide") {
        const scale = 0.55 + i * 0.28;
        for (let x = -20; x < W + 40; x += 16 + r() * (30 - i * 3)) {
          const h = (34 + r() * 46) * scale;
          const w = h * 0.28;
          const y = fn(x) + 6;
          trees += `M${x.toFixed(1)} ${(y - h).toFixed(1)}L${(x + w * 0.45).toFixed(1)} ${(y - h * 0.58).toFixed(1)}L${(x + w * 0.22).toFixed(1)} ${(y - h * 0.58).toFixed(1)}L${(x + w * 0.7).toFixed(1)} ${(y - h * 0.25).toFixed(1)}L${(x + w).toFixed(1)} ${y.toFixed(1)}L${(x - w).toFixed(1)} ${y.toFixed(1)}L${(x - w * 0.7).toFixed(1)} ${(y - h * 0.25).toFixed(1)}L${(x - w * 0.22).toFixed(1)} ${(y - h * 0.58).toFixed(1)}L${(x - w * 0.45).toFixed(1)} ${(y - h * 0.58).toFixed(1)}Z`;
        }
      }
      return { d, trees, color, shade: p.ridges[Math.min(i + 1, 5)], i };
    });
    return { sunX, sunY, ridges };
  }, [seed, mood, p]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden focusable="false">
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          {p.sky.map((c, i) => <stop key={i} offset={[0, 0.42, 0.78, 1][i]} stopColor={c} />)}
        </linearGradient>
        <radialGradient id={`${id}g`} cx={art.sunX / W} cy={art.sunY / H} r="0.45">
          <stop offset="0" stopColor={p.sun} stopOpacity="0.85" />
          <stop offset="0.35" stopColor={p.sun} stopOpacity="0.22" />
          <stop offset="1" stopColor={p.sun} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}s)`} />
      <rect width={W} height={H} fill={`url(#${id}g)`} />
      <circle cx={art.sunX} cy={art.sunY} r="64" fill={p.sun} opacity="0.92" />
      {art.ridges.map((r) => (
        <g key={r.i}>
          <path d={r.d} fill={r.color} />
          {r.trees && <path d={r.trees} fill={r.shade} />}
          {r.i < 5 && <rect x="-40" y={[480, 560, 640, 722, 800][r.i] - 70} width={W + 80} height="200" fill={`url(#${id}f)`} opacity={0.5 - r.i * 0.07} />}
        </g>
      ))}
    </svg>
  );
}

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const INTRO = 0.2;

function PanelLayer({ panel, i, n, progress }: { panel: Panel; i: number; n: number; progress: MotionValue<number> }) {
  const seg = (1 - INTRO - 0.12) / Math.max(1, n - 1);
  const start = INTRO + 0.04 + (i - 1) * seg;
  const enter = useTransform(progress, (p) => (i === 0 ? 1 : clamp((p - start) / seg)));
  const leaveStart = INTRO + 0.04 + i * seg;
  const leave = useTransform(progress, (p) => (i === n - 1 ? 0 : clamp((p - leaveStart) / seg)));
  const clip = useTransform(enter, (v) => (i === 0 ? "inset(0% 0% 0% 0%)" : `inset(${(1 - v) * 100}% 0% 0% 0%)`));
  const intro = useTransform(progress, (p) => clamp(p / INTRO));
  const frame = useTransform(intro, (v) => (i === 0 ? `inset(${(1 - v) * 14}% ${(1 - v) * 7}% ${(1 - v) * 14}% ${(1 - v) * 7}% round ${(1 - v) * 28}px)` : "none"));
  const cardY = useTransform([enter, leave], ([e, l]) => `${(1 - (e as number)) * 125 - (l as number) * 125}%`);
  const cardOpacity = useTransform(intro, (v) => (i === 0 ? clamp((v - 0.45) / 0.55) : 1));
  const zoom = useTransform(progress, (p) => 1 + 0.07 * clamp((p - start + seg) / (2 * seg)));
  const cap = useTransform([enter, leave], ([e, l]) => clamp((e as number) * 1.6 - 0.6) * (1 - clamp((l as number) * 3)));
  const mood = panel.mood ?? "dawn";
  return (
    <motion.div style={{ clipPath: clip, zIndex: i }} className="absolute inset-0">
      <motion.div style={{ clipPath: frame }} className="absolute inset-0">
        <motion.div style={{ scale: zoom }} className="size-full origin-center">
          {panel.art ?? <Landscape seed={panel.seed ?? i + 2} mood={mood} />}
        </motion.div>
      </motion.div>
      <motion.article
        style={{ y: cardY, opacity: cardOpacity }}
        className="absolute left-1/2 top-1/2 w-[min(82%,21rem)] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-card/95 p-5 text-center text-card-foreground shadow-[0_30px_70px_-30px_rgb(0_0_0/0.6)] backdrop-blur"
      >
        <p className="text-[0.7rem] font-semibold tracking-[0.14em] text-muted-foreground">{panel.kicker}</p>
        <h3 className="mt-1.5 text-[clamp(1.4rem,1rem+1.2vw,2.2rem)] font-medium leading-none tracking-[-0.03em]">
          {panel.title.replace(panel.accent, "").trim() && <span>{panel.title.replace(panel.accent, "").trim()} </span>}
          <span style={{ color: panel.accentColor ?? "var(--ring)" }}>{panel.accent}</span>
        </h3>
        <div className="my-3.5 aspect-[16/9] overflow-hidden rounded-xl">{panel.art ?? <Landscape seed={(panel.seed ?? i + 2) + 11} mood={mood} />}</div>
        <p className="text-[0.82rem] leading-snug text-muted-foreground">{panel.text}</p>
        {panel.cta && (
          <a href="#" className="mt-3 inline-flex items-center gap-1 text-sm font-medium underline underline-offset-4">
            {panel.cta} <ArrowUpRight className="size-3.5 text-primary" />
          </a>
        )}
      </motion.article>
      {panel.caption && (
        <motion.p style={{ opacity: cap }} className={cn("absolute bottom-6 max-w-[16ch] text-[0.7rem] font-semibold uppercase leading-snug tracking-[0.12em] text-white/85", i % 2 ? "right-6 text-right" : "left-6")}>
          {panel.caption}
        </motion.p>
      )}
    </motion.div>
  );
}

/**
 * A pinned scene sequence. A framed landscape grows to fill the screen while a card rises over it.
 * Keep scrolling and the card lifts away while the next landscape wipes up from below with its own
 * card. Landscapes are generated, so there are no photos to host. Use `scrollContainer` and a
 * matching `stageHeight` when it lives inside a scrolling box.
 */
export function SceneHandover({
  panels = DEFAULT_PANELS,
  scrollContainer,
  stageHeight = "100svh",
  className,
}: {
  panels?: Panel[];
  scrollContainer?: RefObject<HTMLElement | null>;
  stageHeight?: string;
  className?: string;
}) {
  const root = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: root, container: scrollContainer, offset: ["start start", "end end"] });
  return (
    <section ref={root} className={cn("relative bg-background", className)} style={{ height: `calc(${stageHeight} * ${1.8 + panels.length * 0.9})` }}>
      <div className="sticky top-0 overflow-hidden" style={{ height: stageHeight }}>
        {panels.map((p, i) => (
          <PanelLayer key={p.title} panel={p} i={i} n={panels.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
