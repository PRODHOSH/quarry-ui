"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Five lights come on one by one, hold, then go out together. Use it as a first-load intro,
 * or keep it inline. Sound is off by default and uses two short synthesized tones, no audio files.
 */
export function LightsOutLoader({
  lights = 5,
  stepMs = 220,
  holdMs = 260,
  sound = false,
  fullscreen = false,
  runKey = 0,
  onDone,
  className,
}: {
  lights?: number;
  stepMs?: number;
  holdMs?: number;
  sound?: boolean;
  /** Cover the whole viewport, then fade away when the sequence ends. */
  fullscreen?: boolean;
  /** Change this value to play the sequence again. */
  runKey?: number;
  onDone?: () => void;
  className?: string;
}) {
  const [lit, setLit] = useState(0);
  const [out, setOut] = useState(false);
  const [gone, setGone] = useState(false);
  const done = useRef(onDone);

  useEffect(() => {
    done.current = onDone;
  });

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = sound && typeof AudioContext !== "undefined" ? new AudioContext() : null;
    const tone = (hz: number, ms: number) => {
      if (!ctx) return;
      try {
        void ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = hz;
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + ms / 1000);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + ms / 1000);
      } catch {}
    };

    // Restarting the sequence when runKey changes is exactly what this effect is for.
    /* eslint-disable react-hooks/set-state-in-effect */
    setLit(0);
    setOut(false);
    setGone(false);
    /* eslint-enable react-hooks/set-state-in-effect */
    const timers: number[] = [];
    const step = reduced ? 0 : stepMs;
    for (let i = 1; i <= lights; i++) {
      timers.push(window.setTimeout(() => { setLit(i); tone(700, 90); }, i * step));
    }
    const dark = lights * step + (reduced ? 0 : holdMs);
    timers.push(window.setTimeout(() => { setOut(true); tone(320, 240); }, dark));
    timers.push(window.setTimeout(() => { setGone(true); done.current?.(); }, dark + 450));
    return () => {
      timers.forEach(clearTimeout);
      void ctx?.close().catch(() => {});
    };
  }, [lights, stepMs, holdMs, sound, runKey]);

  if (fullscreen && gone) return null;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "flex items-center justify-center gap-3 sm:gap-4",
        fullscreen && "fixed inset-0 z-[100] bg-background transition-opacity duration-500",
        fullscreen && out && "opacity-0",
        className
      )}
    >
      {Array.from({ length: lights }).map((_, i) => {
        const on = !out && i < lit;
        return (
          <span
            key={i}
            className={cn(
              "size-9 rounded-full border-2 transition-all duration-150 sm:size-12",
              on ? "border-primary bg-primary shadow-[0_0_28px_var(--primary)]" : "border-border bg-transparent"
            )}
          />
        );
      })}
      <span className="sr-only">Lights out and away we go</span>
    </div>
  );
}
