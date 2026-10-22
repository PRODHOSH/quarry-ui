"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";

type Status = "idle" | "loading" | "success" | "error";

export function WaitlistForm({ id = "waitlist-email" }: { id?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
    try {
      const value = email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) || value.length > 254) throw new Error("Please enter a valid email address.");
      const sb = getSupabase();
      if (!sb) throw new Error("Signups are not set up yet.");
      const { error } = await sb.from("waitlist").insert({ email: value });
      // 23505 means this address is already on the list, which is fine from the visitor's side
      if (error && error.code !== "23505") throw new Error("Something went wrong. Please try again.");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <div className="w-full max-w-md">
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-12 items-center gap-3 rounded-full border px-5 text-sm font-normal"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.1 }}
              className="grid size-5 place-items-center rounded-full bg-foreground text-background"
            >
              <Check className="size-3" strokeWidth={3} />
            </motion.span>
            You&apos;re on the list. We&apos;ll email you the day Quarry opens.
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -6 }}
            noValidate
            className="group relative flex h-12 items-center rounded-full border bg-card/40 pl-5 pr-1.5 transition-colors focus-within:border-foreground/40"
          >
            <label htmlFor={id} className="sr-only">
              Email address
            </label>
            <input
              id={id}
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="min-w-0 flex-1 bg-transparent text-sm font-normal outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-85 disabled:opacity-60"
            >
              {status === "loading" ? "Joining" : "Notify me"}
              <ArrowRight className="size-3.5" />
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <p
        role="status"
        aria-live="polite"
        className={`mt-3 h-5 text-center text-xs font-normal ${status === "error" ? "text-red-400" : "text-muted-foreground"}`}
      >
        {status === "error" ? message : status === "success" ? "" : "We will email you once, when we open."}
      </p>
    </div>
  );
}
