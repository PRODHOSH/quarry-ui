"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "login" | "signup";

export function AuthModal({
  open,
  onOpenChange,
  defaultMode = "login",
  brand = "Acme",
  position = "fixed",
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: Mode;
  brand?: string;
  /** Use "absolute" to render inside a relatively positioned container. */
  position?: "fixed" | "absolute";
  className?: string;
}) {
  const [mode, setMode] = useState<Mode>(defaultMode);

  // Start from the requested mode every time the dialog opens.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setMode(defaultMode);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const isLogin = mode === "login";

  return (
    <AnimatePresence>
      {open && (
        <div
          className={cn(
            "inset-0 z-50 flex items-center justify-center p-4",
            position === "fixed" ? "fixed" : "absolute",
            className
          )}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={isLogin ? "Sign in" : "Create account"}
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-sm rounded-2xl border bg-card p-6 text-card-foreground shadow-2xl"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>

            <h2 className="text-xl font-semibold tracking-tight">
              {isLogin ? "Welcome back" : `Join ${brand}`}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isLogin ? `Sign in to your ${brand} account.` : "Create an account in a few seconds."}
            </p>

            <div className="mt-5 grid gap-2">
              <button className="flex items-center justify-center gap-2.5 rounded-lg border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted">
                <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
                  <path fill="#4285F4" d="M22.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h5.9a5.04 5.04 0 0 1-2.19 3.31v2.75h3.55c2.08-1.91 3.28-4.73 3.28-8.09Z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.55-2.75c-.98.66-2.24 1.06-3.73 1.06-2.87 0-5.3-1.94-6.17-4.55H2.17v2.84A11 11 0 0 0 12 23Z" />
                  <path fill="#FBBC05" d="M5.83 13.1a6.6 6.6 0 0 1 0-4.2V6.06H2.17a11 11 0 0 0 0 9.88l3.66-2.84Z" />
                  <path fill="#EA4335" d="M12 5.35c1.62 0 3.07.56 4.21 1.65l3.15-3.15A10.6 10.6 0 0 0 12 1 11 11 0 0 0 2.17 6.06l3.66 2.84C6.7 7.29 9.13 5.35 12 5.35Z" />
                </svg>
                Continue with Google
              </button>
              <button className="flex items-center justify-center gap-2.5 rounded-lg border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
                  <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
                </svg>
                Continue with GitHub
              </button>
            </div>

            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              or with email
              <span className="h-px flex-1 bg-border" />
            </div>

            <form className="grid gap-3" onSubmit={(e) => e.preventDefault()}>
              <label className="grid gap-1.5 text-sm font-medium">
                Email
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="rounded-lg border bg-background px-3 py-2 text-sm font-normal outline-none transition-shadow placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-ring/20"
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                Password
                <input
                  type="password"
                  placeholder="••••••••"
                  className="rounded-lg border bg-background px-3 py-2 text-sm font-normal outline-none transition-shadow placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-ring/20"
                />
              </label>
              <button
                type="submit"
                className="mt-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                {isLogin ? "Sign in" : "Create account"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              {isLogin ? "New here? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setMode(isLogin ? "signup" : "login")}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {isLogin ? "Create an account" : "Sign in"}
              </button>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
