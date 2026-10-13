import { Plus } from "lucide-react";

const FAQS = [
  {
    q: "Is it really free?",
    a: "Yes. Every free component is yours to use in personal and commercial projects, with no account and no attribution required. Pro adds advanced components and advanced templates for a one-time fee.",
  },
  {
    q: "How is it different from a normal component library?",
    a: "Quarry is a shadcn registry. The source is copied into your repo, so you own it and can change anything. There is no wrapper package to fight and no runtime to ship.",
  },
  {
    q: "Will it match my design?",
    a: "Components are written with theme tokens such as background, foreground, card and primary, so they inherit your colors, radius and dark mode from the first render.",
  },
  {
    q: "What do I need to use it?",
    a: "A React project with Tailwind CSS. The shadcn CLI handles the rest: it adds the file, installs the dependencies and sets up the utility helper if you do not have one.",
  },
  {
    q: "When do templates and the MCP server arrive?",
    a: "Both are in progress. Join the list below and you will get one email when each one is ready.",
  },
];

export function Faq() {
  return (
    <div className="divide-y border-y">
      {FAQS.map((item) => (
        <details key={item.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left [&::-webkit-details-marker]:hidden">
            <span className="text-lg font-medium">{item.q}</span>
            <Plus className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-45" />
          </summary>
          <p className="mt-3 max-w-xl text-sm font-normal leading-relaxed text-muted-foreground">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
