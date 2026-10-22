"use client";

import { use } from "react";
import { DetailPage } from "@/components/lms/detail";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <DetailPage id={id} />;
}
