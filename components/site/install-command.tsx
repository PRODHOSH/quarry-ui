"use client";

import { useState } from "react";
import { PACKAGE_MANAGERS, type PackageManager } from "@/lib/site";
import { CopyButton } from "@/components/site/copy-button";
import { cn } from "@/lib/utils";

export function InstallCommand({ name }: { name: string }) {
  const [manager, setManager] = useState<PackageManager>("npm");
  const command = PACKAGE_MANAGERS[manager](name);

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="flex items-center justify-between border-b px-2 py-1.5">
        <div className="flex gap-0.5">
          {(Object.keys(PACKAGE_MANAGERS) as PackageManager[]).map((pm) => (
            <button
              key={pm}
              type="button"
              onClick={() => setManager(pm)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                manager === pm
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {pm}
            </button>
          ))}
        </div>
        <CopyButton value={command} />
      </div>
      <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[13px] text-card-foreground">
        <code>{command}</code>
      </pre>
    </div>
  );
}
