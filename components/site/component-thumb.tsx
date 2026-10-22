"use client";

import { useEffect, useRef, useState } from "react";
import { DEMOS } from "@/registry/demos";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { themeStyle, type ThemeId } from "@/lib/themes";

const VIRTUAL_WIDTH = 900;

/** A live, scaled down render of a component, mounted only when it scrolls into view. */
export function ComponentThumb({
  name,
  stage,
  theme,
  className,
}: {
  name: string;
  stage: "center" | "fill";
  theme?: ThemeId;
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [scale, setScale] = useState(0.35);
  const Demo = DEMOS[name];
  // Small loaders are magnified so they read clearly on a card.
  const zoom = stage === "center" ? 1.6 : 1;
  const virtualWidth = VIRTUAL_WIDTH / zoom;

  const stageRef = useRef<HTMLDivElement>(null);

  // Reveal only once the demo has really drawn something. Its code loads on demand, so a fixed
  // timer would fade the skeleton out over an empty card.
  useEffect(() => {
    if (!visible || ready) return;
    let tries = 0;
    const id = setInterval(() => {
      tries++;
      const el = stageRef.current;
      const drawn = !!el && el.firstElementChild !== null && el.getBoundingClientRect().width > 0;
      if (drawn || tries > 60) {
        // two frames so the first paint lands before the skeleton fades
        requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
        clearInterval(id);
      }
    }, 120);
    return () => clearInterval(id);
  }, [visible, ready]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setScale(el.clientWidth / VIRTUAL_WIDTH);
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(el);
    // Start a long way before the card scrolls in, and never tear it down again. Unmounting on the
    // way out is what made cards flash blank when scrolling back.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "900px 900px" }
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
        "pointer-events-none relative aspect-[16/10] overflow-hidden bg-background text-foreground [contain:layout_paint]",
        stage === "center" && "bg-dots",
        className
      )}
      style={themeStyle(theme)}
      aria-hidden
    >
      <Skeleton className={cn("absolute inset-0 z-10 rounded-none transition-opacity duration-500", ready ? "opacity-0" : "opacity-100")} />
      {visible && Demo && (
        <div
          ref={stageRef}
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
