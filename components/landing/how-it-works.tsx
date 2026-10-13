"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Check, Copy } from "lucide-react";
import AntigravityIcon from "@thesvg/react/google-antigravity";
import { AGENT_ICONS } from "@/components/site/agent-icons";

/**
 * The stroke that follows scroll progress is adapted from Skiper UI's "Svg follow scroll"
 * (skiper19, by @gxuri, https://skiper-ui.com). Rebuilt here with Quarry's tokens and type.
 */
/** Weaves between the cards: calm S-curves, so the length drawn tracks the scroll evenly. */
const PATH =
  "M500 0 C500 130 430 110 430 230 C430 470 570 470 570 710 C570 950 430 950 430 1190 C430 1430 570 1430 570 1670 C570 1800 500 1830 500 2000";
const NODES = [
  { x: 430, y: 230 },
  { x: 570, y: 710 },
  { x: 430, y: 1190 },
  { x: 570, y: 1670 },
];

type Step = { n: string; title: string; body: string; top: string; side: "left" | "right"; visual: React.ReactNode };

const AGENTS = [
  { label: "Claude Code", icon: AGENT_ICONS["claude-code"]("size-5") },
  { label: "Cursor", icon: AGENT_ICONS["cursor"]("size-5") },
  { label: "Antigravity", icon: <AntigravityIcon className="size-5" /> },
  { label: "Codex", icon: AGENT_ICONS["codex"]("size-5") },
];

const STEPS: Step[] = [
  {
    n: "01",
    title: "Copy the prompt",
    body: "Open any component, pick your AI tool and copy. The prompt carries the install command, usage and the rules about your theme.",
    top: "3%",
    side: "left",
    visual: (
      <div className="flex items-center justify-between rounded-lg border bg-background px-4 py-3 text-sm">
        <span className="flex items-center gap-2.5">
          <Image src="/brand/mark.png" alt="" width={607} height={674} className="h-5 w-auto" />
          Feature Bento Grid
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
          <Copy className="size-3" /> Copy prompt
        </span>
      </div>
    ),
  },
  {
    n: "02",
    title: "Paste it into your agent",
    body: "Claude Code, Cursor, Antigravity, Codex. Anything that can read your project and run a command.",
    top: "27%",
    side: "right",
    visual: (
      <ul className="grid grid-cols-2 gap-2">
        {AGENTS.map((a) => (
          <li key={a.label} className="flex items-center gap-2.5 rounded-lg border bg-background px-3 py-2.5 text-sm">
            {a.icon}
            {a.label}
          </li>
        ))}
      </ul>
    ),
  },
  {
    n: "03",
    title: "It installs itself",
    body: "The agent runs the shadcn CLI, adds the file to your repo and wires it into your page. No copy and paste by hand.",
    top: "51%",
    side: "left",
    visual: (
      <div className="rounded-lg border bg-background px-4 py-3 font-mono text-xs leading-relaxed text-muted-foreground">
        <span className="text-foreground">$</span> npx shadcn add feature-bento
        <br />
        <span className="text-foreground">✓</span> components/quarry/feature-bento.tsx
      </div>
    ),
  },
  {
    n: "04",
    title: "Ship it",
    body: "It reads your own tokens, so it matches your colors and dark mode from the first render. Type checked, nothing left to fix.",
    top: "75%",
    side: "right",
    visual: (
      <ul className="space-y-2 text-sm">
        {["Themed from your tokens", "Type checked", "Yours to edit"].map((t) => (
          <li key={t} className="flex items-center gap-2.5 rounded-lg border bg-background px-3 py-2.5">
            <Check className="size-4" /> {t}
          </li>
        ))}
      </ul>
    ),
  },
];

const VIEW_H = 2000;

const STEP_SIDES = ["left", "right", "left", "right"] as const;
const WORDS = ["Copy.", "Paste.", "Install.", "Ship."];

/** A big outlined word on the empty side. It fills with colour as the line reaches its step. */
function Word({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const start = NODES[i].y - 330;
  const t = useTransform(progress, (p) => Math.min(1, Math.max(0, (p * VIEW_H - start) / 230)));
  const fill = useTransform(progress, (p) => (p * VIEW_H >= NODES[i].y ? 1 : 0));
  const x = useTransform(t, (v) => (1 - v) * (STEP_SIDES[i] === "left" ? 28 : -28));
  return (
    <motion.div style={{ opacity: t, x }} className="select-none">
      <span className="text-sm font-medium tabular-nums text-muted-foreground">0{i + 1} / 04</span>
      <div className="relative mt-2 text-[clamp(3.5rem,8vw,6.5rem)] font-semibold leading-none tracking-[-0.05em]">
        <span className="block text-transparent [-webkit-text-stroke:1.5px_var(--border)]">{WORDS[i]}</span>
        <motion.span aria-hidden style={{ opacity: fill }} className="absolute inset-0 block text-brand transition-opacity duration-500">
          {WORDS[i]}
        </motion.span>
      </div>
    </motion.div>
  );
}

function Node({ x, y, progress }: { x: number; y: number; progress: MotionValue<number> }) {
  const lit = useTransform(progress, (p) => (p * VIEW_H >= y ? 1 : 0));
  const stub = x < 500 ? [x - 30, x] : [x, x + 30];
  return (
    <g>
      <line x1={stub[0]} x2={stub[1]} y1={y} y2={y} stroke="var(--border)" strokeWidth={3} />
      <circle cx={x} cy={y} r={9} fill="var(--background)" stroke="var(--border)" strokeWidth={3} />
      <motion.circle cx={x} cy={y} r={9} fill="var(--brand)" style={{ opacity: lit }} />
    </g>
  );
}

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const basePath = useRef<SVGPathElement>(null);
  // Running maximum of the path's y at evenly spaced lengths: lets us ask "how much of the line
  // is needed to reach this height?" so the tip stays at the reading line, loops included.
  const reach = useRef<number[]>([]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.62", "end 0.62"] });

  useEffect(() => {
    const el = basePath.current;
    if (!el) return;
    const total = el.getTotalLength();
    const n = 800;
    let max = 0;
    reach.current = Array.from({ length: n + 1 }, (_, i) => {
      max = Math.max(max, el.getPointAtLength((i / n) * total).y);
      return max;
    });
    // nudge so the table is used immediately
    scrollYProgress.set(scrollYProgress.get());
  }, [scrollYProgress]);

  const tip = useRef<SVGGElement>(null);
  const total = useRef(0);
  useEffect(() => {
    if (basePath.current) total.current = basePath.current.getTotalLength();
  }, []);

  // No spring: the line is bound directly to scroll.
  const pathLength = useTransform(scrollYProgress, (p) => {
    const table = reach.current;
    if (!table.length) return Math.min(1, Math.max(0, p));
    const y = p * VIEW_H;
    if (y <= table[0]) return 0;
    let lo = 0;
    let hi = table.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (table[mid] >= y) hi = mid;
      else lo = mid + 1;
    }
    return lo / (table.length - 1);
  });

  // A bead rides the tip of the line, so the eye can follow it down the page.
  useMotionValueEvent(pathLength, "change", (v) => {
    const el = basePath.current;
    const g = tip.current;
    if (!el || !g || !total.current) return;
    const pt = el.getPointAtLength(v * total.current);
    g.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
    g.style.opacity = v > 0.002 && v < 0.998 ? "1" : "0";
  });

  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.03em] sm:text-6xl">
          From prompt to production in four steps.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-base text-muted-foreground">Scroll. The line follows you down.</p>
      </div>

      <div ref={ref} className="relative mt-16 flex flex-col gap-6 md:mt-24 md:block md:aspect-[1/2] md:gap-0">
        <svg aria-hidden viewBox="0 0 1000 2000" fill="none" className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible md:block">
          <path ref={basePath} d={PATH} stroke="var(--border)" strokeWidth={3} strokeLinecap="round" />
          <motion.path d={PATH} stroke="var(--brand)" strokeWidth={3} strokeLinecap="round" style={{ pathLength }} />
          {NODES.map((n) => (
            <Node key={n.y} {...n} progress={scrollYProgress} />
          ))}
          <g ref={tip} style={{ opacity: 0 }}>
            <circle r={22} fill="var(--brand)" opacity={0.18} />
            <circle r={7} fill="var(--brand)" />
            <circle r={7} fill="none" stroke="#fff" strokeWidth={2} opacity={0.9} />
          </g>
        </svg>

        {STEPS.map((s, i) => (
          <div key={`word-${s.n}`} className={`hidden md:absolute md:flex md:w-[40%] md:items-center md:min-h-[17%] ${s.side === "left" ? "md:right-0" : "md:left-0"}`} style={{ top: s.top }}>
            <Word i={i} progress={scrollYProgress} />
          </div>
        ))}

        {STEPS.map((s) => (
          <motion.article
            key={s.n}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className={`relative z-10 rounded-2xl border bg-card p-7 md:absolute md:w-[40%] ${s.side === "left" ? "md:left-0" : "md:right-0"}`}
            style={{ top: s.top }}
          >
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-full bg-brand/15 text-sm font-medium tabular-nums text-[#8fb0ff]">{s.n}</span>
              <h3 className="text-xl font-semibold tracking-tight">{s.title}</h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            <div className="mt-5">{s.visual}</div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
