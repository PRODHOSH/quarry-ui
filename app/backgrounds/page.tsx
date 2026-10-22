import type { Metadata } from "next";
import { GroupPage } from "@/components/site/group-page";

export const metadata: Metadata = { title: "Backgrounds" };

export default function BackgroundsPage() {
  return <GroupPage kind="backgrounds" />;
}
