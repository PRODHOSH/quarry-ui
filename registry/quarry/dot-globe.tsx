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

const hash3 = (x: number, y: number, z: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
};
const sm = (t: number) => t * t * (3 - 2 * t);
const noise3 = (x: number, y: number, z: number) => {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  const fx = sm(x - ix), fy = sm(y - iy), fz = sm(z - iz);
  const l = (a: number, b: number, t: number) => a + (b - a) * t;
  return l(
    l(l(hash3(ix, iy, iz), hash3(ix + 1, iy, iz), fx), l(hash3(ix, iy + 1, iz), hash3(ix + 1, iy + 1, iz), fx), fy),
    l(l(hash3(ix, iy, iz + 1), hash3(ix + 1, iy, iz + 1), fx), l(hash3(ix, iy + 1, iz + 1), hash3(ix + 1, iy + 1, iz + 1), fx), fy),
    fz
  );
};
const land = (x: number, y: number, z: number) => noise3(x * 1.7 + 3, y * 1.7, z * 1.7) * 0.62 + noise3(x * 3.6, y * 3.6 + 5, z * 3.6) * 0.38;

type V = [number, number, number];
const slerp = (a: V, b: V, t: number): V => {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const om = Math.acos(dot);
  if (om < 1e-4) return a;
  const s = Math.sin(om);
  const k1 = Math.sin((1 - t) * om) / s, k2 = Math.sin(t * om) / s;
  return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
};

/**
 * A rotating globe made of dots. Continents are carved from noise so it reads as a planet without
 * any map data, and glowing arcs fly between points on land. Drag to spin it with real inertia,
 * and dots under the pointer light up.
 */
export function DotGlobe({
  color = "var(--foreground)",
  accent = "var(--primary)",
  interaction = "drag",
  dots = 1600,
  size = 1,
  spin = 1,
  arcs = 6,
  children,
  className,
}: {
  /** Colour of the land dots. */
  color?: string;
  /** Colour of the arcs and the hover glow. */
  accent?: string;
  interaction?: "off" | "drag";
  /** Number of dots on the sphere. */
  dots?: number;
  /** Globe size relative to the area, around 1. */
  size?: number;
  /** Idle rotation speed. */
  spin?: number;
  /** How many arcs are in flight at once. */
  arcs?: number;
  children?: ReactNode;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const live = useRef({ color, accent, interaction, dots, size, spin, arcs });

  useEffect(() => {
    live.current = { color, accent, interaction, dots, size, spin, arcs };
  });

  useEffect(() => {
    const el = host.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, visible = true, last = 0;
    let yaw = 0.6, pitch = 0.35, vyaw = 0, vpitch = 0;
    const ptr = { x: -9999, y: -9999, down: false, lx: 0, ly: 0 };
    const cache: Record<string, { key: string; rgb: [number, number, number] }> = {};
    const rgb = (n: string, css: string) => {
      const c = cache[n];
      if (c && c.key === css) return c.rgb;
      const v = toRgb(el, css);
      cache[n] = { key: css, rgb: v };
      return v;
    };

    let pts: { p: V; land: boolean }[] = [];
    let builtFor = 0;
    const build = (n: number) => {
      pts = [];
      const gold = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < n; i++) {
        const y = 1 - (i / (n - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const th = gold * i;
        const p: V = [Math.cos(th) * r, y, Math.sin(th) * r];
        pts.push({ p, land: land(p[0], p[1], p[2]) > 0.5 });
      }
      builtFor = n;
    };

    type Arc = { a: V; b: V; t: number; speed: number };
    const flights: Arc[] = [];
    const landPts = () => pts.filter((q) => q.land);
    const spawn = (): Arc | null => {
      const L = landPts();
      if (L.length < 2) return null;
      const a = L[Math.floor(Math.random() * L.length)].p;
      let b = L[Math.floor(Math.random() * L.length)].p;
      for (let k = 0; k < 6 && Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) < 0.7; k++) b = L[Math.floor(Math.random() * L.length)].p;
      return { a, b, t: 0, speed: 0.12 + Math.random() * 0.18 };
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

    const project = (p: V, R: number, lift = 1): [number, number, number] => {
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const x1 = p[0] * cy + p[2] * sy;
      const z1 = -p[0] * sy + p[2] * cy;
      const y2 = p[1] * cp - z1 * sp;
      const z2 = p[1] * sp + z1 * cp;
      return [w / 2 + x1 * R * lift, h / 2 - y2 * R * lift, z2];
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || w < 2) return;
      const p = live.current;
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      if (builtFor !== Math.round(p.dots)) { build(Math.round(p.dots)); flights.length = 0; }

      if (ptr.down) { /* velocity set in move */ } else {
        yaw += (vyaw + dt * 0.12 * p.spin) * 1;
        pitch += vpitch;
        vyaw *= 0.94;
        vpitch *= 0.9;
        pitch += (0.3 - pitch) * 0.01;
      }
      pitch = Math.max(-1, Math.min(1, pitch));

      const R = Math.min(w, h) * 0.4 * p.size;
      const c = rgb("c", p.color), a = rgb("a", p.accent);
      ctx.clearRect(0, 0, w, h);

      // atmosphere
      const glow = ctx.createRadialGradient(w / 2, h / 2, R * 0.7, w / 2, h / 2, R * 1.35);
      glow.addColorStop(0, `rgba(${a[0]},${a[1]},${a[2]},0.16)`);
      glow.addColorStop(1, `rgba(${a[0]},${a[1]},${a[2]},0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      for (const q of pts) {
        const [sx, sy, z] = project(q.p, R);
        const front = z > 0;
        let alpha = front ? 0.25 + z * 0.75 : 0.05;
        let r = (q.land ? 1.5 : 0.9) * (0.6 + (z + 1) * 0.35) * (R / 260 + 0.55);
        let col = c;
        if (front && ptr.x > -999) {
          const d = Math.hypot(sx - ptr.x, sy - ptr.y);
          if (d < 46) {
            const k = 1 - d / 46;
            r *= 1 + k * 1.6;
            alpha = Math.min(1, alpha + k);
            col = a;
          }
        }
        if (!q.land) alpha *= 0.4;
        ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // arcs in flight
      while (flights.length < p.arcs) {
        const f = spawn();
        if (!f) break;
        f.t = Math.random() * 0.4;
        flights.push(f);
      }
      while (flights.length > p.arcs) flights.pop();
      for (let i = flights.length - 1; i >= 0; i--) {
        const f = flights[i];
        f.t += dt * f.speed;
        if (f.t > 1.35) { const n = spawn(); if (n) flights[i] = n; continue; }
        const head = Math.min(1, f.t), tail = Math.max(0, f.t - 0.5);
        const steps = 28;
        let prev: [number, number, number] | null = null;
        for (let s = 0; s <= steps; s++) {
          const u = tail + ((head - tail) * s) / steps;
          const v = slerp(f.a, f.b, u);
          const bulge = 1 + Math.sin(Math.PI * u) * 0.28;
          const pr = project(v, R, bulge);
          if (prev && (pr[2] > -0.1 || prev[2] > -0.1)) {
            const fade = (s / steps) * (pr[2] > 0 ? 1 : 0.25);
            ctx.strokeStyle = `rgba(${a[0]},${a[1]},${a[2]},${(fade * 0.9).toFixed(3)})`;
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.moveTo(prev[0], prev[1]);
            ctx.lineTo(pr[0], pr[1]);
            ctx.stroke();
          }
          prev = pr;
        }
        if (prev && prev[2] > 0 && f.t < 1) {
          ctx.fillStyle = `rgba(${a[0]},${a[1]},${a[2]},0.95)`;
          ctx.beginPath();
          ctx.arc(prev[0], prev[1], 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const down = (e: PointerEvent) => {
      if (live.current.interaction === "off") return;
      ptr.down = true;
      ptr.lx = e.clientX;
      ptr.ly = e.clientY;
      vyaw = vpitch = 0;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
      if (ptr.down) {
        const dx = e.clientX - ptr.lx, dy = e.clientY - ptr.ly;
        ptr.lx = e.clientX;
        ptr.ly = e.clientY;
        yaw += dx * 0.006;
        pitch += dy * 0.004;
        vyaw = dx * 0.006;
        vpitch = dy * 0.004 * 0.5;
      }
    };
    const up = () => { ptr.down = false; };
    const leave = () => { ptr.x = ptr.y = -9999; };

    resize();
    build(Math.round(live.current.dots));
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(el);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("pointerleave", leave);
    if (reduced) { frame(0); cancelAnimationFrame(raf); } else raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={host} className={cn("relative isolate h-full min-h-[24rem] w-full touch-pan-y overflow-hidden bg-background", className)}>
      <canvas ref={canvas} className="absolute inset-0 size-full cursor-grab active:cursor-grabbing" aria-hidden />
      {children && <div className="pointer-events-none relative z-10 grid h-full min-h-[inherit] place-items-center">{children}</div>}
    </div>
  );
}
