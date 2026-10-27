"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RGB = [number, number, number];
type Ctx = CanvasRenderingContext2D;

const W = 1944;
const H = 1760;
/** One full loop in seconds. Every motion has a whole number of cycles per loop, so it repeats without a seam. */
const T = 24.5;
const TAU = Math.PI * 2;
const w = TAU / T;
const CW = 16;
const CH = 22;
const COLS = Math.ceil(W / CW);
const ROWS = Math.ceil(H / CH);
const SS = 4;

const hash = (a: number, b: number, c: number) => {
  const h = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453;
  return h - Math.floor(h);
};
const mix = (a: number[], b: number[], k: number): RGB => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const rgb = (c: number[], a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const lum = (c: number[]) => (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255;

// Sunlit shallows top left, deeper blue bottom right.
const STOPS: [number, RGB][] = [[0, [178, 244, 232]], [0.42, [74, 214, 214]], [0.78, [26, 168, 202]], [1, [14, 128, 182]]];
const water = (x: number, y: number): RGB => {
  const k = Math.min(1, Math.max(0, (x * 0.45 + y * 0.9) / (W * 0.45 + H * 0.9)));
  for (let i = 1; i < STOPS.length; i++) if (k <= STOPS[i][0]) return mix(STOPS[i - 1][1], STOPS[i][1], (k - STOPS[i - 1][0]) / (STOPS[i][0] - STOPS[i - 1][0]));
  return STOPS[3][1];
};

const ell = (g: Ctx, x: number, y: number, rx: number, ry: number, rot: number, fill: string | CanvasGradient) => {
  g.beginPath();
  g.ellipse(x, y, rx, ry, rot || 0, 0, TAU);
  g.fillStyle = fill;
  g.fill();
};

// ---------- creatures, drawn in local pixels facing +x ----------
function turtle(g: Ctx, t: number, ph: number) {
  const f = Math.sin((TAU * 14 * t) / T + ph);
  for (const m of [-1, 1]) {
    g.save();
    g.translate(62, 58 * m);
    g.rotate(m * (1.15 + 0.55 * f));
    ell(g, 0, 78 * m, 26, 92, 0, "#9c8a5c");
    ell(g, 0, 70 * m, 14, 70, 0, "#c2b183");
    g.restore();
    g.save();
    g.translate(-92, 40 * m);
    g.rotate(m * (2.2 - 0.3 * f));
    ell(g, 0, 26 * m, 15, 34, 0, "#9c8a5c");
    g.restore();
  }
  ell(g, 118, 0, 30, 24, 0, "#a39060");
  ell(g, 150, 0, 34, 27, 0, "#b8a573");
  ell(g, 146, -10, 7, 5, 0, "#4b3f22");
  ell(g, 146, 10, 7, 5, 0, "#4b3f22");
  ell(g, 0, 0, 132, 100, 0, "#c9b067");
  const sh = g.createRadialGradient(-10, 0, 10, 0, 0, 125);
  sh.addColorStop(0, "#7d6a2e");
  sh.addColorStop(0.7, "#5e5022");
  sh.addColorStop(1, "#3f3616");
  ell(g, 0, 0, 120, 90, 0, sh);
  g.fillStyle = "#b39a4a";
  for (const [x, y, r] of [[60, 0, 26], [12, 0, 30], [-38, 0, 28], [-80, 0, 20], [40, -50, 22], [-8, -56, 24], [-56, -46, 20], [40, 50, 22], [-8, 56, 24], [-56, 46, 20]]) {
    g.beginPath();
    for (let k = 0; k < 6; k++) g.lineTo(x + r * Math.cos((k * TAU) / 6), y + r * 0.8 * Math.sin((k * TAU) / 6));
    g.fill();
  }
  g.fillStyle = "#e0c56a";
  for (const [x, y] of [[60, 0], [12, 0], [-38, 0], [-8, -56], [-8, 56]]) {
    g.beginPath();
    g.arc(x, y, 8, 0, TAU);
    g.fill();
  }
}

function manta(g: Ctx, t: number) {
  const f = Math.sin((TAU * 10 * t) / T);
  const span = 300 + 22 * f;
  const back = -40 - 30 * f;
  g.beginPath();
  g.moveTo(-110, 0);
  g.lineTo(-330, 4 * f);
  g.lineWidth = 7;
  g.strokeStyle = "#1c2733";
  g.stroke();
  g.beginPath();
  g.moveTo(96, -42);
  g.quadraticCurveTo(40, -span * 0.75, back, -span);
  g.quadraticCurveTo(-60, -110, -118, -26);
  g.lineTo(-118, 26);
  g.quadraticCurveTo(-60, 110, back, span);
  g.quadraticCurveTo(40, span * 0.75, 96, 42);
  g.closePath();
  g.fillStyle = "#1e2b3a";
  g.fill();
  for (const m of [-1, 1]) {
    ell(g, 120, 40 * m, 34, 12, 0.35 * m, "#26364a");
    ell(g, 18, 82 * m, 70, 30, -0.5 * m, "#e9eef0");
    ell(g, -10, 150 * m, 40, 18, -0.6 * m, "#8fa3b0");
  }
}

function dolphin(g: Ctx, t: number, ph: number) {
  const b = 0.22 * Math.sin((TAU * 60 * t) / T + ph);
  g.save();
  g.translate(-30, 0);
  g.rotate(b);
  g.beginPath();
  g.moveTo(10, -44);
  g.quadraticCurveTo(-90, -24, -150, -9);
  g.lineTo(-150, 9);
  g.quadraticCurveTo(-90, 24, 10, 44);
  g.fillStyle = "#5c6d7c";
  g.fill();
  g.translate(-150, 0);
  g.rotate(b * 1.4);
  g.beginPath();
  g.moveTo(0, 0);
  g.quadraticCurveTo(-20, -60, -52, -66);
  g.quadraticCurveTo(-30, -20, -40, 0);
  g.quadraticCurveTo(-30, 20, -52, 66);
  g.quadraticCurveTo(-20, 60, 0, 0);
  g.fillStyle = "#4b5a68";
  g.fill();
  g.restore();
  for (const m of [-1, 1]) ell(g, 40, 48 * m, 44, 13, -0.75 * m, "#6f8190");
  g.beginPath();
  g.moveTo(-40, -44);
  g.quadraticCurveTo(40, -58, 150, -18);
  g.lineTo(200, -4);
  g.lineTo(200, 4);
  g.lineTo(150, 18);
  g.quadraticCurveTo(40, 58, -40, 44);
  g.fillStyle = "#8a9cab";
  g.fill();
  ell(g, 20, 0, 120, 22, 0, "#43515e");
}

function tang(g: Ctx, t: number, ph: number) {
  const b = 0.35 * Math.sin((TAU * 110 * t) / T + ph);
  g.save();
  g.translate(-30, 0);
  g.rotate(b);
  g.beginPath();
  g.moveTo(0, 0);
  g.lineTo(-34, -20);
  g.lineTo(-28, 0);
  g.lineTo(-34, 20);
  g.closePath();
  g.fillStyle = "#f2c200";
  g.fill();
  g.restore();
  ell(g, 8, 0, 46, 15, 0, "#ffd61f");
  ell(g, 40, 0, 12, 9, 0, "#ffe46a");
}

function whale(g: Ctx, t: number) {
  const b = 0.16 * Math.sin((TAU * 8 * t) / T);
  g.save();
  g.translate(-260, 0);
  g.rotate(b);
  g.beginPath();
  g.moveTo(40, -70);
  g.quadraticCurveTo(-120, -30, -260, -14);
  g.lineTo(-260, 14);
  g.quadraticCurveTo(-120, 30, 40, 70);
  g.fillStyle = "#2b3d52";
  g.fill();
  g.translate(-260, 0);
  g.rotate(b * 1.5);
  g.beginPath();
  g.moveTo(0, 0);
  g.quadraticCurveTo(-30, -110, -90, -130);
  g.quadraticCurveTo(-60, -40, -70, 0);
  g.quadraticCurveTo(-60, 40, -90, 130);
  g.quadraticCurveTo(-30, 110, 0, 0);
  g.fillStyle = "#dfe7ea";
  g.fill();
  g.restore();
  const fl = 0.15 * Math.sin((TAU * 8 * t) / T + 1);
  for (const m of [-1, 1]) {
    g.save();
    g.translate(150, 95 * m);
    g.rotate(m > 0 ? 0.6 + fl : Math.PI - 0.6 - fl);
    ell(g, 0, 120, 30, 125, 0, "#e6eef0");
    g.restore();
  }
  g.beginPath();
  g.moveTo(330, 0);
  g.quadraticCurveTo(300, -110, 100, -130);
  g.quadraticCurveTo(-120, -110, -260, -70);
  g.lineTo(-260, 70);
  g.quadraticCurveTo(-120, 110, 100, 130);
  g.quadraticCurveTo(300, 110, 330, 0);
  g.fillStyle = "#33475e";
  g.fill();
  g.fillStyle = "#596f86";
  for (let k = 0; k < 7; k++) {
    g.beginPath();
    g.arc(300 - k * 30, 0, 7, 0, TAU);
    g.fill();
  }
  g.beginPath();
  g.moveTo(-60, -10);
  g.quadraticCurveTo(-90, 0, -60, 10);
  g.fillStyle = "#1e2d3e";
  g.fill();
}

function hibiscus(g: Ctx, s: number) {
  for (let k = 0; k < 5; k++) {
    g.save();
    g.rotate((k * TAU) / 5);
    ell(g, 52 * s, 0, 52 * s, 40 * s, 0, "#ef3b5a");
    ell(g, 40 * s, 0, 30 * s, 22 * s, 0, "#d42448");
    g.restore();
  }
  ell(g, 0, 0, 22 * s, 22 * s, 0, "#8a0f2e");
  g.save();
  g.rotate(0.6);
  ell(g, 44 * s, 0, 40 * s, 5 * s, 0, "#ffd84a");
  ell(g, 84 * s, 0, 10 * s, 10 * s, 0, "#ffe27a");
  g.restore();
}

function plumeria(g: Ctx, s: number) {
  for (let k = 0; k < 5; k++) {
    g.save();
    g.rotate((k * TAU) / 5);
    ell(g, 36 * s, 12 * s, 40 * s, 24 * s, 0.35, "#fffaf0");
    g.restore();
  }
  const c = g.createRadialGradient(0, 0, 2, 0, 0, 34 * s);
  c.addColorStop(0, "#ffb800");
  c.addColorStop(1, "rgba(255,214,90,0)");
  ell(g, 0, 0, 34 * s, 34 * s, 0, c);
}

// ---------- paths: closed curves with whole harmonics of T ----------
type Path = (t: number) => [number, number];
const P: Record<string, Path> = {
  turtleA: (t) => [972 + 1080 * Math.cos(w * t + 0.3), 860 + 640 * Math.sin(w * t + 0.3) + 140 * Math.sin(2 * w * t)],
  turtleB: (t) => [900 + 700 * Math.sin(-w * t + 1), 880 - 1080 * Math.cos(-w * t + 1)],
  turtleC: (t) => [972 + 1150 * Math.sin(w * t + 4), 900 + 560 * Math.sin(2 * w * t + 4.6)],
  manta: (t) => [972 + 1380 * Math.cos(-w * t + 3.6), 820 + 900 * Math.sin(-w * t + 3.6)],
  dolphin: (t) => [972 + 1350 * Math.cos(2 * w * t + 0.8), 900 + 950 * Math.sin(2 * w * t + 0.8) + 160 * Math.sin(4 * w * t)],
  school: (t) => [972 + 1150 * Math.sin(2 * w * t + 5), 880 + 800 * Math.sin(3 * w * t + 1)],
  whale: (t) => [972 + 1900 * Math.cos(w * t + 2.4), 1350 + 380 * Math.sin(w * t + 2.4)],
};
const pose = (fn: Path, t: number): [number, number, number] => {
  const [x, y] = fn(t);
  const [x2, y2] = fn(t + 0.02);
  return [x, y, Math.atan2(y2 - y, x2 - x)];
};
const FISH: [number, number][] = [[0, 0], [-120, -70], [-120, 75], [-240, -10], [-230, -140], [-235, 130], [-360, -75], [-355, 70], [-470, 5], [-480, -150], [-470, 150]];
const FLOWERS: ["h" | "p", number, number, number, number][] = [["h", 0.0, 260, 1.0, 1], ["p", 0.22, 1240, 0.9, -1], ["h", 0.47, 640, 0.8, -1], ["p", 0.63, 1560, 1.1, 1], ["p", 0.86, 120, 0.8, 1]];

const RAMP = "8%XSSt%t;:";
const EDGE = "',.o:;";
const SPRINK = ["#ff5fa2", "#16c79a", "#8b6cff", "#ffb000"];
const STILL_AT = 7;

/**
 * A top down Hawaiian lagoon drawn as ASCII cells. Turtles, a manta, dolphins, a school of yellow tangs, a humpback
 * and drifting hibiscus and plumeria swim over a reef, with sun bands and caustics on the water. It is a pure function
 * of time, so the 24.5 second loop is seamless. Put your content in as children and it sits on a frosted patch.
 */
export function AsciiLagoon({
  speed = 1,
  glyphs = true,
  frost = true,
  paused = false,
  children,
  className,
}: {
  /** Playback speed. Can be changed live without a jump. */
  speed?: number;
  /** Draw a character on every cell. Off leaves plain coloured cells. */
  glyphs?: boolean;
  /** Blur and brighten the water behind the children. */
  frost?: boolean;
  /** Hold the current frame. */
  paused?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const live = useRef({ speed, glyphs, frost, paused });

  useEffect(() => {
    live.current = { speed, glyphs, frost, paused };
  });

  useEffect(() => {
    const el = host.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const family = getComputedStyle(cv).fontFamily;

    const mk = (cw: number, ch: number): [HTMLCanvasElement, Ctx] => {
      const c = document.createElement("canvas");
      c.width = cw;
      c.height = ch;
      return [c, c.getContext("2d", { willReadFrequently: true })!];
    };
    const [oc, ox] = mk(COLS * SS, ROWS * SS);
    const [bgc, bgx] = mk(W, H);
    const [blc, blx] = mk(W, H);

    {
      const g = bgx.createLinearGradient(0, 0, W * 0.45, H * 0.9);
      STOPS.forEach(([k, c]) => g.addColorStop(k, rgb(c)));
      bgx.fillStyle = g;
      bgx.fillRect(0, 0, W, H);
      bgx.fillStyle = "rgba(255,255,255,0.07)";
      for (let x = 0; x < W; x += CW) bgx.fillRect(x, 0, 1, H);
      for (let y = 0; y < H; y += CH) bgx.fillRect(0, y, W, 1);
    }

    /** Paint a layer, average it into one colour and coverage per cell. */
    function sample(draw: (g: Ctx) => void) {
      ox.setTransform(1, 0, 0, 1, 0, 0);
      ox.clearRect(0, 0, oc.width, oc.height);
      ox.setTransform(SS / CW, 0, 0, SS / CH, 0, 0);
      draw(ox);
      const d = ox.getImageData(0, 0, oc.width, oc.height).data;
      const out = new Float32Array(COLS * ROWS * 4);
      const rw = oc.width * 4;
      for (let j = 0; j < ROWS; j++) {
        for (let i = 0; i < COLS; i++) {
          let r = 0;
          let gg = 0;
          let b = 0;
          let a = 0;
          for (let v = 0; v < SS; v++) {
            for (let u = 0, p = (j * SS + v) * rw + i * SS * 4; u < SS; u++, p += 4) {
              const al = d[p + 3];
              r += d[p] * al;
              gg += d[p + 1] * al;
              b += d[p + 2] * al;
              a += al;
            }
          }
          const o = (j * COLS + i) * 4;
          if (a > 0) {
            out[o] = r / a;
            out[o + 1] = gg / a;
            out[o + 2] = b / a;
            out[o + 3] = a / (255 * SS * SS);
          }
        }
      }
      return out;
    }
    const put = (g: Ctx, x: number, y: number, a: number, s: number, draw: (g: Ctx) => void) => {
      g.save();
      g.translate(x, y);
      g.rotate(a);
      if (s !== 1) g.scale(s, s);
      draw(g);
      g.restore();
    };

    // The reef floor never moves, so it is sampled once.
    const reef = sample((g) => {
      const blob = (x: number, y: number, r: number, c1: string, c2: string, n: number) => {
        for (let k = 0; k < n; k++) {
          const a = hash(x, y, k) * TAU;
          const d = hash(y, x, k) * r * 0.7;
          ell(g, x + Math.cos(a) * d, y + Math.sin(a) * d * 0.9, r * (0.35 + 0.3 * hash(k, x, y)), r * (0.3 + 0.3 * hash(k, y, x)), a, k % 2 ? c1 : c2);
        }
      };
      blob(140, 1600, 110, "#d98a6a", "#c46a5a", 10);
      blob(1800, 220, 100, "#d8b86a", "#c49c4c", 9);
      blob(80, 380, 80, "#c9a0d8", "#e2a0b8", 7);
      blob(1700, 1650, 110, "#d6b870", "#e8907a", 10);
      for (const [x, y, r, c] of [[300, 1460, 46, "#ff6a3d"], [1520, 1560, 40, "#ff8a2a"], [1900, 420, 36, "#e8483c"], [220, 300, 34, "#ff7a3a"]] as [number, number, number, string][]) {
        g.save();
        g.translate(x, y);
        g.rotate(hash(x, y, 1) * TAU);
        for (let k = 0; k < 5; k++) {
          g.save();
          g.rotate((k * TAU) / 5);
          ell(g, r * 0.6, 0, r * 0.65, r * 0.2, 0, c);
          g.restore();
        }
        ell(g, 0, 0, r * 0.3, r * 0.3, 0, c);
        g.restore();
      }
      for (const [x, y] of [[560, 1580], [1740, 1480], [1960, 980], [40, 900]]) {
        g.save();
        g.translate(x, y);
        for (let k = 0; k < 12; k++) {
          g.rotate(TAU / 12);
          ell(g, 22, 0, 22, 3, 0, "#3a1f4a");
        }
        ell(g, 0, 0, 14, 14, 0, "#2a1438");
        g.restore();
      }
    });

    function cells(L: Float32Array, depth: number, t: number, withGlyphs: boolean) {
      for (let j = 0; j < ROWS; j++) {
        for (let i = 0; i < COLS; i++) {
          const o = (j * COLS + i) * 4;
          const a = L[o + 3];
          if (a < 0.12) continue;
          const x = i * CW;
          const y = j * CH;
          let c: RGB = [L[o], L[o + 1], L[o + 2]];
          if (depth) c = mix(c, water(x, y), depth);
          const flick = hash(i, j, Math.floor(t * 7));
          if (a > 0.5) {
            ctx.fillStyle = rgb(c, depth ? 0.9 : 1);
            ctx.fillRect(x + 1, y + 1, CW - 2, CH - 2);
            if (!withGlyphs) continue;
            const l = lum(c);
            const ch = RAMP[Math.max(0, Math.min(RAMP.length - 1, Math.floor(1 + l * 5 + flick * 4)))];
            ctx.fillStyle = flick < 0.04 ? SPRINK[(flick * 100) | 0] : rgb(l < 0.42 ? mix(c, [255, 255, 255], 0.62) : mix(c, [0, 0, 0], 0.58), depth ? 0.6 : 1);
            ctx.fillText(ch, x + CW / 2, y + CH / 2 + 1);
          } else if (withGlyphs) {
            ctx.fillStyle = rgb(c, Math.min(1, a * 1.6) * (depth ? 0.6 : 1));
            ctx.fillText(EDGE[(flick * EDGE.length) | 0], x + CW / 2, y + CH / 2 + 1);
          } else {
            ctx.fillStyle = rgb(c, Math.min(1, a * 1.6) * (depth ? 0.6 : 1));
            ctx.fillRect(x + 3, y + 3, CW - 6, CH - 6);
          }
        }
      }
    }

    function draw(time: number, withGlyphs: boolean, withFrost: boolean) {
      const t = ((time % T) + T) % T;
      ctx.drawImage(bgc, 0, 0);

      // sun bands drifting over the lagoon
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (let k = 0; k < 4; k++) {
        const off = ((t / T + k / 4) % 1) * (W + H) * 1.2 - H * 0.6;
        const g = ctx.createLinearGradient(off, 0, off + 260, 160);
        g.addColorStop(0, "rgba(255,255,255,0)");
        g.addColorStop(0.5, "rgba(255,255,240,0.10)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }
      ctx.restore();

      ctx.font = `500 15px ${family}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // caustic net and surface glints
      for (let j = 0; j < ROWS; j++) {
        for (let i = 0; i < COLS; i++) {
          const x = i * CW;
          const y = j * CH;
          const v =
            Math.sin(x * 0.011 + y * 0.004 + w * 2 * t + 1.6 * Math.sin(y * 0.007 - w * 3 * t)) +
            Math.sin(-x * 0.006 + y * 0.012 - w * 3 * t + 1.6 * Math.sin(x * 0.008 + w * 2 * t)) +
            Math.sin(x * 0.009 - y * 0.009 + w * 4 * t + 1.2 * Math.sin((x + y) * 0.005 + w * t));
          if (v > 1.55) {
            const k = Math.min(1, (v - 1.55) / 1.2);
            ctx.fillStyle = `rgba(255,255,255,${0.16 + 0.42 * k})`;
            ctx.fillText(k > 0.6 ? "~" : k > 0.3 ? "-" : "·", x + CW / 2, y + CH / 2);
          }
          const gl = hash(i, j, Math.floor(t * 6) % 147);
          if (gl > 0.9988) {
            const f = Math.sin(((t * 6) % 1) * Math.PI);
            ctx.fillStyle = `rgba(255,255,255,${0.95 * f})`;
            ctx.fillText(gl > 0.9995 ? "*" : "+", x + CW / 2, y + CH / 2);
          }
        }
      }

      cells(reef, 0.62, t, withGlyphs);

      const deep = sample((g) => {
        const [x, y, a] = pose(P.whale, t);
        put(g, x, y, a, 1, (q) => whale(q, t));
      });
      cells(deep, 0.4, t, withGlyphs);

      const main = sample((g) => {
        let [x, y, a] = pose(P.manta, t);
        put(g, x, y, a, 1.2, (q) => manta(q, t));
        for (const [dx, ph] of [[0, 0], [1, 1.3]]) {
          [x, y, a] = pose(P.dolphin, t - dx * 0.18);
          put(g, x + dx * 120 * Math.sin(a), y - dx * 120 * Math.cos(a), a, 1.25, (q) => dolphin(q, t, ph));
        }
        [x, y, a] = pose(P.turtleA, t);
        put(g, x, y, a, 1.55, (q) => turtle(q, t, 0));
        [x, y, a] = pose(P.turtleB, t);
        put(g, x, y, a, 1.3, (q) => turtle(q, t, 2));
        [x, y, a] = pose(P.turtleC, t);
        put(g, x, y, a, 1.1, (q) => turtle(q, t, 4));
        [x, y, a] = pose(P.school, t);
        FISH.forEach(([fx, fy], k) => {
          const ca = Math.cos(a);
          const sa = Math.sin(a);
          const wob = 14 * Math.sin(w * 7 * t + k);
          put(g, x + fx * ca - (fy + wob) * sa, y + fx * sa + (fy + wob) * ca, a + 0.15 * Math.sin(w * 9 * t + k), 1.35, (q) => tang(q, t, k));
        });
        for (const [kind, p0, y0, s, dir] of FLOWERS) {
          const u = (p0 + t / T) % 1;
          const fx = -220 + u * (W + 440);
          const fy = y0 + u * 420 + 30 * Math.sin(w * 3 * t + p0 * 9);
          put(g, fx, fy, dir * w * t + p0 * 6, 1, (q) => (kind === "h" ? hibiscus(q, s) : plumeria(q, s)));
        }
      });

      // shadows on the sand, offset down and right from the sun
      ctx.fillStyle = "rgba(4,60,84,0.16)";
      for (let j = 0; j < ROWS - 2; j++) {
        for (let i = 0; i < COLS - 2; i++) {
          if (main[(j * COLS + i) * 4 + 3] > 0.3) ctx.fillRect((i + 2) * CW, (j + 2) * CH, CW, CH);
        }
      }

      // foam wakes behind the swimmers
      for (const [fn, len] of [[P.turtleA, 1.5], [P.turtleB, 1.3], [P.turtleC, 1.1], [P.manta, 1.6], [P.dolphin, 1.4]] as [Path, number][]) {
        for (let k = 1; k <= 16; k++) {
          const [x, y, a] = pose(fn, t - k * 0.09 - 0.35 * len);
          const side = (hash(k, len, 3) - 0.5) * k * 9;
          const px = x + side * -Math.sin(a);
          const py = y + side * Math.cos(a);
          ctx.fillStyle = `rgba(255,255,255,${0.55 * (1 - k / 17)})`;
          ctx.fillText(".·o°"[(hash(k, len, Math.floor(t * 5)) * 4) | 0], Math.floor(px / CW) * CW + CW / 2, Math.floor(py / CH) * CH + CH / 2);
        }
      }

      cells(main, 0, t, withGlyphs);

      if (!withFrost) return;
      // frosted glass behind the content: a blurred copy masked by a soft ellipse
      blx.globalCompositeOperation = "source-over";
      blx.clearRect(0, 0, W, H);
      blx.filter = "blur(11px)";
      blx.drawImage(cv, 0, 0);
      blx.filter = "none";
      blx.globalCompositeOperation = "destination-in";
      blx.save();
      blx.translate(958, 860);
      blx.scale(1, 0.46);
      const m = blx.createRadialGradient(0, 0, 0, 0, 0, 800);
      m.addColorStop(0, "#000");
      m.addColorStop(0.62, "#000");
      m.addColorStop(1, "rgba(0,0,0,0)");
      blx.fillStyle = m;
      blx.fillRect(-1000, -1000, 2000, 2000);
      blx.restore();
      ctx.drawImage(blc, 0, 0);
      ctx.save();
      ctx.translate(958, 860);
      ctx.scale(1, 0.46);
      const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 820);
      glow.addColorStop(0, "rgba(240,255,252,0.62)");
      glow.addColorStop(0.55, "rgba(230,252,250,0.38)");
      glow.addColorStop(1, "rgba(220,250,250,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(-1000, -1000, 2000, 2000);
      ctx.restore();
    }

    // Cover the container with the 1944 by 1760 stage, centred.
    const fit = () => {
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      cv.style.transform = `translate(-50%, -50%) scale(${Math.max(r.width / W, r.height / H)})`;
    };

    let raf = 0;
    let last = 0;
    let clock = 0;
    let visible = true;
    let lastKey = "";
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (!visible) return;
      const lv = live.current;
      const key = `${lv.glyphs}|${lv.frost}`;
      if (lv.paused && key === lastKey) return;
      if (!lv.paused) clock += Math.max(0, dt) * lv.speed;
      lastKey = key;
      draw(clock, lv.glyphs, lv.frost);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (reduced.matches) {
        draw(STILL_AT, live.current.glyphs, live.current.frost);
        return;
      }
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(fit);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      last = performance.now();
    });
    io.observe(el);
    reduced.addEventListener("change", start);
    fit();
    // Canvas text cannot trigger a web font load, so ask for the mono face and redraw once it is in.
    document.fonts?.load(`500 15px ${family}`).then(() => {
      lastKey = "";
      if (reduced.matches) draw(STILL_AT, live.current.glyphs, live.current.frost);
    });
    start();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      reduced.removeEventListener("change", start);
    };
  }, []);

  return (
    <div ref={host} className={cn("relative isolate h-full min-h-[24rem] w-full overflow-hidden bg-[#3fcfd2]", className)}>
      <canvas
        ref={canvas}
        width={W}
        height={H}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 origin-center"
        style={{ width: W, height: H, fontFamily: 'var(--font-geist-mono), "Geist Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace' }}
      />
      {children && <div className="relative z-10 grid h-full min-h-[inherit] place-items-center">{children}</div>}
    </div>
  );
}
