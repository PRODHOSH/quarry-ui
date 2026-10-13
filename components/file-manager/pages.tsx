"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Plus, TriangleAlert, X } from "lucide-react";
import { useState } from "react";
import { ACTIVITY, MEMBERS, STORAGE } from "@/lib/file-manager/data";
import { useBase, useFiles } from "@/lib/file-manager/store";
import { FileGlyph, FileSection, FolderCard, FolderGrid, Modal } from "@/components/file-manager/ui";
import { Initials } from "@/components/file-manager/shell";
import { cn } from "@/lib/utils";

const SEG = ["bg-chart-1", "bg-chart-3", "bg-chart-5", "bg-chart-2"];
const STATUS = {
  complete: "bg-chart-4/15 text-chart-4",
  steady: "bg-muted text-muted-foreground",
  quiet: "bg-destructive/15 text-destructive",
};

function CreateFolder() {
  const s = useFiles();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-xl border bg-card px-4 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <Plus className="size-4" /> Create Folder
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Create folder">
        <form onSubmit={(e) => { e.preventDefault(); if (name.trim()) { s.createFolder(name.trim()); setName(""); setOpen(false); } }} className="space-y-4">
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Folder name" className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:ring-4 focus:ring-ring/20" />
          <button type="submit" className="h-11 w-full rounded-xl bg-primary text-sm font-medium text-primary-foreground hover:opacity-90">Create</button>
        </form>
      </Modal>
    </>
  );
}

function Heading({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {action}
    </div>
  );
}

export function OverviewPage() {
  const s = useFiles();
  const live = s.files.filter((f) => !f.trashed);
  const recent = [...live].sort((a, b) => a.age - b.age).slice(0, 4);
  const folders = s.folders.filter((f) => !f.trashed).slice(0, 4);
  const free = STORAGE.totalGb - STORAGE.usedGb;

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Storage</p>
            <p className="mt-1 text-4xl font-semibold tracking-tight">{STORAGE.usedGb} <span className="text-base font-normal text-muted-foreground">GB used</span></p>
          </div>
          <p className="text-sm text-muted-foreground">From <span className="text-xl font-semibold text-foreground">{STORAGE.totalGb} GB</span></p>
        </div>
        <div className="mt-5 flex h-3 gap-1.5 overflow-hidden rounded-full" aria-hidden>
          {STORAGE.parts.map((p, i) => (
            <span key={p.label} className={cn("h-full rounded-full", SEG[i])} style={{ width: `${(p.gb / STORAGE.totalGb) * 100}%` }} />
          ))}
          <span className="h-full flex-1 rounded-full bg-muted" />
        </div>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
          {STORAGE.parts.map((p, i) => (
            <li key={p.label} className="flex items-center gap-2"><span className={cn("size-2 rounded-full", SEG[i])} /> {p.label}</li>
          ))}
          <li className="flex items-center gap-2"><span className="size-2 rounded-full bg-muted" /> Free Space · {free.toFixed(1)} GB</li>
        </ul>
      </section>

      <section>
        <Heading title="Recent files" />
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {recent.map((f) => (
            <li key={f.id} className="flex items-center gap-4 rounded-2xl border bg-card p-4 transition-colors hover:border-primary/40">
              <FileGlyph type={f.type} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{f.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{f.size} • {f.modified}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <Heading title="Folder" />
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {folders.map((f) => (
            <li key={f.slug}><FolderCard folder={f} /></li>
          ))}
        </ul>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <section className="overflow-hidden rounded-2xl border bg-card">
          <h2 className="p-5 text-lg font-semibold tracking-tight">Member Status</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead className="border-y text-xs text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Members</th>
                  <th className="py-3 font-medium">Upload</th>
                  <th className="py-3 font-medium">Edited</th>
                  <th className="py-3 font-medium">Storage Used</th>
                  <th className="py-3 pr-5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {MEMBERS.map((m) => (
                  <tr key={m.name} className="border-b last:border-0">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Initials name={m.name} className="size-10" />
                        <div>
                          <p className="font-medium">{m.name}</p>
                          <p className="text-xs text-muted-foreground">{m.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 tabular-nums">{String(m.upload).padStart(2, "0")}</td>
                    <td className="py-4 tabular-nums">{String(m.edited).padStart(2, "0")}</td>
                    <td className="py-4 text-muted-foreground">{m.used}</td>
                    <td className="py-4 pr-5"><span className={cn("rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider", STATUS[m.status])}>{m.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-5">
          <h2 className="text-lg font-semibold tracking-tight">Recent Activity</h2>
          <p className="mt-1 text-sm text-muted-foreground">See what your team has been up to.</p>
          <ul className="mt-4 space-y-3">
            {ACTIVITY.map((a, i) => (
              <li key={i} className="flex gap-3 rounded-xl border p-3.5 text-sm">
                <Initials name={a.who === "You" ? "Alex Morgan" : a.who} className="size-8 text-[10px]" />
                <p className="min-w-0 text-muted-foreground">
                  <span className="font-medium text-foreground">{a.who}</span> {a.text} <span className="font-medium text-foreground">{a.target}</span> {a.tail}
                  <span className="mt-1 block text-xs">{a.date}</span>
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export function MyFilesPage() {
  const s = useFiles();
  return (
    <div className="space-y-8">
      <section>
        <Heading title="All Folder" action={<CreateFolder />} />
        <FolderGrid folders={s.folders.filter((f) => !f.trashed)} />
      </section>
      <FileSection title="All Files" files={s.files.filter((f) => !f.trashed)} />
    </div>
  );
}

export function SharedPage() {
  const s = useFiles();
  return (
    <div className="space-y-8">
      <section>
        <Heading title="All Folder" action={<CreateFolder />} />
        <FolderGrid folders={s.folders.filter((f) => !f.trashed && f.shared)} />
      </section>
      <FileSection title="All Files" files={s.files.filter((f) => !f.trashed && f.shared)} defaultView="grid" />
    </div>
  );
}

export function FavoritePage() {
  const s = useFiles();
  return (
    <div className="space-y-8">
      <section>
        <Heading title="Favorite folders" action={<CreateFolder />} />
        <FolderGrid folders={s.folders.filter((f) => !f.trashed && f.favorite)} />
      </section>
      <FileSection title="Favorite Files" files={s.files.filter((f) => !f.trashed && f.favorite)} defaultView="grid" />
    </div>
  );
}

export function RecentPage() {
  const s = useFiles();
  return (
    <div className="space-y-8">
      <section>
        <Heading title="Recent folders" />
        <FolderGrid folders={s.folders.filter((f) => !f.trashed && f.recent).slice(0, 3)} />
      </section>
      <FileSection title="Recent Files" files={s.files.filter((f) => !f.trashed && f.recent)} defaultView="grid" />
    </div>
  );
}

export function TrashPage() {
  const s = useFiles();
  const [banner, setBanner] = useState(true);
  return (
    <div className="space-y-8">
      {banner && (
        <div role="alert" className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <TriangleAlert className="size-4 shrink-0" />
          Items in Trash are automatically deleted after 30 days.
          <button type="button" aria-label="Dismiss" onClick={() => setBanner(false)} className="ml-auto grid size-6 place-items-center rounded-md hover:bg-destructive/15"><X className="size-4" /></button>
        </div>
      )}
      <section>
        <Heading title="Deleted folders" />
        <FolderGrid folders={s.folders.filter((f) => f.trashed)} trash />
      </section>
      <FileSection title="Delete Files" files={s.files.filter((f) => f.trashed)} trash />
    </div>
  );
}

export function FolderPage({ slug }: { slug: string }) {
  const s = useFiles();
  const base = useBase();
  const folder = s.folders.find((f) => f.slug === slug);
  if (!folder) notFound();
  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href={`${base}/shared`} className="hover:text-foreground">Shared Files</Link>
        <ChevronRight className="size-3.5" />
        <span className="font-medium text-foreground">{folder.name}</span>
      </nav>
      <FileSection title={`${folder.name} Files`} files={s.files.filter((f) => !f.trashed && f.folder === slug)} defaultView="grid" />
    </div>
  );
}
