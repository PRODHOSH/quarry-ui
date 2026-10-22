"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Turn any CSS colour, including oklch and var(--token), into [r, g, b]. */
function toRgb(host: HTMLElement, css: string): [number, number, number] {
  const probe = document.createElement("span");
  probe.style.color = css;
  host.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  const c = document.createElement("canvas");
  c.width = c.height = 1;
  const x = c.getContext("2d", { willReadFrequently: true })!;
  x.fillStyle = resolved;
  x.fillRect(0, 0, 1, 1);
  const d = x.getImageData(0, 0, 1, 1).data;
  return [d[0], d[1], d[2]];
}

const hash = (x: number, y: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const smooth = (t: number) => t * t * (3 - 2 * t);
const noise = (x: number, y: number) => {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = smooth(x - ix), fy = smooth(y - iy);
  const a = hash(ix, iy), b = hash(ix + 1, iy), c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
};
const fbm = (x: number, y: number) => noise(x, y) * 0.55 + noise(x * 2.1 + 7.3, y * 2.1 - 3.1) * 0.3 + noise(x * 4.3 - 2.7, y * 4.3 + 9.1) * 0.15;

/**
 * A living topographic map. A noise landscape is sliced into contour lines with marching squares,
 * and the terrain slowly morphs so the lines flow and merge. Every fifth line is an accent "index"
 * contour. The pointer raises a hill or digs a pit, and the lines bend around it.
 */
export function TopoLines({
  color = "var(--foreground)",
  accent = "var(--primary)",
  interaction = "hill",
  levels = 16,
  scale = 1.2,
  speed = 1,
  detail = 12,
  children,
  className,
}: {
  /** Colour of the regular contour lines. */
  color?: string;
  /** Colour of the index contours. */
  accent?: string;
  interaction?: "off" | "hill" | "pit";
  /** Number of elevation levels. */
  levels?: number;
  /** Size of the terrain features. Higher means more, smaller features. */
  scale?: number;
  speed?: number;
  /** Grid cell size in pixels. Lower is smoother and heavier. */
  detail?: number;
  children?: ReactNode;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const live = useRef({ color, accent, interaction, levels, scale, speed, detail });

  useEffect(() => {
    live.current = { color, accent, interaction, levels, scale, speed, detail };
  });

  useEffect(() => {
    const el = host.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ptr = { x: -9999, y: -9999, k: 0, tk: 0 };
    let w = 0, h = 0, raf = 0, visible = true, t = 0, last = 0;
    let field = new Float32Array(0);
    let cols = 0, rows = 0, cell = 12;
    const cache: Record<string, { key: string; rgb: [number, number, number] }> = {};
    const rgb = (n: string, css: string) => {
      const c = cache[n];
      if (c && c.key === css) return c.rgb;
      const v = toRgb(el, css);
      cache[n] = { key: css, rgb: v };
      return v;
    };

    const resize = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // each case lists the cell edges (0 top, 1 right, 2 bottom, 3 left) joined by a segment
    const CASES: number[][][] = [[], [[3, 2]], [[2, 1]], [[3, 1]], [[0, 1]], [[0, 3], [2, 1]], [[0, 2]], [[0, 3]], [[0, 3]], [[0, 2]], [[0, 1], [3, 2]], [[0, 1]], [[3, 1]], [[2, 1]], [[3, 2]], []];

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || w < 2) return;
      const p = live.current;
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      t += dt * p.speed * 0.12;
      ptr.k += (ptr.tk - ptr.k) * 0.06;

      cell = Math.max(6, p.detail);
      cols = Math.ceil(w / cell) + 1;
      rows = Math.ceil(h / cell) + 1;
      if (field.length !== cols * rows) field = new Float32Array(cols * rows);

      const mix = 0.5 + 0.5 * Math.sin(t * 1.3);
      const sgn = p.interaction === "pit" ? -1 : 1;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = (i * cell) / 420 * p.scale, y = (j * cell) / 420 * p.scale;
          let f = fbm(x + t, y + t * 0.6) * (1 - mix) + fbm(x - t * 0.8 + 11.7, y + 4.2 + t * 0.5) * mix;
          if (p.interaction !== "off" && ptr.k > 0.01) {
            const dx = i * cell - ptr.x, dy = j * cell - ptr.y;
            f += sgn * 0.42 * ptr.k * Math.exp(-(dx * dx + dy * dy) / 26000);
          }
          field[j * cols + i] = f;
        }
      }

      const base = rgb("c", p.color), acc = rgb("a", p.accent);
      ctx.clearRect(0, 0, w, h);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      const lo = 0.18, hi = 0.82;
      for (let L = 0; L < p.levels; L++) {
        const level = lo + ((hi - lo) * (L + 0.5)) / p.levels;
        const index = L % 5 === 0;
        const c = index ? acc : base;
        ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${index ? 0.85 : 0.32})`;
        ctx.lineWidth = index ? 1.5 : 1;
        ctx.beginPath();
        for (let j = 0; j < rows - 1; j++) {
          for (let i = 0; i < cols - 1; i++) {
            const a = field[j * cols + i], b = field[j * cols + i + 1], cc = field[(j + 1) * cols + i + 1], d = field[(j + 1) * cols + i];
            const idx = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (cc > level ? 2 : 0) | (d > level ? 1 : 0);
            if (idx === 0 || idx === 15) continue;
            const x0 = i * cell, y0 = j * cell;
            const edge = (e: number): [number, number] => {
              if (e === 0) return [x0 + ((level - a) / (b - a)) * cell, y0];
              if (e === 1) return [x0 + cell, y0 + ((level - b) / (cc - b)) * cell];
              if (e === 2) return [x0 + ((level - d) / (cc - d)) * cell, y0 + cell];
              return [x0, y0 + ((level - a) / (d - a)) * cell];
            };
            for (const [e1, e2] of CASES[idx]) {
              const [px, py] = edge(e1), [qx, qy] = edge(e2);
              ctx.moveTo(px, py);
              ctx.lineTo(qx, qy);
            }
          }
        }
        ctx.stroke();
      }
    };

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
      ptr.tk = 1;
    };
    const leave = () => { ptr.tk = 0; };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(el);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    if (reduced) { frame(0); cancelAnimationFrame(raf); } else raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={host} className={cn("relative isolate h-full min-h-[24rem] w-full overflow-hidden bg-background", className)}>
      <canvas ref={canvas} className="absolute inset-0 size-full" aria-hidden />
      {children && <div className="pointer-events-none relative z-10 grid h-full min-h-[inherit] place-items-center">{children}</div>}
    </div>
  );
}
