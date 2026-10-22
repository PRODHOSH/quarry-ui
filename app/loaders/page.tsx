import type { Metadata } from "next";
import { GroupPage } from "@/components/site/group-page";

export const metadata: Metadata = { title: "Loaders" };

export default function LoadersPage() {
  return <GroupPage kind="loaders" />;
}
