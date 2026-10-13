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
 * Soft blurred colour that drifts like an aurora. One glow follows the pointer, the others wander on
 * their own slow paths. Three colours, all configurable, and nothing here is an image.
 */
export function AuroraMesh({
  color = "var(--primary)",
  color2 = "var(--chart-2)",
  color3 = "var(--chart-4)",
  speed = 1,
  size = 0.55,
  interaction = "follow",
  opacity = 0.6,
  children,
  className,
}: {
  /** First colour. */
  color?: string;
  /** Second colour. */
  color2?: string;
  /** Third colour. */
  color3?: string;
  speed?: number;
  /** Glow size as a fraction of the shorter side. */
  size?: number;
  interaction?: "off" | "follow";
  opacity?: number;
  children?: ReactNode;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const live = useRef({ color, color2, color3, speed, size, interaction, opacity });

  useEffect(() => {
    live.current = { color, color2, color3, speed, size, interaction, opacity };
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
    const follow = { x: 0, y: 0 };

    const resize = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      follow.x = w / 2;
      follow.y = h / 2;
    };

    let last = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const dt = Math.min(2, (now - last) / 16.67 || 1);
      last = now;
      const p = live.current;
      const cs = [rgb("a", p.color!), rgb("b", p.color2!), rgb("c", p.color3!)];
      ctx.clearRect(0, 0, w, h);
      const t = now * 0.00025 * p.speed!;
      const base = Math.min(w, h) * p.size!;
      if (p.interaction === "follow" && ptr.on) { follow.x += (ptr.x - follow.x) * 0.06 * dt; follow.y += (ptr.y - follow.y) * 0.06 * dt; }
      const blobs = [
        { x: w * (0.3 + 0.22 * Math.sin(t * 1.1)), y: h * (0.35 + 0.2 * Math.cos(t * 0.9)), r: base * 1.15, c: cs[0] },
        { x: w * (0.7 + 0.2 * Math.cos(t * 0.8)), y: h * (0.55 + 0.22 * Math.sin(t * 1.2)), r: base * 1.05, c: cs[1] },
        { x: w * (0.5 + 0.3 * Math.sin(t * 0.6 + 2)), y: h * (0.75 + 0.15 * Math.cos(t * 1.3)), r: base * 0.95, c: cs[2] },
        { x: p.interaction === "follow" ? follow.x : w * 0.5, y: p.interaction === "follow" ? follow.y : h * 0.45, r: base * 0.7, c: mix(cs[0], cs[2], 0.5) },
      ];
      for (const b of blobs) {
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, rgba(b.c, p.opacity!));
        g.addColorStop(0.55, rgba(b.c, p.opacity! * 0.35));
        g.addColorStop(1, rgba(b.c, 0));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
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
