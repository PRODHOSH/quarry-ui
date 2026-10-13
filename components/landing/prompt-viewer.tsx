"use client";

import { useState } from "react";
import { AGENT_ICONS } from "@/components/site/agent-icons";
import { CopyButton } from "@/components/site/copy-button";
import { cn } from "@/lib/utils";

export type ViewerPrompt = { id: string; label: string; hint: string; text: string };

const CYCLE_MS = 9000;
const VISIBLE_LINES = 24;

export function PromptViewer({ prompts, sample }: { prompts: ViewerPrompt[]; sample: string }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = prompts[active];
  const lines = current.text.split("\n");
  const shown = lines.slice(0, VISIBLE_LINES);
  const hidden = lines.length - shown.length;

  return (
    <div
      className="grid overflow-hidden rounded-2xl border lg:grid-cols-[17rem_1fr]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div role="tablist" aria-label="AI tools" className="flex overflow-x-auto border-b lg:flex-col lg:border-b-0 lg:border-r">
        {prompts.map((p, i) => {
          const isActive = i === active;
          return (
            <button
              key={p.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => setActive(i)}
              className={cn(
                "relative flex shrink-0 items-center gap-3 px-5 py-4 text-left transition-colors lg:py-[15px]",
                isActive ? "bg-muted/50" : "hover:bg-muted/30"
              )}
            >
              <span className="grid size-5 shrink-0 place-items-center">{AGENT_ICONS[p.id]("size-5")}</span>
              <span className="min-w-0">
                <span className={cn("block text-sm", isActive ? "font-medium text-foreground" : "font-normal text-muted-foreground")}>
                  {p.label}
                </span>
                <span className="hidden text-xs font-normal text-muted-foreground lg:block">{p.hint}</span>
              </span>
              {isActive && (
                <span
                  key={`${active}`}
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-px origin-left bg-foreground lg:inset-x-auto lg:bottom-auto lg:left-0 lg:top-0 lg:h-full lg:w-px lg:origin-top"
                  style={{
                    animation: `${"progress"} ${CYCLE_MS}ms linear forwards`,
                    animationPlayState: paused ? "paused" : "running",
                  }}
                  onAnimationEnd={() => setActive((a) => (a + 1) % prompts.length)}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="min-w-0">
        <div className="flex items-center justify-between border-b px-5 py-2.5">
          <p className="text-xs font-normal text-muted-foreground">
            Prompt for <span className="text-foreground">{current.label}</span>
            <span className="mx-2">·</span>
            {lines.length} lines · sample: {sample}
          </p>
          <CopyButton value={current.text} />
        </div>

        <div className="relative h-[27rem] overflow-hidden">
          <pre key={current.id} className="px-5 py-4 font-mono text-[12.5px] leading-[1.7]">
            {shown.map((line, i) => (
              <div
                key={i}
                className={cn(
                  "hero-in whitespace-pre-wrap break-words",
                  line.startsWith("```") || line.startsWith("import") || line.startsWith("export")
                    ? "text-muted-foreground"
                    : /^(Steps|Notes)$/.test(line) || /^\d+\./.test(line)
                      ? "text-foreground"
                      : "text-card-foreground/85"
                )}
                style={{ "--d": `${Math.min(i * 0.025, 0.6)}s` } as React.CSSProperties}
              >
                {line || " "}
              </div>
            ))}
            {hidden > 0 && (
              <div className="hero-in mt-1 text-muted-foreground" style={{ "--d": "0.65s" } as React.CSSProperties}>
                … {hidden} more lines
              </div>
            )}
          </pre>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>
      </div>
    </div>
  );
}
