"use client";

import { usePathname } from "next/navigation";

/** Renders its children everywhere except the home page. */
export function HideOnHome({ children }: { children: React.ReactNode }) {
  const p = usePathname();
  return p === "/" || p.startsWith("/preview") || p.startsWith("/components") || p.startsWith("/templates") ? null : <>{children}</>;
}
