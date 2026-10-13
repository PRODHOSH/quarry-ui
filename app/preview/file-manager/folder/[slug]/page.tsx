"use client";

import { use } from "react";
import { FolderPage } from "@/components/file-manager/pages";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <FolderPage slug={slug} />;
}
