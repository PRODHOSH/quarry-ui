"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Interaction = "off" | "repel" | "attract" | "swirl";

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

type Particle = { x: number; y: number; life: number; hue: number };

/**
 * Thousands of tiny particles drifting along an invisible flow field and leaving soft trails.
 * The pointer can push them away, pull them in or spin them. Colours accept any CSS colour or token.
 */
export function FlowField({
  color = "var(--primary)",
  accent = "var(--foreground)",
  density = 900,
  speed = 1,
  interaction = "swirl",
  strength = 1,
  children,
  className,
}: {
  color?: string;
  accent?: string;
  /** Number of particles. */
  density?: number;
  speed?: number;
  interaction?: Interaction;
  /** How hard the pointer acts on the particles. */
  strength?: number;
  children?: ReactNode;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const live = useRef({ color, accent, density, speed, interaction, strength });

  useEffect(() => {
    live.current = { color, accent, density, speed, interaction, strength };
  });

  useEffect(() => {
    const el = host.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const ptr = { x: -9999, y: -9999 };
    let w = 0, h = 0, raf = 0, last = 0, visible = true;
    let particles: Particle[] = [];
    let rgbA: [number, number, number] = [255, 255, 255];
    let rgbB: [number, number, number] = [255, 255, 255];
    let keyA = "", keyB = "";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const spawn = (): Particle => ({ x: Math.random() * w, y: Math.random() * h, life: Math.random() * 200, hue: Math.random() });

    const resize = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: live.current.density }, spawn);
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const dt = Math.min(2, (now - last) / 16.67 || 1);
      last = now;
      const p = live.current;
      if (p.color !== keyA) { keyA = p.color; rgbA = toRgb(el, p.color); }
      if (p.accent !== keyB) { keyB = p.accent; rgbB = toRgb(el, p.accent); }
      while (particles.length < p.density) particles.push(spawn());
      particles.length = Math.min(particles.length, p.density);

      // fade what is already there, so each particle leaves a trail
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.07)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      const t = now * 0.00018 * p.speed;
      for (const pt of particles) {
        const a = (Math.sin(pt.x * 0.0042 + t * 2) + Math.cos(pt.y * 0.0051 - t * 1.4) + Math.sin((pt.x + pt.y) * 0.0021 + t)) * 1.6;
        let vx = Math.cos(a) * 1.1;
        let vy = Math.sin(a) * 1.1;
        if (p.interaction !== "off") {
          const dx = pt.x - ptr.x;
          const dy = pt.y - ptr.y;
          const d2 = dx * dx + dy * dy;
          const reach = 190;
          if (d2 < reach * reach && d2 > 1) {
            const d = Math.sqrt(d2);
            const f = (1 - d / reach) * 3.2 * p.strength;
            if (p.interaction === "repel") { vx += (dx / d) * f; vy += (dy / d) * f; }
            else if (p.interaction === "attract") { vx -= (dx / d) * f; vy -= (dy / d) * f; }
            else { vx += (-dy / d) * f; vy += (dx / d) * f; }
          }
        }
        const nx = pt.x + vx * p.speed * dt;
        const ny = pt.y + vy * p.speed * dt;
        const [r, g, b] = [rgbA[0] + (rgbB[0] - rgbA[0]) * pt.hue * 0.5, rgbA[1] + (rgbB[1] - rgbA[1]) * pt.hue * 0.5, rgbA[2] + (rgbB[2] - rgbA[2]) * pt.hue * 0.5];
        ctx.strokeStyle = `rgba(${r | 0},${g | 0},${b | 0},0.55)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(nx, ny);
        ctx.stroke();
        pt.x = nx;
        pt.y = ny;
        pt.life += dt;
        if (pt.x < -10 || pt.x > w + 10 || pt.y < -10 || pt.y > h + 10 || pt.life > 420) Object.assign(pt, spawn(), { life: 0 });
      }
    };

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
    };
    const leave = () => { ptr.x = ptr.y = -9999; };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(el);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    if (reduced) { for (let i = 0; i < 120; i++) frame(i * 16); cancelAnimationFrame(raf); } else raf = requestAnimationFrame(frame);

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
