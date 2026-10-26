import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocView } from "@/components/docs/doc-view";
import { getDoc, getDocs } from "@/lib/docs";

export function generateStaticParams() {
  return getDocs().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  return doc ? { title: `${doc.title} · Docs`, description: doc.lead } : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();
  return <DocView doc={doc} />;
}
