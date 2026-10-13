"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Check, ChevronDown, Copy, Ellipsis, FileText, Image as ImageIcon, Newspaper, Paperclip, Pencil, Play, RefreshCw, Search, Share2, SlidersHorizontal, Sparkles, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { CHIPS, MODELS, PROJECTS, TOOLS } from "@/lib/ai-chat/data";
import { useBase, useChats } from "@/lib/ai-chat/store";
import { cn } from "@/lib/utils";

const CHIP_ICON = { "Deep Search": Search, "Create Images": ImageIcon, "Latest News": Newspaper, "Generate Video": Play };

function useOutside(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const d = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && close();
    document.addEventListener("mousedown", d);
    return () => document.removeEventListener("mousedown", d);
  }, [open, close]);
  return ref;
}

function Composer({ chatId, draftTool, setDraftTool, text, setText, autoFocus }: { chatId: string | null; draftTool: string | null; setDraftTool: (t: string | null) => void; text: string; setText: (t: string) => void; autoFocus?: boolean }) {
  const s = useChats();
  const [model, setModel] = useState(MODELS[1].id);
  const [menu, setMenu] = useState<null | "tools" | "model">(null);
  const [file, setFile] = useState<string | null>(null);
  const area = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const root = useOutside(menu !== null, () => setMenu(null));
  const current = MODELS.find((m) => m.id === model)!;
  const busy = s.busyId !== null;

  useEffect(() => {
    if (!area.current) return;
    area.current.style.height = "0px";
    area.current.style.height = `${Math.min(area.current.scrollHeight, 180)}px`;
  }, [text]);

  const submit = () => {
    if (!text.trim() || busy) return;
    s.send(chatId, file ? `${text} (attached: ${file})` : text, draftTool);
    setText("");
    setFile(null);
    setDraftTool(null);
  };

  return (
    <div ref={root} className="relative w-full rounded-3xl border bg-card p-4 shadow-[0_8px_30px_-12px_rgba(20,30,60,0.18)] transition-shadow focus-within:shadow-[0_12px_40px_-12px_rgba(60,90,255,0.25)]">
      {(draftTool || file) && (
        <div className="mb-2 flex flex-wrap gap-2">
          {draftTool && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs">
              {draftTool}
              <button type="button" aria-label="Remove tool" onClick={() => setDraftTool(null)}><X className="size-3" /></button>
            </span>
          )}
          {file && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs">
              <FileText className="size-3" /> {file}
              <button type="button" aria-label="Remove file" onClick={() => setFile(null)}><X className="size-3" /></button>
            </span>
          )}
        </div>
      )}
      <textarea
        ref={area}
        autoFocus={autoFocus}
        value={text}
        rows={1}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder="Ask me anything..."
        className="block max-h-44 w-full resize-none bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
      />
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="relative flex items-center gap-1">
          <button type="button" aria-label="Attach a file" onClick={() => fileInput.current?.click()} className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <Paperclip className="size-[18px]" />
          </button>
          <input ref={fileInput} type="file" hidden onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)} />
          <button type="button" aria-haspopup="menu" aria-expanded={menu === "tools"} onClick={() => setMenu(menu === "tools" ? null : "tools")} className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-sm text-foreground/80 transition-colors hover:bg-accent">
            <SlidersHorizontal className="size-4" /> Tools
          </button>
          <AnimatePresence>
            {menu === "tools" && (
              <motion.ul initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-12 left-0 z-20 w-56 rounded-2xl border bg-card p-1.5 shadow-xl">
                {TOOLS.map((t) => (
                  <li key={t}>
                    <button type="button" onClick={() => { setDraftTool(draftTool === t ? null : t); setMenu(null); }} className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-accent">
                      {t}
                      {draftTool === t && <Check className="size-4 text-primary" />}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
        <div className="relative flex items-center gap-2">
          <button type="button" aria-haspopup="listbox" aria-expanded={menu === "model"} onClick={() => setMenu(menu === "model" ? null : "model")} className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-sm transition-colors hover:bg-accent">
            <Sparkles className="size-3.5 text-chart-2" /> {current.name} <ChevronDown className={cn("size-4 transition-transform", menu === "model" && "rotate-180")} />
          </button>
          <AnimatePresence>
            {menu === "model" && (
              <motion.ul role="listbox" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-12 right-0 z-20 w-64 rounded-2xl border bg-card p-1.5 shadow-xl">
                {MODELS.map((m) => (
                  <li key={m.id}>
                    <button type="button" role="option" aria-selected={m.id === model} onClick={() => { setModel(m.id); setMenu(null); }} className="flex w-full items-start gap-2 rounded-xl px-3 py-2 text-left hover:bg-accent">
                      <Check className={cn("mt-0.5 size-4 shrink-0 text-primary", m.id === model ? "opacity-100" : "opacity-0")} />
                      <span>
                        <span className="block text-sm font-medium">{m.name}</span>
                        <span className="block text-xs text-muted-foreground">{m.note}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
          <button type="button" aria-label="Send" onClick={submit} disabled={!text.trim() || busy} className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:bg-muted disabled:text-muted-foreground">
            <ArrowUp className="size-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Welcome() {
  const [text, setText] = useState("");
  const [tool, setTool] = useState<string | null>(null);
  return (
    <div className="grid min-h-0 flex-1 place-items-center overflow-y-auto px-5 py-10">
      <div className="w-full max-w-[44rem] text-center">
        <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }} className="bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-3xl font-normal tracking-tight text-transparent sm:text-4xl">
          Hey, How Can I Assist?
        </motion.h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">Converse is our smartest and fastest chatbot — built to give you accurate, helpful answers every time.</p>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7, ease: [0.32, 0.72, 0, 1] }} className="mt-8 text-left">
          <Composer chatId={null} draftTool={tool} setDraftTool={setTool} text={text} setText={setText} autoFocus />
        </motion.div>
        <ul className="mt-5 flex flex-wrap justify-center gap-2.5">
          {CHIPS.map((c) => {
            const I = CHIP_ICON[c];
            return (
              <li key={c}>
                <button type="button" onClick={() => { setTool(c); if (!text) setText(`${c}: `); }} className="inline-flex h-10 items-center gap-2 rounded-full border bg-card px-4 text-sm text-foreground/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:text-foreground">
                  <I className="size-4" /> {c}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function IconBtn({ label, onClick, active, children }: { label: string; onClick?: () => void; active?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={cn("grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground", active && "text-primary")}>
      {children}
    </button>
  );
}

function ShareModal({ open, onClose, url }: { open: boolean; onClose: () => void; url: string }) {
  const s = useChats();
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] grid place-items-center bg-foreground/20 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Share conversation</h2>
              <button type="button" aria-label="Close" onClick={onClose} className="grid size-8 place-items-center rounded-lg hover:bg-accent"><X className="size-4" /></button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Anyone with the link can read this conversation.</p>
            <div className="mt-4 flex gap-2">
              <input readOnly value={url} className="h-11 min-w-0 flex-1 rounded-xl border bg-muted px-3 text-sm outline-none" />
              <button type="button" onClick={() => { navigator.clipboard?.writeText(url).catch(() => {}); s.say("Link copied"); onClose(); }} className="h-11 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90">Copy link</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function NewChatPage() {
  return <Welcome />;
}

export function ConversationPage({ id }: { id: string }) {
  const s = useChats();
  const base = useBase();
  const chat = s.chats.find((c) => c.id === id);
  const [text, setText] = useState("");
  const [tool, setTool] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [share, setShare] = useState(false);
  const [more, setMore] = useState(false);
  const moreRef = useOutside(more, () => setMore(false));
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [chat?.messages]);

  if (!chat) notFound();
  const copy = (t: string) => { navigator.clipboard?.writeText(t).catch(() => {}); s.say("Copied"); };

  return (
    <>
      <div className="flex h-16 shrink-0 items-center justify-end gap-2 px-5">
        <div ref={moreRef} className="relative">
          <button type="button" aria-label="More" aria-expanded={more} onClick={() => setMore((m) => !m)} className="grid size-9 place-items-center rounded-lg border text-muted-foreground hover:bg-accent hover:text-foreground"><Ellipsis className="size-4" /></button>
          {more && (
            <ul className="absolute right-0 top-11 z-30 w-44 rounded-xl border bg-card p-1 shadow-xl">
              <li><button type="button" onClick={() => { copy(chat.messages.map((m) => m.text).join("\n\n")); setMore(false); }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-accent"><Copy className="size-3.5" /> Copy chat</button></li>
              <li><Link href={base || "/"} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-accent"><Sparkles className="size-3.5" /> New chat</Link></li>
            </ul>
          )}
        </div>
        <button type="button" onClick={() => setShare(true)} className="inline-flex h-9 items-center gap-2 rounded-lg bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-85"><Share2 className="size-4" /> Share</button>
      </div>

      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto px-5">
        <ul className="mx-auto max-w-[44rem] space-y-8 pb-6">
          {chat.messages.map((m) =>
            m.role === "user" ? (
              <li key={m.id} className="group flex flex-col items-end gap-2">
                {editing === m.id ? (
                  <form onSubmit={(e) => { e.preventDefault(); s.editAndResend(chat.id, m.id, draft); setEditing(null); }} className="w-full max-w-md rounded-2xl border bg-card p-3">
                    <textarea autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} rows={2} className="w-full resize-none bg-transparent text-sm outline-none" />
                    <div className="mt-2 flex justify-end gap-2">
                      <button type="button" onClick={() => setEditing(null)} className="rounded-lg px-3 py-1.5 text-sm hover:bg-accent">Cancel</button>
                      <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground">Send</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="max-w-[80%] whitespace-pre-wrap rounded-2xl bg-muted px-4 py-3 text-[15px]">{m.text}</p>
                    <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
                      <IconBtn label="Copy" onClick={() => copy(m.text)}><Copy className="size-4" /></IconBtn>
                      <IconBtn label="Edit" onClick={() => { setEditing(m.id); setDraft(m.text); }}><Pencil className="size-4" /></IconBtn>
                    </div>
                  </>
                )}
              </li>
            ) : (
              <li key={m.id}>
                <p className="mb-2 flex items-center gap-2 text-sm text-muted-foreground"><Sparkles className="size-3.5 text-primary" /> Aria 2.0</p>
                <div className="whitespace-pre-wrap text-[15px] leading-relaxed">{m.text || <span className="inline-flex gap-1 py-2" aria-label="Thinking">{[0, 1, 2].map((i) => <motion.span key={i} className="size-1.5 rounded-full bg-muted-foreground" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }} />)}</span>}</div>
                {m.text && (
                  <div className="mt-2 flex items-center">
                    <IconBtn label="Copy" onClick={() => copy(m.text)}><Copy className="size-4" /></IconBtn>
                    <IconBtn label="Regenerate" onClick={() => s.regenerate(chat.id, m.id)}><RefreshCw className="size-4" /></IconBtn>
                    <IconBtn label="Good response" active={m.rating === "up"} onClick={() => s.rate(chat.id, m.id, "up")}><ThumbsUp className="size-4" /></IconBtn>
                    <IconBtn label="Bad response" active={m.rating === "down"} onClick={() => s.rate(chat.id, m.id, "down")}><ThumbsDown className="size-4" /></IconBtn>
                  </div>
                )}
              </li>
            )
          )}
        </ul>
      </div>

      <div className="shrink-0 px-5 pb-5">
        <div className="mx-auto max-w-[44rem]">
          <Composer chatId={chat.id} draftTool={tool} setDraftTool={setTool} text={text} setText={setText} />
        </div>
      </div>
      <ShareModal open={share} onClose={() => setShare(false)} url={`https://converse.app/share/${chat.id}`} />
    </>
  );
}

export function ProjectPage({ slug }: { slug: string }) {
  const s = useChats();
  const base = useBase();
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();
  const list = s.chats.filter((c) => c.project === slug);
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-6 py-16">
      <div className="mx-auto max-w-[44rem]">
        <h1 className="text-3xl font-medium tracking-tight">{project.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{list.length} conversations in this project.</p>
        <ul className="mt-8 divide-y rounded-2xl border">
          {list.map((c) => (
            <li key={c.id}>
              <Link href={`${base}/c/${c.id}`} className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-accent/50">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{c.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">{c.messages.at(-1)?.text}</span>
                </span>
                <ChevronDown className="size-4 -rotate-90 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
        <Link href={base || "/"} className="mt-6 inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90">Start a new chat</Link>
      </div>
    </div>
  );
}
