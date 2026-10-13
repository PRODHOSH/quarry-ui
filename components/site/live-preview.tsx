"use client";

import { useEffect, useRef, useState } from "react";

const W = 1440;
const H = 900;

/** A scaled, live iframe of a template, mounted when it scrolls into view. Clicks go to the real preview. */
export function LivePreview({ src, title, interactive = false }: { src: string; title: string; interactive?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / W));
    ro.observe(el);
    setScale(el.clientWidth / W);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { rootMargin: "200px" });
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);

  return (
    <div ref={box} className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border bg-card shadow-2xl">
      {on && (
        <iframe
          src={src}
          title={`${title} live preview`}
          loading="lazy"
          tabIndex={interactive ? 0 : -1}
          className={interactive ? "absolute left-0 top-0 origin-top-left border-0" : "pointer-events-none absolute left-0 top-0 origin-top-left border-0"}
          style={{ width: W, height: H, transform: `scale(${scale})` }}
        />
      )}
    </div>
  );
}
