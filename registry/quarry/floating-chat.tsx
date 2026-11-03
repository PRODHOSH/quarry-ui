"use client";

import { cn } from "@/lib/utils";

const WHATSAPP = "M12.04 2a9.9 9.9 0 0 0-8.5 14.95L2 22l5.2-1.36A9.9 9.9 0 1 0 12.04 2Zm0 1.8a8.1 8.1 0 1 1-4.13 15.08l-.3-.17-3.08.8.82-3-.2-.31A8.1 8.1 0 0 1 12.04 3.8Zm-3.6 3.9c-.2 0-.52.07-.8.37-.27.3-1.03 1-1.03 2.44s1.06 2.84 1.2 3.03c.15.2 2.05 3.26 5.06 4.44 2.5.98 3 .79 3.54.74.54-.05 1.75-.72 2-1.4.24-.7.24-1.3.17-1.42-.07-.12-.27-.2-.57-.35-.3-.15-1.75-.87-2.02-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.63-.92-2.23-.24-.58-.49-.5-.67-.51h-.57Z";

/**
 * A floating WhatsApp button. It sits in the corner with a soft pulse and, when clicked, opens a
 * chat with your number and a message that is already typed. Swap the placeholder number (digits
 * only, with the country code and no plus sign) and message for your own. `contained` keeps it
 * inside a relatively positioned parent instead of the corner of the screen.
 */
export function FloatingChat({
  phone = "15550102030",
  message = "Hi! I found you on your website and I would like to know more.",
  label = "WhatsApp us",
  contained = false,
  className,
}: {
  /** The number to message, digits only, with the country code. */
  phone?: string;
  /** The text that is waiting in the box when the chat opens. */
  message?: string;
  label?: string;
  contained?: boolean;
  className?: string;
}) {
  const href = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} on WhatsApp`}
      className={cn(
        "group z-40 inline-flex h-14 items-center gap-2.5 rounded-full bg-[#25d366] pl-4 pr-5 text-[0.95rem] font-semibold text-white shadow-[0_14px_30px_-10px_rgb(0_0_0/0.45)] transition-[transform,background-color] duration-200 hover:scale-[1.03] hover:bg-[#1fbd5a] active:scale-95 max-sm:size-14 max-sm:justify-center max-sm:p-0",
        contained ? "absolute" : "fixed",
        "bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))]",
        className
      )}
    >
      <span aria-hidden className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25d366]/40 [animation-duration:2.6s] motion-reduce:hidden" />
      <svg viewBox="0 0 24 24" aria-hidden className="size-6 shrink-0 fill-current">
        <path d={WHATSAPP} />
      </svg>
      <span className="max-sm:sr-only">{label}</span>
    </a>
  );
}
