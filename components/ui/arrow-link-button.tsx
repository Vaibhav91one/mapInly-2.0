import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArrowLinkButtonProps {
  href: string;
  text: string;
  ariaLabel?: string;
  className?: string;
}

export function ArrowLinkButton({
  href,
  text,
  ariaLabel,
  className,
}: ArrowLinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-3 md:px-5 md:py-4",
        "bg-foreground text-white hover:bg-foreground/90 transition-colors",
        "font-medium text-base md:text-lg",
        className
      )}
      aria-label={ariaLabel ?? `Go to ${text}`}
    >
      <span>{text}</span>
      <ArrowUpRight className="size-5 md:size-6 shrink-0 text-white" />
    </Link>
  );
}
