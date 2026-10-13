export type Role = "user" | "assistant";
export type Message = { id: string; role: Role; text: string; rating?: "up" | "down" };
export type Chat = { id: string; title: string; group: "Today" | "Yesterday" | "Earlier"; project?: string; messages: Message[] };
export type Project = { slug: string; name: string };

export const MODELS = [
  { id: "pro", name: "Aria Pro", note: "Best for hard problems" },
  { id: "fast", name: "Aria Fast", note: "Quick everyday answers" },
  { id: "mini", name: "Aria Mini", note: "Light and low cost" },
];

export const TOOLS = ["Web search", "Code interpreter", "Image generation", "File analysis"];
export const CHIPS = ["Deep Search", "Create Images", "Latest News", "Generate Video"] as const;

export const PROJECTS: Project[] = [
  { slug: "atlas", name: "Atlas" },
  { slug: "harbor", name: "Harbor" },
  { slug: "fieldnotes", name: "Fieldnotes" },
  { slug: "northwind", name: "Northwind" },
];

const m = (id: string, role: Role, text: string): Message => ({ id, role, text });

export const SEED: Chat[] = [
  { id: "hi", title: "hi", group: "Today", messages: [m("a", "user", "hi"), m("b", "assistant", "Hello! How can I help you today?")] },
  {
    id: "getting-started",
    title: "Getting Started Conversation",
    group: "Today",
    messages: [
      m("c", "user", "What do you think about the future of AI?"),
      m("d", "assistant", "The future of AI is incredibly promising, with potential breakthroughs in healthcare, education, and sustainability. However, it also requires careful ethical consideration, from how data is used to who benefits from the technology."),
    ],
  },
  { id: "ai-inspirations", title: "AI Inspirations", group: "Yesterday", messages: [m("e", "user", "Give me three ideas for an AI side project."), m("f", "assistant", "1. A study buddy that turns your notes into quizzes.\n2. A recipe planner that works from what is in your fridge.\n3. A meeting recap tool that lists decisions and owners.")] },
  { id: "analytics-report", title: "Analytics Report", group: "Yesterday", messages: [m("g", "user", "Summarise last month's traffic in two lines."), m("h", "assistant", "Traffic grew 12% month over month, led by organic search. Sign-ups held steady, so the conversion rate dipped slightly.")] },
  { id: "project-overview", title: "Project Overview", group: "Yesterday", messages: [m("i", "user", "Outline a project overview for a new onboarding flow."), m("j", "assistant", "Goal: get a new user to their first success in under five minutes.\nScope: welcome, one setup question, a guided first task.\nRisks: too many steps, unclear copy.\nMeasure: completion rate and time to first success.")] },
  ...[
    ["atlas", ["Roadmap brainstorm", "Release notes draft", "User interview themes"]],
    ["harbor", ["Pricing experiments", "Support macros"]],
    ["fieldnotes", ["Launch email", "Landing page copy", "Changelog tone", "FAQ rewrite"]],
    ["northwind", ["Quarterly review", "Hiring plan", "Vendor comparison"]],
  ].flatMap(([slug, titles]) =>
    (titles as string[]).map((t, i) => ({
      id: `${slug}-${i}`,
      title: t,
      group: "Earlier" as const,
      project: slug as string,
      messages: [m(`${slug}-${i}-u`, "user", t), m(`${slug}-${i}-a`, "assistant", `Here is a starting point for “${t}”. Tell me who it is for and I will tailor the tone and length.`)],
    }))
  ),
];

const REPLIES: [RegExp, string][] = [
  [/poem|haiku/i, "Leaves let go in gold,\nthe morning air holds its breath,\nthe year softly turns."],
  [/email/i, "Subject: A quick update\n\nHi there,\n\nHere is the short version: we shipped what we promised, and one more thing you will like. Reply if you want the details.\n\nThanks,\nThe team"],
  [/plan|week|schedule/i, "Here is a simple shape for it:\n\n• Two focused blocks each morning, no meetings\n• One admin hour after lunch\n• Friday afternoon for review and planning\n\nWant me to turn this into a calendar?"],
  [/code|react|bug|error/i, "Start by reproducing it with the smallest example you can. Then check the state that changes right before it breaks, and log it. Most bugs show up as one value that is not what you assumed."],
];

export const replyFor = (q: string, tool: string | null) => {
  const hit = REPLIES.find(([re]) => re.test(q));
  const lead = tool ? `(${tool})\n` : "";
  return lead + (hit ? hit[1] : `Here is a first answer to “${q.length > 70 ? q.slice(0, 67) + "…" : q}”.\n\nStart with the main point, then give two short reasons. I can go deeper on any part, or rewrite it for a different audience.`);
};
