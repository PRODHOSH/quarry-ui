"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Cell = { x: number; y: number; ch: string; heat: number };

const GLYPHS = ["/", "\\", "|", ":", "-", "+"];

/**
 * A 404 drawn in text characters. The numerals are sampled from real type and filled with slashes
 * and bars that shimmer on their own. Drag the pointer across the digits and the characters under
 * it flare up in your `primary` colour, then cool off.
 */
export function NotFoundAscii({
  kicker = "404 / OFF THE MAP",
  title = "That address is empty",
  message = "No page lives here. Head back to the start, or spend a second poking the digits.",
  hint = "TRY TOUCHING THE DIGITS",
  href = "/",
  cta = "Take me back",
  className,
}: {
  kicker?: string;
  title?: string;
  message?: string;
  hint?: string;
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
    let cells: Cell[] = [];
    let w = 0;
    let h = 0;
    let step = 12;
    let raf = 0;
    let running = false;
    let last = 0;
    const mouse = { x: -999, y: -999 };
    let ink = "#000";
    let accent = "#f90";

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = box.clientWidth;
      h = box.clientHeight;
      if (w < 2 || h < 2) {
        cells = [];
        return;
      }
      el.width = w * dpr;
      el.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cs = getComputedStyle(el);
      ink = cs.color;
      accent = cs.getPropertyValue("--primary").trim() || ink;

      step = w < 520 ? 9 : 12;
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
      cells = [];
      for (let y = step / 2; y < h; y += step) {
        for (let x = step / 2; x < w; x += step * 0.62) {
          if (data[(Math.floor(y) * w + Math.floor(x)) * 4 + 3] > 140) {
            cells.push({ x, y, ch: GLYPHS[Math.floor(Math.random() * GLYPHS.length)], heat: 0 });
          }
        }
      }
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.font = `600 ${step}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const reshuffle = t - last > 120;
      if (reshuffle) last = t;
      for (const c of cells) {
        if (reshuffle && Math.random() < 0.04) c.ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const d = Math.hypot(c.x - mouse.x, c.y - mouse.y);
        if (d < 70) c.heat = Math.min(1, c.heat + (1 - d / 70) * 0.6);
        c.heat *= 0.94;
        ctx.globalAlpha = 0.7 + c.heat * 0.3;
        ctx.fillStyle = c.heat > 0.12 ? accent : ink;
        ctx.fillText(c.ch, c.x, c.y);
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      draw(t);
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
    draw(0);
    const ro = new ResizeObserver(() => { build(); draw(0); });
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
    <section className={cn("mx-auto w-full max-w-5xl px-6 py-10", className)}>
      <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground">{kicker}</p>
      <div ref={wrap} className="relative mt-4 h-[min(22rem,48vw)] min-h-[12rem] w-full">
        <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full touch-none text-foreground" />
        <span className="sr-only">Error 404</span>
      </div>
      <h1 className="mt-8 text-4xl font-medium tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-3 max-w-lg leading-relaxed text-muted-foreground">{message}</p>
      <div className="mt-7 flex items-center gap-5">
        <a href={href} className="inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-transform active:scale-95">
          {cta}
        </a>
        <span className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground">{hint}</span>
      </div>
    </section>
  );
}
