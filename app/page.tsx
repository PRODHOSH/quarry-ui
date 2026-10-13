import { ComponentMarquee } from "@/components/landing/component-marquee";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { McpSection } from "@/components/landing/mcp-section";
import { Pricing } from "@/components/landing/pricing";
import { Reveal } from "@/components/landing/reveal";
import { getGroups } from "@/lib/registry";

export default function Home() {
  const groups = getGroups();
  const total = groups.reduce((sum, group) => sum + group.items.length, 0);
  const items = groups
    .filter((g) => g.id !== "loaders")
    .flatMap((g) => g.items)
    .map((item) => ({ name: item.name, title: item.title, stage: item.meta.stage }));

  return (
    <main className="flex-1">
      <Hero total={total} items={items} />

      <section id="how" className="scroll-mt-16 border-t py-28">
        <HowItWorks />
      </section>

      <section id="components" className="scroll-mt-16 border-t py-28">
        <ComponentMarquee items={items} total={total} />
      </section>

      <section id="pricing" className="scroll-mt-16 border-t py-28">
        <Reveal className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.03em] sm:text-5xl">Free to start. Pay once for more.</h2>
          <p className="mx-auto mt-5 max-w-md text-base text-muted-foreground">
            Everything in the library is free. Pro unlocks advanced components and advanced templates for a single payment.
          </p>
        </Reveal>
        <Reveal className="mt-14" delay={0.1}>
          <Pricing />
        </Reveal>
      </section>

      <section id="mcp" className="scroll-mt-16 border-t py-28">
        <Reveal>
          <McpSection />
        </Reveal>
      </section>
    </main>
  );
}
