import { notFound } from "next/navigation";
import {
  EventHeroSection,
  EventImageSection,
  EventDetailsSection,
  EventOrganizedBySection,
  type Organizer,
} from "@/components/events/event";
import { Footer } from "@/components/layout";

const MOCK_ORGANIZERS: Organizer[] = [
  {
    name: "Michele Foletti",
    title: "Mayor of Lugano",
    image: "https://picsum.photos/seed/organizer1/400/500",
  },
  {
    name: "Karin Valenzano Rossi",
    title: "City of Lugano and Head of the Department of Security and Urban Spaces",
    image: "https://picsum.photos/seed/organizer2/400/500",
  },
  {
    name: "Barbara Antonelli",
    title: "Director of Competence",
    image: "https://picsum.photos/seed/organizer3/400/500",
  },
];

const MOCK_JOINERS = [
  { image: "https://picsum.photos/seed/joiner1/400/400" },
  { image: "https://picsum.photos/seed/joiner2/400/400" },
  { image: "https://picsum.photos/seed/joiner3/400/400" },
  { image: "https://picsum.photos/seed/joiner4/400/400" },
  { image: "https://picsum.photos/seed/joiner5/400/400" },
];

const MOCK_EVENTS: Record<
  string,
  {
    title: string;
    date: string;
    location: string;
    headline: string;
    description: string;
    heroImage: string;
    signUpHref?: string;
    hasSignedUp?: boolean;
    organizers?: Organizer[];
    joiners?: { image: string }[];
  }
> = {
  "lugano-ai-week-2025": {
    title: "Lugano AI Week 2025",
    date: "01 – 05.12.2025",
    location: "Asilo Ciani, Lugano",
    headline:
      "Thursday, May 8, discover how data and artificial intelligence are transforming Lugano",
    description:
      "A free event open to the public to understand, discuss and imagine the future of the city through the use of data and emerging technologies.",
    heroImage: "https://picsum.photos/seed/lugano-city/1920/1080",
    signUpHref: "#signup",
    hasSignedUp: true,
    organizers: MOCK_ORGANIZERS,
    joiners: MOCK_JOINERS,
  },
  "swissledger-art-edition": {
    title: "SwissLedger - Art Edition. AI and Blockchain at the service of art.",
    date: "04.06.2025",
    location: "Asilo Ciani, Lugano",
    headline:
      "AI and Blockchain at the service of art. Free conference dedicated to innovation for the art world.",
    description:
      "Join us for a free conference exploring how AI and blockchain are reshaping the art world, from authentication to new forms of creation.",
    heroImage: "https://picsum.photos/seed/swissledger/1920/1080",
    signUpHref: "#signup",
    organizers: MOCK_ORGANIZERS,
    joiners: MOCK_JOINERS,
  },
  "ticino-tech-meetup": {
    title: "Ticino Tech Meetup",
    date: "15.03.2025",
    location: "USI Campus, Lugano",
    headline:
      "Monthly meetup for tech enthusiasts in the Ticino region. Connect, learn and share.",
    description:
      "A free monthly meetup bringing together developers, founders and tech enthusiasts to discuss trends, projects and opportunities in Ticino.",
    heroImage: "https://picsum.photos/seed/ticino/1920/1080",
    signUpHref: "#signup",
    organizers: MOCK_ORGANIZERS,
    joiners: MOCK_JOINERS,
  },
};

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = MOCK_EVENTS[slug];

  if (!event) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col pt-20">
      <EventHeroSection
        title={event.title}
        date={event.date}
        location={event.location}
        organizer={event.organizers?.[0]}
        joiners={event.joiners}
      />
      <EventImageSection src={event.heroImage} alt={event.title} />
      <EventDetailsSection
        headline={event.headline}
        description={event.description}
        signUpHref={event.signUpHref}
        hasSignedUp={event.hasSignedUp}
        eventSlug={slug}
        eventTitle={event.title}
        eventImage={event.heroImage}
      />
      {/* {event.organizers && event.organizers.length > 0 && (
        <EventOrganizedBySection organizers={event.organizers} />
      )} */}
      <Footer />
    </main>
  );
}
