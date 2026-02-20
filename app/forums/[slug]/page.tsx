import { notFound } from "next/navigation";
import {
  ForumHeroSection,
  ForumDetailsSection,
  ForumCommentsSection,
} from "@/components/forums/forum";
import { EventImageSection } from "@/components/events/event";
import { Footer } from "@/components/layout";

const MOCK_CREATORS = [
  {
    name: "Michele Foletti",
    image: "https://picsum.photos/seed/organizer1/400/500",
  },
  {
    name: "Karin Valenzano Rossi",
    image: "https://picsum.photos/seed/organizer2/400/500",
  },
  {
    name: "Barbara Antonelli",
    image: "https://picsum.photos/seed/organizer3/400/500",
  },
];

const MOCK_FORUMS: Record<
  string,
  {
    title: string;
    headline: string;
    description: string;
    heroImage: string;
    chatHref?: string;
    creator?: { name: string; image: string };
  }
> = {
  "lugano-ai-community": {
    title: "Lugano AI Community",
    headline:
      "Discuss AI trends, share projects, and connect with local experts",
    description:
      "A community-driven forum for AI enthusiasts in Lugano. Share your projects, learn from others, and stay updated on the latest developments in artificial intelligence.",
    heroImage: "https://picsum.photos/seed/lugano-ai/1920/1080",
    chatHref: "#chat",
    creator: MOCK_CREATORS[0],
  },
  "blockchain-art": {
    title: "Blockchain & Art",
    headline:
      "Exploring the intersection of blockchain technology and digital art",
    description:
      "Join discussions on how blockchain is transforming the art world, from NFTs to provenance and new forms of digital creation.",
    heroImage: "https://picsum.photos/seed/blockchain-art/1920/1080",
    chatHref: "#chat",
    creator: MOCK_CREATORS[1],
  },
  "ticino-tech-hub": {
    title: "Ticino Tech Hub",
    headline:
      "Monthly discussions for developers and tech enthusiasts",
    description:
      "A forum for tech enthusiasts in the Ticino region. Connect, share knowledge, and discuss the latest trends in development and technology.",
    heroImage: "https://picsum.photos/seed/ticino-tech/1920/1080",
    chatHref: "#chat",
    creator: MOCK_CREATORS[2],
  },
};

interface ForumPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ForumPage({ params }: ForumPageProps) {
  const { slug } = await params;
  const forum = MOCK_FORUMS[slug];

  if (!forum) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col pt-20">
      <ForumHeroSection
        title={forum.title}
        creator={forum.creator}
      />
      <EventImageSection src={forum.heroImage} alt={forum.title} />
      <ForumDetailsSection
        headline={forum.headline}
        description={forum.description}
        chatHref={forum.chatHref}
      />
      <ForumCommentsSection forumId={slug} />
      <Footer />
    </main>
  );
}
