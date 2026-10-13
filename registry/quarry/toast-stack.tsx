"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type Toast = { id: number; title: string; description?: string; tone?: "success" | "info" | "warning" };

const ICON = { success: CheckCircle2, info: Info, warning: TriangleAlert };

/** A tiny store for the stack. Call push to add a toast; it removes itself after duration milliseconds. */
export function useToastStack(duration = 4200) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const next = useRef(1);
  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const push = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = next.current++;
      setToasts((cur) => [...cur.slice(-4), { ...t, id }]);
      window.setTimeout(() => dismiss(id), duration);
    },
    [duration, dismiss]
  );
  return { toasts, push, dismiss };
}

/**
 * Toasts that stack like a deck. Older ones sit behind and shrink. Hover the stack and it fans out so
 * every message can be read. Pair it with useToastStack.
 */
export function ToastStack({
  toasts,
  onDismiss,
  position = "absolute",
  className,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
  position?: "fixed" | "absolute";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const list = [...toasts].reverse();

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className={cn("bottom-5 right-5 z-50 w-[22rem] max-w-[calc(100%-2rem)]", position, className)}
      style={{ height: open ? Math.min(list.length, 5) * 84 : 76 }}
    >
      <AnimatePresence>
        {list.map((t, i) => {
          const Icon = ICON[t.tone ?? "info"];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{
                opacity: i > 3 ? 0 : 1,
                y: open ? -i * 84 : -i * 10,
                scale: open ? 1 : 1 - i * 0.05,
              }}
              exit={{ opacity: 0, x: 80, transition: { duration: 0.25 } }}
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
              style={{ zIndex: 10 - i, transformOrigin: "bottom center" }}
              className="absolute inset-x-0 bottom-0 flex items-start gap-3 rounded-2xl border bg-card p-4 shadow-xl"
            >
              <Icon className={cn("mt-0.5 size-5 shrink-0", t.tone === "warning" ? "text-foreground" : "text-primary")} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{t.title}</p>
                {t.description && <p className="mt-0.5 truncate text-xs text-muted-foreground">{t.description}</p>}
              </div>
              <button type="button" aria-label="Dismiss" onClick={() => onDismiss(t.id)} className="grid size-6 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                <X className="size-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
