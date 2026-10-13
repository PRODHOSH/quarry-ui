"use client";

import { useState, type CSSProperties } from "react";
import { Moon, Sun } from "lucide-react";
import { FeatureBento } from "@/registry/quarry/feature-bento";
import { cn } from "@/lib/utils";

type Theme = { id: string; label: string; hue: number | null; chroma: number };
type Scheme = "dark" | "light";

const THEMES: Theme[] = [
  { id: "mono", label: "Mono", hue: null, chroma: 0 },
  { id: "indigo", label: "Indigo", hue: 275, chroma: 0.17 },
  { id: "emerald", label: "Emerald", hue: 160, chroma: 0.15 },
  { id: "rose", label: "Rose", hue: 12, chroma: 0.18 },
  { id: "amber", label: "Amber", hue: 75, chroma: 0.15 },
];

/** The only thing that changes between themes: a handful of CSS variables. */
function tokens(theme: Theme, scheme: Scheme): Record<string, string> {
  if (theme.hue === null) return {};
  const h = theme.hue;
  const c = theme.chroma;
  const L = scheme === "dark" ? 0.72 : 0.55;
  const tone = (shift: number) => `oklch(${L} ${c} ${(h + shift + 360) % 360})`;
  return {
    "--primary": tone(0),
    "--primary-foreground": scheme === "dark" ? `oklch(0.16 0.03 ${h})` : "oklch(0.99 0 0)",
    "--accent": scheme === "dark" ? `oklch(0.3 0.05 ${h})` : `oklch(0.95 0.03 ${h})`,
    "--accent-foreground": scheme === "dark" ? `oklch(0.95 0.03 ${h})` : `oklch(0.3 0.08 ${h})`,
    "--ring": `oklch(${L} ${c} ${h} / 40%)`,
    "--chart-1": tone(0),
    "--chart-2": tone(45),
    "--chart-3": tone(-45),
    "--chart-4": tone(95),
    "--chart-5": tone(-95),
  };
}

export function ThemeShowcase() {
  const [themeId, setThemeId] = useState("indigo");
  const [scheme, setScheme] = useState<Scheme>("dark");
  const theme = THEMES.find((t) => t.id === themeId)!;
  const vars = tokens(theme, scheme);

  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="overflow-hidden rounded-2xl border">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b px-5 py-3.5">
          <div className="flex items-center gap-1" role="radiogroup" aria-label="Theme">
            {THEMES.map((t) => {
              const on = t.id === themeId;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  aria-label={t.label}
                  onClick={() => setThemeId(t.id)}
                  className={cn(
                    "group flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 text-sm transition-colors",
                    on ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span
                    className="size-5 rounded-full border border-foreground/15 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background:
                        t.hue === null
                          ? "linear-gradient(135deg, oklch(0.97 0 0) 50%, oklch(0.2 0 0) 50%)"
                          : `oklch(0.7 ${t.chroma} ${t.hue})`,
                    }}
                  />
                  <span className={cn("font-normal", on && "font-medium")}>{t.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <code className="hidden font-mono text-xs text-muted-foreground md:block">
              --primary: {vars["--primary"] ?? (scheme === "dark" ? "oklch(0.97 0 0)" : "oklch(0.18 0 0)")}
            </code>
            <div className="flex rounded-full bg-muted p-0.5">
              {(["dark", "light"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-label={`${s} mode`}
                  aria-pressed={scheme === s}
                  onClick={() => setScheme(s)}
                  className={cn(
                    "grid size-7 place-items-center rounded-full transition-colors",
                    scheme === s ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {s === "dark" ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className={cn(
            scheme,
            "bg-background text-foreground transition-colors duration-500 [&_*]:transition-[background-color,border-color,color] [&_*]:duration-500"
          )}
          style={vars as CSSProperties}
        >
          <FeatureBento className="py-14" />
        </div>
      </div>
    </div>
  );
}
