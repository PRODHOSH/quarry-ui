import { AGENTS, buildPrompt, type AgentId } from "@/lib/prompts";
import { cookieFor, FREE_PROMPTS, isSignedIn, networkAllows, readCount } from "@/lib/prompt-gate";
import { getItem, getSource } from "@/lib/registry";

export const dynamic = "force-dynamic";

/**
 * Hands out a prompt. Signed in people get unlimited prompts. Everyone else gets FREE_PROMPTS,
 * counted in a signed cookie and backed up per network. The prompt text only leaves the server
 * through this route, so the limit cannot be skipped by editing the page.
 */
export async function POST(request: Request) {
  let name = "";
  let agent = "";
  try {
    const body = await request.json();
    name = String(body?.name ?? "");
    agent = String(body?.agent ?? "");
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const item = getItem(name);
  const known = agent === "default" || AGENTS.some((a) => a.id === agent);
  if (!item || !known) return Response.json({ error: "Unknown item." }, { status: 404 });
  const prompt = buildPrompt(agent as AgentId, { item, source: getSource(item) });

  if (await isSignedIn(request.headers.get("authorization"))) {
    return Response.json({ prompt, unlimited: true, remaining: null });
  }

  const used = readCount(request.headers.get("cookie"));
  const ip = (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0] ??
    request.headers.get("x-real-ip") ??
    "unknown"
  ).trim();

  if (used >= FREE_PROMPTS || !(await networkAllows(ip))) {
    return Response.json({ error: "limit", free: FREE_PROMPTS }, { status: 403, headers: { "Set-Cookie": cookieFor(Math.max(used, FREE_PROMPTS)) } });
  }

  return Response.json({ prompt, unlimited: false, remaining: FREE_PROMPTS - (used + 1) }, { headers: { "Set-Cookie": cookieFor(used + 1) } });
}
