import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CodeBlock } from "@/components/site/code-block";
import { InstallCommand } from "@/components/site/install-command";
import { PreviewStage } from "@/components/site/preview-stage";
import { PromptMenu } from "@/components/site/prompt-menu";
import { getItem, getItems, getNeighbours, getSource } from "@/lib/registry";
import { GROUPS } from "@/lib/registry-types";
import { THEMES, themeCss } from "@/lib/themes";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getItems().map((item) => ({ slug: item.name }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getItem(slug);
  return item ? { title: item.title, description: item.description } : {};
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-medium tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

export default async function ComponentPage({ params }: Props) {
  const { slug } = await params;
  const item = getItem(slug);
  if (!item) notFound();

  const source = getSource(item);
  const { previous, next } = getNeighbours(item.name);
  const group = GROUPS.find((g) => g.id === item.categories[0]);
  const theme = item.meta.theme ? THEMES[item.meta.theme] : undefined;
  const packages = [...item.dependencies, "clsx", "tailwind-merge"];

  return (
    <article className="mx-auto max-w-4xl space-y-10">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            <Link href="/components" className="hover:text-foreground">
              Components
            </Link>
            <span className="mx-1.5">/</span>
            {group?.title}
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-[-0.03em] sm:text-5xl">{item.title}</h1>
          <p className="mt-4 max-w-xl font-normal leading-relaxed text-muted-foreground">{item.description}</p>
        </div>
        <div className="shrink-0">
          <PromptMenu item={item} source={source} />
        </div>
      </header>

      <PreviewStage name={item.name} stage={item.meta.stage} theme={item.meta.theme} />

      {theme && (
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

      <Section title="Usage">
        <CodeBlock code={item.docs} title="example.tsx" />
      </Section>

      <Section title="Source">
        <CodeBlock code={source} title={`components/${item.name}.tsx`} maxHeight="max-h-[36rem]" />
      </Section>

      <nav className="grid gap-3 border-t pt-8 sm:grid-cols-2" aria-label="More components">
        {previous ? (
          <Link
            href={`/components/${previous.name}`}
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
            href={`/components/${next.name}`}
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
