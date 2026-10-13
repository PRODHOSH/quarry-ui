import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Early access signups.
 *
 * Production: set WAITLIST_WEBHOOK_URL to any endpoint that accepts a JSON POST
 * (Formspree, Resend audiences, a Google Sheets script, Zapier, n8n and so on).
 * Development: with no webhook set, emails are appended to .data/waitlist.csv (git ignored).
 */
export async function POST(request: Request) {
  let email = "";
  try {
    const body = await request.json();
    email = String(body?.email ?? "").trim().toLowerCase();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!EMAIL.test(email) || email.length > 254) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 422 });
  }

  const webhook = process.env.WAITLIST_WEBHOOK_URL;

  try {
    if (webhook) {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, source: "quarry-ui-landing", at: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } else if (process.env.NODE_ENV !== "production") {
      const dir = path.join(process.cwd(), ".data");
      await mkdir(dir, { recursive: true });
      await appendFile(path.join(dir, "waitlist.csv"), `${new Date().toISOString()},${email}\n`);
    } else {
      return Response.json({ error: "Signups are not configured yet." }, { status: 503 });
    }
  } catch {
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
