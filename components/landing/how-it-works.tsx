"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Check, Copy } from "lucide-react";
import AntigravityIcon from "@thesvg/react/google-antigravity";
import { Mark } from "@/components/site/mark";
import { AGENT_ICONS } from "@/components/site/agent-icons";

/**
 * The stroke that follows scroll progress is adapted from Skiper UI's "Svg follow scroll"
 * (skiper19, by @gxuri, https://skiper-ui.com). Like the original it starts half drawn, sits behind the
 * headline and keeps drawing down the page. Each card is placed against a measured point on the path
 * (x, y in the path's own coordinates, f = how far along the line that point is).
 */
const PATH =
  "M876.605 394.131C788.982 335.917 696.198 358.139 691.836 416.303C685.453 501.424 853.722 498.43 941.95 409.714C1016.1 335.156 1008.64 186.907 906.167 142.846C807.014 100.212 712.699 198.494 789.049 245.127C889.053 306.207 986.062 116.979 840.548 43.3233C743.932 -5.58141 678.027 57.1682 672.279 112.188C666.53 167.208 712.538 172.943 736.353 163.088C760.167 153.234 764.14 120.924 746.651 93.3868C717.461 47.4252 638.894 77.8642 601.018 116.979C568.164 150.908 557 201.079 576.467 246.924C593.342 286.664 630.24 310.55 671.68 302.614C756.114 286.446 729.747 206.546 681.86 186.442C630.54 164.898 492 209.318 495.026 287.644C496.837 334.494 518.402 366.466 582.455 367.287C680.013 368.538 771.538 299.456 898.634 292.434C1007.02 286.446 1192.67 309.384 1242.36 382.258C1266.99 418.39 1273.65 443.108 1247.75 474.477C1217.32 511.33 1149.4 511.259 1096.84 466.093C1044.29 420.928 1029.14 380.576 1033.97 324.172C1038.31 273.428 1069.55 228.986 1117.2 216.384C1152.2 207.128 1188.29 213.629 1194.45 245.127C1201.49 281.062 1132.22 280.104 1100.44 272.673C1065.32 264.464 1044.22 234.837 1032.77 201.413C1019.29 162.061 1029.71 131.126 1056.44 100.965C1086.19 67.4032 1143.96 54.5526 1175.78 86.1513C1207.02 117.17 1186.81 143.379 1156.22 166.691C1112.57 199.959 1052.57 186.238 999.784 155.164C957.312 130.164 899.171 63.7054 931.284 26.3214C952.068 2.12513 996.288 3.87363 1007.22 43.58C1018.15 83.2749 1003.56 122.644 975.969 163.376C948.377 204.107 907.272 255.122 913.558 321.045C919.727 385.734 990.968 497.068 1063.84 503.35C1111.46 507.456 1166.79 511.984 1175.68 464.527C1191.52 379.956 1101.26 334.985 1030.29 377.017C971.109 412.064 956.297 483.647 953.797 561.655C947.587 755.413 1197.56 941.828 936.039 1140.66C745.771 1285.32 321.926 950.737 134.536 1202.19C-6.68295 1391.68 -53.4837 1655.38 131.935 1760.5C478.381 1956.91 1124.19 1515 1201.28 1997.83C1273.66 2451.23 100.805 1864.7 303.794 2668.89";
const VIEW = { x: -60, w: 1400, h: 2700 };

const AGENTS = [
  { label: "Claude Code", icon: AGENT_ICONS["claude-code"]("size-5") },
  { label: "Cursor", icon: AGENT_ICONS["cursor"]("size-5") },
  { label: "Antigravity", icon: <AntigravityIcon className="size-5" /> },
  { label: "Codex", icon: AGENT_ICONS["codex"]("size-5") },
];

const STEPS = [
  {
    y: 950,
    x: 1055,
    f: 0.607,
    side: "left" as const,
    n: "01",
    where: "On the component page",
    title: "Copy the prompt",
    body: "Open any component, pick your AI tool and copy. The prompt carries the install command, how to use it and the rules about your theme.",
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
    y: 1400,
    x: 30,
    f: 0.726,
    side: "right" as const,
    n: "02",
    where: "In your AI tool",
    title: "Paste it into your agent",
    body: "Claude Code, Cursor, Antigravity, Codex. Anything that can read your project and run a command.",
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
    y: 1850,
    x: 1142,
    f: 0.859,
    side: "left" as const,
    n: "03",
    where: "In your terminal",
    title: "It installs itself",
    body: "The agent runs the shadcn CLI, adds the file to your repo and wires it into your page. Nothing to copy by hand.",
    visual: (
      <div className="rounded-lg border bg-background px-4 py-3 font-mono text-xs leading-relaxed text-muted-foreground">
        <span className="text-foreground">$</span> npx shadcn add feature-bento
        <br />
        <span className="text-foreground">✓</span> components/quarry/feature-bento.tsx
      </div>
    ),
  },
  {
    y: 2300,
    x: 353,
    f: 0.964,
    side: "right" as const,
    n: "04",
    where: "In your app",
    title: "Ship it",
    body: "It reads your own tokens, so it matches your colors and dark mode from the first render. Type checked, nothing left to fix.",
    visual: (
      <ul className="space-y-2 text-sm">
        {["Themed from your tokens", "Type checked", "Yours to edit"].map((t) => (
          <li key={t} className="flex items-center gap-2.5 rounded-lg border bg-background px-3 py-2.5">
            <Check className="size-4 text-brand" /> {t}
          </li>
        ))}
      </ul>
    ),
  },
];


const pct = (x: number) => ((x - VIEW.x) / VIEW.w) * 100;

function Node({ x, y, f, line }: { x: number; y: number; f: number; line: MotionValue<number> }) {
  const lit = useTransform(line, (v) => (v >= f ? 1 : 0));
  return (
    <g>
      <circle cx={x} cy={y} r={16} fill="var(--background)" stroke="var(--border)" strokeWidth={6} />
      <motion.circle cx={x} cy={y} r={16} fill="var(--brand)" style={{ opacity: lit }} />
    </g>
  );
}

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const basePath = useRef<SVGPathElement>(null);
  // Running maximum of the path's y at evenly spaced lengths: "how much line is needed to reach this height?"
  // keeps the tip near the reading line while the line draws at an even pace.
  const reach = useRef<number[]>([]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.6", "end 0.6"] });

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
    scrollYProgress.set(scrollYProgress.get());
  }, [scrollYProgress]);

  // Starts half drawn, like the original, then follows the scroll with no smoothing.
  const pathLength = useTransform(scrollYProgress, (p) => {
    const table = reach.current;
    if (!table.length) return 0.5 + 0.5 * Math.min(1, Math.max(0, p));
    const y = p * VIEW.h;
    let lo = 0;
    let hi = table.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (table[mid] >= y) hi = mid;
      else lo = mid + 1;
    }
    return Math.max(0.5, lo / (table.length - 1));
  });

  return (
    <div className="mx-auto max-w-6xl px-6">
      <div ref={ref} className="relative flex flex-col gap-6 md:block md:aspect-[1400/2700] md:gap-0">
        <svg
          aria-hidden
          viewBox={`${VIEW.x} 0 ${VIEW.w} ${VIEW.h}`}
          fill="none"
          className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible md:block"
        >
          <path ref={basePath} d={PATH} stroke="var(--border)" strokeOpacity={0.7} strokeWidth={12} strokeLinecap="round" />
          <motion.path d={PATH} stroke="var(--brand)" strokeOpacity={0.4} strokeWidth={12} strokeLinecap="round" style={{ pathLength }} />
          {STEPS.map((s) => (
            <Node key={s.n} x={s.x} y={s.y} f={s.f} line={pathLength} />
          ))}
        </svg>

        <div className="relative z-10 text-center md:absolute md:inset-x-0 md:top-[2.5%]">
          <p className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            How it works
          </p>
          <h2 className="mt-5 text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-7xl lg:text-[7rem]">
            From prompt
            <br />
            to production
            <br />
            in <Mark>four steps.</Mark>
          </h2>
        </div>

        {STEPS.map((s) => (
          <div
            key={s.n}
            className="relative z-10 md:absolute md:w-[36%] md:-translate-y-1/2"
            style={{
              top: `${(s.y / VIEW.h) * 100}%`,
              ...(s.side === "left" ? { right: `calc(${100 - pct(s.x)}% + 2.75rem)` } : { left: `calc(${pct(s.x)}% + 2.75rem)` }),
            }}
          >
            <motion.article
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
              className="rounded-2xl border bg-card p-6 md:p-7"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-full bg-brand/15 text-sm font-medium tabular-nums text-[#8fb0ff]">{s.n}</span>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">{s.title}</h3>
                  <p className="text-xs text-muted-foreground">{s.where}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              <div className="mt-5">{s.visual}</div>
            </motion.article>
          </div>
        ))}
      </div>
    </div>
  );
}
