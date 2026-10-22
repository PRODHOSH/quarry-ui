import type { MetadataRoute } from "next";
import { getDesignIndex } from "@/lib/design";
import { getItems, ownerOf } from "@/lib/registry";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/** Every public page: the sections, each component, template, background, loader and design system. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const top = ["", "/components", "/templates", "/backgrounds", "/loaders", "/design", "/waitlist"].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  const items = getItems().map((i) => ({
    url: `${SITE_URL}/${ownerOf(i)}/${i.name}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: ownerOf(i) === "templates" ? 0.8 : 0.6,
  }));
  const designs = getDesignIndex().map((d) => ({ url: `${SITE_URL}/design/${d.slug}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.4 }));
  return [...top, ...items, ...designs];
}
