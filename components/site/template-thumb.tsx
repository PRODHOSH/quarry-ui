"use client";

import { cn } from "@/lib/utils";

/** A still of a template's preview, with a quiet placeholder until it has loaded. */
export function TemplateThumb({ name, title, className }: { name: string; title: string; className?: string }) {
  return (
    <div className={cn("relative aspect-[16/10] w-full overflow-hidden rounded-2xl border bg-muted/60", className)}>
      <div className="absolute inset-0 animate-pulse bg-muted/70" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/thumbs/${name}.webp`} alt={`${title} preview`} loading="lazy" decoding="async" draggable={false} className={cn("absolute inset-0 size-full object-cover object-top")} />
    </div>
  );
}
