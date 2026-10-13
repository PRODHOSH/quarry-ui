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
 * Points drifting slowly, joined by thin lines whenever two come close. Near the pointer, lines reach
 * toward it, or the points get pushed away, so the network seems to notice you.
 */
export function Constellation({
  color = "var(--primary)",
  accent = "var(--muted-foreground)",
  count = 80,
  linkDistance = 130,
  speed = 1,
  interaction = "connect",
  children,
  className,
}: {
  /** Lines and points near the pointer. */
  color?: string;
  /** Resting points. */
  accent?: string;
  /** Number of points. */
  count?: number;
  linkDistance?: number;
  speed?: number;
  interaction?: "off" | "connect" | "repel";
  children?: ReactNode;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const live = useRef({ color, accent, count, linkDistance, speed, interaction });

  useEffect(() => {
    live.current = { color, accent, count, linkDistance, speed, interaction };
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
    type N = { x: number; y: number; vx: number; vy: number };
    let nodes: N[] = [];

    const resize = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = Array.from({ length: live.current.count! }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5 }));
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
      while (nodes.length < p.count!) nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5 });
      nodes.length = p.count!;
      const L = p.linkDistance!;
      for (const n of nodes) {
        n.x += n.vx * p.speed! * dt;
        n.y += n.vy * p.speed! * dt;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        if (p.interaction === "repel") {
          const dx = n.x - ptr.x, dy = n.y - ptr.y, d = Math.hypot(dx, dy);
          if (d < 140 && d > 1) { n.x += (dx / d) * (1 - d / 140) * 3 * dt; n.y += (dy / d) * (1 - d / 140) * 3 * dt; }
        }
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < L) {
            ctx.strokeStyle = rgba(mix(B, A, 0.4), (1 - d / L) * 0.45);
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        const dp = Math.hypot(a.x - ptr.x, a.y - ptr.y);
        const near = p.interaction === "connect" && dp < L * 1.7;
        if (near) {
          ctx.strokeStyle = rgba(A, (1 - dp / (L * 1.7)) * 0.8);
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(ptr.x, ptr.y); ctx.stroke();
        }
        ctx.fillStyle = rgba(near ? A : B, near ? 0.95 : 0.55);
        ctx.beginPath(); ctx.arc(a.x, a.y, near ? 2.4 : 1.6, 0, 6.2832); ctx.fill();
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
