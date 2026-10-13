"use client";

import { use } from "react";
import { ProjectPage } from "@/components/ai-chat/chat";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <ProjectPage slug={slug} />;
}
