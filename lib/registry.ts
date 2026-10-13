import fs from "node:fs";
import path from "node:path";
import registry from "@/registry.json";
import { GROUPS, type GroupId, type RegistryItem } from "@/lib/registry-types";

const items = registry.items as RegistryItem[];

export function getItems(): RegistryItem[] {
  return items;
}

export function getItem(name: string): RegistryItem | undefined {
  return items.find((item) => item.name === name);
}

export function getGroups() {
  return GROUPS.map((group) => ({
    ...group,
    items: items.filter((item) => item.categories.includes(group.id)),
  }));
}

/** Items in the order they appear in the sidebar, used for previous / next links. */
export function getOrderedItems(): RegistryItem[] {
  return getGroups().flatMap((group) => group.items);
}

export function getNeighbours(name: string) {
  const ordered = getOrderedItems();
  const index = ordered.findIndex((item) => item.name === name);
  return {
    previous: index > 0 ? ordered[index - 1] : undefined,
    next: index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : undefined,
  };
}

/** Reads the real source file, so the page, the CLI and the prompts can never drift apart. */
export function getSource(item: RegistryItem): string {
  return fs.readFileSync(path.join(process.cwd(), "registry", "quarry", `${item.name}.tsx`), "utf8");
}

export type { GroupId, RegistryItem };
