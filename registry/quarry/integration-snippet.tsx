"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

const SNIPPET = `<script src="https://cdn.example.com/sdk.js"></script>
<script>
  Acme.init({ key: "pk_live_..." });
</script>`;

const POINTS = ["No build step required", "Works on any HTML page", "Live in under a minute"];

export function IntegrationSnippet({
  snippet = SNIPPET,
  filename = "index.html",
  className,
}: {
  snippet?: string;
  filename?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className={cn("w-full px-6 py-10 sm:px-10", className)}>
      <div className="mx-auto grid max-w-4xl items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-primary">SDK integration</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Two tags. Live in sixty seconds.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Add one script and you are done. No refactoring, no config files.
          </p>
          <ul className="mt-6 space-y-3">
            {POINTS.map((point) => (
              <li key={point} className="flex items-center gap-3 text-sm text-foreground">
                <span className="grid size-5 place-items-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-2.5">
            <span className="font-mono text-xs text-muted-foreground">{filename}</span>
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-card-foreground">
            <code>{snippet}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}
