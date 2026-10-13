"use client";

import { usePathname } from "next/navigation";

/** Renders its children everywhere except the home page. */
export function HideOnHome({ children }: { children: React.ReactNode }) {
  return usePathname() === "/" ? null : <>{children}</>;
}
