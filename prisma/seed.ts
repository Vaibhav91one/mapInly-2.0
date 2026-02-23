import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fallback IDs if no profiles in DB (e.g. fresh project)
const SEED_USER_ID = "fef2cf13-0435-4ae9-9c34-3fed9aa280ba";
const TECH_USER_ID = "c419d77a-2afb-49ab-ab56-e19fb17c0e0b";

// Zod limits: title ≤40, tagline ≤100, shortDescription ≤200, tags length 3, each tag ≤10, comment ≤2000
const TITLE_MAX = 40;
const TAGLINE_MAX = 100;
const SHORT_DESC_MAX = 200;
const TAG_MAX_LEN = 10;
const TAGS_MAX = 3;
const COMMENT_MAX = 2000;

// Hand-written translations for seed (Mode B): es + de for all events, forums, chat lines, and comments (by order)
const EVENT_TRANSLATIONS: Record<
  string,
  { es: { title: string; tagline: string; shortDescription: string }; de: { title: string; tagline: string; shortDescription: string } }
> = {
  "welcome-to-mapinly": {
    es: {
      title: "Bienvenido a Mapinly",
      tagline: "Descubre eventos, chatea en tu idioma, traducciones automáticas.",
      shortDescription:
        "Este evento muestra cómo funciona Mapinly: encuentra eventos, regístrate y chatea con otros. Los mensajes se traducen para que todos participen en su idioma.",
    },
    de: {
      title: "Willkommen bei Mapinly",
      tagline: "Events entdecken, Chat in deiner Sprache, automatische Übersetzungen.",
      shortDescription:
        "Dieses Event zeigt, wie Mapinly funktioniert: Events finden, anmelden und mit anderen chatten. Nachrichten werden übersetzt, damit alle in ihrer Sprache dabei sein können.",
    },
  },
  "lugano-ai-week-2025": {
    es: {
      title: "Lugano AI Week 2025",
      tagline: "El 8 de mayo, descubre cómo los datos y la IA transforman Lugano.",
      shortDescription:
        "Un evento gratuito abierto al público para entender, debatir e imaginar el futuro de la ciudad mediante datos y tecnologías emergentes.",
    },
    de: {
      title: "Lugano AI Week 2025",
      tagline: "Am 8. Mai: wie Daten und KI Lugano transformieren.",
      shortDescription:
        "Eine kostenlose Veranstaltung für die Öffentlichkeit, um die Zukunft der Stadt durch Daten und neue Technologien zu verstehen und zu gestalten.",
    },
  },
  "ticino-tech-meetup": {
    es: {
      title: "Ticino Tech Meetup",
      tagline: "Meetup mensual para entusiastas de la tecnología en Ticino.",
      shortDescription:
        "Un meetup mensual que reúne a desarrolladores, fundadores y entusiastas para hablar de tendencias, proyectos y oportunidades en Ticino.",
    },
    de: {
      title: "Ticino Tech Meetup",
      tagline: "Monatliches Meetup für Tech-Enthusiasten im Tessin.",
      shortDescription:
        "Ein monatliches Meetup für Entwickler, Gründer und Tech-Interessierte zu Trends, Projekten und Chancen im Tessin.",
    },
  },
  "data-science-workshop": {
    es: {
      title: "Taller de Data Science",
      tagline: "Taller práctico de análisis de datos y fundamentos de ML.",
      shortDescription:
        "Introducción práctica a la ciencia de datos: desde limpiar datos hasta construir modelos simples. Trae tu portátil. No se requiere experiencia.",
    },
    de: {
      title: "Data-Science-Workshop",
      tagline: "Praktischer Workshop zu Datenanalyse und Machine Learning.",
      shortDescription:
        "Praktische Einführung in Data Science: von der Datenbereinigung bis zu einfachen Modellen. Laptop mitbringen. Keine Vorkenntnisse nötig.",
    },
  },
  "startup-pitch-night": {
    es: {
      title: "Startup Pitch Night",
      tagline: "Presenta tu startup a inversores y al ecosistema local.",
      shortDescription:
        "Una noche de pitches de startups en fase inicial. Recibe feedback, conoce mentores y conecta con fundadores e inversores.",
    },
    de: {
      title: "Startup Pitch Night",
      tagline: "Präsentiere dein Startup vor Investoren und dem Ökosystem.",
      shortDescription:
        "Ein Abend mit kurzen Pitches von Early-Stage-Startups. Feedback, Mentoren und Vernetzung mit Gründern und Investoren.",
    },
  },
  "open-source-lugano": {
    es: {
      title: "Open Source Lugano",
      tagline: "Meetup mensual de contribuidores open source. Código, revisión y colaboración.",
      shortDescription:
        "Trae tu portátil y tu proyecto open source favorito. Emparejamos, corregimos issues y compartimos trucos. Todos los niveles bienvenidos.",
    },
    de: {
      title: "Open Source Lugano",
      tagline: "Monatliches Meetup für Open-Source-Contributor. Code, Review, Zusammenarbeit.",
      shortDescription:
        "Bring deinen Laptop und dein Lieblings-Open-Source-Projekt mit. Wir arbeiten zu zweit, beheben Issues und tauschen Tipps aus.",
    },
  },
};

const FORUM_TRANSLATIONS: Record<
  string,
  { es: { title: string; tagline: string; shortDescription: string }; de: { title: string; tagline: string; shortDescription: string } }
> = {
  "how-mapinly-works": {
    es: {
      title: "Cómo funciona Mapinly",
      tagline: "Foros de comunidad: debate en tu idioma, hilos traducidos.",
      shortDescription:
        "Este foro explica Mapinly: publica y responde en tu idioma. Los hilos se traducen para que todos puedan seguir la conversación. Cambia el idioma de la app para ver el contenido en otro idioma.",
    },
    de: {
      title: "So funktioniert Mapinly",
      tagline: "Community-Foren: diskutiere in deiner Sprache, übersetzte Threads.",
      shortDescription:
        "Dieses Forum erklärt Mapinly: posten und antworten in deiner Sprache. Threads werden übersetzt, damit alle mitreden können. Wechsle die App-Sprache für andere Locales.",
    },
  },
  "lugano-ai-community": {
    es: {
      title: "Comunidad Lugano AI",
      tagline: "Debate tendencias IA, comparte proyectos, conecta con expertos locales.",
      shortDescription:
        "Un foro impulsado por la comunidad para entusiastas de la IA en Lugano. Comparte proyectos, aprende y mantente al día.",
    },
    de: {
      title: "Lugano AI Community",
      tagline: "Diskutiere KI-Trends, teile Projekte, vernetze dich mit lokalen Experten.",
      shortDescription:
        "Ein community-getriebenes Forum für KI-Enthusiasten in Lugano. Projekte teilen, voneinander lernen, auf dem Laufenden bleiben.",
    },
  },
  "ticino-tech-hub": {
    es: {
      title: "Ticino Tech Hub",
      tagline: "Debates mensuales para desarrolladores y entusiastas tech.",
      shortDescription:
        "Un foro para entusiastas tech en la región del Tesino. Conectar, compartir conocimiento y debatir tendencias en desarrollo y tecnología.",
    },
    de: {
      title: "Ticino Tech Hub",
      tagline: "Monatliche Diskussionen für Entwickler und Tech-Enthusiasten.",
      shortDescription:
        "Ein Forum für Tech-Enthusiasten in der Region Tessin. Vernetzen, Wissen teilen, aktuelle Trends diskutieren.",
    },
  },
  "startup-ideas": {
    es: {
      title: "Ideas Startup",
      tagline: "Comparte y valida ideas de startup con la comunidad.",
      shortDescription:
        "Un espacio para publicar ideas en fase inicial, recibir feedback y encontrar cofundadores o primeros usuarios. Sé constructivo y respetuoso.",
    },
    de: {
      title: "Startup-Ideen",
      tagline: "Teile und validiere Startup-Ideen mit der Community.",
      shortDescription:
        "Ein Ort für frühe Ideen, Feedback und die Suche nach Co-Foundern oder Early Users. Konstruktiv und respektvoll bleiben.",
    },
  },
  "open-source-ch": {
    es: {
      title: "Open Source CH",
      tagline: "Proyectos y contribuciones open source en Suiza.",
      shortDescription:
        "Debate sobre proyectos open source, maintainers y cómo involucrarse. Desde el primer PR hasta el mantenimiento a largo plazo.",
    },
    de: {
      title: "Open Source CH",
      tagline: "Open-Source-Projekte und Beiträge in der Schweiz.",
      shortDescription:
        "Diskutiere Open-Source-Projekte, Maintainer und wie du einsteigen kannst. Vom ersten PR bis zur langfristigen Wartung.",
    },
  },
};

const CHAT_MESSAGE_TRANSLATIONS: Record<string, { es: string; de: string }> = {
  "Hi everyone! Looking forward to this.": { es: "¡Hola a todos! Ganas de que empiece.", de: "Hallo zusammen! Freue mich darauf." },
  "Same here, thanks for organizing.": { es: "Igual yo, gracias por organizar.", de: "Ebenso, danke für die Organisation." },
  "Will the session be recorded?": { es: "¿Se grabará la sesión?", de: "Wird die Session aufgezeichnet?" },
  "Yes, we'll share the link in the chat after.": {
    es: "Sí, compartiremos el enlace en el chat después.",
    de: "Ja, wir teilen den Link danach im Chat.",
  },
  "Perfect, see you there!": { es: "Perfecto, ¡nos vemos allí!", de: "Perfekt, bis dahin!" },
};

// Comment translations in seed order: showcase (3), lugano (3), startup (1)
const COMMENT_TRANSLATIONS_ES = [
  "¡Bienvenido! En Mapinly puedes publicar en tu idioma. Los demás ven tu mensaje traducido al suyo. Cambia el idioma de la app para ver este hilo en otro idioma.",
  "Muy útil. ¿Así que el mismo hilo aparece en varios idiomas automáticamente?",
  "Sí. Los eventos funcionan igual: el chat se traduce para que todos puedan seguir en su idioma.",
  "¡Bienvenido al foro! Recuerda seguir las normas de la comunidad y ser respetuoso.",
  "Gran debate. He seguido los desarrollos de IA en Lugano y es emocionante ver crecer la comunidad.",
  "¡De acuerdo! La comunidad de IA aquí es muy acogedora. Ganas de la próxima quedada.",
  "Si tienes una idea en fase inicial, publícala aquí. Sé constructivo y respetuoso al dar feedback.",
];
const COMMENT_TRANSLATIONS_DE = [
  "Willkommen! In Mapinly kannst du in deiner Sprache posten. Andere sehen deine Nachricht in ihrer Sprache. Wechsle die App-Sprache, um diesen Thread in einer anderen Locale zu sehen.",
  "Sehr hilfreich. Erscheint derselbe Thread also automatisch in mehreren Sprachen?",
  "Ja. Bei Events ist es dasselbe: Der Chat wird übersetzt, damit alle in ihrer Sprache folgen können.",
  "Willkommen im Forum! Bitte halte dich an die Community-Richtlinien und sei respektvoll.",
  "Tolle Diskussion. Ich verfolge die KI-Entwicklungen in Lugano und es ist spannend, wie die Community wächst.",
  "Stimme zu! Die KI-Community hier ist sehr einladend. Freue mich auf das nächste Meetup.",
  "Wenn du eine frühe Idee hast, poste sie hier. Sei konstruktiv und respektvoll bei Feedback.",
];

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

async function getProfileIds(): Promise<string[]> {
  const profiles = await prisma.profile.findMany({ select: { id: true } });
  const ids = profiles.map((p) => p.id);
  if (ids.length === 0) return [SEED_USER_ID, TECH_USER_ID];
  return ids;
}

async function forceReset() {
  await prisma.comment.deleteMany({});
  await prisma.eventRegistration.deleteMany({});
  await prisma.eventMessage.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.forum.deleteMany({});
}

async function main() {
  const force = process.argv.includes("--force");
  await syncProfilesFromAuth();
  const profileIds = await getProfileIds();
  const creatorId = profileIds[0]!;

  if (force) {
    await forceReset();
  }

  const eventCount = await prisma.event.count();
  if (eventCount > 0 && !force) {
    console.log("Events already seeded, skipping. Use --force to re-seed.");
  } else if (eventCount === 0 || force) {
    // Showcase: how Mapinly works — discover events, event chat in your language, auto translations
    const showcaseEvent = await prisma.event.create({
      data: {
        slug: "welcome-to-mapinly",
        title: truncate("Welcome to Mapinly", TITLE_MAX),
        tagline: truncate(
          "Discover events, join event chat in your language, automatic translations.",
          TAGLINE_MAX
        ),
        shortDescription: truncate(
          "This event shows how Mapinly works: find events, register, and chat with other attendees. Messages are translated so everyone can join in their preferred language.",
          SHORT_DESC_MAX
        ),
        date: "01.03.2026",
        timeRange: "2:00 PM - 4:00 PM",
        location: {
          displayName: "Online / Mapinly",
          latitude: 46.0037,
          longitude: 8.9511,
        },
        tags: tags(["mapinly", "intro", "community"]),
        image: "gradient:#6366f1,#8b5cf6,#a855f7,#d946ef",
        imageOverlay: "MAPINLY",
        sourceLocale: "en",
        createdBy: creatorId,
      },
    });

    const sampleEventData = [
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
        createdBy: profileIds[0]!,
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
        createdBy: profileIds[1 % profileIds.length]!,
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
        createdBy: profileIds[2 % profileIds.length]!,
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
        date: "12.05.2026",
        timeRange: "6:30 PM - 9:00 PM",
        location: {
          displayName: "Palazzo dei Congressi, Lugano",
          latitude: 46.002,
          longitude: 8.948,
        },
        tags: tags(["startup", "pitch", "invest"]),
        image: "https://picsum.photos/seed/startup-pitch/1920/1080",
        imageOverlay: null,
        createdBy: profileIds[0]!,
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
        date: "20.01.2026",
        timeRange: "5:00 PM - 8:00 PM",
        location: {
          displayName: "Coworking Lugano Sud",
          latitude: 46.001,
          longitude: 8.949,
        },
        tags: tags(["opensource", "dev", "community"]),
        image: "gradient:#f59e0b,#ef4444,#ec4899,#d946ef",
        imageOverlay: null,
        createdBy: profileIds[1 % profileIds.length]!,
      },
    ];

    await prisma.event.createMany({ data: sampleEventData });
    const events = await prisma.event.findMany({ select: { id: true, slug: true } });

    const welcomeEvent = events.find((e) => e.slug === "welcome-to-mapinly") ?? showcaseEvent;
    const ticinoTech = events.find((e) => e.slug === "ticino-tech-meetup");
    const pitchNight = events.find((e) => e.slug === "startup-pitch-night");

    for (let i = 0; i < Math.min(3, profileIds.length); i++) {
      await prisma.eventRegistration.upsert({
        where: { eventId_userId: { eventId: welcomeEvent.id, userId: profileIds[i]! } },
        create: { eventId: welcomeEvent.id, userId: profileIds[i]! },
        update: {},
      });
    }
    if (ticinoTech) {
      await prisma.eventRegistration.upsert({
        where: { eventId_userId: { eventId: ticinoTech.id, userId: profileIds[0]! } },
        create: { eventId: ticinoTech.id, userId: profileIds[0]! },
        update: {},
      });
    }
    if (pitchNight) {
      await prisma.eventRegistration.upsert({
        where: { eventId_userId: { eventId: pitchNight.id, userId: profileIds[0]! } },
        create: { eventId: pitchNight.id, userId: profileIds[0]! },
        update: {},
      });
      if (profileIds.length > 1) {
        await prisma.eventRegistration.upsert({
          where: { eventId_userId: { eventId: pitchNight.id, userId: profileIds[1]! } },
          create: { eventId: pitchNight.id, userId: profileIds[1]! },
          update: {},
        });
      }
    }
    console.log("Seeded showcase event + 5 sample events with registrations.");
  }

  const forumCount = await prisma.forum.count();
  if (forumCount > 0 && !force) {
    console.log("Forums already seeded, skipping.");
  } else if (forumCount === 0 || force) {
    // Showcase: how Mapinly works — community forums, discuss in your language, translated threads
    await prisma.forum.create({
      data: {
        slug: "how-mapinly-works",
        title: truncate("How Mapinly Works", TITLE_MAX),
        tagline: truncate(
          "Community forums: discuss in your language, see translated threads.",
          TAGLINE_MAX
        ),
        shortDescription: truncate(
          "This forum explains Mapinly: post and reply in your preferred language. Threads are translated so everyone can join the conversation. Try switching the app language to see content in another locale.",
          SHORT_DESC_MAX
        ),
        status: "active",
        tags: tags(["mapinly", "intro", "community"]),
        image: "gradient:#6366f1,#8b5cf6,#a855f7,#d946ef",
        sourceLocale: "en",
        createdBy: creatorId,
      },
    });

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
          createdBy: profileIds[0]!,
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
          createdBy: profileIds[1 % profileIds.length]!,
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
          createdBy: profileIds[0]!,
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
          status: "closed",
          tags: tags(["opensource", "dev", "CH"]),
          image: null,
          createdBy: profileIds[2 % profileIds.length]!,
        },
      ],
    });
    console.log("Seeded showcase forum + 4 sample forums.");
  }

  const commentCount = await prisma.comment.count();
  if (commentCount > 0 && !force) {
    console.log("Comments already seeded, skipping.");
  } else if (commentCount === 0 || force) {
    const showcaseForum = await prisma.forum.findUnique({ where: { slug: "how-mapinly-works" } });
    const luganoForum = await prisma.forum.findUnique({ where: { slug: "lugano-ai-community" } });
    const startupForum = await prisma.forum.findUnique({ where: { slug: "startup-ideas" } });

    if (showcaseForum) {
      const c1 = await prisma.comment.create({
        data: {
          forumId: showcaseForum.id,
          parentId: null,
          authorId: profileIds[0]!,
          content: truncate(
            "Welcome! In Mapinly you can post in your language. Others see your message translated into their preferred language. Try changing the app language to see this thread in another locale.",
            COMMENT_MAX
          ),
          upvotes: 10,
          downvotes: 0,
        },
      });
      await prisma.comment.create({
        data: {
          forumId: showcaseForum.id,
          parentId: c1.id,
          authorId: profileIds[1 % profileIds.length]!,
          content: truncate(
            "That's really helpful. So the same thread appears in multiple languages automatically?",
            COMMENT_MAX
          ),
          upvotes: 5,
          downvotes: 0,
        },
      });
      await prisma.comment.create({
        data: {
          forumId: showcaseForum.id,
          parentId: null,
          authorId: profileIds[0]!,
          content: truncate(
            "Yes. Events work the same way: the event chat is translated so everyone can follow along in their language.",
            COMMENT_MAX
          ),
          upvotes: 8,
          downvotes: 1,
        },
      });
    }

    if (luganoForum) {
      const c1 = await prisma.comment.create({
        data: {
          forumId: luganoForum.id,
          parentId: null,
          authorId: profileIds[0]!,
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
          forumId: luganoForum.id,
          parentId: c1.id,
          authorId: profileIds[1 % profileIds.length]!,
          content: truncate(
            "Great discussion so far. I've been following the AI developments in Lugano and it's exciting to see the community grow.",
            COMMENT_MAX
          ),
          upvotes: 5,
          downvotes: 0,
        },
      });
      await prisma.comment.create({
        data: {
          forumId: luganoForum.id,
          parentId: c2.id,
          authorId: profileIds[2 % profileIds.length]!,
          content: truncate(
            "I agree! The AI community here is really welcoming. Looking forward to the next meetup.",
            COMMENT_MAX
          ),
          upvotes: 3,
          downvotes: 0,
        },
      });
    }

    if (startupForum) {
      await prisma.comment.create({
        data: {
          forumId: startupForum.id,
          parentId: null,
          authorId: profileIds[0]!,
          content: truncate(
            "If you have an early-stage idea, post it here. Be constructive and respectful when giving feedback.",
            COMMENT_MAX
          ),
          upvotes: 7,
          downvotes: 1,
        },
      });
    }

    console.log("Seeded comments on showcase forum + 2 sample forums.");
  }

  const eventMessageCount = await prisma.eventMessage.count();
  if (eventMessageCount > 0 && !force) {
    console.log("Event messages already seeded, skipping.");
  } else if (eventMessageCount === 0 || force) {
    const welcomeEvent = await prisma.event.findUnique({ where: { slug: "welcome-to-mapinly" } });
    const ticinoEvent = await prisma.event.findUnique({ where: { slug: "ticino-tech-meetup" } });
    const pitchEvent = await prisma.event.findUnique({ where: { slug: "startup-pitch-night" } });

    const chatLines = (eventId: string) => [
      { eventId, userId: profileIds[0]!, content: "Hi everyone! Looking forward to this." },
      { eventId, userId: profileIds[1 % profileIds.length]!, content: "Same here, thanks for organizing." },
      { eventId, userId: profileIds[2 % profileIds.length]!, content: "Will the session be recorded?" },
      { eventId, userId: profileIds[0]!, content: "Yes, we'll share the link in the chat after." },
      { eventId, userId: profileIds[1 % profileIds.length]!, content: "Perfect, see you there!" },
    ];

    if (welcomeEvent) {
      for (const msg of chatLines(welcomeEvent.id)) {
        await prisma.eventMessage.create({
          data: { ...msg, sourceLocale: "en" },
        });
      }
    }
    if (ticinoEvent) {
      for (const msg of chatLines(ticinoEvent.id)) {
        await prisma.eventMessage.create({
          data: { ...msg, sourceLocale: "en" },
        });
      }
    }
    if (pitchEvent) {
      for (const msg of chatLines(pitchEvent.id)) {
        await prisma.eventMessage.create({
          data: { ...msg, sourceLocale: "en" },
        });
      }
    }
    console.log("Seeded event messages (chat) for showcase event + 2 sample events.");
  }

  // Translation-seed phase: seed event_translations, forum_translations, comment_translations, event_message_translations (es + de)
  const allEvents = await prisma.event.findMany({ select: { id: true, slug: true } });
  const allForums = await prisma.forum.findMany({ select: { id: true, slug: true } });
  const allComments = await prisma.comment.findMany({ select: { id: true }, orderBy: { createdAt: "asc" } });
  const allMessages = await prisma.eventMessage.findMany({ select: { id: true, content: true } });

  for (const event of allEvents) {
    const tx = EVENT_TRANSLATIONS[event.slug];
    if (!tx) continue;
    for (const locale of ["es", "de"] as const) {
      const t = tx[locale];
      await prisma.eventTranslation.upsert({
        where: { eventId_locale: { eventId: event.id, locale } },
        create: { eventId: event.id, locale, title: t.title, tagline: t.tagline, shortDescription: t.shortDescription },
        update: {},
      });
    }
  }

  for (const forum of allForums) {
    const tx = FORUM_TRANSLATIONS[forum.slug];
    if (!tx) continue;
    for (const locale of ["es", "de"] as const) {
      const t = tx[locale];
      await prisma.forumTranslation.upsert({
        where: { forumId_locale: { forumId: forum.id, locale } },
        create: { forumId: forum.id, locale, title: t.title, tagline: t.tagline, shortDescription: t.shortDescription },
        update: {},
      });
    }
  }

  for (let i = 0; i < allComments.length; i++) {
    const esContent = COMMENT_TRANSLATIONS_ES[i];
    const deContent = COMMENT_TRANSLATIONS_DE[i];
    if (esContent) {
      await prisma.commentTranslation.upsert({
        where: { commentId_locale: { commentId: allComments[i]!.id, locale: "es" } },
        create: { commentId: allComments[i]!.id, locale: "es", content: esContent },
        update: {},
      });
    }
    if (deContent) {
      await prisma.commentTranslation.upsert({
        where: { commentId_locale: { commentId: allComments[i]!.id, locale: "de" } },
        create: { commentId: allComments[i]!.id, locale: "de", content: deContent },
        update: {},
      });
    }
  }

  for (const msg of allMessages) {
    const tx = CHAT_MESSAGE_TRANSLATIONS[msg.content];
    if (!tx) continue;
    await prisma.eventMessageTranslation.upsert({
      where: { messageId_locale: { messageId: msg.id, locale: "es" } },
      create: { messageId: msg.id, locale: "es", content: tx.es },
      update: {},
    });
    await prisma.eventMessageTranslation.upsert({
      where: { messageId_locale: { messageId: msg.id, locale: "de" } },
      create: { messageId: msg.id, locale: "de", content: tx.de },
      update: {},
    });
  }

  if (allEvents.length > 0 || allForums.length > 0) {
    console.log("Seeded translations (es, de) for events, forums, comments, and event messages.");
  }

  // Mode A: when API key is set, fill extra locales (fr, it, pt, zh) for events and forums via Lingo API
  const extraLocales = ["fr", "it", "pt", "zh"] as const;
  const apiKey = process.env.LINGODOTDEV_API_KEY;
  if (apiKey && allEvents.length > 0) {
    const { LingoDotDevEngine } = await import("lingo.dev/sdk");
    const lingo = new LingoDotDevEngine({ apiKey });
    const translate = async (texts: string[], targetLocale: string): Promise<string[]> => {
      return Promise.all(
        texts.map((text) =>
          lingo.localizeText(text, { sourceLocale: "en", targetLocale })
        )
      );
    };
    const eventsWithContent = await prisma.event.findMany({
      select: { id: true, title: true, tagline: true, shortDescription: true },
    });
    for (const locale of extraLocales) {
      const titles = await translate(eventsWithContent.map((e) => e.title), locale);
      const taglines = await translate(eventsWithContent.map((e) => e.tagline), locale);
      const shortDescriptions = await translate(
        eventsWithContent.map((e) => e.shortDescription),
        locale
      );
      for (let i = 0; i < eventsWithContent.length; i++) {
        await prisma.eventTranslation.upsert({
          where: { eventId_locale: { eventId: eventsWithContent[i]!.id, locale } },
          create: {
            eventId: eventsWithContent[i]!.id,
            locale,
            title: titles[i]!,
            tagline: taglines[i]!,
            shortDescription: shortDescriptions[i]!,
          },
          update: {},
        });
      }
    }
    console.log("Seeded event translations for fr, it, pt, zh (API).");
  }
  if (apiKey && allForums.length > 0) {
    const { LingoDotDevEngine } = await import("lingo.dev/sdk");
    const lingo = new LingoDotDevEngine({ apiKey });
    const translate = async (texts: string[], targetLocale: string): Promise<string[]> => {
      return Promise.all(
        texts.map((text) =>
          lingo.localizeText(text, { sourceLocale: "en", targetLocale })
        )
      );
    };
    const forumsWithContent = await prisma.forum.findMany({
      select: { id: true, title: true, tagline: true, shortDescription: true },
    });
    for (const locale of extraLocales) {
      const titles = await translate(forumsWithContent.map((f) => f.title), locale);
      const taglines = await translate(forumsWithContent.map((f) => f.tagline), locale);
      const shortDescriptions = await translate(
        forumsWithContent.map((f) => f.shortDescription),
        locale
      );
      for (let i = 0; i < forumsWithContent.length; i++) {
        await prisma.forumTranslation.upsert({
          where: { forumId_locale: { forumId: forumsWithContent[i]!.id, locale } },
          create: {
            forumId: forumsWithContent[i]!.id,
            locale,
            title: titles[i]!,
            tagline: taglines[i]!,
            shortDescription: shortDescriptions[i]!,
          },
          update: {},
        });
      }
    }
    console.log("Seeded forum translations for fr, it, pt, zh (API).");
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
