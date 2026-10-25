import type { Metadata } from "next";
import { ForumsView } from "@/components/forums/forums-view";

export const metadata: Metadata = {
  title: "Forums",
  description: "Community forums – discuss and share in your language.",
};

export default function ForumsPage() {
  return <ForumsView />;
}
