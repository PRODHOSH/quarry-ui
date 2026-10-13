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
 * A field of small needles that all turn to face the pointer, like a grid of compasses. Choose whether
 * they point at it or away from it. When nobody is near they sway on their own.
 */
export function CompassField({
  color = "var(--primary)",
  accent = "var(--muted-foreground)",
  spacing = 30,
  length = 13,
  interaction = "toward",
  children,
  className,
}: {
  /** Needles near the pointer. */
  color?: string;
  /** Resting needles. */
  accent?: string;
  spacing?: number;
  /** Needle length in pixels. */
  length?: number;
  interaction?: "off" | "toward" | "away";
  children?: ReactNode;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const live = useRef({ color, accent, spacing, length, interaction });

  useEffect(() => {
    live.current = { color, accent, spacing, length, interaction };
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
    let angles: number[] = [];

    const resize = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      angles = [];
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
      const s = p.spacing!;
      const cols = Math.floor(w / s), rows = Math.floor(h / s);
      const ox = (w - (cols - 1) * s) / 2, oy = (h - (rows - 1) * s) / 2;
      const t = now * 0.0004;
      ctx.lineCap = "round";
      ctx.lineWidth = 2;
      let k = 0;
      for (let cx = 0; cx < cols; cx++) {
        for (let cy = 0; cy < rows; cy++, k++) {
          const x = ox + cx * s, y = oy + cy * s;
          const idle = Math.sin(x * 0.01 + t) + Math.cos(y * 0.012 - t * 1.2);
          let target = idle;
          let near = 0;
          if (p.interaction !== "off" && ptr.on) {
            const d = Math.hypot(ptr.x - x, ptr.y - y);
            near = Math.max(0, 1 - d / 260);
            const aim = Math.atan2(ptr.y - y, ptr.x - x) + (p.interaction === "away" ? Math.PI : 0);
            target = near > 0 ? aim : idle;
          }
          let a = angles[k] ?? target;
          let diff = target - a;
          diff = Math.atan2(Math.sin(diff), Math.cos(diff));
          a += diff * 0.14 * dt;
          angles[k] = a;
          const len = p.length! * (0.7 + near * 0.7);
          ctx.strokeStyle = rgba(mix(B, A, near), 0.3 + near * 0.7);
          ctx.beginPath();
          ctx.moveTo(x - Math.cos(a) * len * 0.5, y - Math.sin(a) * len * 0.5);
          ctx.lineTo(x + Math.cos(a) * len * 0.5, y + Math.sin(a) * len * 0.5);
          ctx.stroke();
        }
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
