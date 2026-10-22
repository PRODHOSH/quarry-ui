import { ComponentCard } from "@/components/site/component-card";
import { Mark } from "@/components/site/mark";
import { getItems, ownerOf, type Owner } from "@/lib/registry";
import { cn } from "@/lib/utils";

const COPY: Record<"backgrounds" | "loaders", { word: string; blurb: string }> = {
  backgrounds: {
    word: "backgrounds",
    blurb: "Live canvas and CSS backgrounds for hero sections and full pages. Every one has controls you can tune, and every one reads your theme tokens.",
  },
  loaders: {
    word: "loaders",
    blurb: "Small loading motions for buttons, lists and whole screens. Pure CSS where possible, one file each, colour from currentColor.",
  },
};

/** The gallery page for one top level section: /backgrounds or /loaders. */
export function GroupPage({ kind }: { kind: Extract<Owner, "backgrounds" | "loaders"> }) {
  const items = getItems().filter((i) => ownerOf(i) === kind);
  const copy = COPY[kind];

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-10">
        <h1 className="text-5xl font-medium capitalize tracking-[-0.03em]">
          All <Mark>{copy.word}</Mark>
        </h1>
        <p className="mt-4 max-w-xl font-normal leading-relaxed text-muted-foreground">
          {items.length} free {copy.word}. {copy.blurb}
        </p>
      </header>
      <ul className={cn("grid gap-4", kind === "loaders" ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3")}>
        {items.map((item) => (
          <li key={item.name}>
            <ComponentCard name={item.name} title={item.title} stage={item.meta.stage} theme={item.meta.theme} base={`/${kind}`} />
          </li>
        ))}
      </ul>
    </div>
  );
}
