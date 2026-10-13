# Contributing to Quarry UI

Thanks for wanting to help. Quarry UI is small enough that one good pull request makes a real difference, and we are happy to help you get yours over the line.

Everyone taking part is expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to help

- **Report a bug.** Something looks off, breaks in dark mode, or fails to install? [Open a bug report](https://github.com/PRODHOSH/quarry-ui/issues/new?template=bug_report.yml).
- **Suggest a component.** Tell us what you reach for and cannot find. [Open a component request](https://github.com/PRODHOSH/quarry-ui/issues/new?template=component_request.yml).
- **Improve one we have.** Better motion, better accessibility, tidier code. All welcome.
- **Build a new component.** The steps are below.
- **Fix the docs.** Typos, unclear wording, missing steps.

For anything bigger than a small fix, please open an issue first so we can agree on the direction before you spend a weekend on it.

## Getting set up

You need Node.js 20 or newer and npm.

```bash
git clone https://github.com/<your-username>/quarry-ui.git
cd quarry-ui
npm install
npm run dev
```

The site runs at [http://localhost:3000](http://localhost:3000). Fork the repo first if you plan to open a pull request, then create a branch:

```bash
git checkout -b add-pricing-toggle
```

## Adding a component

1. **Write the file** at `registry/quarry/<name>.tsx`. Use kebab case for the filename and PascalCase for the export.
2. **Register it** in `registry.json`. Copy a neighbouring entry and change the name, title, description, dependencies, usage snippet (`docs`) and `meta`.
   - `meta.stage` is `center` for small things that sit in the middle of the preview, or `fill` for full width sections.
   - `meta.theme` picks one of the theme presets in `lib/themes.ts`. This only changes how the preview looks on the site.
3. **Add the preview** to `registry/demos.tsx`. Most components can use a plain `dynamic(() => import(...))` line. If the component needs a scene around it (a scroll area, a fake page), wrap it there and keep the component file clean.
4. **Build the registry** so the install JSON is generated:

   ```bash
   npm run registry:build
   ```

5. **Look at it.** Open `/components/<name>` and check it in light and dark mode, at phone width, and with the keyboard.
6. **Run the checks** (see below), then open your pull request.

## What a good component looks like

We review against this list. It is not meant to be strict for its own sake. It keeps the library consistent and easy to copy.

- **Theme tokens only.** Use `bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `border`, `bg-primary` and friends. Do not hardcode hex values or Tailwind palette colors like `bg-blue-500`. Avoid `chart-*` colors too, because not every theme defines them.
- **One self contained file.** It can import `@/lib/utils`, `framer-motion` and `lucide-react`. Nothing else from the repo.
- **A named export and a `className` prop** that is merged with `cn()`, so people can adjust it without editing the file.
- **Sensible defaults and props.** It should look good with zero props, and the data it shows (labels, items, images) should be overridable.
- **Real motion, not noise.** Animate to explain a change: something entering, moving, or confirming. Keep durations short (150 to 400 ms for UI, longer only for ambient effects). Prefer springs for things the user drags or hovers.
- **Accessible.** Real buttons and links, visible focus, `aria-label` on icon buttons, correct roles for tabs and switches, and keyboard support where people expect it.
- **Works at phone width.** Test it narrow.
- **No brand icons from `lucide-react`.** They were removed. Use generic icons or inline SVG.
- **Images.** Use `https://picsum.photos` seeds for demo photos and avatars made from initials. Never commit someone else's photos or logos.
- **No client secrets, no network calls** in the component itself.

## Code style

- TypeScript, strict. No `any` unless there is no other way.
- Match the files around yours. Two space indent, double quotes, semicolons.
- Comments explain *why*, not *what*. A short doc comment above the component that says what it does is welcome.
- React Compiler lint rules are on. Do not call `setState` directly inside an effect, and do not create components inside render.

## Before you open a pull request

Run all three and make sure they pass:

```bash
npm run typecheck
npm run lint
npm run build
```

If you changed the registry, commit the regenerated files in `public/r/` too.

## Pull request tips

- Keep each pull request to one change. A new component and an unrelated refactor should be two pull requests.
- Add a screenshot or a short screen recording for anything visual. It speeds up review a lot.
- Say what you tested: browsers, light and dark mode, phone width, keyboard.
- Be patient and kind. Reviews can take a few days, and feedback is about the code, never about you.

## Commit messages

Short and in the imperative: `add faq search`, `fix dock hover on touch`, `docs: clarify template install`. No need for anything fancier.

## Licensing

By contributing you agree that your work is released under the [MIT License](LICENSE), the same as the rest of the project.

## Questions

Not sure about something? Open a [discussion](https://github.com/PRODHOSH/quarry-ui/discussions) or ask in your pull request draft. There are no silly questions here.
