"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { TermReplay } from "@/components/landing/term-replay";
import { AGENT_ICONS } from "@/components/site/agent-icons";
import AntigravityIcon from "@thesvg/react/google-antigravity";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    title: "Copy the prompt",
    body: "Open any component and choose your tool. Quarry copies a prompt written for it: the install command, how to use it, and the rules about your theme.",
  },
  {
    title: "Paste it into your agent",
    body: "The agent reads your project, runs the shadcn CLI, installs what is missing and wires the component in. What you are scrolling through is a real, unedited session.",
  },
  {
    title: "It is in your app",
    body: "Themed from your own tokens, type checked and rendering. Nothing was copied by hand.",
  },
];

// Where each step lives on the scroll timeline (0..1)
const A = 0.2; // copy -> paste
const B = 0.62; // Claude Code -> Antigravity
const C = 0.82; // paste -> result
const clamp = (x: number) => Math.min(1, Math.max(0, x));
const ramp = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

export function ScrollStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 });
  const [p, setP] = useState(0);
  useMotionValueEvent(smooth, "change", (v) => setP(clamp(v)));
  const meter = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const step = p < A ? 0 : p < C ? 1 : 2;
  // layer visibility
  const vCopy = 1 - ramp(p, A - 0.04, A + 0.02);
  const vClaude = ramp(p, A - 0.02, A + 0.04) * (1 - ramp(p, B - 0.02, B + 0.04));
  const vAnti = ramp(p, B - 0.02, B + 0.04) * (1 - ramp(p, C - 0.03, C + 0.03));
  const vResult = ramp(p, C - 0.03, C + 0.03);
  const q = ramp(p, B, C); // inside the Antigravity phase
  const antiFrame = q < 0.34 ? 0 : q < 0.7 ? 1 : 2;

  const label = p < A ? "quarry-ui.vercel.app" : p < B ? "Claude Code" : p < C ? "Antigravity IDE" : "Your app";
  const labelIcon = p < A ? null : p < B ? AGENT_ICONS["claude-code"]("size-4") : p < C ? <AntigravityIcon className="size-4" /> : null;
  const caption =
    p < A ? "Real screenshot of the component page" : p < B ? "Real Claude Code session, replayed byte for byte" : p < C ? "Real Antigravity IDE, Gemini agent" : "The installed component, running in a real Next.js app";

  return (
    <div ref={ref} className="relative h-[560vh]">
      <div className="sticky top-16 flex h-[calc(100svh-4rem)] items-center">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-6 lg:grid-cols-[1fr_1.45fr] lg:gap-14">
          {/* steps */}
          <div className="order-2 lg:order-1">
            <ol className="relative space-y-7">
              <span aria-hidden className="absolute bottom-1 left-[15px] top-1 hidden w-px bg-border lg:block" />
              <motion.span
                aria-hidden
                className="absolute left-[15px] top-1 hidden w-px bg-foreground lg:block"
                style={{ height: meter, maxHeight: "calc(100% - 0.5rem)" }}
              />
              {STEPS.map((s, i) => {
                const active = i === step;
                return (
                  <li key={s.title} className={cn("relative lg:pl-12", active ? "block" : "hidden lg:block")}>
                    <span
                      className={cn(
                        "absolute left-0 top-0 hidden size-8 place-items-center rounded-full border text-sm tabular-nums transition-colors duration-500 lg:grid",
                        active ? "border-foreground bg-foreground text-background" : i < step ? "border-foreground/50 text-foreground" : "bg-background text-muted-foreground"
                      )}
                    >
                      {i + 1}
                    </span>
                    <h3 className={cn("text-2xl font-semibold tracking-tight transition-colors duration-500 sm:text-3xl", active ? "text-foreground" : "text-muted-foreground/60")}>
                      {s.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-2 max-w-md text-base font-normal leading-relaxed text-muted-foreground transition-all duration-500",
                        active ? "max-h-40 opacity-100" : "max-h-0 overflow-hidden opacity-0 lg:max-h-0"
                      )}
                    >
                      {s.body}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* stage */}
          <div className="order-1 lg:order-2">
            <div className="overflow-hidden rounded-2xl border bg-card shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
              <div className="flex h-10 items-center justify-between border-b px-4 text-xs">
                <span className="flex items-center gap-2 font-medium">
                  {labelIcon}
                  {label}
                </span>
                <span className="rounded-full border px-2.5 py-0.5 font-normal text-muted-foreground">Real recording</span>
              </div>

              <div className="relative aspect-[5/4] bg-background">
                {/* 1 · the real component page */}
                <div className="absolute inset-0 origin-[84%_18%]" style={{ opacity: vCopy, transform: `scale(${1.05 + 0.62 * ramp(p, 0.01, A - 0.02)})` }}>
                  <Image src="/proof/quarry-copy-menu.webp" alt="The Quarry component page with the copy prompt menu open" fill sizes="(min-width:1024px) 640px, 100vw" className="object-cover object-[78%_12%]" priority />
                </div>
                {/* 2 · a real Claude Code session, scrubbed by scroll */}
                <div className="absolute inset-0" style={{ opacity: vClaude, pointerEvents: "none" }}>
                  <TermReplay progress={ramp(p, A, B)} />
                </div>
                {/* 3 · real Antigravity */}
                <div className="absolute inset-0" style={{ opacity: vAnti }}>
                  {[
                    { src: "/proof/antigravity-1.webp", scale: 1.7, origin: "100% 46%" },
                    { src: "/proof/antigravity-2.webp", scale: 1.7, origin: "100% 44%" },
                    { src: "/proof/antigravity-3.webp", scale: 1.32, origin: "70% 40%" },
                  ].map((f, i) => (
                    <Image
                      key={f.src}
                      src={f.src}
                      alt="The real Antigravity IDE running the Quarry prompt"
                      fill
                      sizes="(min-width:1024px) 640px, 100vw"
                      className="object-cover transition-opacity duration-500"
                      style={{ opacity: i === antiFrame ? 1 : 0, transform: `scale(${f.scale + 0.08 * q})`, transformOrigin: f.origin }}
                    />
                  ))}
                </div>
                {/* 4 · the result in a real app */}
                <div className="absolute inset-0" style={{ opacity: vResult, transform: `scale(${1.04 - 0.04 * ramp(p, C, 1)})` }}>
                  <Image src="/proof/app-result.webp" alt="The installed component running in a real Next.js app" fill sizes="(min-width:1024px) 640px, 100vw" className="object-cover object-top" />
                </div>
              </div>
            </div>
            <p className="mt-3 text-center text-xs font-normal text-muted-foreground">{caption}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
