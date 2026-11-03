"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RGB = [number, number, number];
type Candle = { o: number; h: number; l: number; c: number; mark: number };

/** Turn any CSS colour, including oklch and var(--token), into [r, g, b]. */
function toRgb(host: HTMLElement, css: string): RGB {
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
const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

/** A tiny seeded generator, so the chart is the same on every visit. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A live candlestick chart drawn as a background. The candles drift left as new ones appear on the
 * right, every so often a short run lights up in the highlight colour with a bright wick, and the
 * candles under the pointer glow. A warm light rises from the bottom edge. Colours take any CSS value
 * or token, it pauses off screen, and reduced motion draws one still frame.
 */
export function CandleField({
  ground = "var(--foreground)",
  candle = "var(--muted-foreground)",
  highlight = "var(--primary)",
  speed = 1,
  size = 1,
  glow = true,
  children,
  className,
}: {
  ground?: string;
  /** The colour of ordinary candles. */
  candle?: string;
  /** The colour of the candles that light up. */
  highlight?: string;
  speed?: number;
  /** Candle width multiplier. */
  size?: number;
  /** Warm light along the bottom edge. */
  glow?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const live = useRef({ ground, candle, highlight, speed, size });
  const kick = useRef<(() => void) | null>(null);

  useEffect(() => {
    live.current = { ground, candle, highlight, speed, size };
    kick.current?.();
  }, [ground, candle, highlight, speed, size]);

  useEffect(() => {
    const el = host.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const rand = rng(7);
    const ptr = { x: -1e4, y: -1e4 };
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let last = 0;
    let visible = true;
    let off = 0;
    let price = 100;
    let drift = 0;
    let n = 0;
    let colors: { base: RGB; hi: RGB } | null = null;
    let key = "";
    const candles: Candle[] = [];

    const next = (): Candle => {
      const o = price;
      drift = drift * 0.9 + (rand() - 0.5) * 1.1;
      const c = o + drift * 1.4 + (rand() - 0.5) * 4.6;
      const h = Math.max(o, c) + rand() * 3.6;
      const l = Math.min(o, c) - rand() * 3.6;
      price = c;
      n += 1;
      // A short run of three candles lights up every so often.
      const mark = n % 29 >= 0 && n % 29 < 3 && n > 3 ? 1 : 0;
      return { o, h, l, c, mark };
    };

    const step = () => Math.max(16, Math.round(w / 34)) * live.current.size;
    const fill = () => {
      const need = Math.ceil(w / step()) + 4;
      while (candles.length < need) candles.push(next());
    };

    const resolve = () => {
      const lv = live.current;
      const k = `${lv.candle}|${lv.highlight}`;
      if (k === key && colors) return;
      key = k;
      colors = { base: toRgb(el, lv.candle), hi: toRgb(el, lv.highlight) };
    };

    const draw = () => {
      resolve();
      const { base, hi } = colors!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const s = step();
      const bodyW = s * 0.58;
      let lo = Infinity;
      let up = -Infinity;
      for (const c of candles) {
        lo = Math.min(lo, c.l);
        up = Math.max(up, c.h);
      }
      const pad = h * 0.18;
      const y = (v: number) => h - pad - ((v - lo) / Math.max(1, up - lo)) * (h - pad * 2.1);
      candles.forEach((c, i) => {
        const x = i * s - off;
        const edge = Math.min(1, Math.min(x, w - x) / (w * 0.12) + 0.15);
        const near = Math.max(0, 1 - Math.hypot(x - ptr.x, y((c.o + c.c) / 2) - ptr.y) / 150);
        const bull = c.c >= c.o;
        const col = c.mark ? hi : base;
        const alpha = Math.max(0, edge) * (c.mark ? 0.95 : (bull ? 0.42 : 0.22) + near * 0.5);
        if (c.mark) {
          ctx.shadowColor = rgba(hi, 0.8);
          ctx.shadowBlur = 18;
        }
        ctx.strokeStyle = rgba(c.mark ? [255, 255, 255] : col, alpha);
        ctx.lineWidth = Math.max(1, s * 0.07);
        ctx.beginPath();
        ctx.moveTo(x, y(c.h));
        ctx.lineTo(x, y(c.l));
        ctx.stroke();
        ctx.fillStyle = rgba(col, alpha);
        const top = y(Math.max(c.o, c.c));
        ctx.fillRect(x - bodyW / 2, top, bodyW, Math.max(2, y(Math.min(c.o, c.c)) - top));
        ctx.shadowBlur = 0;
      });
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      off += dt * live.current.speed * step() * 0.55;
      while (off >= step()) {
        off -= step();
        candles.shift();
        candles.push(next());
      }
      draw();
      if (visible && !reduced.matches && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (raf) return;
      last = performance.now();
      if (reduced.matches) draw();
      else raf = requestAnimationFrame(frame);
    };
    kick.current = start;

    const resize = () => {
      const r = el.getBoundingClientRect();
      if (r.width < 2) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      fill();
      if (reduced.matches) draw();
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
    };
    const leave = () => {
      ptr.x = ptr.y = -1e4;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(el);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", start);
    resize();
    start();
    return () => {
      cancelAnimationFrame(raf);
      kick.current = null;
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", start);
    };
  }, []);

  return (
    <div ref={host} className={cn("relative isolate h-full min-h-[24rem] w-full overflow-hidden", className)} style={{ background: ground }}>
      <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
      {glow && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5"
          style={{ background: `radial-gradient(80% 90% at 50% 125%, color-mix(in oklab, ${highlight} 80%, transparent) 0%, color-mix(in oklab, ${highlight} 30%, transparent) 38%, transparent 72%)` }}
        />
      )}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(70% 70% at 50% 45%, transparent 35%, ${ground} 110%)` }} />
      {children && <div className="pointer-events-none relative z-10 grid h-full min-h-[inherit] place-items-center text-background">{children}</div>}
    </div>
  );
}
