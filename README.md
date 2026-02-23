# Mapinly

> **The only language you need is your own.**

Mapinly is a community platform for discovering events and joining discussions — without the language barrier. Every piece of content on Mapinly is automatically translated so that users can participate fully in their own language, whether they're reading an event description, chatting with attendees, or commenting in a forum.

---

## Demo

<!-- Add your YouTube demo link below -->
> 🎬 **Video Demo:**  - [Watch on YouTube](https://youtu.be/wGdOCh-qTPk)

---

## What Mapinly Does

- **Events** — Browse, create, and register for local or global events. Each event has a title, description, location (with an interactive map), date & time, tags, and a live chat room for registered attendees.
- **Forums** — Create community discussion threads. Users can comment, reply, and upvote or downvote contributions. Forums can be marked open or closed.
- **Automatic Translation** — All dynamic content (event titles, descriptions, forum posts, comments, chat messages) is stored with its source locale and translated on-the-fly into the viewer's preferred language using the Lingo.dev AI SDK. The UI itself is statically localised via i18next.
- **7 Supported Languages** — English, Spanish, German, French, Italian, Portuguese, and Chinese.
- **Interactive Map** — Events are plotted on a MapLibre GL map. Users can get turn-by-turn routing from their current location to any event via the OSRM routing API.
- **Dashboard** — A personal space to manage the events you've organised, the forums you've created, and your upcoming registrations — all with a calendar view.
- **Authentication** — Powered by Supabase Auth (email / OAuth). Protected routes are handled by Next.js middleware.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, React 19) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| Animations | [Motion (Framer Motion)](https://motion.dev) + [@paper-design/shaders-react](https://github.com/paper-design/shaders) |
| Database | [PostgreSQL](https://www.postgresql.org) via [Prisma ORM](https://www.prisma.io) |
| Auth & Backend | [Supabase](https://supabase.com) (Auth, Row-Level Security) |
| Translations (UI) | [i18next](https://www.i18next.com) + [react-i18next](https://react.i18next.com) |
| Translations (Content) | [Lingo.dev SDK](https://lingo.dev) (AI-powered, runtime) |
| Maps | [mapcn](https://mapcn.vercel.app/) |
| Routing | [OSRM](http://project-osrm.org) (open-source routing engine) |
| Forms | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| State | [Zustand](https://zustand-demo.pmnd.rs) |
| Language | TypeScript |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Lingo.dev](https://lingo.dev) account & API key (for AI content translation)

### 1. Clone the repository

```bash
git clone https://github.com/Vaibhav91one/mapinly.git
cd mapinly
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file at the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database (Prisma)
DATABASE_URL=your_postgres_connection_string
DATABASE_URL_DIRECT=your_direct_postgres_connection_string

# Lingo.dev (AI content translations)
LINGODOTDEV_API_KEY=your_lingo_api_key

# App URL (used for SEO / Open Graph)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set up the database

```bash
# Push the Prisma schema to your database
npx prisma db push

# (Optional) Seed with sample data
npm run db:seed
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
mapinly/
├── app/                        # Next.js App Router pages & API routes
│   ├── page.tsx                # Home page
│   ├── events/                 # Events listing + individual event pages
│   ├── forums/                 # Forums listing + individual forum pages
│   ├── dashboard/              # User dashboard
│   ├── auth/                   # Authentication pages
│   └── api/                    # API route handlers
├── components/
│   ├── home/                   # Landing page sections
│   ├── events/                 # Event list, cards, hero, chat
│   ├── forums/                 # Forum list, cards, comments
│   ├── dashboard/              # Dashboard sections & carousels
│   ├── layout/                 # Navbar & footer
│   ├── forms/                  # Reusable form components
│   ├── shared/                 # Shared UI (MaskText animation, etc.)
│   ├── locale/                 # Language switcher & locale dialogs
│   ├── map/                    # Map & route-planning components
│   └── ui/                     # shadcn/ui primitives
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Database seeder
├── lib/
│   ├── i18n/                   # i18next setup, keys, and locale utilities
│   ├── events/                 # Server-side event data helpers
│   └── forums/                 # Server-side forum data helpers
└── public/
    └── svgs/                   # SVG assets (Asterisk logo, etc.)
```

---

## Key Features in Depth

### Language-First Design

When a new user visits Mapinly, they're prompted to choose their preferred language. From that point on, every piece of content — event titles, forum discussions, chat messages, comment threads, and tags — is served in their chosen language. The source language of each post is stored in the database; translations are generated and cached per locale.

### Live Event Chat

Registered attendees of an event have access to a real-time chat room scoped to that event. Messages are stored with their source locale and translated for each reader automatically.

### Interactive Maps & Routing

Events include a precise geographic location. The events page includes a full-screen map view with markers for all events. On an individual event page, users can request a walking or driving route from their current location to the event, with live duration and distance shown via the OSRM API.

### Animated UI

The landing page features a scroll-driven LiquidMetal shader animation, a velocity-scroll marquee section, and a staggered mask-text reveal effect on all major headings throughout the app.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Generate Prisma client and build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run db:seed` | Seed the database with sample data |

---

## Deployment

This project is optimised for deployment on [Vercel](https://vercel.com).

1. Connect your GitHub repository to a new Vercel project.
2. Add all environment variables from the `.env` template above in the Vercel project settings.
3. Set `NEXT_PUBLIC_APP_URL` to your production domain (e.g. `https://mapinly.vercel.app`).
4. Deploy — Vercel will run `npm run build` which includes `prisma generate` automatically.

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## Author

**Vaibhav Tomar**

- GitHub: [@Vaibhav91one](https://github.com/Vaibhav91one)
- Twitter: [@VrsatileVaibhav](https://twitter.com/VrsatileVaibhav)
- LinkedIn: [vaibhav-tomar-a6b2b6255](https://www.linkedin.com/in/vaibhav-tomar-a6b2b6255/)
- Portfolio: [portfolio-v2-rouge-ten-80.vercel.app](https://portfolio-v2-rouge-ten-80.vercel.app/)

---

## License

This project is open source under the [MIT License](LICENSE).
