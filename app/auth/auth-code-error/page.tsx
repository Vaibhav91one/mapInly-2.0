import Link from "next/link";
import { sectionClasses } from "@/lib/layout-classes";

export default function AuthCodeErrorPage() {
  return (
    <section
      className={`${sectionClasses} flex min-h-[calc(100vh-200px)] flex-col items-center justify-center gap-6 bg-black pt-20 text-white`}
    >
      <h1 className="text-2xl font-medium">
        We couldn&apos;t sign you in. Something went wrong.
      </h1>
      <p className="text-white/70">
        Please try again or contact support if the problem persists.
      </p>
      <Link
        href="/auth"
        className="rounded-full border border-white/30 bg-transparent px-6 py-3 font-medium text-white transition-colors hover:border-primary/60 hover:bg-white/5"
      >
        Back to sign in
      </Link>
    </section>
  );
}
