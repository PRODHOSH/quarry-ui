import { notFound } from "next/navigation";
import { ThumbStage } from "@/components/site/thumb-stage";
import { getItem, getItems } from "@/lib/registry";

export const metadata = { robots: { index: false } };

export function generateStaticParams() {
  return getItems().filter((i) => i.categories[0] !== "templates").map((i) => ({ name: i.name }));
}

export default async function Page({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const item = getItem(name);
  if (!item) notFound();
  return <ThumbStage name={item.name} stage={item.meta.stage} theme={item.meta.theme} />;
}
