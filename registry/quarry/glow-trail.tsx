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
const mix = (a: number[], b: number[], t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const rgba = (c: number[], a: number) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

/**
 * Wherever the pointer goes it leaves a trail of soft light that drifts and fades. When nobody is
 * moving a slow glow wanders by itself, so the surface is never empty.
 */
export function GlowTrail({
  color = "var(--primary)",
  accent = "var(--chart-2)",
  size = 46,
  fade = 1,
  interaction = "trail",
  children,
  className,
}: {
  /** Core of the glow. */
  color?: string;
  /** Outer colour of the glow. */
  accent?: string;
  /** Particle size in pixels. */
  size?: number;
  /** Higher keeps the trail longer. */
  fade?: number;
  interaction?: "off" | "trail";
  children?: ReactNode;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const live = useRef({ color, accent, size, fade, interaction });

  useEffect(() => {
    live.current = { color, accent, size, fade, interaction };
  });

  useEffect(() => {
    const el = host.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const ptr = { x: -9999, y: -9999, on: false };
    let w = 0, h = 0, raf = 0, visible = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const colors: Record<string, { key: string; rgb: [number, number, number] }> = {};
    const rgb = (name: string, css: string) => {
      const c = colors[name];
      if (c && c.key === css) return c.rgb;
      const v = toRgb(el, css);
      colors[name] = { key: css, rgb: v };
      return v;
    };
    type P = { x: number; y: number; vx: number; vy: number; life: number; s: number; m: number };
    const ps: P[] = [];
    let lx = -1, ly = -1;
    let sprite: HTMLCanvasElement | null = null;
    let spriteKey = "";
    const makeSprite = (a: number[], b: number[]) => {
      const c = document.createElement("canvas");
      c.width = c.height = 128;
      const x = c.getContext("2d")!;
      const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, rgba(a, 0.95));
      g.addColorStop(0.35, rgba(mix(a, b, 0.5), 0.45));
      g.addColorStop(1, rgba(b, 0));
      x.fillStyle = g;
      x.fillRect(0, 0, 128, 128);
      return c;
    };
    const emit = (x: number, y: number, n: number) => {
      for (let i = 0; i < n; i++) ps.push({ x, y, vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8 - 0.1, life: 1, s: 0.5 + Math.random() * 0.7, m: Math.random() });
      if (ps.length > 420) ps.splice(0, ps.length - 420);
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

    let last = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const dt = Math.min(2, (now - last) / 16.67 || 1);
      last = now;
      const p = live.current;
      const A = rgb("a", p.color!), B = rgb("b", p.accent!);
      const key = `${A}|${B}`;
      if (key !== spriteKey) { spriteKey = key; sprite = makeSprite(A, B); }
      ctx.clearRect(0, 0, w, h);
      const t = now * 0.0006;
      // a quiet wanderer keeps the surface alive when the pointer is away
      if (!ptr.on || p.interaction === "off") emit(w * (0.5 + 0.32 * Math.sin(t * 1.3)), h * (0.5 + 0.28 * Math.sin(t * 0.9 + 1)), 1);
      ctx.globalCompositeOperation = "lighter";
      for (let i = ps.length - 1; i >= 0; i--) {
        const q = ps[i];
        q.x += q.vx * dt; q.y += q.vy * dt; q.life -= 0.012 * dt / p.fade!;
        if (q.life <= 0) { ps.splice(i, 1); continue; }
        const r = p.size! * q.s * (0.4 + q.life * 0.8);
        ctx.globalAlpha = Math.min(1, q.life * 1.2) * 0.9;
        ctx.drawImage(sprite!, q.x - r, q.y - r, r * 2, r * 2);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
      ptr.on = true;
      if (live.current.interaction === "trail") {
        if (lx >= 0) {
          const dist = Math.hypot(ptr.x - lx, ptr.y - ly);
          const steps = Math.max(1, Math.min(8, Math.floor(dist / 10)));
          for (let i = 1; i <= steps; i++) emit(lx + ((ptr.x - lx) * i) / steps, ly + ((ptr.y - ly) * i) / steps, 1);
        }
        lx = ptr.x; ly = ptr.y;
      }
    };
    const leave = () => { ptr.x = ptr.y = -9999; ptr.on = false; };
    const down = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      void r; void e;

    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(el);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointerdown", down);
    if (reduced) { for (let i = 0; i < 90; i++) frame(i * 16); cancelAnimationFrame(raf); } else raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointerdown", down);
    };
  }, []);

  return (
    <div ref={host} className={cn("relative isolate h-full min-h-[24rem] w-full overflow-hidden bg-background", className)}>
      <canvas ref={canvas} className="absolute inset-0 size-full" aria-hidden />
      {children && <div className="pointer-events-none relative z-10 grid h-full min-h-[inherit] place-items-center">{children}</div>}
    </div>
  );
}
