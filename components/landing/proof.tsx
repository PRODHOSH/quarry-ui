import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Parallax } from "@/components/landing/parallax";
import { Reveal } from "@/components/landing/reveal";
import { AGENT_ICONS } from "@/components/site/agent-icons";
import AntigravityIcon from "@thesvg/react/google-antigravity";

/** The exact file the shadcn CLI downloads, trimmed for the page. Read from the build output, so it can never go stale. */
function registryExcerpt() {
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(process.cwd(), "public", "r", "feature-bento.json"), "utf8"));
    const { name, type, title, dependencies, registryDependencies, files } = raw;
    return JSON.stringify(
      { name, type, title, dependencies, registryDependencies, files: files.map((f: { path: string; content: string }) => ({ path: f.path, content: `${f.content.length} characters of source` })) },
      null,
      2
    );
  } catch {
    return "";
  }
}

const FACTS = [
  { k: "1m 23s", v: "Claude Code, start to finish" },
  { k: "3 files", v: "created or changed" },
  { k: "0 errors", v: "type check passes" },
];

export function Proof() {
  const json = registryExcerpt();
  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
        <Reveal className="min-w-0">
          <figure className="group relative h-full overflow-hidden rounded-2xl border bg-card">
            <div className="flex items-center justify-between border-b px-4 py-2.5 text-xs">
              <span className="flex items-center gap-2 font-medium">
                {AGENT_ICONS["claude-code"]("size-4")} Claude Code
              </span>
              <span className="font-normal text-muted-foreground">v2.1.293 · Sonnet 5.5</span>
            </div>
            <div className="relative aspect-[5/4]">
              <Image src="/proof/claude-final.webp" alt="The real Claude Code summary after installing the component" fill sizes="(min-width:1024px) 640px, 100vw" className="object-cover object-bottom" />
            </div>
            <figcaption className="grid grid-cols-3 divide-x border-t">
              {FACTS.map((f) => (
                <div key={f.k} className="px-4 py-4">
                  <p className="text-xl font-semibold tracking-tight tabular-nums">{f.k}</p>
                  <p className="mt-0.5 text-xs font-normal text-muted-foreground">{f.v}</p>
                </div>
              ))}
            </figcaption>
          </figure>
        </Reveal>

        <div className="grid min-w-0 gap-5">
          <Parallax distance={36} className="min-w-0">
          <Reveal delay={0.08} className="min-w-0">
            <figure className="overflow-hidden rounded-2xl border bg-card">
              <div className="flex items-center justify-between border-b px-4 py-2.5 text-xs">
                <span className="flex items-center gap-2 font-medium">
                  <AntigravityIcon className="size-4" /> Antigravity IDE
                </span>
                <span className="font-normal text-muted-foreground">Gemini 3.1 Pro</span>
              </div>
              <div className="relative aspect-[16/10]">
                <Image src="/proof/antigravity-3.webp" alt="The real Antigravity IDE after installing the component" fill sizes="(min-width:1024px) 480px, 100vw" className="object-cover object-[75%_35%]" />
              </div>
            </figure>
          </Reveal>
          </Parallax>

          <Parallax distance={64} className="min-w-0">
          <Reveal delay={0.16} className="min-w-0">
            <figure className="overflow-hidden rounded-2xl border bg-card">
              <div className="flex items-center justify-between border-b px-4 py-2.5 text-xs">
                <span className="font-medium">r/feature-bento.json</span>
                <Link href="/r/feature-bento.json" className="inline-flex items-center gap-1 font-normal text-muted-foreground transition-colors hover:text-foreground">
                  Open raw <ArrowUpRight className="size-3" />
                </Link>
              </div>
              <pre className="max-h-56 overflow-hidden whitespace-pre-wrap break-words px-4 py-3 font-mono text-[11.5px] leading-relaxed text-muted-foreground">{json}</pre>
            </figure>
          </Reveal>
          </Parallax>
        </div>
      </div>

      <p className="mt-6 text-center text-sm font-normal text-muted-foreground">
        Recorded on a clean Next.js 16 app. These are unedited sessions, and the JSON is the real file the CLI fetches.
      </p>
    </div>
  );
}
