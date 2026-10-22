import { getItems, ownerOf } from "@/lib/registry";
import { ItemView } from "@/components/site/item-view";
import { generateMetadata } from "@/app/components/[slug]/page";

export { generateMetadata };

export function generateStaticParams() {
  return getItems().filter((i) => ownerOf(i) === "loaders").map((i) => ({ slug: i.name }));
}

export default async function LoadersItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ItemView slug={slug} kind="loaders" />;
}
