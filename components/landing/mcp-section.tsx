import { Palette, PackageCheck, Search } from "lucide-react";
import { WaitlistForm } from "@/components/landing/waitlist-form";
import { Mark } from "@/components/site/mark";
import { CodeBlock } from "@/components/site/code-block";
import { AGENT_ICONS } from "@/components/site/agent-icons";
import AntigravityIcon from "@thesvg/react/google-antigravity";

const POINTS = [
  { icon: Search, title: "Search by intent", body: "Describe what you need. It finds the right component." },
  { icon: PackageCheck, title: "Installs for you", body: "Same shadcn registry, with the correct dependencies." },
  { icon: Palette, title: "Reads your theme", body: "Checks your tokens before it writes a single line." },
];

const CONFIG = `{
  "mcpServers": {
    "quarry": {
      "command": "npx",
      "args": ["-y", "@quarry-ui/mcp"]
    }
  }
}`;

const AGENTS = [
  { name: "Claude Code", icon: AGENT_ICONS["claude-code"]("size-4") },
  { name: "Cursor", icon: AGENT_ICONS["cursor"]("size-4") },
  { name: "Antigravity", icon: <AntigravityIcon className="size-4" /> },
  { name: "Codex", icon: AGENT_ICONS["codex"]("size-4") },
];

export function McpSection() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-label inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs uppercase tracking-wide text-muted-foreground">
          <span className="size-1.5 rounded-full bg-brand" />
          MCP server · Coming soon
        </p>
        <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.03em] sm:text-5xl">
          Connect your <Mark>AI agents.</Mark>
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground">
          One server, and your agent can search Quarry, pick the right component and install it without leaving your editor.
        </p>
        <ul className="mt-7 flex flex-wrap items-center justify-center gap-2">
          {AGENTS.map((a) => (
            <li key={a.name} className="inline-flex items-center gap-2 rounded-full border bg-card/40 px-3.5 py-1.5 text-sm">
              {a.icon}
              {a.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border bg-border lg:grid-cols-[1.15fr_1fr]">
        <div className="bg-background p-5 sm:p-6">
          <CodeBlock code={CONFIG} lang="json" title="mcp.json · preview of the config" />
        </div>
        <ul className="grid divide-y bg-background">
          {POINTS.map((p) => (
            <li key={p.title} className="flex items-start gap-4 p-6">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl border bg-card/60">
                <p.icon className="size-[18px] text-[#7fa3ff]" />
              </span>
              <div>
                <h3 className="text-base font-medium">{p.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div id="waitlist" className="mx-auto mt-14 flex max-w-md scroll-mt-28 flex-col items-center text-center">
        <p className="mb-4 text-sm font-medium">Get one email when MCP, templates and Pro go live.</p>
        <WaitlistForm />
      </div>
    </div>
  );
}
