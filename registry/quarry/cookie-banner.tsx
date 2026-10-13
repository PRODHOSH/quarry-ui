"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";
import { cn } from "@/lib/utils";

type Choices = { analytics: boolean; marketing: boolean };

/**
 * A consent banner with real choices. Necessary cookies are always on, the rest are switches.
 * The decision is remembered in localStorage under storageKey. Pass storageKey={null} to always show it.
 */
export function CookieBanner({
  title = "We use a few cookies",
  description = "Some are needed to make the site work. Others help us understand what to improve. You choose.",
  storageKey = "quarry-cookie-consent",
  position = "fixed",
  onChange,
  className,
}: {
  title?: string;
  description?: string;
  storageKey?: string | null;
  position?: "fixed" | "absolute";
  onChange?: (choices: Choices) => void;
  className?: string;
}) {
  const [shown, setShown] = useState(false);
  const [detail, setDetail] = useState(false);
  const [choices, setChoices] = useState<Choices>({ analytics: false, marketing: false });

  useEffect(() => {
    try {
      // localStorage only exists on the client, so the choice can only be read after mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (!storageKey || !localStorage.getItem(storageKey)) setShown(true);
    } catch {
      setShown(true);
    }
  }, [storageKey]);

  const save = (next: Choices) => {
    try {
      if (storageKey) localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {}
    onChange?.(next);
    setShown(false);
  };

  const row = ({ id, label, hint, locked }: { id: keyof Choices | "necessary"; label: string; hint: string; locked?: boolean }) => {
    const on = locked ? true : choices[id as keyof Choices];
    return (
      <li key={id} className="flex items-center justify-between gap-4 py-2.5">
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label={label}
          disabled={locked}
          onClick={() => !locked && setChoices((c) => ({ ...c, [id]: !c[id as keyof Choices] }))}
          className={cn("relative h-6 w-10 shrink-0 rounded-full transition-colors", on ? "bg-primary" : "bg-border", locked && "opacity-50")}
        >
          <span className={cn("absolute top-0.5 size-5 rounded-full bg-background shadow transition-all", on ? "left-[1.1rem]" : "left-0.5")} />
        </button>
      </li>
    );
  };

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          role="dialog"
          aria-label="Cookie preferences"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
          className={cn("bottom-5 left-1/2 z-50 w-[min(92vw,30rem)] -translate-x-1/2 rounded-3xl border bg-card p-6 shadow-2xl", position, className)}
        >
          <div className="flex items-start gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Cookie className="size-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold">{title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {detail && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 divide-y overflow-hidden"
              >
                {row({ id: "necessary", label: "Necessary", hint: "Sign in, security, remembering this choice", locked: true })}
                {row({ id: "analytics", label: "Analytics", hint: "Anonymous usage, so we can fix what is slow" })}
                {row({ id: "marketing", label: "Marketing", hint: "Measuring which campaigns work" })}
              </motion.ul>
            )}
          </AnimatePresence>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => save({ analytics: true, marketing: true })} className="h-10 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
              Accept all
            </button>
            {detail ? (
              <button type="button" onClick={() => save(choices)} className="h-10 rounded-full border px-5 text-sm font-medium transition-colors hover:bg-accent">
                Save choices
              </button>
            ) : (
              <button type="button" onClick={() => save({ analytics: false, marketing: false })} className="h-10 rounded-full border px-5 text-sm font-medium transition-colors hover:bg-accent">
                Only necessary
              </button>
            )}
            <button type="button" onClick={() => setDetail((d) => !d)} className="ml-auto text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline">
              {detail ? "Hide details" : "Customise"}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
