"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { Animal, Colorway } from "@/components/abyss/ascii-aquarium";

export type Look = "auto" | "tiles" | "glyphs";
export type Mode = "auto" | "fast" | "think";

export type Settings = { animal: Animal; colorway: Colorway; look: Look; speed: number; scale: number; paused: boolean };

const KEY = "abyss-settings";
const BASE: Settings = { animal: "shark", colorway: "theme", look: "auto", speed: 1, scale: 1, paused: false };

type Ctx = { settings: Settings; set: (patch: Partial<Settings>) => void; reset: () => void };
const SettingsContext = createContext<Ctx>({ settings: BASE, set: () => {}, reset: () => {} });
export const useSettings = () => useContext(SettingsContext);

/** The URL prefix the template is mounted at, so links work at /abyss, /preview/abyss or anywhere else. */
export function useBase() {
  const path = usePathname();
  const i = path.indexOf("/abyss");
  return i === -1 ? "" : path.slice(0, i + "/abyss".length);
}

/** Remembers the scene you chose. Pass `defaults` to change what a first time visitor sees. */
export function SettingsProvider({ defaults, children }: { defaults?: Partial<Settings>; children: ReactNode }) {
  const start = useMemo<Settings>(() => ({ ...BASE, ...defaults }), [defaults]);
  const [settings, setSettings] = useState<Settings>(start);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      // Restoring a saved choice after mount keeps the server and client markup identical.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setSettings({ ...start, ...JSON.parse(saved) });
    } catch {}
  }, [start]);

  const set = useCallback((patch: Partial<Settings>) => {
    setSettings((cur) => {
      const next = { ...cur, ...patch };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setSettings(start);
    try {
      localStorage.removeItem(KEY);
    } catch {}
  }, [start]);

  const value = useMemo(() => ({ settings, set, reset }), [settings, set, reset]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
