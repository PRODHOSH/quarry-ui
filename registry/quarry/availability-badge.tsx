"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A round badge with text running around its edge and an arrow in the middle. The ring turns slowly
 * and speeds up on hover. Good for "available for work" and "book a call" prompts.
 */
export function AvailabilityBadge({
  text = "Available for work • Let's talk • ",
  href = "mailto:hello@example.com",
  size = 128,
  position = "static",
  className,
}: {
  /** Repeats around the circle. End it with a separator so the loop reads cleanly. */
  text?: string;
  href?: string;
  size?: number;
  position?: "static" | "fixed" | "absolute";
  className?: string;
}) {
  const id = `ring-${text.length}-${size}`;
  return (
    <a
      href={href}
      aria-label={text.replace(/•/g, ",")}
      className={cn("group grid place-items-center rounded-full bg-card shadow-lg ring-1 ring-border transition-transform duration-500 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] hover:scale-105", position === "static" ? "relative" : position, position !== "static" && "bottom-6 right-6 z-50", className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full animate-[spin_14s_linear_infinite] overflow-visible group-hover:animate-[spin_6s_linear_infinite]" aria-hidden>
        <defs>
          <path id={id} d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
        </defs>
        <text className="fill-foreground text-[8.6px] font-semibold uppercase tracking-[0.12em]">
          <textPath href={`#${id}`} textLength="236" lengthAdjust="spacing">
            {text.repeat(Math.max(1, Math.ceil(60 / text.length))).slice(0, 60)}
          </textPath>
        </text>
      </svg>
      <span className="relative grid size-[38%] place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-500 group-hover:rotate-45">
        <ArrowRight className="size-1/2 -rotate-45" />
      </span>
    </a>
  );
}
