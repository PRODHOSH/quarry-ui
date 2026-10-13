"use client";

import { use } from "react";
import { ConversationPage } from "@/components/ai-chat/chat";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ConversationPage id={id} />;
}
