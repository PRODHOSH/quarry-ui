"use client";

import { lazy, Suspense, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const GitHubCalendar = lazy(() =>
  import("react-github-calendar").then((mod) => ({ default: mod.GitHubCalendar }))
);

const Skeleton = () => <div className="h-36 w-full animate-pulse rounded-xl bg-muted" />;

// Five intensity levels derived from the theme, so the graph follows light and dark mode.
const LEVELS = [
  "var(--muted)",
  "color-mix(in oklab, var(--chart-2) 30%, var(--muted))",
  "color-mix(in oklab, var(--chart-2) 55%, var(--muted))",
  "color-mix(in oklab, var(--chart-2) 80%, var(--muted))",
  "var(--chart-2)",
];

export function GithubHeatmap({
  username = "torvalds",
  className,
}: {
  username?: string;
  className?: string;
}) {
  const currentYear = new Date().getFullYear();
  const years: (number | "last")[] = ["last", currentYear, currentYear - 1];
  const [year, setYear] = useState<number | "last">("last");
  // The calendar fetches in the browser, so render it only after hydration.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  return (
    <div className={cn("w-full rounded-2xl border bg-card p-6 text-card-foreground", className)}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Contributions</h3>
          <p className="text-sm text-muted-foreground">@{username} on GitHub</p>
        </div>
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {years.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setYear(y)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                year === y
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {y === "last" ? "Last year" : y}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full overflow-x-auto text-sm text-muted-foreground [&_article]:w-full [&_svg]:h-auto [&_svg]:max-w-full">
        {mounted ? (
          <Suspense fallback={<Skeleton />}>
            <GitHubCalendar
              username={username}
              year={year}
              colorScheme="light"
              theme={{ light: LEVELS as [string, string, string, string, string] }}
              blockRadius={3}
              blockSize={11}
              blockMargin={4}
              fontSize={12}
            />
          </Suspense>
        ) : (
          <Skeleton />
        )}
      </div>
    </div>
  );
}
