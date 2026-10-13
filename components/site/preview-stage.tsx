"use client";

import { useState } from "react";
import { Moon, RotateCcw, Sun } from "lucide-react";
import { DEMOS } from "@/registry/demos";
import { cn } from "@/lib/utils";
import { useSiteTheme, type Scheme } from "@/components/site/use-site-theme";

/**
 * The one preview surface used by every component page.
 * Same height and same framing for every item, so nothing jumps around between pages.
 */
export function PreviewStage({ name, stage }: { name: string; stage: "center" | "fill" }) {
  const siteTheme = useSiteTheme();
  const [override, setOverride] = useState<Scheme | null>(null);
  const [run, setRun] = useState(0);
  const scheme = override ?? siteTheme;
  const Demo = DEMOS[name];

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
          <div className="flex rounded-md bg-muted p-0.5">
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
          scheme,
          "relative h-[34rem] overflow-y-auto bg-background text-foreground scrollbar-none",
          stage === "center" && "bg-dots"
        )}
      >
        <div
          key={run}
          className={cn(
            "flex min-h-full w-full",
            stage === "center" ? "items-center justify-center p-6" : "items-center"
          )}
        >
          {Demo ? <Demo /> : null}
        </div>
      </div>
    </div>
  );
}
