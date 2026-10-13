<p align="center">
  <a href="https://quarry-ui.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset=".github/assets/logo-light.png">
      <img alt="Quarry UI" src=".github/assets/logo-dark.png" width="360">
    </picture>
  </a>
</p>

<p align="center">
  Free, open source React components and full app templates with real motion.<br>
  Copy them into your project with one command. You own the code.
</p>

<p align="center">
  <a href="LICENSE"><img alt="MIT license" src="https://img.shields.io/badge/license-MIT-111111?style=flat-square"></a>
  <a href="CONTRIBUTING.md"><img alt="PRs welcome" src="https://img.shields.io/badge/PRs-welcome-111111?style=flat-square"></a>
  <img alt="Built for shadcn/ui" src="https://img.shields.io/badge/built%20for-shadcn%2Fui-111111?style=flat-square">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-111111?style=flat-square">
  <img alt="Tailwind CSS 4" src="https://img.shields.io/badge/Tailwind-4-111111?style=flat-square">
</p>

## What is this?

Quarry UI is a library of UI pieces we kept wishing existed: footers that feel finished, testimonials that move, pricing tables that do not look like every other pricing table, and a couple of complete apps you can start from instead of a blank folder.

It is distributed as a [shadcn registry](https://ui.shadcn.com/docs/registry). That means there is no package to install and no version to keep up with. You run one command, the source lands in your repo, and from then on it is your code. Change anything you like.

A few things we care about:

- **Tokens only.** Components read your shadcn theme (`background`, `foreground`, `card`, `muted`, `border`, `primary`), so they match your site and follow your light and dark mode without extra setup.
- **One file per component.** No hidden folders, no internal imports. Open the file and you can read the whole thing.
- **Motion with a reason.** Animations are there to explain what changed, not to show off. Everything uses [Motion](https://motion.dev) (the `framer-motion` package).
- **Copy a prompt, not just code.** Every component has a ready made prompt for Claude Code, Codex, Cursor, v0, Lovable, bolt.new and Replit.

## What is inside

| | Count | Examples |
|---|---|---|
| Templates | 2 | AI Chat, File Manager (full multi page Next.js apps) |
| Sections | 24 | Mega Footer, Pricing Cards, Testimonial Columns, FAQ with Search, Feature Tabs |
| Elements | 40 | Mega Menu Navbar, Dock, Command Menu, Video Player, Lightbox Gallery, Number Ticker |
| Backgrounds | 7 | Flow Field, Aurora Mesh, Constellation (canvas, with a live configure panel) |
| Loaders | 15 | Newton's Cradle, Helix, Waveform |

Browse everything with live previews at [quarry-ui.com](https://quarry-ui.com).

## Quick start

You need a React project with Tailwind CSS and shadcn/ui. If you do not have shadcn set up yet, run this once in your project:

```bash
npx shadcn@latest init
```

Then add any component by its registry URL:

```bash
npx shadcn@latest add https://quarry-ui.com/r/mega-footer.json
```

Prefer another package manager?

```bash
pnpm dlx shadcn@latest add https://quarry-ui.com/r/mega-footer.json
yarn dlx shadcn@latest add https://quarry-ui.com/r/mega-footer.json
bunx --bun shadcn@latest add https://quarry-ui.com/r/mega-footer.json
```

The CLI copies the file into your components folder and installs whatever it needs (usually `framer-motion` and `lucide-react`). Then import it and use it:

```tsx
import { MegaFooter } from "@/components/mega-footer";

export default function Page() {
  return <MegaFooter brand="Northwind" />;
}
```

Every component page on the site shows its own usage snippet and the exact command.

### Installing a template

Templates are complete apps with several routes, not just a single file.

```bash
npx shadcn@latest add https://quarry-ui.com/r/file-manager.json
npx shadcn@latest add https://quarry-ui.com/r/ai-chat.json
```

They need a Next.js project using the App Router. The CLI adds the routes, components and a small store under `lib/`. State lives in memory so the demo works straight away. To make it real, replace the store with calls to your own API.

### Using an AI tool instead

Open any component on the site and press **Copy prompt**. Pick your tool (Claude Code, Codex, Cursor, v0, Lovable, bolt.new or Replit) and paste it. The prompt tells the agent exactly how to install and place the component.

## Running the site locally

You need Node.js 20 or newer.

```bash
git clone https://github.com/PRODHOSH/quarry-ui.git
cd quarry-ui
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Command | What it does |
|---|---|
| `npm run dev` | Start the site with hot reload |
| `npm run registry:build` | Regenerate `public/r/*.json` from `registry.json` |
| `npm run typecheck` | Run TypeScript with no emit |
| `npm run lint` | Run ESLint |
| `npm run build` | Build the registry and the production site |

Optional settings go in `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://quarry-ui.com
NEXT_PUBLIC_CONTACT_EMAIL=hello@quarry-ui.com
NEXT_PUBLIC_GITHUB_URL=https://github.com/PRODHOSH/quarry-ui
WAITLIST_WEBHOOK_URL=
```

## How the repo is organised

```
registry.json            The manifest: one entry per component or template
registry/quarry/*.tsx    One self contained file per component (this is what people install)
registry/templates/      Extra files that ship with templates, like their layouts
registry/demos.tsx       Site only: maps each component to its live preview
public/r/*.json          Generated registry output, served at /r/<name>.json
app/                     The documentation site
components/site/         Site chrome: header, sidebar, preview stage, prompt menu
lib/                     Registry helpers, theme presets, prompt builder
.github/                 Issue and pull request templates
```

## Adding a component

The short version is below. [CONTRIBUTING.md](CONTRIBUTING.md) has the full checklist.

1. Create `registry/quarry/<name>.tsx` with a named export and a `className` prop. Use theme tokens only.
2. Add an entry to `registry.json` with a title, description, dependencies, usage snippet and `meta.stage` (`center` for small things, `fill` for full width sections).
3. Map it to a preview in `registry/demos.tsx`.
4. Run `npm run registry:build`, then check it in the browser in light and dark mode.

## Roadmap

- [x] Components, backgrounds, loaders and two full templates
- [x] Copy prompts for the major AI tools
- [ ] An MCP server so agents can search and install components directly
- [ ] More templates: dashboard, landing page, portfolio, blog
- [ ] A Pro collection

Have an idea? [Open a feature request](https://github.com/PRODHOSH/quarry-ui/issues/new?template=feature_request.yml).

## Contributing

Contributions are very welcome, from a typo fix to a whole new component. Please read [CONTRIBUTING.md](CONTRIBUTING.md) first. By taking part you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

Found a security problem? Please do not open a public issue. See [SECURITY.md](SECURITY.md).

## License

Quarry UI is released under the [MIT License](LICENSE). Use it in personal and commercial projects, no attribution needed, though a mention is always appreciated.

## Thanks

Built on the shoulders of [shadcn/ui](https://ui.shadcn.com), [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com), [Motion](https://motion.dev) and [Lucide](https://lucide.dev).
