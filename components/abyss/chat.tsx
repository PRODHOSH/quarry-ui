"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Paperclip, Plus } from "lucide-react";
import { AsciiAquarium } from "@/components/abyss/ascii-aquarium";
import { Appearance } from "@/components/abyss/appearance";
import { Logo } from "@/components/abyss/logo";
import { HEADLINES, MODES, SUGGESTIONS, replyFor, type Message } from "@/lib/abyss/data";
import { useBase, useSettings } from "@/lib/abyss/settings";
import { cn } from "@/lib/utils";

const PACE: Record<string, number> = { auto: 1, fast: 1.5, think: 0.65 };

function Headline({ still }: { still: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (still) return;
    const t = setInterval(() => setI((v) => (v + 1) % HEADLINES.length), 3400);
    return () => clearInterval(t);
  }, [still]);
  const words = HEADLINES[i].split(" ");
  return (
    <div className="text-center">
      <h1 className="sr-only">What is on your mind?</h1>
      <p aria-hidden className="text-[15px] text-muted-foreground">Ask Abyss to</p>
      <div aria-hidden className="mt-1.5 h-[1.25em] text-[clamp(2.1rem,5.4vw,3.6rem)] font-medium leading-[1.2] tracking-[-0.035em]">
        <AnimatePresence mode="wait">
          <motion.div key={i} className="flex justify-center gap-[0.28em] whitespace-nowrap" exit={{ opacity: 0, filter: "blur(8px)" }} transition={{ duration: 0.25 }}>
            {words.map((w, k) => (
              <motion.span key={k} initial={{ opacity: 0, filter: "blur(10px)", y: 8 }} animate={{ opacity: 1, filter: "blur(0px)", y: 0 }} transition={{ duration: 0.55, delay: k * 0.07, ease: [0.22, 1, 0.36, 1] }}>
                {w}
              </motion.span>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Composer({ boxRef, value, onChange, onSend, mode, onMode, busy, onTyping }: { boxRef: RefObject<HTMLDivElement | null>; value: string; onChange: (v: string) => void; onSend: () => void; mode: string; onMode: (m: string) => void; busy: boolean; onTyping: (on: boolean) => void }) {
  const area = useRef<HTMLTextAreaElement>(null);
  return (
    <div ref={boxRef} className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
        className="rounded-[1.6rem] border border-border bg-card/55 p-3 shadow-[0_12px_48px_-16px_rgb(0_0_0/0.7)] backdrop-blur-xl transition-colors focus-within:border-foreground/30"
      >
        <textarea
          ref={area}
          rows={1}
          value={value}
          autoFocus
          placeholder="What's on your mind?"
          aria-label="Message"
          onChange={(e) => {
            onChange(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
          }}
          onFocus={() => onTyping(true)}
          onBlur={() => onTyping(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          className="block max-h-44 min-h-11 w-full resize-none bg-transparent px-2 py-2 text-[15px] leading-6 text-foreground outline-none placeholder:text-muted-foreground"
        />
        <div className="mt-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button type="button" aria-label="Attach a file" className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <Paperclip className="size-4" />
            </button>
            <div role="radiogroup" aria-label="Response mode" className="relative flex rounded-full border border-border p-0.5">
              {MODES.map((m) => (
                <button key={m.id} type="button" role="radio" aria-checked={mode === m.id} title={m.hint} onClick={() => onMode(m.id)} className={cn("relative rounded-full px-3 py-1 text-xs font-medium transition-colors", mode === m.id ? "text-background" : "text-muted-foreground hover:text-foreground")}>
                  {mode === m.id && <motion.span layoutId="abyss-mode" className="absolute inset-0 rounded-full bg-foreground" transition={{ type: "spring", stiffness: 500, damping: 36 }} />}
                  <span className="relative">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
          <button type="submit" disabled={!value.trim() || busy} aria-label="Send" className="grid size-9 place-items-center rounded-full bg-foreground text-background transition-opacity disabled:opacity-25">
            <ArrowUp className="size-4" strokeWidth={2.4} />
          </button>
        </div>
      </form>
    </div>
  );
}

/** The home screen: a creature swimming behind a prompt box. Sending a message turns it into a conversation. */
export function AbyssChat() {
  const base = useBase();
  const { settings } = useSettings();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [mode, setMode] = useState("auto");
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const started = messages.length > 0;

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  useEffect(() => {
    end.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages]);

  const send = (raw = text) => {
    const q = raw.trim();
    if (!q || busy) return;
    const id = Date.now();
    const words = replyFor(q, mode).split(" ");
    setMessages((m) => [...m, { id, role: "user", text: q }, { id: id + 1, role: "assistant", text: "" }]);
    setText("");
    setBusy(true);
    let n = 0;
    timer.current = setInterval(() => {
      n += 1;
      setMessages((m) => m.map((x) => (x.id === id + 1 ? { ...x, text: words.slice(0, n).join(" ") } : x)));
      if (n >= words.length && timer.current) {
        clearInterval(timer.current);
        timer.current = null;
        setBusy(false);
      }
    }, mode === "fast" ? 18 : mode === "think" ? 60 : 32);
  };

  const fresh = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setMessages([]);
    setText("");
    setBusy(false);
  };

  return (
    <div className="relative h-svh overflow-hidden bg-background text-foreground">
      <AsciiAquarium
        className="absolute inset-0 h-full"
        animal={settings.animal}
        colorway={settings.colorway}
        look={settings.look}
        speed={settings.speed * PACE[mode] * (typing || busy ? 1.35 : 1)}
        scale={settings.scale}
        paused={settings.paused}
        calm={started ? 0.9 : 0.35}
        dim={started ? 0.5 : 0}
        avoid={box}
      />

      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href={base || "/"} className="rounded-lg px-1 py-1" aria-label="Abyss home"><Logo /></Link>
          {started && (
            <button type="button" onClick={fresh} className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background/50 px-3 text-xs text-foreground/90 backdrop-blur-md transition-colors hover:bg-accent">
              <Plus className="size-3.5" /> New chat
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Appearance />
          <Link href={`${base}/login`} className="hidden h-9 items-center rounded-full px-3.5 text-sm text-foreground/90 transition-colors hover:bg-accent sm:inline-flex">Sign in</Link>
          <Link href={`${base}/signup`} className="inline-flex h-9 items-center rounded-full bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90">Get started</Link>
        </div>
      </header>

      {started ? (
        <main className="relative z-10 flex h-full flex-col pt-16">
          <div className="min-h-0 flex-1 overflow-y-auto px-4">
            <ol className="mx-auto max-w-2xl space-y-6 py-6">
              {messages.map((m) => (
                <li key={m.id} className={cn("flex", m.role === "user" && "justify-end")}>
                  {m.role === "user" ? (
                    <p className="max-w-[85%] rounded-2xl rounded-br-md border border-border bg-card/70 px-4 py-2.5 text-[15px] leading-6 backdrop-blur-md">{m.text}</p>
                  ) : (
                    <div className="flex max-w-[92%] gap-3">
                      <span aria-hidden className="mt-1 grid size-6 shrink-0 place-items-center rounded-full border border-border bg-card/70 text-[10px] text-primary backdrop-blur-md">A</span>
                      <p className="text-[15px] leading-7 text-foreground/95">
                        {m.text || <span className="inline-flex gap-1 pt-2">{[0, 1, 2].map((d) => <motion.i key={d} className="size-1.5 rounded-full bg-muted-foreground" animate={{ opacity: [0.25, 1, 0.25] }} transition={{ duration: 1, repeat: Infinity, delay: d * 0.15 }} />)}</span>}
                      </p>
                    </div>
                  )}
                </li>
              ))}
              <div ref={end} />
            </ol>
          </div>
          <div className="mx-auto w-full max-w-2xl px-4 pb-5">
            <Composer boxRef={box} value={text} onChange={setText} onSend={() => send()} mode={mode} onMode={setMode} busy={busy} onTyping={setTyping} />
          </div>
        </main>
      ) : (
        <main className="relative z-10 grid h-full place-items-center px-4 pt-14">
          <div className="w-full max-w-2xl">
            <Headline still={settings.paused} />
            <div className="mt-8">
              <Composer boxRef={box} value={text} onChange={setText} onSend={() => send()} mode={mode} onMode={setMode} busy={busy} onTyping={setTyping} />
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => send(s)} className="rounded-full border border-border bg-background/40 px-3.5 py-1.5 text-[13px] text-muted-foreground backdrop-blur-md transition-colors hover:border-foreground/30 hover:text-foreground">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
