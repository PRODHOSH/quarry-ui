"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Calendar, Target, Trophy, UserPlus, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = { icon: ReactNode; label: string; title: string; description: string };

const STEPS: Step[] = [
  { icon: <Calendar className="size-4" />, label: "Step 1", title: "Create your account", description: "Sign up and set your preferences in under a minute." },
  { icon: <Users className="size-4" />, label: "Step 2", title: "Build your network", description: "Connect with teammates and grow your audience organically." },
  { icon: <UserPlus className="size-4" />, label: "Step 3", title: "Share your links", description: "Distribute your unique links across the channels you use." },
  { icon: <Target className="size-4" />, label: "Step 4", title: "Track your goals", description: "Follow progress with live analytics in one dashboard." },
  { icon: <Trophy className="size-4" />, label: "Step 5", title: "Earn rewards", description: "Hit milestones and unlock perks as you go." },
];

/** Scroll progress is tracked inside this component's own scroll area. */
export function ScrollTimeline({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: ref });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div ref={ref} className={cn("h-[34rem] w-full overflow-y-auto", className)}>
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-12 text-center">
          <p className="text-sm font-medium text-primary">How it works</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Your journey, step by step
          </h2>
        </div>

        <div className="relative pl-12">
          <div className="absolute bottom-2 left-[15px] top-2 w-px bg-border" />
          <motion.div
            style={{ scaleY }}
            className="absolute bottom-2 left-[15px] top-2 w-px origin-top bg-primary"
          />

          <ol className="space-y-10">
            {STEPS.map((step) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6, root: ref }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <span className="absolute -left-12 grid size-8 place-items-center rounded-full border bg-background text-primary shadow-xs">
                  {step.icon}
                </span>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {step.label}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
