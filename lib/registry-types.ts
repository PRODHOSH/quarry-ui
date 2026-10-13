export type GroupId = "sections" | "elements" | "loaders";

export type RegistryItem = {
  name: string;
  type: "registry:component" | "registry:block";
  title: string;
  description: string;
  categories: GroupId[];
  dependencies: string[];
  registryDependencies: string[];
  files: { path: string; type: string }[];
  docs: string;
  meta: { stage: "center" | "fill" };
};

export const GROUPS: { id: GroupId; title: string; description: string }[] = [
  {
    id: "sections",
    title: "Sections",
    description: "Full width blocks for landing pages, built from theme tokens.",
  },
  {
    id: "elements",
    title: "Elements",
    description: "Focused interface pieces such as modals, pills and graphs.",
  },
  {
    id: "loaders",
    title: "Loaders",
    description: "Small, tasteful loading states that follow your colors.",
  },
];

/** The name a component is exported under, derived from its registry name. */
export const exportName = (name: string) =>
  name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
