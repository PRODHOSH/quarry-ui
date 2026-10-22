import type { Metadata } from "next";
import { ComingSoon } from "@/components/landing/coming-soon";

export const metadata: Metadata = { title: "Join the waiting list" };

export default function WaitlistPage() {
  return (
    <div className="grid min-h-[calc(100svh-8rem)] place-items-center">
      <ComingSoon />
    </div>
  );
}
