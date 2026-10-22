import type { Metadata } from "next";
import { ItemView } from "@/components/site/item-view";
import { getItem, getItems, ownerOf } from "@/lib/registry";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getItems().filter((item) => ownerOf(item) === "components").map((item) => ({ slug: item.name }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getItem(slug);
  return item ? { title: item.title, description: item.description } : {};
}

export default async function ComponentPage({ params }: Props) {
  const { slug } = await params;
  return <ItemView slug={slug} kind="components" />;
}
