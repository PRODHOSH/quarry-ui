"use client";

import type { ReactNode } from "react";
import { Cloud, Code2, Database, GitBranch, Globe, Lock, Mail, MessageSquare, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_RINGS: ReactNode[][] = [
  [<GitBranch key="g" />, <Database key="d" />, <Lock key="l" />],
  [<Cloud key="c" />, <Mail key="m" />, <Code2 key="co" />, <MessageSquare key="ms" />, <Globe key="gl" />],
];

/**
 * Icons circling a centre mark on concentric rings, each ring turning at its own pace and the icons
 * held upright. A clean way to show integrations. Pass rings as arrays of nodes, innermost first.
 */
export function OrbitingIcons({
  rings = DEFAULT_RINGS,
  center = <Zap />,
  size = 360,
  className,
}: {
  rings?: ReactNode[][];
  center?: ReactNode;
  /** Diameter of the outer ring in pixels. */
  size?: number;
  className?: string;
}) {
  const step = (size / 2 - 28) / rings.length;

  return (
    <div className={cn("relative mx-auto grid place-items-center", className)} style={{ width: size, height: size }}>
      {rings.map((icons, r) => {
        const radius = step * (r + 1);
        const duration = 26 + r * 14;
        return (
          <div key={r} className="absolute rounded-full border border-dashed border-foreground/20" style={{ width: radius * 2, height: radius * 2 }}>
            <div className="absolute inset-0" style={{ animation: `orbit-spin ${duration}s linear infinite${r % 2 ? " reverse" : ""}` }}>
              {icons.map((icon, i) => {
                const angle = (360 / icons.length) * i;
                return (
                  <div key={i} className="absolute left-1/2 top-1/2 size-0" style={{ transform: `rotate(${angle}deg) translateY(${-radius}px)` }}>
                    <div className="-translate-x-1/2 -translate-y-1/2" style={{ transform: `translate(-50%,-50%) rotate(${-angle}deg)` }}>
                      <div className="grid size-11 place-items-center rounded-2xl border bg-card text-foreground/80 shadow-lg [&_svg]:size-5" style={{ animation: `orbit-spin ${duration}s linear infinite ${r % 2 ? "" : "reverse"}` }}>
                        {icon}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <div className="relative grid size-16 place-items-center rounded-3xl bg-primary text-primary-foreground shadow-[0_0_60px_-8px_var(--primary)] [&_svg]:size-7">
        <span aria-hidden className="absolute inset-0 animate-ping rounded-3xl bg-primary/30 [animation-duration:3s]" />
        <span className="relative">{center}</span>
      </div>
      <style>{`@keyframes orbit-spin{to{transform:rotate(360deg)}}@media (prefers-reduced-motion:reduce){[style*="orbit-spin"]{animation:none!important}}`}</style>
    </div>
  );
}
