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

type Star = { x: number; y: number; z: number; r: number; tw: number; rate: number };
type Meteor = { x: number; y: number; vx: number; vy: number; life: number };

/**
 * A quiet night sky. Three layers of stars sit at different depths, twinkle softly and drift
 * almost imperceptibly. The pointer shifts the layers by different amounts for a calm sense of
 * depth, and once in a while a shooting star crosses. No nebulae, no glow, just stars.
 */
export function Starfield({
  color = "var(--foreground)",
  density = 1,
  speed = 1,
  twinkle = 0.5,
  interaction = "parallax",
  shooting = true,
  children,
  className,
}: {
  /** Star colour. */
  color?: string;
  /** How many stars, around 1. */
  density?: number;
  /** Drift speed. 0 freezes the sky. */
  speed?: number;
  /** How much the stars twinkle, from 0 to 1. */
  twinkle?: number;
  interaction?: "off" | "parallax";
  /** An occasional shooting star. */
  shooting?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const live = useRef({ color, density, speed, twinkle, interaction, shooting });

  useEffect(() => {
    live.current = { color, density, speed, twinkle, interaction, shooting };
  });

  useEffect(() => {
    const el = host.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const look = { x: 0, y: 0, tx: 0, ty: 0 };
    let w = 0, h = 0, raf = 0, visible = true, t = 0, last = 0, nextMeteor = 4;
    let stars: Star[] = [];
    let builtFor = 0;
    const meteors: Meteor[] = [];
    let rgbKey = "", rgb: [number, number, number] = [255, 255, 255];

    const build = () => {
      const n = Math.round(((w * h) / 2200) * live.current.density);
      builtFor = live.current.density;
      stars = Array.from({ length: n }, () => {
        const z = Math.random() < 0.7 ? 0 : Math.random() < 0.78 ? 1 : 2;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: [0.55, 0.9, 1.35][z] * (0.8 + Math.random() * 0.4),
          tw: Math.random() * Math.PI * 2,
          rate: 0.4 + Math.random() * 1.2,
        };
      });
    };

    const resize = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || w < 2) return;
      const p = live.current;
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      t += dt;
      if (builtFor !== p.density) build();
      if (rgbKey !== p.color) { rgbKey = p.color; rgb = toRgb(el, p.color); }
      look.x += (look.tx - look.x) * 0.04;
      look.y += (look.ty - look.y) * 0.04;

      ctx.clearRect(0, 0, w, h);
      const depth = [4, 10, 18];
      const drift = [3, 6, 10];
      for (const s of stars) {
        s.x -= drift[s.z] * p.speed * dt;
        s.y -= drift[s.z] * 0.35 * p.speed * dt;
        if (s.x < -2) s.x += w + 4;
        if (s.y < -2) s.y += h + 4;
        const px = s.x + look.x * depth[s.z];
        const py = s.y + look.y * depth[s.z];
        const base = [0.5, 0.8, 1][s.z];
        const a = base * (1 - p.twinkle * 0.5 * (0.5 + 0.5 * Math.sin(t * s.rate + s.tw)));
        ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (p.shooting && !reduced) {
        nextMeteor -= dt;
        if (nextMeteor <= 0) {
          nextMeteor = 6 + Math.random() * 9;
          const fromLeft = Math.random() < 0.5;
          meteors.push({ x: fromLeft ? Math.random() * w * 0.5 : w * 0.5 + Math.random() * w * 0.5, y: Math.random() * h * 0.4, vx: (fromLeft ? 1 : -1) * (420 + Math.random() * 220), vy: 180 + Math.random() * 120, life: 1 });
        }
        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i];
          m.x += m.vx * dt;
          m.y += m.vy * dt;
          m.life -= dt * 1.3;
          if (m.life <= 0) { meteors.splice(i, 1); continue; }
          const len = 90;
          const k = Math.hypot(m.vx, m.vy);
          const tx = m.x - (m.vx / k) * len, ty = m.y - (m.vy / k) * len;
          const g = ctx.createLinearGradient(m.x, m.y, tx, ty);
          g.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${(0.9 * m.life).toFixed(3)})`);
          g.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.2;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(tx, ty);
          ctx.stroke();
        }
      }
    };

    const move = (e: PointerEvent) => {
      if (live.current.interaction === "off") return;
      const r = el.getBoundingClientRect();
      look.tx = -(((e.clientX - r.left) / r.width) * 2 - 1);
      look.ty = -(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    const leave = () => { look.tx = look.ty = 0; };

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
