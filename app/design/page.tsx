import type { Metadata } from "next";
import { DesignGallery } from "@/components/design/gallery";
import { CATEGORY_ORDER, getDesignCards } from "@/lib/design";

export const metadata: Metadata = {
  title: "Design systems",
  description: "DESIGN.md files for well known brands. Drop one in your project and ask your AI agent to build in that design language.",
};

export default function DesignPage() {
  const cards = getDesignCards();
  const categories = CATEGORY_ORDER.filter((c) => cards.some((x) => x.category === c));

  return (
    <div className="mx-auto w-full max-w-6xl">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-muted-foreground">DESIGN.md</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Design systems your agent can read</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Plain text design briefs for {cards.length} well known brands: colours, type, spacing, components and the reasoning behind them. Save one as <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]">DESIGN.md</code> in your project, then ask your AI tool to build a page in that language.
        </p>
      </header>
      <div className="mt-10">
        <DesignGallery cards={cards} categories={categories} />
      </div>
    </div>
  );
}
