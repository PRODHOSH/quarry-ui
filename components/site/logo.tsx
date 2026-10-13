import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Brand artwork is white on transparent, so it is shown as is on the dark site. */
export function Logo({ className, size = "md" }: { className?: string; size?: "md" | "lg" }) {
  return (
    <Link
      href="/"
      aria-label="Quarry UI home"
      className={cn("inline-flex shrink-0 items-center", className)}
    >
      <Image
        src="/brand/logo.png"
        alt="Quarry UI"
        width={1738}
        height={389}
        sizes="160px"
        priority
        className={cn("w-auto", size === "lg" ? "h-7" : "h-[22px]")}
      />
    </Link>
  );
}
