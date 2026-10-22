"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, X } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { useAuth, type Provider } from "@/components/auth/auth-provider";

const Google = () => (
  <svg viewBox="0 0 48 48" className="size-5" aria-hidden>
    <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3A12 12 0 0 1 24 36a12 12 0 1 1 0-24c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 1 0 24 44c11 0 20-8 20-20 0-1.3-.1-2.6-.4-3.9Z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8A12 12 0 0 1 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7Z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.6 5.1A20 20 0 0 0 24 44Z" />
    <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9Z" />
  </svg>
);
const GitHub = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden>
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);

/** The sign in popup: the Quarry logo, a short line, and Google or GitHub. */
export function SignInDialog() {
  const { dialogOpen, closeSignIn, signIn, configured, reason } = useAuth();
  const [busy, setBusy] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dialogOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeSignIn();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [dialogOpen, closeSignIn]);

  const go = async (p: Provider) => {
    setBusy(p);
    setError(null);
    const err = await signIn(p);
    if (err) {
      setError(err);
      setBusy(null);
    }
  };

  const providers: { id: Provider; label: string; icon: React.ReactNode }[] = [
    { id: "google", label: "Continue with Google", icon: <Google /> },
    { id: "github", label: "Continue with GitHub", icon: <GitHub /> },
  ];

  return (
    <AnimatePresence>
      {dialogOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} onClick={closeSignIn} className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Sign in to Quarry UI"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl border bg-card p-8 shadow-2xl"
          >
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />
            <button type="button" onClick={closeSignIn} aria-label="Close" className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <X className="size-4" />
            </button>

            <div className="flex flex-col items-center text-center">
              <Logo size="lg" className="[&_img]:h-8" />
              <h2 className="mt-7 text-2xl font-semibold tracking-tight">{reason ? "Sign in to continue" : "Welcome back"}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{reason ?? "Sign in to save components and keep your bookmarks in one place."}</p>
            </div>

            <div className="mt-7 space-y-3">
              {providers.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  disabled={busy !== null}
                  onClick={() => go(p.id)}
                  className="flex h-12 w-full items-center justify-center gap-3 rounded-full border bg-background text-sm font-medium transition-all hover:border-foreground/30 hover:bg-muted active:scale-[0.98] disabled:opacity-60"
                >
                  {busy === p.id ? <Loader2 className="size-5 animate-spin" /> : p.icon}
                  {p.label}
                </button>
              ))}
            </div>

            {(error || !configured) && (
              <p role="alert" className="mt-4 rounded-xl border bg-muted/50 px-3.5 py-2.5 text-center text-xs leading-relaxed text-muted-foreground">
                {error ?? "Sign in is not set up yet. Add your Supabase keys to enable it."}
              </p>
            )}

            <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
              By continuing you agree to use Quarry UI kindly. We only store your name, email and bookmarks.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
