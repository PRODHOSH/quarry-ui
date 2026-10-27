"use client";

import { useState } from "react";
import { Moon, RotateCcw, Sun } from "lucide-react";
import { DEMOS } from "@/registry/demos";
import { PLAYGROUNDS, type Control } from "@/registry/playgrounds";
import { cn } from "@/lib/utils";
import { themeStyle, type ThemeId } from "@/lib/themes";
import { useSiteTheme, type Scheme } from "@/components/site/use-site-theme";

/**
 * The one preview surface used by every component page.
 * Same height and same framing for every item, so nothing jumps around between pages.
 */
export function PreviewStage({ name, stage, theme, tall = false }: { name: string; stage: "center" | "fill"; theme?: ThemeId; tall?: boolean }) {
  const siteTheme = useSiteTheme();
  const [override, setOverride] = useState<Scheme | null>(null);
  const [run, setRun] = useState(0);
  const scheme = override ?? siteTheme;
  const Demo = DEMOS[name] as React.ComponentType<Record<string, unknown>> | undefined;
  const controls = PLAYGROUNDS[name];
  const defaults = Object.fromEntries((controls ?? []).map((c) => [c.key, c.value]));
  const [values, setValues] = useState<Record<string, unknown>>(defaults);
  const set = (key: string, v: unknown) => setValues((cur) => ({ ...cur, [key]: v }));

  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <span className="px-1 text-xs font-medium text-muted-foreground">Preview</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setRun((n) => n + 1)}
            aria-label="Replay"
            className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <RotateCcw className="size-3.5" />
          </button>
          <div className={cn("flex rounded-md bg-muted p-0.5", theme && "hidden")}>
            {(["light", "dark"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setOverride(option)}
                aria-label={`${option} preview`}
                aria-pressed={scheme === option}
                className={cn(
                  "grid size-6 place-items-center rounded transition-colors",
                  scheme === option
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {option === "light" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className={cn(
          !theme && scheme,
          tall ? "relative h-[44rem] overflow-hidden bg-background text-foreground" : "relative h-[34rem] overflow-y-auto bg-background text-foreground scrollbar-none",
          stage === "center" && "bg-dots"
        )}
        style={themeStyle(theme)}
      >
        <div
          key={run}
          className={cn(
            "flex w-full",
            tall ? "h-full" : "min-h-full",
            stage === "center" ? "items-center justify-center p-6" : "items-center"
          )}
        >
          {Demo ? <Demo {...values} /> : null}
        </div>
      </div>

      {controls && (
        <div className="border-t bg-card/60 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Configure</p>
            <button type="button" onClick={() => setValues(defaults)} className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              Reset
            </button>
          </div>
          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {controls.map((c) => (
              <Field key={c.key} control={c} value={values[c.key]} onChange={(v) => set(c.key, v)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ control: c, value, onChange }: { control: Control; value: unknown; onChange: (v: unknown) => void }) {
  const label = c.label ? <span className="text-sm text-muted-foreground">{c.label}</span> : null;
  if (c.type === "color")
    return (
      <label className="flex items-center justify-between gap-3">
        {label}
        <span className="flex items-center gap-2">
          <code className="font-mono text-xs text-muted-foreground">{String(value)}</code>
          <input type="color" value={String(value)} onChange={(e) => onChange(e.target.value)} className="size-8 cursor-pointer rounded-md border bg-transparent p-0.5" />
        </span>
      </label>
    );
  if (c.type === "range")
    return (
      <label className="flex items-center justify-between gap-3">
        {label}
        <span className="flex items-center gap-3">
          <input type="range" min={c.min} max={c.max} step={c.step} value={Number(value)} onChange={(e) => onChange(Number(e.target.value))} className="w-36 accent-[var(--primary)]" />
          <span className="w-10 text-right font-mono text-xs tabular-nums">{Number(value)}</span>
        </span>
      </label>
    );
  if (c.type === "toggle")
    return (
      <div className={cn("flex items-center gap-3", label ? "justify-between" : "justify-start")}>
        {label}
        <button type="button" role="switch" aria-checked={Boolean(value)} aria-label={c.label || "Toggle"} onClick={() => onChange(!value)} className={cn("relative h-6 w-10 rounded-full transition-colors", value ? "bg-foreground" : "bg-border")}>
          <span className={cn("absolute top-0.5 size-5 rounded-full bg-background transition-all", value ? "left-[1.1rem]" : "left-0.5")} />
        </button>
      </div>
    );
  return (
    <div className={cn("flex items-center gap-3", label ? "justify-between" : "justify-start")}>
      {label}
      <div role="radiogroup" aria-label={c.label || "Options"} className="flex rounded-lg bg-muted p-0.5">
        {c.options.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={value === o.value} onClick={() => onChange(o.value)} className={cn("rounded-md px-2.5 py-1 text-xs transition-colors", value === o.value ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground")}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
