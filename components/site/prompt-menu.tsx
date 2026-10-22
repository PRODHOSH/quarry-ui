"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { AGENT_ICONS } from "@/components/site/agent-icons";
import { AGENTS, type AgentId } from "@/lib/prompts";
import type { RegistryItem } from "@/lib/registry-types";
import { cn } from "@/lib/utils";

/**
 * Copies a prompt for the chosen AI tool. The prompt is fetched from the server, which allows two
 * free copies and then asks the visitor to sign in. Signed in people copy as many as they like.
 */
export function PromptMenu({ item }: { item: RegistryItem }) {
  const { openSignIn, getAccessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<AgentId | null>(null);
  const [busy, setBusy] = useState(false);
  const [left, setLeft] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const copy = async (agent: AgentId) => {
    if (busy) return;
    setBusy(true);
    try {
      const token = await getAccessToken();
      const res = await fetch("/api/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ name: item.name, agent }),
      });
      if (res.status === 403) {
        setOpen(false);
        setLeft(0);
        openSignIn("You have used your 2 free prompt copies. Sign in to keep copying, it only takes a moment.");
        return;
      }
      if (!res.ok) return;
      const data = (await res.json()) as { prompt: string; remaining: number | null };
      await navigator.clipboard.writeText(data.prompt);
      setLeft(data.remaining);
      setCopied(agent);
      setOpen(false);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      // network or clipboard problem: leave the button as it was
    } finally {
      setBusy(false);
    }
  };

  return (
    <div ref={root} className="relative inline-flex">
      <button
        type="button"
        onClick={() => copy("default")}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-l-full bg-primary py-2 pl-4 pr-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85 disabled:opacity-70"
      >
        {busy ? <Loader2 className="size-4 animate-spin" /> : copied === "default" ? <Check className="size-4" /> : <Sparkles className="size-4" />}
        {copied === "default" ? "Copied" : "Copy prompt"}
      </button>
      <button
        type="button"
        aria-label="Choose an AI tool"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center rounded-r-full border-l border-primary-foreground/20 bg-primary pl-2 pr-3 text-primary-foreground transition-opacity hover:opacity-85"
      >
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground shadow-xl">
          <p className="px-3 pb-1 pt-2 text-xs font-medium text-muted-foreground">Copy a prompt tuned for</p>
          {AGENTS.map((agent) => (
            <button
              key={agent.id}
              type="button"
              onClick={() => copy(agent.id)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
            >
              <span className="grid size-5 shrink-0 place-items-center">{AGENT_ICONS[agent.id]("size-4")}</span>
              <span className="flex-1">
                <span className="block font-medium leading-tight">{agent.label}</span>
                <span className="block text-xs text-muted-foreground">{agent.hint}</span>
              </span>
              {copied === agent.id && <Check className="size-4 text-emerald-500" />}
            </button>
          ))}
          {left !== null && (
            <p className="mt-1 border-t px-3 py-2 text-xs text-muted-foreground">{left > 0 ? `${left} free ${left === 1 ? "copy" : "copies"} left. Sign in for unlimited.` : "No free copies left. Sign in for unlimited."}</p>
          )}
        </div>
      )}
    </div>
  );
}
