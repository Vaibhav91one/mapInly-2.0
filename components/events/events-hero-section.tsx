import Link from "next/link";
import { cn } from "@/lib/utils";
import { sectionClasses, sectionInnerClasses } from "@/lib/layout-classes";

export function EventsHeroSection() {
  return (
    <section
      className={cn(
        sectionClasses,
        "h-[60dvh] bg-foreground"
      )}
    >
      <div
        className={cn(
          sectionInnerClasses,
          "relative z-10 flex min-h-[60dvh] flex-col items-start justify-between gap-8"
        )}
      >
        <p className="text-sm font-regular leading-tight tracking-tight text-white md:text-2xl">
          <Link href="/" className="hover:text-background transition-colors">
            /
          </Link>{" "}
          <span className="text-white">Events</span>
        </p>
        <h1 className="text-6xl font-regular tracking-tight leading-tight text-background md:text-8xl lg:text-9xl">
          Events
        </h1>
      </div>
    </section>
  );
}
