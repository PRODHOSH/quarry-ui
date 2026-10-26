"use client";

import { useId, useMemo, useState, type InputHTMLAttributes, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AsciiAquarium, type Colorway } from "@/components/abyss/ascii-aquarium";
import { Logo } from "@/components/abyss/logo";
import { SettingsProvider, useBase, useSettings } from "@/lib/abyss/settings";
import { cn } from "@/lib/utils";

/** Wraps every page of the template: shares the scene settings and gives sign in and sign up their split layout. */
export function AbyssRoot({ colorway, children }: { colorway?: Colorway; children: ReactNode }) {
  const defaults = useMemo(() => (colorway ? { colorway } : undefined), [colorway]);
  return (
    <SettingsProvider defaults={defaults}>
      <Route>{children}</Route>
    </SettingsProvider>
  );
}

function Route({ children }: { children: ReactNode }) {
  const path = usePathname();
  const mode = path.endsWith("/signup") ? "signup" : path.endsWith("/login") ? "login" : null;
  return mode ? <AuthShell mode={mode}>{children}</AuthShell> : <>{children}</>;
}

const QUOTES = {
  login: "Slow down. The good ideas surface on their own.",
  signup: "Come on in. We saved you a spot near the glow.",
};

/** Two halves that trade places between sign in and sign up. The shell stays mounted, so the swap animates. */
function AuthShell({ mode, children }: { mode: "login" | "signup"; children: ReactNode }) {
  const base = useBase();
  const { settings } = useSettings();
  const right = mode === "signup";
  const slide = "lg:transition-[left] lg:duration-700 lg:ease-[cubic-bezier(0.7,0,0.2,1)]";
  return (
    <div className="fixed inset-0 overflow-y-auto bg-background text-foreground lg:overflow-hidden">
      <section className={cn("flex min-h-full flex-col px-6 py-6 sm:px-10 lg:absolute lg:inset-y-0 lg:min-h-0 lg:w-1/2", slide, right ? "lg:left-1/2" : "lg:left-0")}>
        <header className="flex items-center justify-between">
          <Link href={base || "/"} aria-label="Abyss home"><Logo /></Link>
          <Link href={base || "/"} className="inline-flex h-9 items-center rounded-full border border-border px-4 text-sm text-foreground/90 transition-colors hover:bg-accent">Back home</Link>
        </header>
        <main className="flex flex-1 items-center justify-center py-8">
          <div key={mode} className="w-full max-w-[380px] animate-in fade-in slide-in-from-bottom-2 duration-500">{children}</div>
        </main>
        <footer className="text-center text-xs text-muted-foreground">By continuing you agree to the terms and the privacy policy.</footer>
      </section>

      <aside aria-hidden className={cn("absolute hidden overflow-hidden border-border lg:inset-y-0 lg:block lg:w-1/2", slide, right ? "lg:left-0 lg:border-r" : "lg:left-1/2 lg:border-l")}>
        <AsciiAquarium className="absolute inset-0 h-full" animal={settings.animal} colorway={settings.colorway} look={settings.look} speed={settings.speed} scale={settings.scale} paused={settings.paused} calm={0} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
        <p className="absolute inset-x-10 bottom-12 max-w-md text-[clamp(1.6rem,2.6vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.03em]">{QUOTES[mode]}</p>
      </aside>
    </div>
  );
}

const input = "h-11 w-full rounded-xl border border-border bg-card/60 px-4 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:border-foreground/25 focus:border-foreground/45 focus:ring-4 focus:ring-foreground/5 aria-invalid:border-destructive";

function Field({ label, error, aside, ...rest }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; aside?: ReactNode }) {
  const id = useId();
  const [show, setShow] = useState(false);
  const password = rest.type === "password";
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm text-foreground/90">{label}</label>
        {aside}
      </div>
      <div className="relative">
        <input id={id} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-e` : undefined} {...rest} type={password && show ? "text" : rest.type} className={cn(input, password && "pr-11")} />
        {password && (
          <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"} className="absolute inset-y-0 right-1 grid w-10 place-items-center text-muted-foreground hover:text-foreground">
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
      {error && <p id={`${id}-e`} className="text-[13px] text-destructive">{error}</p>}
    </div>
  );
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type Errors = Partial<Record<"name" | "email" | "password", string>>;

function Heading({ title, lead }: { title: string; lead: string }) {
  return (
    <div className="mb-7">
      <h1 className="text-[2rem] font-semibold leading-tight tracking-[-0.03em]">{title}</h1>
      <p className="mt-2 text-[15px] leading-6 text-muted-foreground">{lead}</p>
    </div>
  );
}

function Providers() {
  const btn = "inline-flex h-11 items-center justify-center gap-2.5 rounded-xl border border-border bg-card/60 text-sm font-medium transition-colors hover:bg-accent";
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <button type="button" className={btn}>
        <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
          <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
        </svg>
        Google
      </button>
      <button type="button" className={btn}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]" aria-hidden>
          <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
        </svg>
        GitHub
      </button>
    </div>
  );
}

function Divider() {
  return (
    <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
      <span className="h-px flex-1 bg-border" /> or with email <span className="h-px flex-1 bg-border" />
    </div>
  );
}

/** Frontend only: the forms check their input and then open the chat. Connect them to your auth service. */
function useSubmit(validate: (d: FormData) => Errors) {
  const router = useRouter();
  const base = useBase();
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(new FormData(e.currentTarget));
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    setTimeout(() => router.push(base || "/"), 700);
  };
  return { errors, busy, onSubmit };
}

const val = (d: FormData, k: string) => String(d.get(k) ?? "").trim();
const submitCls = "mt-1 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60";

export function LoginPage() {
  const base = useBase();
  const { errors, busy, onSubmit } = useSubmit((d) => {
    const e: Errors = {};
    if (!EMAIL.test(val(d, "email"))) e.email = "Enter a valid email address.";
    if (!val(d, "password")) e.password = "Enter your password.";
    return e;
  });
  return (
    <>
      <Heading title="Welcome back" lead="The water is still warm. Pick up where you left off." />
      <Providers />
      <Divider />
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" error={errors.email} />
        <Field label="Password" name="password" type="password" autoComplete="current-password" error={errors.password} aside={<a href="#" className="text-[13px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">Forgot it?</a>} />
        <button type="submit" disabled={busy} className={submitCls}>{busy && <Loader2 className="size-4 animate-spin" />} Sign in</button>
      </form>
      <p className="mt-6 text-sm text-muted-foreground">New here? <Link href={`${base}/signup`} className="text-foreground underline underline-offset-4">Create an account</Link></p>
    </>
  );
}

export function SignupPage() {
  const base = useBase();
  const { errors, busy, onSubmit } = useSubmit((d) => {
    const e: Errors = {};
    if (val(d, "name").length < 2) e.name = "Tell us what to call you.";
    if (!EMAIL.test(val(d, "email"))) e.email = "Enter a valid email address.";
    if (String(d.get("password") ?? "").length < 8) e.password = "Use at least 8 characters.";
    return e;
  });
  return (
    <>
      <Heading title="Make yourself at home" lead="A free account keeps your chats and your scene settings." />
      <Providers />
      <Divider />
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Field label="Name" name="name" autoComplete="name" placeholder="Mira Hale" error={errors.name} />
        <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" error={errors.email} />
        <Field label="Password" name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" error={errors.password} />
        <button type="submit" disabled={busy} className={submitCls}>{busy && <Loader2 className="size-4 animate-spin" />} Create account</button>
      </form>
      <p className="mt-6 text-sm text-muted-foreground">Already have an account? <Link href={`${base}/login`} className="text-foreground underline underline-offset-4">Sign in</Link></p>
    </>
  );
}
