export type GroupId = "templates" | "sections" | "elements" | "backgrounds" | "loaders";

export type RegistryItem = {
  name: string;
  type: "registry:component" | "registry:block";
  title: string;
  description: string;
  categories: GroupId[];
  dependencies: string[];
  registryDependencies: string[];
  files: { path: string; type: string; target?: string }[];
  docs: string;
  meta: { stage: "center" | "fill"; theme?: import("@/lib/themes").ThemeId; preview?: string; tags?: string[]; route?: string; routes?: string[] };
};

export const GROUPS: { id: GroupId; title: string; description: string }[] = [
  {
    id: "templates",
    title: "Templates",
    description: "Whole screens and apps. Install one, then change the copy and wire it to your data.",
  },
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
    id: "backgrounds",
    title: "Backgrounds",
    description: "Interactive canvas backdrops. Tune the colour and the cursor behaviour live.",
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
