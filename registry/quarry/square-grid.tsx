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

/**
 * A graph paper grid of crisp square boxes. The lines stay faint until you move over them: the
 * square under the pointer lights up and every square it touches fades out slowly behind it, like
 * a trail of lit tiles. When nobody is around, single squares blink on and off by themselves.
 */
export function SquareGrid({
  color = "var(--foreground)",
  accent = "var(--primary)",
  cell = 44,
  interaction = "trail",
  flash = true,
  fade = true,
  children,
  className,
}: {
  /** Colour of the grid lines. */
  color?: string;
  /** Colour of the lit squares. */
  accent?: string;
  /** Size of one square in pixels. */
  cell?: number;
  interaction?: "off" | "trail";
  /** Random squares blink when idle. */
  flash?: boolean;
  /** Soften the grid toward the edges. */
  fade?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const live = useRef({ color, accent, cell, interaction, flash });

  useEffect(() => {
    live.current = { color, accent, cell, interaction, flash };
  });

  useEffect(() => {
    const el = host.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const heat = new Map<string, number>();
    const ptr = { x: -9999, y: -9999, on: false };
    let w = 0, h = 0, raf = 0, visible = true, last = 0, nextFlash = 0;
    let key = "", ink: [number, number, number] = [255, 255, 255], lit: [number, number, number] = [255, 255, 255];

    const resize = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const hit = (cx: number, cy: number, v: number) => {
      const k = `${cx},${cy}`;
      heat.set(k, Math.max(heat.get(k) ?? 0, v));
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || w < 2) return;
      const p = live.current;
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      const k = p.color + "|" + p.accent;
      if (k !== key) { key = k; ink = toRgb(el, p.color); lit = toRgb(el, p.accent); }

      const s = Math.max(16, p.cell);
      if (p.interaction === "trail" && ptr.on) hit(Math.floor(ptr.x / s), Math.floor(ptr.y / s), 1);
      if (p.flash && (!ptr.on || p.interaction === "off")) {
        nextFlash -= dt;
        if (nextFlash <= 0) {
          nextFlash = 0.25 + Math.random() * 0.5;
          hit(Math.floor((Math.random() * w) / s), Math.floor((Math.random() * h) / s), 0.7 + Math.random() * 0.3);
        }
      }

      ctx.clearRect(0, 0, w, h);

      // lit squares
      for (const [id, v] of heat) {
        const nv = v - dt * 0.9;
        if (nv <= 0.01) { heat.delete(id); continue; }
        heat.set(id, nv);
        const [cx, cy] = id.split(",").map(Number);
        const e = nv * nv;
        ctx.fillStyle = `rgba(${lit[0]},${lit[1]},${lit[2]},${(e * 0.32).toFixed(3)})`;
        ctx.fillRect(cx * s, cy * s, s, s);
        ctx.strokeStyle = `rgba(${lit[0]},${lit[1]},${lit[2]},${(e * 0.9).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(cx * s + 0.5, cy * s + 0.5, s - 1, s - 1);
      }

      // the grid itself, drawn on top so lit squares keep crisp edges
      ctx.strokeStyle = `rgba(${ink[0]},${ink[1]},${ink[2]},0.12)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= w; x += s) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, h); }
      for (let y = 0; y <= h; y += s) { ctx.moveTo(0, y + 0.5); ctx.lineTo(w, y + 0.5); }
      ctx.stroke();
    };

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
      ptr.on = true;
    };
    const leave = () => { ptr.on = false; };

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
      <canvas
        ref={canvas}
        className="absolute inset-0 size-full"
        style={fade ? { WebkitMaskImage: "radial-gradient(ellipse at center, #000 35%, transparent 95%)", maskImage: "radial-gradient(ellipse at center, #000 35%, transparent 95%)" } : undefined}
        aria-hidden
      />
      {children && <div className="pointer-events-none relative z-10 grid h-full min-h-[inherit] place-items-center">{children}</div>}
    </div>
  );
}
