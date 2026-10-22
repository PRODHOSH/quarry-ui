"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { COMMENTS, CONTENT, LEARNERS, PEOPLE, TODOS, TRAINER_POOL, type Comment, type Content, type Kind, type Todo } from "./data";

type Store = {
  content: Content[];
  todos: Todo[];
  comments: Record<string, Comment[]>;
  toast: string;
  say: (t: string) => void;
  addContent: (title: string, kind: Kind) => string;
  patch: (id: string, p: Partial<Content>) => void;
  remove: (id: string) => void;
  toggleFavorite: (id: string) => void;
  assign: (id: string, people: string[]) => void;
  addSection: (id: string) => void;
  addChapter: (id: string, sectionId: string) => void;
  addTrainer: (id: string) => void;
  addTodo: (title: string) => void;
  toggleTodo: (id: string) => void;
  addComment: (id: string, text: string) => void;
  graded: string[];
  grade: (quizId: string) => void;
};

const Ctx = createContext<Store | null>(null);
let n = 1;
const uid = () => `x${Date.now().toString(36)}${n++}`;

export function useLms() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useLms must be used inside LmsProvider");
  return c;
}

/** The URL prefix the template is mounted at, so links work at /lms, /preview/lms or anywhere else. */
export function useBase() {
  const path = usePathname();
  const i = path.indexOf("/lms");
  return i === -1 ? "" : path.slice(0, i + "/lms".length);
}

/** Keeps everything in memory. Replace these actions with calls to your own API. */
export function LmsProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Content[]>(CONTENT);
  const [todos, setTodos] = useState<Todo[]>(TODOS);
  const [comments, setComments] = useState<Record<string, Comment[]>>({ "interface-foundations": COMMENTS });
  const [graded, setGraded] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const say = useCallback((t: string) => {
    setToast(t);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 2200);
  }, []);

  const patch = useCallback((id: string, p: Partial<Content>) => setContent((l) => l.map((c) => (c.id === id ? { ...c, ...p } : c))), []);

  const value = useMemo<Store>(
    () => ({
      content,
      todos,
      comments,
      toast,
      say,
      graded,
      patch,
      addContent: (title, kind) => {
        const id = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "untitled"}-${uid().slice(-3)}`;
        setContent((l) => [
          {
            id,
            title,
            kind,
            published: false,
            tags: ["Not Urgent"],
            language: "English",
            author: PEOPLE[0].name,
            created: "Today",
            edited: "Just now",
            description: "Add a short description so learners know what to expect.",
            points: 50,
            hours: 1,
            sections: [{ id: "s1", title: "Section one", chapters: [{ id: "s1-0", title: "Chapter one" }] }],
            art: l.length % 4,
            assigned: [],
            completed: 0,
            favorite: false,
            archived: false,
            project: "Northwind Studio",
            trainers: [PEOPLE[0].id],
          },
          ...l,
        ]);
        say("Content created");
        return id;
      },
      remove: (id) => {
        setContent((l) => l.filter((c) => c.id !== id));
        say("Content deleted");
      },
      toggleFavorite: (id) => setContent((l) => l.map((c) => (c.id === id ? { ...c, favorite: !c.favorite } : c))),
      assign: (id, people) => {
        setContent((l) => l.map((c) => (c.id === id ? { ...c, assigned: Array.from(new Set([...c.assigned, ...people])) } : c)));
        say(people.length ? `Assigned to ${people.length} ${people.length === 1 ? "person" : "people"}` : "Nobody selected");
      },
      addSection: (id) =>
        setContent((l) =>
          l.map((c) => (c.id === id ? { ...c, edited: "Just now", sections: [...c.sections, { id: uid(), title: `New section ${c.sections.length + 1}`, chapters: [] }] } : c))
        ),
      addChapter: (id, sectionId) =>
        setContent((l) =>
          l.map((c) =>
            c.id === id
              ? { ...c, edited: "Just now", sections: c.sections.map((s) => (s.id === sectionId ? { ...s, chapters: [...s.chapters, { id: uid(), title: `New chapter ${s.chapters.length + 1}` }] } : s)) }
              : c
          )
        ),
      addTrainer: (id) =>
        setContent((l) =>
          l.map((c) => {
            if (c.id !== id) return c;
            const next = TRAINER_POOL.find((p) => !c.trainers.includes(p.id)) ?? LEARNERS.find((p) => !c.trainers.includes(p.id));
            return next ? { ...c, trainers: [...c.trainers, next.id] } : c;
          })
        ),
      addTodo: (title) => setTodos((l) => [{ id: uid(), title, done: false }, ...l]),
      toggleTodo: (id) => setTodos((l) => l.map((t) => (t.id === id ? { ...t, done: !t.done } : t))),
      addComment: (id, text) => setComments((m) => ({ ...m, [id]: [...(m[id] ?? []), { id: uid(), author: PEOPLE[0].name, text, at: "Just now" }] })),
      grade: (quizId) => {
        setGraded((g) => [...g, quizId]);
        say("Graded");
      },
    }),
    [content, todos, comments, toast, say, graded, patch]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
