import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CodeBlock } from "@/components/site/code-block";
import { InstallCommand } from "@/components/site/install-command";
import { LivePreview } from "@/components/site/live-preview";
import { PreviewStage } from "@/components/site/preview-stage";
import { BookmarkButton } from "@/components/auth/bookmark-button";
import { PromptMenu } from "@/components/site/prompt-menu";
import { getFiles, getItem, getNeighbours, getSource, ownerOf, type Owner } from "@/lib/registry";
import { GROUPS } from "@/lib/registry-types";
import { THEMES, themeCss } from "@/lib/themes";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-medium tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

/** Shared by /components/[slug] and /templates/[slug]. Sends a visitor to the right one. */
const OWNER_LABEL: Record<Owner, string> = { components: "Components", templates: "Templates", backgrounds: "Backgrounds", loaders: "Loaders" };

export async function ItemView({ slug, kind }: { slug: string; kind: Owner }) {
  const item = getItem(slug);
  if (!item) notFound();
  const owner = ownerOf(item);
  if (owner !== kind) redirect(`/${owner}/${slug}`);

  const source = getSource(item);
  const { previous, next } = getNeighbours(item.name, owner);
  const group = GROUPS.find((g) => g.id === item.categories[0]);
  const isTemplate = item.categories[0] === "templates";
  const files = isTemplate ? getFiles(item) : [];
  const theme = item.meta.theme ? THEMES[item.meta.theme] : undefined;
  const packages = [...item.dependencies, "clsx", "tailwind-merge"];

  return (
    <article className={item.categories[0] === "templates" ? "mx-auto max-w-6xl space-y-10" : "mx-auto max-w-4xl space-y-10"}>
      <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            <Link href={`/${owner}`} className="hover:text-foreground">
              {OWNER_LABEL[owner]}
            </Link>
            {owner === "components" && (
              <>
                <span className="mx-1.5">/</span>
                {group?.title}
              </>
            )}
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-[-0.03em] sm:text-5xl">{item.title}</h1>
          <p className="mt-4 max-w-xl font-normal leading-relaxed text-muted-foreground">{item.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <BookmarkButton kind={owner} slug={item.name} variant="pill" />
          <PromptMenu item={item} />
        </div>
      </header>

      {isTemplate ? (
        <div className="space-y-3">
          <LivePreview src={item.meta.preview!} title={item.title} interactive />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>This is the running app. Click around, it is the real thing.</span>
            <a href={item.meta.preview} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-medium text-foreground underline-offset-4 hover:underline">
              View preview in a new tab <ArrowRight className="size-4 -rotate-45" />
            </a>
          </div>
        </div>
      ) : (
        <PreviewStage name={item.name} stage={item.meta.stage} theme={item.meta.theme} tall={false} />
      )}

      {theme && !isTemplate && (
        <Section title="Theme">
          <p className="text-sm text-muted-foreground">
            This one was designed with the <strong className="font-medium text-foreground">{theme.name}</strong> preset in{" "}
            <strong className="font-medium text-foreground">{theme.font.label}</strong>. The component only reads your shadcn tokens, so
            it also works in your own theme. Paste this if you want the exact look.
          </p>
          <div className="flex flex-wrap gap-2">
            {["background", "card", "muted", "primary"].map((k) => (
              <span key={k} className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs text-muted-foreground">
                <span className="size-3.5 rounded-full border" style={{ background: theme.vars[`--${k}`] }} />
                {k}
              </span>
            ))}
          </div>
          <CodeBlock code={themeCss(theme.id)} lang="css" title="globals.css" />
        </Section>
      )}

      <Section title="Installation">
        <InstallCommand name={item.name} />
        <p className="text-sm text-muted-foreground">
          Adds <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{item.name}.tsx</code> to
          your components folder and installs{" "}
          {packages.map((pkg, i) => (
            <span key={pkg}>
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{pkg}</code>
              {i < packages.length - 2 ? ", " : i === packages.length - 2 ? " and " : ""}
            </span>
          ))}
          . Prefer to copy by hand? The full source is below.
        </p>
      </Section>

      {isTemplate ? (
        <>
          <Section title="Routes">
            <ul className="divide-y rounded-xl border">
              {item.meta.routes?.map((r) => (
                <li key={r} className="flex items-center justify-between px-4 py-2.5 font-mono text-sm">
                  <span>{item.meta.route}{r === "/" ? "" : r}</span>
                  {!r.includes("[") && <a href={`${item.meta.preview}${r === "/" ? "" : r}`} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-foreground">Open</a>}
                </li>
              ))}
            </ul>
          </Section>
          <Section title="What you get">
            <p className="whitespace-pre-line text-sm text-muted-foreground">{item.docs}</p>
          </Section>
          <Section title={`Files (${files.length})`}>
            <div className="space-y-2">
              {files.map((f) => (
                <details key={f.path} className="group rounded-xl border">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 font-mono text-sm">
                    <span className="truncate">{f.target}</span>
                    <span className="shrink-0 text-xs text-muted-foreground group-open:hidden">Show source</span>
                  </summary>
                  <div className="border-t p-2">
                    <CodeBlock code={f.code} title={f.target} maxHeight="max-h-[28rem]" />
                  </div>
                </details>
              ))}
            </div>
          </Section>
        </>
      ) : (
        <>
          <Section title="Usage">
            <CodeBlock code={item.docs} title="example.tsx" />
          </Section>

          <Section title="Source">
            <CodeBlock code={source} title={`components/${item.name}.tsx`} maxHeight="max-h-[36rem]" />
          </Section>
        </>
      )}

      <nav className="grid gap-3 border-t pt-8 sm:grid-cols-2" aria-label="More components">
        {previous ? (
          <Link
            href={`/${owner}/${previous.name}`}
            className="group flex items-center gap-3 rounded-xl border p-4 transition-colors hover:border-foreground/30"
          >
            <ArrowLeft className="size-4 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
            <span>
              <span className="block text-xs text-muted-foreground">Previous</span>
              <span className="text-sm font-normal">{previous.title}</span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/${owner}/${next.name}`}
            className="group flex items-center justify-end gap-3 rounded-xl border p-4 text-right transition-colors hover:border-foreground/30"
          >
            <span>
              <span className="block text-xs text-muted-foreground">Next</span>
              <span className="text-sm font-normal">{next.title}</span>
            </span>
            <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </nav>
    </article>
  );
}
