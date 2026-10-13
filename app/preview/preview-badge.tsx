"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";

const subscribe = () => () => {};

/** The link back to the site. It hides itself when the preview is shown inside a frame on the site. */
export function PreviewBadge() {
  const framed = useSyncExternalStore(subscribe, () => window.self !== window.top, () => true);
  if (framed) return null;
  return (
    <Link href="/templates" className="fixed bottom-4 right-4 z-[80] inline-flex items-center gap-2 rounded-full border bg-background/90 px-3.5 py-2 text-xs text-foreground shadow-lg backdrop-blur transition-colors hover:bg-accent">
      <span className="size-1.5 rounded-full bg-primary" />
      Preview · Back to Quarry
    </Link>
  );
}
