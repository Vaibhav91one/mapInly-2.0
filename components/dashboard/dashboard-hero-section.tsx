import Link from "next/link";
import { cn } from "@/lib/utils";
import { sectionClasses, sectionInnerClasses } from "@/lib/layout-classes";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function DashboardHeroSection() {
  return (
    <section
      className={cn(sectionClasses, "h-[60dvh] bg-black")}
    >
      <div
        className={cn(
          sectionInnerClasses,
          "relative z-10 flex min-h-[60dvh] flex-col items-start justify-between gap-8"
        )}
      >
         <p className="text-sm font-regular leading-tight tracking-tight text-white md:text-2xl">
          <Link href="/dashboard" className="hover:text-background transition-colors">
            /
          </Link>{" "}
          <span className="text-white">Dashboard</span>
        </p>
        <h1 className="text-6xl font-regular tracking-tight leading-tight text-white md:text-8xl lg:text-9xl">
          Dashboard
        </h1>
      </div>
    </section>
  );
}
