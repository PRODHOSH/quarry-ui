"use client";

import { useSyncExternalStore } from "react";

export type Scheme = "light" | "dark";

const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
};

const getSnapshot = (): Scheme =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

/** The scheme currently applied to the whole site. */
export function useSiteTheme(): Scheme {
  return useSyncExternalStore(subscribe, getSnapshot, () => "dark");
}

export function setSiteTheme(scheme: Scheme) {
  document.documentElement.classList.toggle("dark", scheme === "dark");
  try {
    localStorage.setItem("quarry-theme", scheme);
  } catch {}
}
