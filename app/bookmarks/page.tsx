import type { Metadata } from "next";
import { BookmarksView } from "@/components/auth/bookmarks-view";
import { getDesignCards } from "@/lib/design";
import { getItems, ownerOf } from "@/lib/registry";

export const metadata: Metadata = { title: "Bookmarks" };

export default function BookmarksPage() {
  const items = getItems().map((i) => ({ name: i.name, title: i.title, owner: ownerOf(i), stage: i.meta.stage, theme: i.meta.theme }));
  const designs = getDesignCards().map((d) => ({ slug: d.slug, name: d.name, category: d.category, swatch: d.swatch }));
  return <BookmarksView items={items} designs={designs} />;
}
