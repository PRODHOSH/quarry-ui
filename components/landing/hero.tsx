"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AntigravityIcon from "@thesvg/react/google-antigravity";
import { ComponentCard } from "@/components/site/component-card";
import { CopyButton } from "@/components/site/copy-button";
import { AGENT_ICONS } from "@/components/site/agent-icons";
import { registryUrl } from "@/lib/site";

type Item = { name: string; title: string; stage: "center" | "fill" };

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

const AGENTS = [
  { name: "Claude Code", icon: AGENT_ICONS["claude-code"]("size-5") },
  { name: "Cursor", icon: AGENT_ICONS["cursor"]("size-5") },
  { name: "Antigravity", icon: <AntigravityIcon className="size-5" /> },
  { name: "Codex", icon: AGENT_ICONS["codex"]("size-5") },
];

function Column({ items, reverse = false, speed }: { items: Item[]; reverse?: boolean; speed: number }) {
  return (
    <div className="h-full min-w-0 overflow-hidden">
      <div className={`vcol ${reverse ? "vcol-reverse" : ""}`} style={{ "--vcol-speed": `${speed}s` } as React.CSSProperties}>
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1 || undefined} inert={copy === 1 || undefined} className="space-y-5 pb-5">
            {items.map((item) => (
              <li key={item.name}>
                <ComponentCard name={item.name} title={item.title} stage={item.stage} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export function Hero({ total, items }: { total: number; items: Item[] }) {
  const command = `npx shadcn@latest add ${registryUrl("feature-bento")}`;
  const sections = items.filter((i) => i.stage === "fill").slice(0, 12);
  const left = sections.filter((_, i) => i % 2 === 0);
  const right = sections.filter((_, i) => i % 2 === 1);

  return (
    <section className="relative isolate overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-14 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[0.95fr_1.05fr] lg:gap-8 lg:py-10">
        <div>
          <p className="hero-in mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm text-muted-foreground" style={d(0)}>
            <span className="size-1.5 rounded-full bg-brand" />
            {total} free components · shadcn registry
          </p>
          <h1 className="hero-in text-balance text-[clamp(2.4rem,4.2vw,3.9rem)] font-semibold leading-[1.02] tracking-[-0.04em]" style={d(0.1)}>
            Whole pages
            <br />
            from <span className="text-brand">one prompt.</span>
          </h1>
          <p className="hero-in mt-6 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground" style={d(0.2)}>
            Clean, themed sections that stack into complete pages. Paste a prompt into your AI tool and they land in your repo.
          </p>
          <div className="hero-in mt-8 flex flex-wrap items-center gap-3" style={d(0.3)}>
            <Link
              href="/components"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-7 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Browse components
              <ArrowRight className="size-4" />
            </Link>
            <div className="flex h-12 min-w-0 items-center rounded-full border bg-card/60 pl-5 pr-1.5">
              <code className="truncate font-mono text-[13px] text-foreground">
                <span className="mr-2 text-[#7fa3ff]">$</span>npx shadcn@latest add feature-bento
              </code>
              <CopyButton value={command} className="ml-3 h-9 rounded-full bg-muted px-4 py-0 text-[13px] text-foreground hover:bg-accent" />
            </div>
          </div>

          <div className="hero-in mt-10" style={d(0.4)}>
            <p className="text-sm text-muted-foreground">Works with</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {AGENTS.map((a) => (
                <li key={a.name} className="inline-flex items-center gap-2 rounded-full border bg-card/40 px-3.5 py-1.5 text-sm">
                  {a.icon}
                  {a.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="vcols hero-in relative lg:-mx-24 lg:px-24 h-[34rem] sm:h-[40rem] lg:h-[44rem]"
          style={{ ...d(0.25), maskImage: "linear-gradient(180deg, transparent, #000 14%, #000 86%, transparent)" }}
        >
          <div className="grid h-full grid-cols-2 gap-5 [transform:rotate(-4deg)_scale(1.06)]">
            <Column items={left} speed={75} />
            <div className="h-full min-w-0 pt-16">
              <Column items={right} reverse speed={90} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
