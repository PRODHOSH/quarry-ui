"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * A still preview of a component. Lists show images, not live demos, so scrolling never mounts
 * dozens of animations at once. The real, live version is on the component page.
 */
export function ComponentThumb({ name, stage, className }: { name: string; stage: "center" | "fill"; theme?: unknown; className?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={cn("relative aspect-[16/10] overflow-hidden bg-muted/60", stage === "center" && "bg-dots", className)} aria-hidden>
      <div className="absolute inset-0 animate-pulse bg-muted/70" />
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/thumbs/${name}.webp`}
          alt=""
          width={900}
          height={563}
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => setFailed(true)}
          className={cn("absolute inset-0 size-full object-cover")}
        />
      )}
    </div>
  );
}
