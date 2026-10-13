"use client";

import { useEffect, useRef, useState } from "react";
import { DEMOS } from "@/registry/demos";
import { cn } from "@/lib/utils";

const VIRTUAL_WIDTH = 900;

/** A live, scaled down render of a component, mounted only when it scrolls into view. */
export function ComponentThumb({
  name,
  stage,
  className,
}: {
  name: string;
  stage: "center" | "fill";
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [scale, setScale] = useState(0.35);
  const Demo = DEMOS[name];
  // Small loaders are magnified so they read clearly on a card.
  const zoom = stage === "center" ? 1.6 : 1;
  const virtualWidth = VIRTUAL_WIDTH / zoom;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setScale(el.clientWidth / VIRTUAL_WIDTH);
    measure();
    // Mount straight away when already on screen; the observer handles everything below the fold.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 120 && rect.bottom > -120) setVisible(true);
    const resize = new ResizeObserver(measure);
    resize.observe(el);
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "120px" }
    );
    io.observe(el);
    return () => {
      resize.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={box}
      className={cn(
        "pointer-events-none relative aspect-[16/10] overflow-hidden bg-background",
        stage === "center" && "bg-dots",
        className
      )}
      aria-hidden
    >
      {visible && Demo && (
        <div
          className={cn(
            "absolute left-0 top-0 flex origin-top-left items-center",
            stage === "center" && "justify-center"
          )}
          style={{
            width: virtualWidth,
            height: (virtualWidth * 10) / 16,
            transform: `scale(${scale * zoom})`,
          }}
        >
          <Demo />
        </div>
      )}
    </div>
  );
}
