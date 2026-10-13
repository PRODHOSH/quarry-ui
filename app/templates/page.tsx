import { Suspense } from "react";
import type { Metadata } from "next";
import { TemplatesBrowser } from "@/components/site/templates-browser";
import { getGroups } from "@/lib/registry";

export const metadata: Metadata = { title: "Templates", description: "Whole Next.js apps you can install, restyle and ship." };

export default function TemplatesPage() {
  const items = getGroups().find((g) => g.id === "templates")?.items ?? [];
  const templates = items.map((i) => ({
    name: i.name,
    title: i.title,
    description: i.description,
    preview: i.meta.preview ?? "",
    tags: i.meta.tags ?? [],
    routes: i.meta.routes?.length ?? 1,
    files: i.files.length,
  }));
  return (
    <Suspense fallback={null}>
      <TemplatesBrowser templates={templates} />
    </Suspense>
  );
}
