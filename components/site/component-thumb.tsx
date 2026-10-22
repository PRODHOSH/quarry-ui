"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * A still preview of a component. Lists show images, not live demos, so scrolling never mounts
 * dozens of animations at once. The image fades in only after it has decoded, on a calm
 * placeholder, so nothing pops or flashes. The live version is on the component page.
 */
export function ComponentThumb({ name, stage, className, priority = false }: { name: string; stage: "center" | "fill"; theme?: unknown; className?: string; priority?: boolean }) {
  const img = useRef<HTMLImageElement>(null);
  const [shown, setShown] = useState(false);
  const [failed, setFailed] = useState(false);

  // the image may already be cached before React attaches onLoad
  useEffect(() => {
    const el = img.current;
    if (el?.complete && el.naturalWidth > 0) el.decode().then(() => setShown(true)).catch(() => setShown(true));
  }, []);

  return (
    <div className={cn("relative aspect-[16/10] overflow-hidden bg-muted/40", stage === "center" && "bg-dots", className)} aria-hidden>
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={img}
          src={`/thumbs/${name}.webp`}
          alt=""
          width={900}
          height={563}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          onLoad={(e) => e.currentTarget.decode().then(() => setShown(true)).catch(() => setShown(true))}
          onError={() => setFailed(true)}
          className={cn("absolute inset-0 size-full object-cover transition-opacity duration-500 ease-out", shown ? "opacity-100" : "opacity-0")}
        />
      )}
    </div>
  );
}
