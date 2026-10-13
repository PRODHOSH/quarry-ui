"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The real film: a real Claude Code session, the real site, a voiceover and sound design.
 * Plays muted while it is on screen; one click turns the sound on from the top.
 */
export function HeroFilm({ className }: { className?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (!soundOn) {
      el.muted = false;
      el.currentTime = 0;
      el.play().catch(() => {});
      setSoundOn(true);
    } else {
      el.muted = true;
      setSoundOn(false);
    }
  };

  return (
    <div className={cn("group relative overflow-hidden rounded-2xl border bg-black", className)}>
      <video
        ref={video}
        muted
        loop
        playsInline
        preload="metadata"
        poster="/video/poster.jpg"
        className="aspect-[9/16] max-h-[78vh] w-full object-cover md:aspect-video md:max-h-none"
      >
        <source src="/video/quarry-film-v.mp4" media="(max-width: 767px)" type="video/mp4" />
        <source src="/video/quarry-film-h.mp4" type="video/mp4" />
      </video>

      <button
        type="button"
        onClick={toggle}
        aria-pressed={soundOn}
        className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-background/85 px-4 py-2 text-sm font-medium text-foreground shadow-lg backdrop-blur transition-transform hover:scale-[1.03]"
      >
        {soundOn ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
        {soundOn ? "Sound on" : "Play with sound"}
      </button>
      <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-background/70 px-3 py-1 text-xs font-normal text-muted-foreground backdrop-blur">
        Real session · 20s
      </span>
    </div>
  );
}
