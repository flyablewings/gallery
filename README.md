# Model Europa Portfolio & CMS

A modern portfolio and gallery application with an integrated CMS backend. Built with Next.js, Prisma, and PostgreSQL, designed for professional deployment with Docker.

---

## Features

- **Public portfolio** — Responsive gallery with project pages and image viewers
- **Admin dashboard** — Full CRUD for projects at `/admin` with JWT-protected login
- **Image management** — Multiple uploads per project, primary image selection, reordering (JPG, PNG, GIF, max 5MB)
- **Database** — PostgreSQL with Prisma ORM; schema and seed via CLI or Docker
- **Docker** — One-command run with `docker-compose`; persistent DB and upload volumes
- **Accessibility & performance** — Next/Image optimization, Framer Motion animations, SEO meta tags

---

## Tech Stack

| Layer        | Technology        |
| ------------ | ----------------- |
| Framework    | Next.js 14        |
| Database     | PostgreSQL + Prisma |
| Styling      | Tailwind CSS      |
| Animations   | Framer Motion     |
| Auth         | JWT (admin)       |
| Deployment   | Docker & Docker Compose |

---

## Prerequisites

- **Node.js** 18+ (for local development)
- **Docker & Docker Compose** (for containerized run)
- **PostgreSQL** (only if running app locally without Docker)

---

## Quick Start

### Option 1: Docker (recommended)

```bash
# Clone and enter project
cd gallery

# Start app and database
docker-compose up -d --build
```

- App: **http://localhost:3003**
- First-time DB setup (run once):

  ```bash
  docker-compose exec app npx prisma db push
  docker-compose exec app npx prisma db seed
  ```

### Option 2: Local development

1. **Database** — Start PostgreSQL (or only the DB container):

   ```bash
   docker-compose up -d db
   ```

2. **Environment** — Copy env and set values:

   ```bash
   cp env.example .env
   ```

   Required in `.env`:

   - `DATABASE_URL` — e.g. `postgresql://user:password@localhost:6432/portfolio_cms?schema=public`
   - `JWT_SECRET` — Strong secret for admin JWT

3. **Install and run**:

   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   npm run dev
   ```

   App: **http://localhost:3000**

---

## Environment Variables

| Variable       | Description                          | Example |
| -------------- | ------------------------------------ | ------- |
| `DATABASE_URL` | PostgreSQL connection string         | `postgresql://user:password@host:port/db?schema=public` |
| `JWT_SECRET`   | Secret for signing admin JWT tokens  | Long random string |

See `env.example` for a template.

---

## Admin CMS

- **URL:** `/admin` (after starting the app)
- **Actions:** Create, read, update, and delete projects; upload and reorder images; set primary image per project
- **Storage:** Images in `public/uploads` (or Docker volume `uploads_data`)
- **Persistence:** Data in PostgreSQL (volume `postgres_data` in Docker)

---

## Customization

- **Accent color:** `tailwind.config.ts` → `theme.extend.colors.accent`
- **Fonts:** `src/app/layout.tsx` (default: Inter)

---

## Scripts

| Command              | Description                |
| -------------------- | -------------------------- |
| `npm run dev`        | Start Next.js dev server   |
| `npm run build`      | Production build           |
| `npm run start`      | Start production server    |
| `npm run lint`       | Run ESLint                 |
| `npm run db:seed`    | Run Prisma seed (via config) |

---

## Project structure (high level)

```
gallery/
├── prisma/           # Schema and seeds
├── src/
│   ├── app/          # Next.js app router (pages, API routes)
│   ├── components/   # React components
│   └── lib/          # Prisma client, auth middleware
├── public/           # Static assets and uploads
├── docker-compose.yml
├── Dockerfile
└── env.example
```

---

## License

Private project. All rights reserved.
