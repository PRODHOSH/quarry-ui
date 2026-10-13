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
 * Rows of lines that ripple like water. The pointer lifts or pinches the lines near it, so you can
 * pull a ridge through the field. Line colour blends from one colour to another down the page.
 */
export function WaveLines({
  color = "var(--primary)",
  accent = "var(--muted-foreground)",
  lines = 30,
  amplitude = 18,
  speed = 1,
  interaction = "lift",
  children,
  className,
}: {
  /** First line colour. */
  color?: string;
  /** Last line colour. */
  accent?: string;
  lines?: number;
  /** Height of the ripples in pixels. */
  amplitude?: number;
  speed?: number;
  interaction?: "off" | "lift" | "pinch";
  children?: ReactNode;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const live = useRef({ color, accent, lines, amplitude, speed, interaction });

  useEffect(() => {
    live.current = { color, accent, lines, amplitude, speed, interaction };
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
    let gx = 0, gy = 0;

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
      ctx.clearRect(0, 0, w, h);
      if (ptr.on) { gx += (ptr.x - gx) * 0.12 * dt; gy += (ptr.y - gy) * 0.12 * dt; } else { gx += (w / 2 - gx) * 0.02 * dt; gy += (h / 2 - gy) * 0.02 * dt; }
      const t = now * 0.0007 * p.speed!;
      const n = p.lines!;
      ctx.lineWidth = 1.2;
      for (let i = 0; i < n; i++) {
        const y0 = ((i + 1) / (n + 1)) * h;
        ctx.strokeStyle = rgba(mix(A, B, i / n), 0.35 + 0.5 * (1 - Math.abs(i / n - 0.5) * 2));
        ctx.beginPath();
        for (let x = 0; x <= w + 8; x += 8) {
          let y = y0 + p.amplitude! * (Math.sin(x * 0.008 + t + i * 0.32) + 0.5 * Math.sin(x * 0.019 - t * 1.4 + i * 0.2));
          if (p.interaction !== "off" && ptr.on) {
            const g = Math.exp(-((x - gx) ** 2) / (2 * 130 * 130)) * Math.exp(-((y0 - gy) ** 2) / (2 * 150 * 150));
            y += p.interaction === "lift" ? -g * 70 : (gy - y0) * g * 0.7;
          }
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
      ptr.on = true;

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
