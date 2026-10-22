import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

/** Prompts anyone can copy before they have to sign in. */
export const FREE_PROMPTS = 2;
/** A looser per network cap that catches people who clear their cookies again and again. */
const NETWORK_LIMIT = 12;
export const COOKIE = "qpc";

function secret() {
  const s = process.env.PROMPT_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV === "production") throw new Error("PROMPT_SECRET is not set.");
  return "quarry-dev-only-secret";
}

const mac = (v: string) => createHmac("sha256", secret()).update(v).digest("hex");

/** The count is stored in a signed cookie, so it cannot be edited by hand. */
export function readCount(cookieHeader: string | null): number {
  const raw = cookieHeader
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1);
  if (!raw) return 0;
  const [n, sig] = raw.split(".");
  if (!sig || !/^\d{1,3}$/.test(n)) return 0;
  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(mac(n), "hex");
  return a.length === b.length && timingSafeEqual(a, b) ? Number(n) : 0;
}

export function cookieFor(count: number): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE}=${count}.${mac(String(count))}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax${secure}`;
}

const client = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
};

/** True when the bearer token belongs to a real signed in account. */
export async function isSignedIn(authorization: string | null): Promise<boolean> {
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;
  const sb = client();
  if (!token || !sb) return false;
  const { data, error } = await sb.auth.getUser(token);
  return !error && Boolean(data.user);
}

/** Counts one use against this network. Fails open, because the cookie is the main limit. */
export async function networkAllows(ip: string): Promise<boolean> {
  const sb = client();
  if (!sb) return true;
  const { data, error } = await sb.rpc("claim_prompt", { p_id: mac(`ip:${ip}`), p_limit: NETWORK_LIMIT });
  return error ? true : data === true;
}
