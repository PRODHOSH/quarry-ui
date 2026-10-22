"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** A still of a template's preview that fades in once decoded, on a calm placeholder. */
export function TemplateThumb({ name, title, className }: { name: string; title: string; className?: string }) {
  const img = useRef<HTMLImageElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = img.current;
    if (el?.complete && el.naturalWidth > 0) el.decode().then(() => setShown(true)).catch(() => setShown(true));
  }, []);
  return (
    <div className={cn("relative aspect-[16/10] w-full overflow-hidden rounded-2xl border bg-muted/40", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={img}
        src={`/thumbs/${name}.webp`}
        alt={`${title} preview`}
        loading="lazy"
        decoding="async"
        draggable={false}
        onLoad={(e) => e.currentTarget.decode().then(() => setShown(true)).catch(() => setShown(true))}
        className={cn("absolute inset-0 size-full object-cover object-top transition-opacity duration-500 ease-out", shown ? "opacity-100" : "opacity-0")}
      />
    </div>
  );
}
