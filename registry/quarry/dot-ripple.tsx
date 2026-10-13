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
 * A grid of dots that swell and shift around the pointer. Click and a ripple rolls outward through the
 * grid. In push mode the dots move away from the pointer, in pull mode they gather toward it.
 */
export function DotRipple({
  color = "var(--primary)",
  accent = "var(--muted-foreground)",
  spacing = 28,
  radius = 150,
  interaction = "push",
  ripples = true,
  children,
  className,
}: {
  /** Colour of the dots near the pointer. */
  color?: string;
  /** Colour of the resting dots. */
  accent?: string;
  /** Distance between dots in pixels. */
  spacing?: number;
  /** How far the pointer reaches. */
  radius?: number;
  interaction?: "off" | "push" | "pull";
  /** Clicking sends a ripple through the grid. */
  ripples?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const live = useRef({ color, accent, spacing, radius, interaction, ripples });

  useEffect(() => {
    live.current = { color, accent, spacing, radius, interaction, ripples };
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
    const ripples: { x: number; y: number; t: number }[] = [];

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
      const s = p.spacing!;
      const R = p.radius!;
      ctx.clearRect(0, 0, w, h);
      const tt = now * 0.0016;
      for (let i = ripples.length - 1; i >= 0; i--) { ripples[i].t += dt * 0.016; if (ripples[i].t > 1.8) ripples.splice(i, 1); }
      const cols = Math.ceil(w / s) + 1, rows = Math.ceil(h / s) + 1;
      const ox = (w - (cols - 1) * s) / 2, oy = (h - (rows - 1) * s) / 2;
      for (let cx = 0; cx < cols; cx++) {
        for (let cy = 0; cy < rows; cy++) {
          const bx = ox + cx * s, by = oy + cy * s;
          let x = bx, y = by, f = 0;
          const dx = bx - ptr.x, dy = by - ptr.y;
          const d = Math.hypot(dx, dy);
          if (p.interaction !== "off" && d < R && d > 0.5) {
            f = (1 - d / R) ** 2;
            const k = (p.interaction === "push" ? 1 : -1) * f * s * 0.9;
            x += (dx / d) * k;
            y += (dy / d) * k;
          }
          let bump = 0;
          if (p.ripples) {
            for (const r of ripples) {
              const rd = Math.hypot(bx - r.x, by - r.y);
              const edge = Math.abs(rd - r.t * 520);
              if (edge < 60) bump = Math.max(bump, (1 - edge / 60) * (1 - r.t / 1.8));
            }
          }
          const idle = (Math.sin(tt + (bx + by) * 0.012) + 1) * 0.5;
          const size = 1.1 + idle * 0.5 + f * 3.2 + bump * 3.5;
          const c = mix(B, A, Math.min(1, f * 1.4 + bump));
          ctx.fillStyle = rgba(c, 0.28 + idle * 0.12 + f * 0.7 + bump * 0.7);
          ctx.beginPath();
          ctx.arc(x, y, size, 0, 6.2832);
          ctx.fill();
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
      if (live.current.ripples) ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: 0 });
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
