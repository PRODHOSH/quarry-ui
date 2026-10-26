export const HEADLINES = ["explain a hard idea", "plan a slow weekend", "tidy up an email", "find the bug", "outline the essay", "write the first draft"];

export const SUGGESTIONS = ["Summarize a long paper", "Plan a weekend in Lisbon", "Review my SQL query", "Rewrite this email, kindly"];

export const MODES = [
  { id: "auto", label: "Auto", hint: "Picks the right pace" },
  { id: "fast", label: "Fast", hint: "Quick answers" },
  { id: "think", label: "Think", hint: "Takes its time" },
] as const;

export type Message = { id: number; role: "user" | "assistant"; text: string };

/** Stand in for a model. Replace with a call to your own API and stream the tokens into the message. */
export function replyFor(prompt: string, mode: string): string {
  const p = prompt.toLowerCase();
  const lead =
    mode === "think"
      ? "Let me slow down and look at this properly. "
      : mode === "fast"
        ? "Short version first. "
        : "";
  if (/(plan|trip|weekend|travel|lisbon)/.test(p))
    return `${lead}Start with one anchor for each day and leave the rest loose. Morning for the thing you came for, a long lunch, then wander. Book the two things that sell out, skip everything else. Want me to turn that into a day by day list?`;
  if (/(sql|query|bug|code|error|function)/.test(p))
    return `${lead}Paste the query and the table shapes and I will look for the usual suspects: a missing index, a join that fans out rows, or a filter that runs after the sort. If you can share the plan from EXPLAIN, even better.`;
  if (/(email|rewrite|polite|kind|message)/.test(p))
    return `${lead}Happy to. Keep the first line warm, state the ask in one sentence, and give a clear next step with a date. Send me the draft and I will tighten it without losing your voice.`;
  if (/(paper|summar|essay|outline|draft|write)/.test(p))
    return `${lead}Give me the text and tell me who it is for. I will pull out the claim, the evidence and the one caveat that matters, then write it at the length you need.`;
  return `${lead}Good question. I would begin by naming what a good answer looks like for you, then work backwards from there. Tell me a bit more about the goal and I will take it from here.`;
}
