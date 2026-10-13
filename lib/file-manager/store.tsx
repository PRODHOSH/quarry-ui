"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { FILES, FOLDERS, TRASHED_FILES, TRASHED_FOLDERS, type Category, type FileItem, type FolderItem } from "./data";

type Store = {
  files: FileItem[];
  folders: FolderItem[];
  toast: string;
  say: (text: string) => void;
  toggleFile: (id: string, key: "favorite" | "shared") => void;
  toggleFolder: (slug: string, key: "favorite") => void;
  trashFile: (id: string) => void;
  trashFolder: (slug: string) => void;
  restoreFile: (id: string) => void;
  restoreFolder: (slug: string) => void;
  removeFile: (id: string) => void;
  removeFolder: (slug: string) => void;
  renameFile: (id: string, name: string) => void;
  addFiles: (names: { name: string; kb: number }[], folder?: string | null) => void;
  createFolder: (name: string) => void;
};

const Ctx = createContext<Store | null>(null);

const kindOf = (name: string): { type: string; category: Category } => {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return { type: ext.toUpperCase(), category: "image" };
  if (["mp4", "mov", "webm"].includes(ext)) return { type: ext.toUpperCase(), category: "video" };
  if (["xls", "xlsx", "csv"].includes(ext)) return { type: "XLS", category: "xls" };
  return { type: ext ? ext.toUpperCase() : "FILE", category: "document" };
};
const sizeLabel = (kb: number) => (kb < 1024 ? `${Math.max(1, Math.round(kb))} KB` : `${(kb / 1024).toFixed(1)} MB`);

/** Holds every file and folder in memory so all pages stay in sync. Swap the setters for calls to your own API. */
export function FileManagerProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<FileItem[]>([...FILES, ...TRASHED_FILES]);
  const [folders, setFolders] = useState<FolderItem[]>([...FOLDERS, ...TRASHED_FOLDERS]);
  const [toast, setToast] = useState("");

  const say = useCallback((text: string) => {
    setToast(text);
    window.setTimeout(() => setToast((t) => (t === text ? "" : t)), 2400);
  }, []);

  const value = useMemo<Store>(
    () => ({
      files,
      folders,
      toast,
      say,
      toggleFile: (id, key) => setFiles((c) => c.map((f) => (f.id === id ? { ...f, [key]: !f[key] } : f))),
      toggleFolder: (slug, key) => setFolders((c) => c.map((f) => (f.slug === slug ? { ...f, [key]: !f[key] } : f))),
      trashFile: (id) => { setFiles((c) => c.map((f) => (f.id === id ? { ...f, trashed: true, modified: "Deleted just now", age: 0 } : f))); say("Moved to trash"); },
      trashFolder: (slug) => { setFolders((c) => c.map((f) => (f.slug === slug ? { ...f, trashed: true } : f))); say("Folder moved to trash"); },
      restoreFile: (id) => { setFiles((c) => c.map((f) => (f.id === id ? { ...f, trashed: false, modified: "Just now", age: 0 } : f))); say("File restored"); },
      restoreFolder: (slug) => { setFolders((c) => c.map((f) => (f.slug === slug ? { ...f, trashed: false } : f))); say("Folder restored"); },
      removeFile: (id) => { setFiles((c) => c.filter((f) => f.id !== id)); say("Deleted for good"); },
      removeFolder: (slug) => { setFolders((c) => c.filter((f) => f.slug !== slug)); say("Deleted for good"); },
      renameFile: (id, name) => setFiles((c) => c.map((f) => (f.id === id ? { ...f, name, ...kindOf(name) } : f))),
      addFiles: (names, folder = null) => {
        setFiles((c) => [
          ...names.map((n, i) => ({ id: `u${Date.now()}${i}`, name: n.name, owner: "You", ...kindOf(n.name), size: sizeLabel(n.kb), kb: n.kb, modified: "Just now", age: 0, folder, favorite: false, shared: false, recent: true, trashed: false })),
          ...c,
        ]);
        say(names.length === 1 ? "Uploaded 1 file" : `Uploaded ${names.length} files`);
      },
      createFolder: (name) => {
        const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "folder"}-${folders.length}`;
        setFolders((c) => [{ slug, name, files: 0, size: "0MB", tone: ((c.length % 5) + 1) as FolderItem["tone"], favorite: false, shared: false, recent: true, trashed: false }, ...c]);
        say("Folder created");
      },
    }),
    [files, folders, toast, say]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFiles() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useFiles must be used inside FileManagerProvider");
  return v;
}

/** The URL prefix the template is mounted on, found from the current path so it works anywhere. */
export function useBase() {
  const path = usePathname();
  const i = path.indexOf("/file-manager");
  return i === -1 ? "" : path.slice(0, i + "/file-manager".length);
}
