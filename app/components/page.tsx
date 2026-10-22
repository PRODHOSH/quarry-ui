import type { Metadata } from "next";
import { Mark } from "@/components/site/mark";
import { ComponentCard } from "@/components/site/component-card";
import { getGroups } from "@/lib/registry";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Components" };

export default function ComponentsPage() {
  const groups = getGroups().filter((g) => g.id === "sections" || g.id === "elements");
  const total = groups.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-10">
        <h1 className="text-5xl font-medium tracking-[-0.03em]">
          All <Mark>components</Mark>
        </h1>
        <p className="mt-4 max-w-xl font-normal leading-relaxed text-muted-foreground">
          {total} free components. Each one is a single file that reads your theme tokens, so it
          looks at home in your project from the first render.
        </p>
      </header>

      <div className="space-y-16">
        {groups.map((group) => (
          <section key={group.id} aria-labelledby={`group-${group.id}`}>
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <div>
                <h2 id={`group-${group.id}`} className="text-xl font-medium tracking-tight">
                  {group.title}
                </h2>
                <p className="mt-1 text-sm font-normal text-muted-foreground">{group.description}</p>
              </div>
              <span className="text-sm tabular-nums text-muted-foreground">{group.items.length}</span>
            </div>

            <ul
              className={cn(
                "grid gap-4",
                group.id === "loaders"
                  ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
              )}
            >
              {group.items.map((item) => (
                <li key={item.name}>
                  <ComponentCard name={item.name} title={item.title} stage={item.meta.stage} theme={item.meta.theme} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
