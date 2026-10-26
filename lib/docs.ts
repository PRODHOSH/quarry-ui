import { getItems, ownerOf } from "@/lib/registry";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

/** The documentation, as data. The site pages and the PDF are both drawn from this one file. */
export type Block =
  | { t: "p"; text: string }
  | { t: "h3"; text: string }
  | { t: "code"; code: string; lang?: string; title?: string }
  | { t: "list"; items: string[]; ordered?: boolean }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "note"; text: string; title?: string };

export type Doc = { slug: string; group: string; title: string; lead: string; blocks: Block[] };

const R = `${SITE_URL}/r`;

function counts() {
  const items = getItems();
  const n = (o: string) => items.filter((i) => ownerOf(i) === o).length;
  return { components: n("components"), templates: n("templates"), backgrounds: n("backgrounds"), loaders: n("loaders") };
}

export function getDocs(): Doc[] {
  const c = counts();
  return [
    {
      slug: "introduction",
      group: "Getting started",
      title: "Introduction",
      lead: `${SITE_NAME} is a free, open source library of React components, full app templates, backgrounds and loaders. You copy what you need into your project and it becomes your code.`,
      blocks: [
        { t: "p", text: "There is no package to install and no version to keep up with. Each item is a small registry entry that the shadcn CLI turns into plain files in your repository. Read them, change them, delete the parts you do not need." },
        { t: "h3", text: "What is inside" },
        {
          t: "table",
          head: ["Collection", "Count", "What it is"],
          rows: [
            ["Components", String(c.components), "Sections and elements: footers, pricing, testimonials, navbars, galleries, forms, text effects and more."],
            ["Templates", String(c.templates), "Whole apps that install into your Next.js project: AI Chat, File Manager, Learning Platform and Abyss."],
            ["Backgrounds", String(c.backgrounds), "Live canvases with controls, for hero sections and full pages."],
            ["Loaders", String(c.loaders), "Small loading motions you can drop in anywhere."],
            ["Design systems", "78", "DESIGN.md briefs for well known brands, written for AI tools to read."],
          ],
        },
        { t: "h3", text: "How it works" },
        {
          t: "list",
          ordered: true,
          items: [
            "Find something on the site and open its page.",
            "Run the install command, or press Copy prompt and paste it into your AI tool.",
            "The CLI writes the source into your project and adds any packages it needs.",
            "Import it, pass your own content, and change anything you like.",
          ],
        },
        { t: "h3", text: "Principles" },
        {
          t: "list",
          items: [
            "**Your theme, not ours.** Components only use shadcn tokens, so they follow your colours and dark mode.",
            "**One file each.** Open a component and you can read the whole thing.",
            "**Motion that explains.** Things move to show what changed, never just to show off.",
            "**Accessible by default.** Real buttons and links, visible focus, and reduced motion respected.",
          ],
        },
      ],
    },
    {
      slug: "installation",
      group: "Getting started",
      title: "Installation",
      lead: "Quarry UI installs through the shadcn CLI. If your project already uses shadcn/ui, you can add a component right now.",
      blocks: [
        { t: "h3", text: "Requirements" },
        {
          t: "list",
          items: [
            "A React project. Templates need Next.js with the App Router.",
            "Tailwind CSS 4.",
            "shadcn/ui set up in the project, so a `components.json` file exists.",
            "Node.js 20 or newer.",
          ],
        },
        { t: "h3", text: "Set up shadcn once" },
        { t: "p", text: "Skip this if you already have a `components.json`." },
        { t: "code", lang: "bash", code: "npx shadcn@latest init" },
        { t: "h3", text: "Add a component" },
        { t: "p", text: "Every item has a JSON address on this site. Pass it to the CLI:" },
        { t: "code", lang: "bash", code: `npx shadcn@latest add ${R}/mega-footer.json` },
        { t: "p", text: "The CLI copies the file into your components folder, installs the packages it needs (usually `framer-motion` and `lucide-react`) and makes sure `lib/utils.ts` has the `cn()` helper." },
        { t: "h3", text: "Other package managers" },
        {
          t: "table",
          head: ["Manager", "Command"],
          rows: [
            ["npm", `npx shadcn@latest add ${R}/<name>.json`],
            ["pnpm", `pnpm dlx shadcn@latest add ${R}/<name>.json`],
            ["yarn", `yarn dlx shadcn@latest add ${R}/<name>.json`],
            ["bun", `bunx --bun shadcn@latest add ${R}/<name>.json`],
          ],
        },
        { t: "h3", text: "Add a template" },
        { t: "p", text: "Templates are installed the same way. They write several files, including pages under `app/`:" },
        { t: "code", lang: "bash", code: `npx shadcn@latest add ${R}/ai-chat.json` },
        { t: "p", text: "Start your dev server and open the route the template documents, for example `/ai-chat`." },
        { t: "note", title: "Overwriting", text: "If a file already exists, the CLI asks before replacing it. Commit your work first so you can review the diff." },
      ],
    },
    {
      slug: "quick-start",
      group: "Getting started",
      title: "Quick start",
      lead: "From an empty page to a working component in about a minute.",
      blocks: [
        { t: "p", text: "This walks through the Mega Footer. Every other component follows the same steps." },
        { t: "h3", text: "1. Install it" },
        { t: "code", lang: "bash", code: `npx shadcn@latest add ${R}/mega-footer.json` },
        { t: "h3", text: "2. Use it" },
        {
          t: "code",
          lang: "tsx",
          title: "app/page.tsx",
          code: `import { MegaFooter } from "@/components/mega-footer";

export default function Page() {
  return <MegaFooter brand="Northwind" />;
}`,
        },
        { t: "h3", text: "3. Make it yours" },
        { t: "p", text: "Every component has sensible defaults and accepts your own content through props. Each one also takes a `className`, merged with `cn()`, so you can adjust spacing and size without editing the file." },
        { t: "code", lang: "tsx", code: `<MegaFooter brand="Northwind" className="border-t" />` },
        { t: "p", text: "When props are not enough, open the file in `components/` and edit it. It is your code." },
        { t: "note", title: "Each page shows its own usage", text: "Open any item on the site to see a live preview, the install command, the props and a usage snippet." },
      ],
    },
    {
      slug: "ai-prompts",
      group: "Getting started",
      title: "Copy prompt",
      lead: "Prefer to let an AI tool do the work? Every item has a Copy prompt button.",
      blocks: [
        { t: "p", text: "The prompt contains everything the tool needs: what to install, how to import it, and for some tools the full source. Paste it into the tool and it sets the component up in your project." },
        { t: "h3", text: "Supported tools" },
        {
          t: "table",
          head: ["Tool", "How it works"],
          rows: [
            ["Claude Code", "Runs the install command for you"],
            ["Codex", "Runs the install command for you"],
            ["Cursor", "Agent mode with a terminal"],
            ["v0", "Paste the source"],
            ["Lovable", "Paste the source"],
            ["bolt.new", "Paste the source"],
            ["Replit", "Agent with a shell"],
          ],
        },
        { t: "p", text: "Use the arrow next to the button to choose your tool. The site remembers your choice." },
        { t: "h3", text: "Limits" },
        { t: "p", text: "You can copy a couple of prompts without an account. After that, sign in with Google or GitHub to keep copying. Signing in is free and only stores your name, email and bookmarks. The install command and the source code are never limited." },
      ],
    },
    {
      slug: "theming",
      group: "Guides",
      title: "Theming",
      lead: "Components follow your design system because they only use shadcn tokens.",
      blocks: [
        { t: "p", text: "There are no hard coded colours in a Quarry component. Everything reads CSS variables from your `globals.css`, so a new theme or dark mode applies to every component at once." },
        { t: "h3", text: "Tokens in use" },
        {
          t: "table",
          head: ["Token", "Used for"],
          rows: [
            ["`background`, `foreground`", "Page surface and default text"],
            ["`card`, `card-foreground`", "Raised panels and cards"],
            ["`muted`, `muted-foreground`", "Quiet surfaces and secondary text"],
            ["`primary`, `primary-foreground`", "Main buttons and emphasis"],
            ["`accent`, `accent-foreground`", "Hover states and highlights"],
            ["`border`, `ring`", "Outlines and focus rings"],
            ["`destructive`", "Errors and delete actions"],
          ],
        },
        { t: "h3", text: "Change the look" },
        { t: "p", text: "Edit the variables in your stylesheet. Nothing inside the components needs to change." },
        {
          t: "code",
          lang: "css",
          title: "globals.css",
          code: `:root {
  --background: oklch(0.985 0 0);
  --foreground: oklch(0.16 0 0);
  --primary: oklch(0.18 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --border: oklch(0.91 0 0);
}

.dark {
  --background: oklch(0.12 0 0);
  --foreground: oklch(0.97 0 0);
  --primary: oklch(0.97 0 0);
  --primary-foreground: oklch(0.14 0 0);
}`,
        },
        { t: "h3", text: "Dark mode" },
        { t: "p", text: "Use the `dark` class on a parent element, the same way shadcn does. Components switch with it and need no extra props." },
        { t: "h3", text: "Presets on the site" },
        { t: "p", text: "Previews on the site wrap some components in a preset, a small set of tokens and a font they were designed with. The component page shows the preset as CSS you can paste into your own `globals.css` if you want the same look." },
      ],
    },
    {
      slug: "components",
      group: "Guides",
      title: "Components",
      lead: "How components are built, and how to change them.",
      blocks: [
        { t: "h3", text: "Anatomy" },
        { t: "p", text: "Each component is a single file with a named export and a `className` prop." },
        {
          t: "code",
          lang: "tsx",
          code: `import { cn } from "@/lib/utils";

export function Example({ title = "Hello", className }: { title?: string; className?: string }) {
  return <section className={cn("rounded-2xl border bg-card p-6", className)}>{title}</section>;
}`,
        },
        { t: "h3", text: "Sections and elements" },
        { t: "p", text: "Sections are page sized: heroes, feature grids, pricing, footers. Elements are smaller: buttons, inputs, badges, cards. Use the sidebar to browse either." },
        { t: "h3", text: "Customising" },
        {
          t: "list",
          items: [
            "**Props first.** Pass your own text, items and images.",
            "**className second.** Adjust layout and spacing from outside.",
            "**Edit the source last.** The file is in your repository. Change what you like.",
          ],
        },
        { t: "h3", text: "Motion" },
        { t: "p", text: "Motion uses `framer-motion` or plain CSS. Many ambient effects check `prefers-reduced-motion` and fall back to a still frame. Interactive motion keeps durations short." },
        { t: "h3", text: "Dependencies" },
        { t: "p", text: "The install command adds what a component needs. Most use only `framer-motion` and `lucide-react`. A few backgrounds use no packages at all." },
      ],
    },
    {
      slug: "templates",
      group: "Guides",
      title: "Templates",
      lead: "Complete apps that install into a Next.js project and become yours.",
      blocks: [
        { t: "p", text: "A template is a set of files: pages under `app/`, components, a small data layer and a layout. Everything runs on sample data, so you can see it working before you connect anything." },
        {
          t: "table",
          head: ["Template", "Install", "Routes"],
          rows: [
            ["AI Chat", `npx shadcn@latest add ${R}/ai-chat.json`, "/ai-chat, /ai-chat/c/[id], /ai-chat/projects/[slug]"],
            ["File Manager", `npx shadcn@latest add ${R}/file-manager.json`, "/file-manager and its folders"],
            ["Learning Platform", `npx shadcn@latest add ${R}/lms.json`, "/lms, /lms/content, /lms/reports"],
            ["Abyss", `npx shadcn@latest add ${R}/abyss.json`, "/abyss, /abyss/login, /abyss/signup"],
          ],
        },
        { t: "h3", text: "Mount point" },
        { t: "p", text: "Each template lives under its own folder in `app/`. Links inside it work wherever it is mounted, so you can move the folder or serve it from a different path." },
        { t: "h3", text: "Connect your backend" },
        {
          t: "list",
          items: [
            "**AI Chat and Abyss.** Replace the `replyFor` function in the data file with a call to your model API and stream tokens into the message.",
            "**Abyss sign in and sign up.** The forms validate input and then open the chat. Connect their submit handlers to your auth service.",
            "**File Manager and Learning Platform.** Swap the sample data in the template's `lib` folder for your own queries.",
          ],
        },
        { t: "note", title: "Theme", text: "Templates read your tokens. The preview on the site sets its own theme so you see the design as intended." },
      ],
    },
    {
      slug: "backgrounds",
      group: "Guides",
      title: "Backgrounds",
      lead: "Live canvases for hero sections and full pages, each with controls you can tune.",
      blocks: [
        { t: "p", text: "Backgrounds are components that fill their container. Give them a height, put your content inside as children, and they draw behind it." },
        {
          t: "code",
          lang: "tsx",
          code: `import { FlowField } from "@/components/flow-field";

export default function Hero() {
  return (
    <div className="h-screen">
      <FlowField interaction="swirl">
        <h1>Your headline</h1>
      </FlowField>
    </div>
  );
}`,
        },
        { t: "h3", text: "Controls" },
        { t: "p", text: "The preview on every background page has controls for its props: colour, speed, density, cursor behaviour. Set them until it looks right, then copy the values into your code." },
        { t: "h3", text: "Performance" },
        {
          t: "list",
          items: [
            "Canvases pause when scrolled out of view.",
            "Reduced motion shows a still frame instead of animating.",
          ],
        },
      ],
    },
    {
      slug: "ascii-aquarium",
      group: "Guides",
      title: "ASCII Aquarium",
      lead: "Sea creatures, birds and pets drawn as live ASCII, with colourways and controls. Used by the Abyss template.",
      blocks: [
        { t: "p", text: "The aquarium paints each animal into a tiny hidden canvas, one pixel per character cell, then turns every pixel into a glyph by how dark it is. Large animals such as sharks and whales are drawn as soft shapes and look like shaded ASCII art. Small ones such as birds, fish, butterflies and pets are pixel sprites on muted tiles." },
        { t: "code", lang: "bash", code: `npx shadcn@latest add ${R}/ascii-aquarium.json` },
        {
          t: "code",
          lang: "tsx",
          code: `import { AsciiAquarium } from "@/components/ascii-aquarium";

export default function Hero() {
  return (
    <div className="h-screen">
      <AsciiAquarium animal="jellyfish" colorway="dusk">
        <h1>Something is swimming</h1>
      </AsciiAquarium>
    </div>
  );
}`,
        },
        { t: "h3", text: "Animals" },
        {
          t: "table",
          head: ["Group", "Values"],
          rows: [
            ["Ocean", "`shark`, `hammerhead`, `manta`, `whale`, `turtle`, `jellyfish`, `school`"],
            ["Sky", "`birds`, `butterflies`"],
            ["Land", "`dog`, `cat`, `rabbit`, `pets`"],
          ],
        },
        { t: "p", text: "Land animals sit in a small meadow with trees and grass. They blink, wag, and hop to a new spot every few seconds. `pets` shows a dog, a cat and a rabbit together." },
        { t: "h3", text: "Colourways" },
        { t: "p", text: "`theme` reads your own `background`, `foreground` and `primary` tokens and follows light and dark mode. The others are fixed: `abyss`, `mono`, `ember`, `kelp`, `dusk` and `paper`. The `COLORWAYS` export lists their colours." },
        { t: "h3", text: "Props" },
        {
          t: "table",
          head: ["Prop", "Default", "What it does"],
          rows: [
            ["`animal`", "`shark`", "Which animal or scene to draw."],
            ["`colorway`", "`theme`", "Colours. `theme` uses your tokens."],
            ["`count`", "auto", "How many animals. Chosen from the stage size when empty."],
            ["`speed`", "`1`", "Pace of everything. Can be changed live."],
            ["`scale`", "`1`", "Size of the animals. Can be changed live."],
            ["`detail`", "`9`", "Size of one character cell in px. Smaller is finer."],
            ["`look`", "`auto`", "`tiles`, `glyphs` or `auto`, which picks what suits the animal."],
            ["`grid`", "`true`", "Faint cell grid behind everything. Tiles only."],
            ["`bubbles`", "`true`", "Rising flecks in water scenes."],
            ["`pointer`", "`avoid`", "`avoid`, `attract` or `off`. How animals react to the cursor."],
            ["`paused`", "`false`", "Stops the motion and keeps the frame."],
            ["`calm`", "`0.6`", "Fades the scene behind your content, 0 to 1."],
            ["`dim`", "`0`", "Fades the whole scene, 0 to 1."],
            ["`avoid`", "children", "A ref to an element animals should keep clear of."],
            ["`className`", "none", "Set a height here. The component fills its container."],
          ],
        },
        { t: "h3", text: "Tips" },
        {
          t: "list",
          items: [
            "Always give the container a height. The scene fills it.",
            "Use `avoid` with a ref to your prompt box or card so animals swim around it.",
            "Raise `dim` behind long text, and lower `speed` for calmer screens.",
            "Reduced motion draws a single still frame and stops the loop.",
          ],
        },
      ],
    },
    {
      slug: "loaders",
      group: "Guides",
      title: "Loaders",
      lead: "Small loading motions that match any theme.",
      blocks: [
        { t: "p", text: "Loaders are tiny components with no required props. Drop one where something is loading." },
        { t: "code", lang: "tsx", code: `import { ArcSpinner } from "@/components/arc-spinner";\n\n<ArcSpinner className="size-8" />` },
        { t: "p", text: "They use `currentColor`, so they take the text colour of their parent. Put them in a button, a card or a full page overlay." },
      ],
    },
    {
      slug: "design-systems",
      group: "Guides",
      title: "Design systems",
      lead: "DESIGN.md briefs your AI tool can read to build in a familiar visual language.",
      blocks: [
        { t: "p", text: "A DESIGN.md is a plain text description of a design language: colours, type, spacing, components and the reasoning behind them. The site has briefs for 78 well known brands." },
        { t: "h3", text: "How to use one" },
        {
          t: "list",
          ordered: true,
          items: [
            "Open a brand on the Design systems page and download or copy its DESIGN.md.",
            "Save it in your project root as `DESIGN.md`.",
            "Ask your AI tool to build a page following it.",
          ],
        },
        { t: "code", lang: "text", code: "Build a pricing page that follows DESIGN.md. Use its colours, type scale and component rules." },
        { t: "note", title: "Brand names", text: "The briefs describe the public look of each brand for reference. Names and designs belong to their owners, and a brief gives you no right to use their trademarks. Build your own product in your own name." },
      ],
    },
    {
      slug: "registry",
      group: "Reference",
      title: "Registry",
      lead: "How items are published, and how tools and agents can read them.",
      blocks: [
        { t: "p", text: "Quarry UI is a shadcn registry. Every item is a JSON file at a predictable address." },
        { t: "code", lang: "text", code: `${R}/<name>.json` },
        { t: "h3", text: "Machine readable indexes" },
        {
          t: "table",
          head: ["Address", "Contents"],
          rows: [
            ["`/llms.txt`", "A short index of every component, template, background and loader."],
            ["`/llms-full.txt`", "The index with descriptions and usage for each item."],
            ["`/sitemap.xml`", "Every public page."],
            ["`/r/<name>.json`", "The install payload for one item."],
          ],
        },
        { t: "h3", text: "Item shape" },
        {
          t: "code",
          lang: "json",
          code: `{
  "name": "mega-footer",
  "type": "registry:component",
  "title": "Mega Footer",
  "dependencies": ["framer-motion"],
  "registryDependencies": ["utils"],
  "files": [{ "path": "registry/quarry/mega-footer.tsx", "type": "registry:component" }]
}`,
        },
        { t: "p", text: "Multi file items, such as templates, list every file with a `target` path that says where it is written in your project." },
      ],
    },
    {
      slug: "self-hosting",
      group: "Reference",
      title: "Run it yourself",
      lead: "Clone the site, run it locally, or deploy your own copy.",
      blocks: [
        { t: "h3", text: "Run locally" },
        {
          t: "code",
          lang: "bash",
          code: `git clone https://github.com/PRODHOSH/quarry-ui.git
cd quarry-ui
npm install
npm run dev`,
        },
        { t: "p", text: "Open http://localhost:3000. The site works without any configuration. Sign in, bookmarks and the waiting list need a Supabase project." },
        { t: "h3", text: "Scripts" },
        {
          t: "table",
          head: ["Command", "What it does"],
          rows: [
            ["`npm run dev`", "Start the dev server."],
            ["`npm run build`", "Build the registry JSON, then the site."],
            ["`npm run registry:build`", "Build only the registry JSON into `public/r`."],
            ["`npm run lint`", "Run ESLint."],
            ["`npm run typecheck`", "Run the TypeScript compiler without emitting."],
          ],
        },
        { t: "h3", text: "Environment variables" },
        { t: "p", text: "Copy `.env.example` to `.env.local` and fill what you need." },
        {
          t: "table",
          head: ["Variable", "Purpose"],
          rows: [
            ["`NEXT_PUBLIC_SUPABASE_URL`", "Your Supabase project URL."],
            ["`NEXT_PUBLIC_SUPABASE_ANON_KEY`", "The public anon key from Project settings, API."],
            ["`NEXT_PUBLIC_SITE_URL`", "The public address of your deployment. Used in links, the sitemap and install commands."],
            ["`NEXT_PUBLIC_CONTACT_EMAIL`", "Where the contact links point."],
            ["`NEXT_PUBLIC_GITHUB_URL`", "Your repository address."],
            ["`PROMPT_SECRET`", "Server only. A long random string that signs the free prompt counter. Required in production. Create one with `openssl rand -hex 32`."],
            ["`NEXT_PUBLIC_GA_ID`", "Google Analytics measurement id. Leave empty to turn it off."],
          ],
        },
        { t: "h3", text: "Set up Supabase" },
        {
          t: "list",
          ordered: true,
          items: [
            "Create a free project at supabase.com.",
            "Run the files in `supabase/migrations` in order: `0001_bookmarks.sql`, `0002_waitlist.sql`, `0003_prompt_usage.sql`.",
            "Under Authentication, turn on the Google and GitHub providers and add your keys.",
            "Under Authentication, URL configuration, set the Site URL to your address and add it to the redirect list.",
            "Copy the project URL and anon key into `.env.local`.",
          ],
        },
        { t: "p", text: "Bookmarks and the prompt counter are protected by row level security, so people can only read their own rows." },
        { t: "h3", text: "Deploy" },
        { t: "p", text: "Any host that runs Next.js works. On Vercel, import the repository, add the environment variables and deploy. The build command already runs the registry build first." },
      ],
    },
    {
      slug: "contributing",
      group: "Reference",
      title: "Contributing",
      lead: "One good pull request makes a real difference. Here is the short version.",
      blocks: [
        { t: "h3", text: "Add a component" },
        {
          t: "list",
          ordered: true,
          items: [
            "Create `registry/quarry/<name>.tsx` with a named export and a `className` prop.",
            "Add an entry to `registry.json`. Copy a neighbour and change the details.",
            "Add a preview in `registry/demos.tsx`.",
            "Run `npm run registry:build`.",
            "Open the page, then check light and dark mode, phone width and the keyboard.",
            "Run `npm run lint` and `npm run typecheck`, then open the pull request.",
          ],
        },
        { t: "h3", text: "What a good component looks like" },
        {
          t: "list",
          items: [
            "Theme tokens only. No hex values and no palette colours.",
            "One self contained file that imports only `@/lib/utils`, `framer-motion` and `lucide-react`.",
            "A named export and a `className` prop merged with `cn()`.",
            "Looks good with zero props, and the content is overridable.",
            "Short, purposeful motion that respects reduced motion.",
            "Accessible: real buttons, visible focus, labels on icon buttons.",
            "Works at phone width.",
          ],
        },
        { t: "p", text: "The full guide is in CONTRIBUTING.md in the repository. Security problems should be reported privately, as described in SECURITY.md." },
      ],
    },
    {
      slug: "faq",
      group: "Reference",
      title: "Troubleshooting and FAQ",
      lead: "Quick answers to the things people ask most.",
      blocks: [
        { t: "h3", text: "The install command says components.json is missing" },
        { t: "p", text: "shadcn is not set up in the project yet. Run `npx shadcn@latest init`, then try again." },
        { t: "h3", text: "A component looks unstyled" },
        { t: "p", text: "Check that Tailwind CSS 4 is installed and that your stylesheet defines the shadcn tokens. Components read `--background`, `--foreground`, `--primary` and the rest, so a missing token shows as missing colour." },
        { t: "h3", text: "I get an error about the utils file" },
        { t: "p", text: "Components import `cn` from `@/lib/utils`. The CLI creates it for you. If you moved it, update the import or restore the file." },
        { t: "h3", text: "My background shows nothing" },
        { t: "p", text: "The container needs a height. Add `h-screen` or a fixed height to the parent, or pass a height class through `className`." },
        { t: "h3", text: "Can I use it in a commercial project?" },
        { t: "p", text: "Yes. The code is MIT licensed. No credit is needed." },
        { t: "h3", text: "Do I need an account?" },
        { t: "p", text: "No. Browsing, installing and copying source are open. An account is only needed for bookmarks and for copying more than a couple of prompts." },
        { t: "h3", text: "Does it work with Vite or Remix?" },
        { t: "p", text: "Components do, as long as you have Tailwind CSS 4 and shadcn set up. Templates are built for the Next.js App Router." },
        { t: "h3", text: "How do I get updates?" },
        { t: "p", text: "Run the install command again for the item and review the diff. Because the code is yours, the CLI asks before replacing files you have changed." },
        { t: "h3", text: "I found a bug or want a component" },
        { t: "p", text: `Open an issue on GitHub, or write to ${CONTACT_EMAIL}.` },
      ],
    },
    {
      slug: "license",
      group: "Reference",
      title: "License and credits",
      lead: "Free to use anywhere.",
      blocks: [
        { t: "p", text: "Quarry UI is released under the MIT License. You can use, copy, change and distribute it, in private and commercial work, without asking and without credit. The software comes with no warranty." },
        { t: "p", text: "A few assets come from other people and keep their own terms, including illustrations and the DESIGN.md collection. They are credited in THIRD_PARTY_NOTICES.md in the repository." },
        { t: "p", text: "Brand names and designs mentioned in the design briefs belong to their owners." },
      ],
    },
  ];
}

export function getDoc(slug: string) {
  return getDocs().find((d) => d.slug === slug);
}

export const DOC_GROUPS = ["Getting started", "Guides", "Reference"] as const;
