"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, RotateCcw, Waves } from "lucide-react";
import { ANIMALS, COLORWAYS, type Colorway } from "@/components/abyss/ascii-aquarium";
import { useSettings, type Look } from "@/lib/abyss/settings";
import { cn } from "@/lib/utils";

const GROUPS = ["Ocean", "Sky", "Land"] as const;
const LOOKS: { id: Look; label: string }[] = [
  { id: "auto", label: "Auto" },
  { id: "tiles", label: "Tiles" },
  { id: "glyphs", label: "Glyphs" },
];
const SWATCH_KEYS = Object.keys(COLORWAYS) as Exclude<Colorway, "theme">[];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function Slider({ value, min, max, step, onChange, label }: { value: number; min: number; max: number; step: number; onChange: (v: number) => void; label: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <input type="range" aria-label={label} min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-1 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-border accent-primary" />
      <span className="w-8 shrink-0 text-right text-xs tabular-nums text-muted-foreground">{value.toFixed(1)}x</span>
    </div>
  );
}

/** A small panel that tunes the scene: which animal, the colours, the pace and the size. */
export function Appearance({ className }: { className?: string }) {
  const { settings, set, reset } = useSettings();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const down = (e: PointerEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener("keydown", key);
    window.addEventListener("pointerdown", down);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("pointerdown", down);
    };
  }, [open]);

  return (
    <div ref={box} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-background/50 px-3.5 text-sm text-foreground/90 backdrop-blur-md transition-colors hover:bg-accent"
      >
        <Waves className="size-4" /> Scene
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-11 z-30 w-[min(22rem,calc(100vw-2rem))] origin-top-right space-y-5 rounded-2xl border border-border bg-card/90 p-4 shadow-2xl backdrop-blur-2xl"
          >
            <Row label="Creature">
              <div className="space-y-2.5">
                {GROUPS.map((g) => (
                  <div key={g} className="flex flex-wrap items-center gap-1.5">
                    <span className="w-12 text-xs text-muted-foreground">{g}</span>
                    {ANIMALS.filter((a) => a.group === g).map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => set({ animal: a.id })}
                        aria-pressed={settings.animal === a.id}
                        className={cn("rounded-full border px-2.5 py-1 text-xs transition-colors", settings.animal === a.id ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground")}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </Row>

            <Row label="Colour">
              <div className="flex flex-wrap gap-2">
                {SWATCH_KEYS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    title={COLORWAYS[k].label}
                    aria-label={COLORWAYS[k].label}
                    aria-pressed={settings.colorway === k}
                    onClick={() => set({ colorway: k })}
                    className={cn("grid size-8 place-items-center rounded-full border-2 transition-transform hover:scale-105", settings.colorway === k ? "border-foreground" : "border-transparent")}
                    style={{ background: `linear-gradient(135deg, ${COLORWAYS[k].bg} 0 45%, ${COLORWAYS[k].fam[0]} 45% 100%)`, boxShadow: "inset 0 0 0 1px rgb(127 127 127 / 0.35)" }}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => set({ colorway: "theme" })}
                  aria-pressed={settings.colorway === "theme"}
                  className={cn("rounded-full border px-2.5 text-xs transition-colors", settings.colorway === "theme" ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground")}
                >
                  Theme
                </button>
              </div>
            </Row>

            <Row label="Look">
              <div className="inline-flex rounded-full border border-border p-0.5">
                {LOOKS.map((l) => (
                  <button key={l.id} type="button" aria-pressed={settings.look === l.id} onClick={() => set({ look: l.id })} className={cn("rounded-full px-3 py-1 text-xs transition-colors", settings.look === l.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}>
                    {l.label}
                  </button>
                ))}
              </div>
            </Row>

            <div className="grid grid-cols-2 gap-5 [&>div]:min-w-0">
              <Row label="Speed">
                <Slider label="Speed" value={settings.speed} min={0.3} max={2} step={0.1} onChange={(v) => set({ speed: v })} />
              </Row>
              <Row label="Size">
                <Slider label="Size" value={settings.scale} min={0.6} max={1.5} step={0.1} onChange={(v) => set({ scale: v })} />
              </Row>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-3">
              <button type="button" onClick={() => set({ paused: !settings.paused })} className="inline-flex items-center gap-2 text-sm text-foreground/90 hover:text-foreground">
                {settings.paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
                {settings.paused ? "Play motion" : "Pause motion"}
              </button>
              <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                <RotateCcw className="size-3" /> Reset
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
