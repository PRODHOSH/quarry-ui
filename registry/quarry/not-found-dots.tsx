"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type Dot = { hx: number; hy: number; x: number; y: number; vx: number; vy: number };

/**
 * A 404 made of dots. The numerals are sampled from real text, so every dot has a home. Move the
 * pointer through them and the dots scatter, then spring back into place. Colour follows `primary`.
 */
export function NotFoundDots({
  title = "We looked everywhere",
  message = "Even the dusty corners. This page is simply not here, but the rest of the site is.",
  href = "/",
  cta = "Back to home",
  className,
}: {
  title?: string;
  message?: string;
  href?: string;
  cta?: string;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const box = wrap.current;
    if (!el || !box) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dots: Dot[] = [];
    let w = 0;
    let h = 0;
    let gap = 14;
    let raf = 0;
    let running = false;
    const mouse = { x: -999, y: -999 };
    let color = "#000";

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = box.clientWidth;
      h = box.clientHeight;
      if (w < 2 || h < 2) {
        dots = [];
        return;
      }
      el.width = w * dpr;
      el.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cs = getComputedStyle(el);
      color = cs.getPropertyValue("--primary").trim() || cs.color;

      gap = w < 520 ? 9 : 13;
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const o = off.getContext("2d")!;
      const size = Math.min(h * 0.95, w * 0.5);
      o.font = `900 ${size}px ui-sans-serif, system-ui, sans-serif`;
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.fillStyle = "#000";
      o.fillText("404", w / 2, h / 2 + size * 0.04);
      const data = o.getImageData(0, 0, w, h).data;
      dots = [];
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          if (data[(Math.floor(y) * w + Math.floor(x)) * 4 + 3] > 140) dots.push({ hx: x, hy: y, x, y, vx: 0, vy: 0 });
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      const reach = 90;
      for (const d of dots) {
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < reach && dist > 0.1) {
          const f = (1 - dist / reach) * 7;
          d.vx += (dx / dist) * f;
          d.vy += (dy / dist) * f;
        }
        d.vx += (d.hx - d.x) * 0.045;
        d.vy += (d.hy - d.y) * 0.045;
        d.vx *= 0.86;
        d.vy *= 0.86;
        d.x += d.vx;
        d.y += d.vy;
        const lift = Math.min(1, Math.hypot(d.x - d.hx, d.y - d.hy) / 40);
        ctx.beginPath();
        ctx.arc(d.x, d.y, 2.6 + lift * 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || still) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    build();
    draw();
    const ro = new ResizeObserver(() => { build(); draw(); });
    ro.observe(box);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(box);

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const leave = () => { mouse.x = mouse.y = -999; };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <section className={cn("mx-auto flex w-full max-w-5xl flex-col px-6 py-10", className)}>
      <div ref={wrap} className="relative h-[min(24rem,52vw)] min-h-[13rem] w-full">
        <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full text-primary" />
        <span className="sr-only">Error 404</span>
      </div>
      <div className="mt-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-md text-muted-foreground">{message}</p>
        </div>
        <a href={href} className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-transform active:scale-95">
          <ArrowLeft className="size-4" /> {cta}
        </a>
      </div>
    </section>
  );
}
