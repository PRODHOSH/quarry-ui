"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { replyFor, SEED, type Chat } from "./data";

type Store = {
  chats: Chat[];
  busyId: string | null;
  toast: string;
  say: (t: string) => void;
  send: (chatId: string | null, text: string, tool?: string | null) => void;
  regenerate: (chatId: string, messageId: string) => void;
  rate: (chatId: string, messageId: string, rating: "up" | "down") => void;
  editAndResend: (chatId: string, messageId: string, text: string) => void;
  rename: (chatId: string, title: string) => void;
  remove: (chatId: string) => void;
};

const Ctx = createContext<Store | null>(null);
let counter = 1;
const uid = () => `n${Date.now().toString(36)}${counter++}`;

/** Keeps every conversation in memory and streams replies. Replace the stream with a call to your own model API. */
export function ChatProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const base = useBase();
  const [chats, setChats] = useState<Chat[]>(SEED);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const timer = useRef<number | null>(null);

  useEffect(() => () => { if (timer.current) window.clearInterval(timer.current); }, []);

  const say = useCallback((t: string) => {
    setToast(t);
    window.setTimeout(() => setToast((x) => (x === t ? "" : x)), 2200);
  }, []);

  const patch = useCallback((id: string, fn: (c: Chat) => Chat) => setChats((cur) => cur.map((c) => (c.id === id ? fn(c) : c))), []);

  const stream = useCallback(
    (chatId: string, assistantId: string, full: string) => {
      setBusyId(chatId);
      let i = 0;
      window.setTimeout(() => {
        timer.current = window.setInterval(() => {
          i = Math.min(full.length, i + 3);
          patch(chatId, (c) => ({ ...c, messages: c.messages.map((m) => (m.id === assistantId ? { ...m, text: full.slice(0, i) } : m)) }));
          if (i >= full.length) {
            if (timer.current) window.clearInterval(timer.current);
            setBusyId(null);
          }
        }, 18);
      }, 700);
    },
    [patch]
  );

  const value = useMemo<Store>(
    () => ({
      chats,
      busyId,
      toast,
      say,
      send: (chatId, text, tool = null) => {
        const q = text.trim();
        if (!q || busyId) return;
        const aId = uid();
        const full = replyFor(q, tool);
        let id = chatId;
        if (!id) {
          id = uid();
          const created: Chat = { id, title: q.length > 32 ? q.slice(0, 30) + "…" : q, group: "Today", messages: [] };
          setChats((c) => [created, ...c]);
          router.push(`${base}/c/${id}`);
        }
        patch(id, (c) => ({ ...c, messages: [...c.messages, { id: uid(), role: "user", text: q }, { id: aId, role: "assistant", text: "" }] }));
        stream(id, aId, full);
      },
      regenerate: (chatId, messageId) => {
        if (busyId) return;
        const chat = chats.find((c) => c.id === chatId);
        const idx = chat?.messages.findIndex((m) => m.id === messageId) ?? -1;
        const q = idx > 0 ? chat!.messages[idx - 1].text : "";
        patch(chatId, (c) => ({ ...c, messages: c.messages.map((m) => (m.id === messageId ? { ...m, text: "", rating: undefined } : m)) }));
        stream(chatId, messageId, replyFor(q + " ", null));
      },
      rate: (chatId, messageId, rating) => patch(chatId, (c) => ({ ...c, messages: c.messages.map((m) => (m.id === messageId ? { ...m, rating: m.rating === rating ? undefined : rating } : m)) })),
      editAndResend: (chatId, messageId, text) => {
        if (busyId || !text.trim()) return;
        const aId = uid();
        patch(chatId, (c) => {
          const idx = c.messages.findIndex((m) => m.id === messageId);
          return { ...c, messages: [...c.messages.slice(0, idx), { id: uid(), role: "user", text: text.trim() }, { id: aId, role: "assistant", text: "" }] };
        });
        stream(chatId, aId, replyFor(text.trim(), null));
      },
      rename: (chatId, title) => patch(chatId, (c) => ({ ...c, title })),
      remove: (chatId) => {
        setChats((c) => c.filter((x) => x.id !== chatId));
        say("Conversation deleted");
      },
    }),
    [chats, busyId, toast, say, patch, stream, router, base]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useChats() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useChats must be used inside ChatProvider");
  return v;
}

/** The URL prefix the template is mounted on, found from the current path so it works anywhere. */
export function useBase() {
  const path = usePathname();
  const i = path.indexOf("/ai-chat");
  return i === -1 ? "" : path.slice(0, i + "/ai-chat".length);
}
