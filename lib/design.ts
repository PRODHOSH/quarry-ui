import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import index from "@/lib/design-index.json";

export type DesignMeta = { slug: string; name: string; category: string; tagline: string };
export type DesignDoc = DesignMeta & {
  body: string;
  colors: { key: string; value: string }[];
  fonts: string[];
  swatch: string[];
  bytes: number;
};

const FILES = join(process.cwd(), "public", "design-md");
const PREFER = ["primary", "canvas", "background", "surface", "ink", "text", "accent", "brand", "secondary", "foreground"];

export const CATEGORY_ORDER = ["AI & LLM", "Developer tools", "Backend & DevOps", "Productivity & SaaS", "Design & creative", "Fintech", "Commerce", "Media & tech", "Automotive"];

export function getDesignIndex(): DesignMeta[] {
  return index as DesignMeta[];
}

const isHex = (v: string) => /^#[0-9a-f]{6}$/i.test(v);

function parse(raw: string) {
  const fm = raw.match(/^---\n([\s\S]*?)\n---\n/);
  const front = fm ? fm[1] : "";
  const body = fm ? raw.slice(fm[0].length) : raw;

  const colors: { key: string; value: string }[] = [];
  const block = front.match(/^colors:\n((?:[ \t]+.*\n?)+)/m);
  if (block) {
    for (const line of block[1].split("\n")) {
      const m = line.match(/^\s+([\w-]+):\s*"?(#[0-9a-fA-F]{6})"?/);
      if (m) colors.push({ key: m[1], value: m[2].toLowerCase() });
    }
  }

  const fonts: string[] = [];
  for (const m of front.matchAll(/fontFamily:\s*(.+)/g)) {
    const first = m[1].split(",")[0].trim().replace(/^["']+|["']+$/g, "");
    if (first && !fonts.includes(first)) fonts.push(first);
  }

  const pick: string[] = [];
  for (const key of PREFER) {
    const c = colors.find((x) => x.key === key || x.key.startsWith(key + "-"));
    if (c && !pick.includes(c.value)) pick.push(c.value);
    if (pick.length >= 5) break;
  }
  for (const c of colors) {
    if (pick.length >= 6) break;
    if (isHex(c.value) && !pick.includes(c.value)) pick.push(c.value);
  }
  return { body, colors, fonts: fonts.slice(0, 4), swatch: pick.slice(0, 6) };
}

const cache = new Map<string, DesignDoc>();

export function getDesign(slug: string): DesignDoc | null {
  const meta = getDesignIndex().find((d) => d.slug === slug);
  if (!meta) return null;
  const hit = cache.get(slug);
  if (hit) return hit;
  const raw = readFileSync(join(FILES, `${slug}.md`), "utf-8").replace(/\r/g, "");
  const doc: DesignDoc = { ...meta, ...parse(raw), bytes: Buffer.byteLength(raw) };
  cache.set(slug, doc);
  return doc;
}

/** Light data for the gallery: name, tagline, category and a palette strip. */
export function getDesignCards() {
  return getDesignIndex().map((m) => {
    const d = getDesign(m.slug)!;
    return { slug: m.slug, name: m.name, category: m.category, tagline: m.tagline, swatch: d.swatch, fonts: d.fonts.slice(0, 2) };
  });
}
