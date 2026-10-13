"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/**
 * A custom video player with a clean control bar. Click the picture to play or pause, drag the
 * scrubber, set the volume, go fullscreen, and use Space, M and F from the keyboard. Controls hide
 * themselves while playing and return on movement.
 */
export function VideoPlayer({
  src = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  poster,
  className,
}: {
  src?: string;
  poster?: string;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const idle = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [show, setShow] = useState(true);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };
  const wake = () => {
    setShow(true);
    clearTimeout(idle.current);
    idle.current = setTimeout(() => video.current && !video.current.paused && setShow(false), 2200);
  };
  useEffect(() => () => clearTimeout(idle.current), []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "k") { e.preventDefault(); toggle(); }
    if (e.key === "m") setMuted((m) => !m);
    if (e.key === "f") wrap.current?.requestFullscreen?.();
    wake();
  };

  const pct = dur ? (time / dur) * 100 : 0;

  return (
    <div
      ref={wrap}
      tabIndex={0}
      onKeyDown={onKey}
      onPointerMove={wake}
      onPointerLeave={() => playing && setShow(false)}
      className={cn("group relative aspect-video w-full max-w-2xl overflow-hidden rounded-2xl border bg-black outline-none focus-visible:ring-2 focus-visible:ring-primary", className)}
    >
      <video
        ref={video}
        src={src}
        poster={poster}
        muted={muted}
        playsInline
        loop
        onClick={toggle}
        onPlay={() => { setPlaying(true); wake(); }}
        onPause={() => { setPlaying(false); setShow(true); }}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
        className="size-full cursor-pointer object-cover"
      />

      <AnimatePresence>
        {!playing && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            onClick={toggle}
            aria-label="Play video"
            className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-black shadow-xl backdrop-blur transition-transform hover:scale-105"
          >
            <Play className="ml-0.5 size-6 fill-current" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ opacity: show ? 1 : 0, y: show ? 0 : 8 }}
        transition={{ duration: 0.22 }}
        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-3 pt-10 text-white"
      >
        <input
          type="range"
          min={0}
          max={dur || 1}
          step={0.01}
          value={time}
          aria-label="Seek"
          onChange={(e) => { if (video.current) video.current.currentTime = Number(e.target.value); setTime(Number(e.target.value)); }}
          style={{ background: `linear-gradient(to right, white ${pct}%, rgba(255,255,255,.28) ${pct}%)` }}
          className="h-1 w-full cursor-pointer appearance-none rounded-full [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:size-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white"
        />
        <div className="mt-2.5 flex items-center gap-3 text-xs">
          <button onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="transition-transform active:scale-90">
            {playing ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
          </button>
          <button onClick={() => setMuted((m) => !m)} aria-label={muted ? "Unmute" : "Mute"} className="transition-transform active:scale-90">
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
          <span className="tabular-nums opacity-80">{fmt(time)} / {fmt(dur)}</span>
          <button onClick={() => wrap.current?.requestFullscreen?.()} aria-label="Fullscreen" className="ml-auto transition-transform active:scale-90">
            <Maximize className="size-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
