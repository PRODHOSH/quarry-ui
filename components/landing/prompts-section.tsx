import { PromptViewer } from "@/components/landing/prompt-viewer";
import { AGENTS, buildPrompt } from "@/lib/prompts";
import { getItem, getSource } from "@/lib/registry";

/** Builds the real prompt for every tool from a small sample component, then hands it to the viewer. */
export function PromptsSection() {
  const item = getItem("typing-indicator")!;
  const source = getSource(item);
  const prompts = AGENTS.map((agent) => ({
    id: agent.id,
    label: agent.label,
    hint: agent.hint,
    text: buildPrompt(agent.id, { item, source }),
  }));

  return (
    <div className="mx-auto max-w-6xl px-6">
      <PromptViewer prompts={prompts} sample={item.title} />
    </div>
  );
}
