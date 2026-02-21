import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Map old synthetic IDs to real auth user IDs
const SEED_USER_ID = "fef2cf13-0435-4ae9-9c34-3fed9aa280ba";
const TECH_USER_ID = "c419d77a-2afb-49ab-ab56-e19fb17c0e0b";

// Zod limits: title ≤40, tagline ≤100, shortDescription ≤200, tags length 3, each tag ≤10, comment ≤2000
const TITLE_MAX = 40;
const TAGLINE_MAX = 100;
const SHORT_DESC_MAX = 200;
const TAG_MAX_LEN = 10;
const TAGS_MAX = 3;
const COMMENT_MAX = 2000;

function truncate(s: string, max: number) {
  return s.length <= max ? s : s.slice(0, max);
}

function tags(arr: string[]) {
  return arr.slice(0, TAGS_MAX).map((t) => truncate(t, TAG_MAX_LEN));
}

async function syncProfilesFromAuth() {
  await prisma.$executeRaw`
    INSERT INTO public.profiles (id, display_name, avatar_url, created_at, updated_at)
    SELECT 
      u.id,
      COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', u.email, 'User'),
      u.raw_user_meta_data->>'avatar_url',
      now(),
      now()
    FROM auth.users u
    ON CONFLICT (id) DO UPDATE SET
      display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
      avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
      updated_at = now()
  `;
}

async function forceReset() {
  await prisma.comment.deleteMany({});
  await prisma.eventRegistration.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.forum.deleteMany({});
}

async function main() {
  const force = process.argv.includes("--force");
  await syncProfilesFromAuth();

  if (force) {
    await forceReset();
  }

  const eventCount = await prisma.event.count();
  if (eventCount > 0 && !force) {
    console.log("Events already seeded, skipping. Use --force to re-seed.");
  } else if (eventCount === 0 || force) {
    const eventData = [
      {
        slug: "lugano-ai-week-2025",
        title: truncate("Lugano AI Week 2025", TITLE_MAX),
        tagline: truncate(
          "Thursday, May 8, discover how data and AI are transforming Lugano",
          TAGLINE_MAX
        ),
        shortDescription: truncate(
          "A free event open to the public to understand, discuss and imagine the future of the city through the use of data and emerging technologies.",
          SHORT_DESC_MAX
        ),
        date: "01 – 05.12.2025",
        timeRange: "6:00 PM - 8:00 PM",
        location: {
          displayName: "Asilo Ciani, Lugano",
          latitude: 46.0037,
          longitude: 8.9511,
        },
        tags: tags(["AI", "community", "formazione"]),
        image: "https://picsum.photos/seed/lugano-city/1920/1080",
        imageOverlay: "AI WEEK",
        createdBy: SEED_USER_ID,
      },
      {
        slug: "swissledger-art-edition",
        title: truncate("SwissLedger - Art Edition. AI & Blockchain", TITLE_MAX),
        tagline: truncate(
          "AI and Blockchain at the service of art. Free conference for the art world.",
          TAGLINE_MAX
        ),
        shortDescription: truncate(
          "Join us for a free conference exploring how AI and blockchain are reshaping the art world, from authentication to new forms of creation.",
          SHORT_DESC_MAX
        ),
        date: "04.06.2025",
        timeRange: "10:00 AM - 2:00 PM",
        location: {
          displayName: "Asilo Ciani, Lugano",
          latitude: 46.0037,
          longitude: 8.9511,
        },
        tags: tags(["art", "blockchain", "network"]),
        image: "https://picsum.photos/seed/swissledger/1920/1080",
        imageOverlay: null,
        createdBy: SEED_USER_ID,
      },
      {
        slug: "ticino-tech-meetup",
        title: truncate("Ticino Tech Meetup", TITLE_MAX),
        tagline: truncate(
          "Monthly meetup for tech enthusiasts in Ticino. Connect, learn and share.",
          TAGLINE_MAX
        ),
        shortDescription: truncate(
          "A free monthly meetup bringing together developers, founders and tech enthusiasts to discuss trends, projects and opportunities in Ticino.",
          SHORT_DESC_MAX
        ),
        date: "15.03.2025",
        timeRange: "6:00 PM - 9:00 PM",
        location: {
          displayName: "USI Campus, Lugano",
          latitude: 46.0055,
          longitude: 8.9524,
        },
        tags: tags(["tech", "community", "innovation"]),
        image: "gradient:#6366f1,#8b5cf6,#a855f7,#d946ef",
        imageOverlay: null,
        createdBy: SEED_USER_ID,
      },
      {
        slug: "data-science-workshop",
        title: truncate("Data Science Workshop", TITLE_MAX),
        tagline: truncate(
          "Hands-on workshop on data analysis and machine learning basics.",
          TAGLINE_MAX
        ),
        shortDescription: truncate(
          "A practical introduction to data science: from cleaning data to building simple models. Bring your laptop. No prior experience required.",
          SHORT_DESC_MAX
        ),
        date: "22.04.2025",
        timeRange: "2:00 PM - 5:00 PM",
        location: {
          displayName: "Lugano Innovation Hub",
          latitude: 46.004,
          longitude: 8.95,
        },
        tags: tags(["data", "workshop", "ML"]),
        image: "gradient:#0ea5e9,#06b6d4,#14b8a6,#10b981",
        imageOverlay: null,
        createdBy: TECH_USER_ID,
      },
      {
        slug: "startup-pitch-night",
        title: truncate("Startup Pitch Night", TITLE_MAX),
        tagline: truncate(
          "Pitch your startup to investors and the local ecosystem.",
          TAGLINE_MAX
        ),
        shortDescription: truncate(
          "An evening of short pitches from early-stage startups. Get feedback, meet mentors, and connect with other founders and investors.",
          SHORT_DESC_MAX
        ),
        date: "10.05.2025",
        timeRange: "6:30 PM - 9:00 PM",
        location: {
          displayName: "Palazzo dei Congressi, Lugano",
          latitude: 46.002,
          longitude: 8.948,
        },
        tags: tags(["startup", "pitch", "invest"]),
        image: "https://picsum.photos/seed/startup-pitch/1920/1080",
        imageOverlay: null,
        createdBy: TECH_USER_ID,
      },
      {
        slug: "open-source-lugano",
        title: truncate("Open Source Lugano", TITLE_MAX),
        tagline: truncate(
          "Monthly open source contributors meetup. Code, review, and collaborate.",
          TAGLINE_MAX
        ),
        shortDescription: truncate(
          "Bring your laptop and your favorite open source project. We pair up, fix issues, and share tips. All skill levels welcome.",
          SHORT_DESC_MAX
        ),
        date: "20.06.2025",
        timeRange: "5:00 PM - 8:00 PM",
        location: {
          displayName: "Coworking Lugano Sud",
          latitude: 46.001,
          longitude: 8.949,
        },
        tags: tags(["opensource", "dev", "community"]),
        image: "gradient:#f59e0b,#ef4444,#ec4899,#d946ef",
        imageOverlay: null,
        createdBy: SEED_USER_ID,
      },
    ];

    await prisma.event.createMany({ data: eventData });
    const events = await prisma.event.findMany({ select: { id: true, slug: true } });

    // Registrations: multiple users on some events
    const luganoAi = events.find((e) => e.slug === "lugano-ai-week-2025");
    const ticinoTech = events.find((e) => e.slug === "ticino-tech-meetup");
    const dataWorkshop = events.find((e) => e.slug === "data-science-workshop");
    const pitchNight = events.find((e) => e.slug === "startup-pitch-night");

    if (luganoAi) {
      await prisma.eventRegistration.upsert({
        where: { eventId_userId: { eventId: luganoAi.id, userId: SEED_USER_ID } },
        create: { eventId: luganoAi.id, userId: SEED_USER_ID },
        update: {},
      });
      await prisma.eventRegistration.upsert({
        where: { eventId_userId: { eventId: luganoAi.id, userId: TECH_USER_ID } },
        create: { eventId: luganoAi.id, userId: TECH_USER_ID },
        update: {},
      });
    }
    if (ticinoTech) {
      await prisma.eventRegistration.upsert({
        where: { eventId_userId: { eventId: ticinoTech.id, userId: SEED_USER_ID } },
        create: { eventId: ticinoTech.id, userId: SEED_USER_ID },
        update: {},
      });
    }
    if (dataWorkshop) {
      await prisma.eventRegistration.upsert({
        where: { eventId_userId: { eventId: dataWorkshop.id, userId: TECH_USER_ID } },
        create: { eventId: dataWorkshop.id, userId: TECH_USER_ID },
        update: {},
      });
    }
    if (pitchNight) {
      await prisma.eventRegistration.upsert({
        where: { eventId_userId: { eventId: pitchNight.id, userId: SEED_USER_ID } },
        create: { eventId: pitchNight.id, userId: SEED_USER_ID },
        update: {},
      });
    }
    console.log("Seeded 6 events with registrations.");
  }

  const forumCount = await prisma.forum.count();
  if (forumCount > 0 && !force) {
    console.log("Forums already seeded, skipping.");
  } else if (forumCount === 0 || force) {
    await prisma.forum.createMany({
      data: [
        {
          slug: "lugano-ai-community",
          title: truncate("Lugano AI Community", TITLE_MAX),
          tagline: truncate(
            "Discuss AI trends, share projects, and connect with local experts",
            TAGLINE_MAX
          ),
          shortDescription: truncate(
            "A community-driven forum for AI enthusiasts in Lugano. Share your projects, learn from others, and stay updated on the latest developments in artificial intelligence.",
            SHORT_DESC_MAX
          ),
          status: "active",
          tags: tags(["AI", "community", "innovation"]),
          image: "https://picsum.photos/seed/lugano-ai/1920/1080",
          createdBy: SEED_USER_ID,
        },
        {
          slug: "blockchain-art",
          title: truncate("Blockchain & Art", TITLE_MAX),
          tagline: truncate(
            "Exploring blockchain technology and digital art",
            TAGLINE_MAX
          ),
          shortDescription: truncate(
            "Join discussions on how blockchain is transforming the art world, from NFTs to provenance and new forms of digital creation.",
            SHORT_DESC_MAX
          ),
          status: "active",
          tags: tags(["blockchain", "art", "NFT"]),
          image: "https://picsum.photos/seed/blockchain-art/1920/1080",
          createdBy: SEED_USER_ID,
        },
        {
          slug: "ticino-tech-hub",
          title: truncate("Ticino Tech Hub", TITLE_MAX),
          tagline: truncate(
            "Monthly discussions for developers and tech enthusiasts",
            TAGLINE_MAX
          ),
          shortDescription: truncate(
            "A forum for tech enthusiasts in the Ticino region. Connect, share knowledge, and discuss the latest trends in development and technology.",
            SHORT_DESC_MAX
          ),
          status: "closed",
          tags: tags(["tech", "meetup", "dev"]),
          image: "https://picsum.photos/seed/ticino-tech/1920/1080",
          createdBy: SEED_USER_ID,
        },
        {
          slug: "startup-ideas",
          title: truncate("Startup Ideas", TITLE_MAX),
          tagline: truncate(
            "Share and validate startup ideas with the community",
            TAGLINE_MAX
          ),
          shortDescription: truncate(
            "A place to post early-stage ideas, get feedback, and find co-founders or early users. Be constructive and respectful.",
            SHORT_DESC_MAX
          ),
          status: "active",
          tags: tags(["startup", "ideas", "feedback"]),
          image: "gradient:#6366f1,#8b5cf6,#a855f7,#d946ef",
          createdBy: TECH_USER_ID,
        },
        {
          slug: "open-source-ch",
          title: truncate("Open Source CH", TITLE_MAX),
          tagline: truncate(
            "Open source projects and contributions in Switzerland",
            TAGLINE_MAX
          ),
          shortDescription: truncate(
            "Discuss open source projects, maintainers, and how to get involved. From first PR to long-term maintenance.",
            SHORT_DESC_MAX
          ),
          status: "active",
          tags: tags(["opensource", "dev", "CH"]),
          image: null,
          createdBy: TECH_USER_ID,
        },
      ],
    });
    console.log("Seeded 5 forums.");
  }

  const commentCount = await prisma.comment.count();
  if (commentCount > 0 && !force) {
    console.log("Comments already seeded, skipping.");
  } else if (commentCount === 0 || force) {
    const forum = await prisma.forum.findUnique({ where: { slug: "lugano-ai-community" } });
    if (forum) {
      const c1 = await prisma.comment.create({
        data: {
          forumId: forum.id,
          parentId: null,
          authorId: SEED_USER_ID,
          content: truncate(
            "Welcome to the forum! Please remember to follow our community guidelines and be respectful in your discussions.",
            COMMENT_MAX
          ),
          upvotes: 13,
          downvotes: 3,
        },
      });
      const c2 = await prisma.comment.create({
        data: {
          forumId: forum.id,
          parentId: null,
          authorId: TECH_USER_ID,
          content: truncate(
            "If you have any questions or concerns, feel free to contact the moderators. We're here to help!",
            COMMENT_MAX
          ),
          upvotes: 12,
          downvotes: 2,
        },
      });
      const c3 = await prisma.comment.create({
        data: {
          forumId: forum.id,
          parentId: c1.id,
          authorId: SEED_USER_ID,
          content: truncate(
            "Great discussion so far. I've been following the AI developments in Lugano and it's exciting to see the community grow.",
            COMMENT_MAX
          ),
          upvotes: 5,
          downvotes: 0,
        },
      });
      const c4 = await prisma.comment.create({
        data: {
          forumId: forum.id,
          parentId: c3.id,
          authorId: TECH_USER_ID,
          content: truncate(
            "I agree! The AI community here is really welcoming. Looking forward to the next meetup.",
            COMMENT_MAX
          ),
          upvotes: 3,
          downvotes: 0,
        },
      });
      await prisma.comment.create({
        data: {
          forumId: forum.id,
          parentId: c4.id,
          authorId: SEED_USER_ID,
          content: truncate(
            "Same here. Let's keep the momentum going with more events and threads.",
            COMMENT_MAX
          ),
          upvotes: 2,
          downvotes: 1,
        },
      });
      // Extra top-level and nested on c2
      await prisma.comment.create({
        data: {
          forumId: forum.id,
          parentId: c2.id,
          authorId: SEED_USER_ID,
          content: truncate(
            "Thanks for the quick response. I'll reach out if I need anything.",
            COMMENT_MAX
          ),
          upvotes: 1,
          downvotes: 0,
        },
      });
      console.log("Seeded comments (nested 3+ levels, multiple authors).");
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
