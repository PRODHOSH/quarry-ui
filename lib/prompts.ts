import { registryUrl } from "@/lib/site";
import type { RegistryItem } from "@/lib/registry-types";

export type AgentId =
  | "default"
  | "claude-code"
  | "codex"
  | "cursor"
  | "v0"
  | "lovable"
  | "bolt"
  | "replit";

export const AGENTS: { id: AgentId; label: string; hint: string }[] = [
  { id: "claude-code", label: "Claude Code", hint: "Runs the CLI for you" },
  { id: "codex", label: "Codex", hint: "Runs the CLI for you" },
  { id: "cursor", label: "Cursor", hint: "Agent mode with terminal" },
  { id: "v0", label: "v0", hint: "Paste the source" },
  { id: "lovable", label: "Lovable", hint: "Paste the source" },
  { id: "bolt", label: "bolt.new", hint: "Paste the source" },
  { id: "replit", label: "Replit", hint: "Agent with a shell" },
];

type Context = { item: RegistryItem; source: string };

const UTILS = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`;

const npmPackages = ({ item }: Context) =>
  [...item.dependencies, "clsx", "tailwind-merge"].join(" ");

const themeNote = (item: RegistryItem) =>
  `It is styled only with shadcn theme tokens (background, foreground, card, muted, border, primary and the chart colors), so it follows the project's existing light and dark theme. Do not hardcode colors.${
    item.meta.stage === "fill" ? " It is fluid width and fills its parent." : ""
  }`;

const usageBlock = (item: RegistryItem) => "```tsx\n" + item.docs + "\n```";

const cliPrompt = (ctx: Context, agentNote: string) => {
  const { item } = ctx;
  return `Add the "${item.title}" component from Quarry UI to this project.

${item.description}

Steps
1. Confirm this is a React project with Tailwind CSS. If there is no components.json, run \`npx shadcn@latest init\` first and accept the defaults.
2. Install the component with the shadcn CLI:
   npx shadcn@latest add ${registryUrl(item.name)}
   Use this project's package manager if it is not npm. The command copies the source into the components folder and installs: ${npmPackages(ctx)}.
3. Import and render it where it fits:

${usageBlock(item)}

Notes
- ${themeNote(item)}
- Adjust it with the className prop. Do not rewrite its internals.
- ${agentNote}
- When finished, run a type check and tell me which files changed.`;
};

const sourcePrompt = (ctx: Context, intro: string, extra = "") => {
  const { item, source } = ctx;
  return `${intro}

Component: ${item.title}
${item.description}

1. Install these npm packages: ${npmPackages(ctx)}
2. If the project has no src/lib/utils.ts (or lib/utils.ts), create it with:

\`\`\`ts
${UTILS}
\`\`\`

3. Create components/${item.name}.tsx (use src/components if the project uses src) with exactly this code:

\`\`\`tsx
${source.trim()}
\`\`\`

4. Use it like this:

${usageBlock(item)}

Notes
- ${themeNote(item)}
- Keep the "@/lib/utils" import working with the project's path alias.${extra ? `\n- ${extra}` : ""}`;
};

export function buildPrompt(agent: AgentId, ctx: Context): string {
  switch (agent) {
    case "claude-code":
      return cliPrompt(
        ctx,
        "If you need to confirm placement, check the existing page structure first and ask me only if it is still unclear."
      );
    case "codex":
      return cliPrompt(
        ctx,
        "Follow the conventions in AGENTS.md if the repository has one, and keep the change limited to this component."
      );
    case "cursor":
      return cliPrompt(
        ctx,
        "Reference @components.json and an existing component for import and file naming conventions. If the terminal is unavailable, fetch " +
          registryUrl(ctx.item.name) +
          " and create the file from its content."
      );
    case "replit":
      return cliPrompt(
        ctx,
        "If the shadcn CLI cannot run in this environment, install the packages with the package manager and create the file from the registry JSON at " +
          registryUrl(ctx.item.name) +
          "."
      );
    case "v0":
      return sourcePrompt(
        ctx,
        `Add this Quarry UI component to the current design. Keep it exactly as written and compose it into the page I describe next.`,
        "v0 already uses shadcn tokens, so no extra theme setup is needed."
      );
    case "lovable":
      return sourcePrompt(
        ctx,
        `Add this Quarry UI component to the project. Do not restyle it, just place it where it belongs.`,
        "Lovable projects already ship shadcn tokens in index.css and tailwind.config, so the classes resolve without changes."
      );
    case "bolt":
      return sourcePrompt(
        ctx,
        `Add this Quarry UI component to the project and render it on the main page so I can see it.`,
        "If the project does not define shadcn color tokens, add the standard ones (background, foreground, card, muted, border, primary) to the Tailwind theme first."
      );
    default:
      return `Install the "${ctx.item.title}" component from Quarry UI.

${ctx.item.description}

Run: npx shadcn@latest add ${registryUrl(ctx.item.name)}

Then use it:

${usageBlock(ctx.item)}

${themeNote(ctx.item)}
If you cannot run commands, use this code instead after installing ${npmPackages(ctx)}:

\`\`\`tsx
${ctx.source.trim()}
\`\`\``;
  }
}


