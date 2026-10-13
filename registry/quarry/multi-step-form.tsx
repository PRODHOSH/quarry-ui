"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Account", "Workspace", "Plan"];
const PLANS = [
  { id: "free", name: "Free", note: "For trying things out" },
  { id: "pro", name: "Pro", note: "For growing teams" },
  { id: "team", name: "Team", note: "For whole organisations" },
];

const field = "h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60";

/**
 * A three step onboarding form with a progress rail. Steps slide in the direction of travel,
 * each step validates before continuing, and the finish state confirms with a drawn checkmark.
 */
export function MultiStepForm({ className }: { className?: string }) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [done, setDone] = useState(false);
  const [v, setV] = useState({ name: "", email: "", workspace: "", plan: "pro" });
  const set = (k: keyof typeof v, val: string) => setV((s) => ({ ...s, [k]: val }));

  const valid = [v.name.trim() && /\S+@\S+\.\S+/.test(v.email), v.workspace.trim(), true][step];

  const go = (d: number) => {
    setDir(d);
    if (d > 0 && step === STEPS.length - 1) return setDone(true);
    setStep((s) => Math.min(STEPS.length - 1, Math.max(0, s + d)));
  };

  return (
    <div className={cn("w-full max-w-md rounded-2xl border bg-card p-6", className)}>
      <div className="mb-6 flex items-center">
        {STEPS.map((s, n) => (
          <div key={s} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2">
              <motion.span
                animate={{ backgroundColor: n <= step || done ? "var(--primary)" : "var(--muted)", color: n <= step || done ? "var(--primary-foreground)" : "var(--muted-foreground)" }}
                className="grid size-7 place-items-center rounded-full text-xs font-semibold"
              >
                {n < step || done ? <Check className="size-3.5" strokeWidth={3} /> : n + 1}
              </motion.span>
              <span className={cn("hidden text-xs font-medium sm:block", n === step && !done ? "text-foreground" : "text-muted-foreground")}>{s}</span>
            </div>
            {n < STEPS.length - 1 && (
              <div className="mx-3 h-px flex-1 overflow-hidden bg-border">
                <motion.div animate={{ scaleX: n < step || done ? 1 : 0 }} transition={{ duration: 0.4 }} className="h-full origin-left bg-primary" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="relative min-h-[11.5rem] overflow-hidden">
        <AnimatePresence mode="popLayout" custom={dir} initial={false}>
          {done ? (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-4 text-center">
              <svg viewBox="0 0 52 52" className="size-16 text-primary">
                <motion.circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
                <motion.path d="M15 27 l8 8 l14 -16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.4 }} />
              </svg>
              <p className="mt-4 text-lg font-semibold">You are all set, {v.name.split(" ")[0]}</p>
              <p className="mt-1 text-sm text-muted-foreground">{v.workspace} is ready on the {PLANS.find((p) => p.id === v.plan)?.name} plan.</p>
            </motion.div>
          ) : (
            <motion.div
              key={step}
              custom={dir}
              initial={{ opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -40 }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="space-y-3"
            >
              {step === 0 && (
                <>
                  <h3 className="text-lg font-semibold">Create your account</h3>
                  <input className={field} placeholder="Full name" value={v.name} onChange={(e) => set("name", e.target.value)} aria-label="Full name" />
                  <input className={field} placeholder="Work email" type="email" value={v.email} onChange={(e) => set("email", e.target.value)} aria-label="Work email" />
                </>
              )}
              {step === 1 && (
                <>
                  <h3 className="text-lg font-semibold">Name your workspace</h3>
                  <input className={field} placeholder="e.g. Northwind Studio" value={v.workspace} onChange={(e) => set("workspace", e.target.value)} aria-label="Workspace name" />
                  <p className="text-xs text-muted-foreground">You can change this later in settings.</p>
                </>
              )}
              {step === 2 && (
                <>
                  <h3 className="text-lg font-semibold">Pick a plan</h3>
                  <div className="space-y-2">
                    {PLANS.map((p) => (
                      <button key={p.id} onClick={() => set("plan", p.id)} className={cn("flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-left transition-colors", v.plan === p.id ? "border-primary bg-primary/10" : "hover:bg-muted")}>
                        <span><span className="block text-sm font-medium">{p.name}</span><span className="block text-xs text-muted-foreground">{p.note}</span></span>
                        <span className={cn("grid size-5 place-items-center rounded-full border transition-colors", v.plan === p.id && "border-primary bg-primary text-primary-foreground")}>{v.plan === p.id && <Check className="size-3" strokeWidth={3} />}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!done ? (
        <div className="mt-5 flex items-center justify-between">
          <button onClick={() => go(-1)} disabled={step === 0} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-0">
            <ArrowLeft className="size-4" /> Back
          </button>
          <button onClick={() => go(1)} disabled={!valid} className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all active:scale-95 disabled:opacity-40">
            {step === STEPS.length - 1 ? "Finish" : "Continue"} <ArrowRight className="size-4" />
          </button>
        </div>
      ) : (
        <button onClick={() => { setDone(false); setStep(0); setV({ name: "", email: "", workspace: "", plan: "pro" }); }} className="mt-4 w-full text-center text-xs text-muted-foreground underline underline-offset-4">Start over</button>
      )}
    </div>
  );
}
