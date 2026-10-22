import { getDesignIndex } from "@/lib/design";
import { getItems, ownerOf, type Owner } from "@/lib/registry";
import { registryUrl, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

const LABEL: Record<Owner, string> = { components: "Components", templates: "Templates", backgrounds: "Backgrounds", loaders: "Loaders" };
const ORDER: Owner[] = ["components", "templates", "backgrounds", "loaders"];

const intro = `${SITE_NAME} is a free, open source library of React components, full app templates, backgrounds and loaders with real motion, plus DESIGN.md briefs for well known brands. Everything installs through the shadcn CLI: the source is copied into your project and is yours to change. Components style themselves only with shadcn theme tokens, so they follow your colours and dark mode.`;

const howTo = `## How to install

Run this in a React project that uses Tailwind CSS and shadcn/ui (run \`npx shadcn@latest init\` first if it does not):

\`\`\`bash
npx shadcn@latest add ${SITE_URL}/r/<name>.json
\`\`\`

Replace <name> with an item name from the lists below. Every item page also has a "Copy prompt" button for AI tools.`;

/** The short index, following the llms.txt convention: a title, a summary and sectioned links. */
export function llmsTxt(): string {
  const items = getItems();
  const sections = ORDER.map((o) => {
    const list = items.filter((i) => ownerOf(i) === o);
    return `## ${LABEL[o]}\n\n${list.map((i) => `- [${i.title}](${SITE_URL}/${o}/${i.name}): ${i.description}`).join("\n")}`;
  });
  const design = getDesignIndex();
  return [
    `# ${SITE_NAME}`,
    `> ${SITE_TAGLINE}. ${intro}`,
    howTo,
    ...sections,
    `## Design systems\n\nPlain text DESIGN.md files an AI tool can read to build in a brand's design language. Index: ${SITE_URL}/design\n\n${design.map((d) => `- [${d.name}](${SITE_URL}/design/${d.slug}): ${d.tagline}. File: ${SITE_URL}/design-md/${d.slug}.md`).join("\n")}`,
    `## Optional\n\n- [Full documentation for language models](${SITE_URL}/llms-full.txt)\n- [Sitemap](${SITE_URL}/sitemap.xml)\n- [Source code](https://github.com/PRODHOSH/quarry-ui)`,
  ].join("\n\n") + "\n";
}

/** The long form: every item with its description, packages, install command and usage. */
export function llmsFullTxt(): string {
  const items = getItems();
  const body = ORDER.map((o) => {
    const list = items.filter((i) => ownerOf(i) === o);
    const entries = list.map((i) => {
      const deps = i.dependencies.length ? i.dependencies.join(", ") : "none beyond React";
      const extra = o === "templates" && i.meta.routes ? `\nRoutes: ${i.meta.routes.join(", ")}` : "";
      return [
        `### ${i.title}`,
        i.description,
        `- Page: ${SITE_URL}/${o}/${i.name}`,
        `- Install: \`npx shadcn@latest add ${registryUrl(i.name)}\``,
        `- Extra packages: ${deps}${extra}`,
        `- Registry JSON with full source: ${registryUrl(i.name)}`,
        "",
        "Usage:",
        "",
        "```tsx",
        i.docs,
        "```",
      ].join("\n");
    });
    return `## ${LABEL[o]}\n\n${entries.join("\n\n")}`;
  });
  const design = getDesignIndex();
  return [
    `# ${SITE_NAME}`,
    `> ${SITE_TAGLINE}.`,
    intro,
    howTo,
    `## Conventions\n\n- Components are single files named \`<name>.tsx\` that export a named component and accept a \`className\` prop.\n- They use only theme tokens (background, foreground, card, muted, border, primary and friends), never hard coded colours.\n- Motion uses the \`framer-motion\` package and icons use \`lucide-react\`.\n- Templates install a whole app under their own route folder, for example \`app/lms\`, and keep demo data in memory so they run straight away.`,
    ...body,
    `## Design systems\n\nEach is a plain text DESIGN.md that describes a brand's colours, type, spacing and components. Save it as DESIGN.md in a project and ask an AI tool to build in that language.\n\n${design.map((d) => `- ${d.name} (${d.category}): ${SITE_URL}/design-md/${d.slug}.md`).join("\n")}`,
  ].join("\n\n") + "\n";
}
