"use client";

import { DEMOS } from "@/registry/demos";
import { cn } from "@/lib/utils";
import { themeStyle, type ThemeId } from "@/lib/themes";

/** Renders one demo at the fixed size the thumbnail generator screenshots. Site tooling only. */
export function ThumbStage({ name, stage, theme }: { name: string; stage: "center" | "fill"; theme?: ThemeId }) {
  const Demo = DEMOS[name];
  const zoom = stage === "center" ? 1.6 : 1;
  const w = 900 / zoom;
  return (
    <div id="thumb" className={cn("relative h-[563px] w-[900px] overflow-hidden bg-background text-foreground", stage === "center" && "bg-dots")} style={themeStyle(theme)}>
      <div className={cn("absolute left-0 top-0 flex origin-top-left items-center", stage === "center" && "justify-center")} style={{ width: w, height: (w * 10) / 16, transform: `scale(${zoom})` }}>
        {Demo ? <Demo /> : null}
      </div>
    </div>
  );
}
