# Abdirahman Digital

A personal digital platform and content management system — statements, announcements,
articles, notes, thoughts, portfolio, services, and a secure admin dashboard to manage it all.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS + Prisma + PostgreSQL + NextAuth**.

---

## 1. What's included

- **Public site**: Home, About, Statements, Announcements, Articles, Notes, Thoughts,
  Portfolio, Services, Contact, global Search, Privacy Policy — all rendered server-side
  from the database, with SEO metadata, sitemap.xml, and robots.txt.
- **Admin dashboard** (`/admin`): protected by NextAuth credentials login, with an overview,
  full CRUD for every content type, a rich text editor (Tiptap), category/tag management,
  a contact-message inbox, and an editable About-page content panel — all backed by real
  API routes and a real PostgreSQL database via Prisma.
- **Security**: bcrypt password hashing, JWT sessions in secure httpOnly cookies, brute-force
  login rate limiting, server-side authorization on every admin API route, Zod input
  validation, CSP + security headers, honeypot + rate limiting on the public contact form,
  and an audit log of admin actions.
- **Design system**: light/dark mode with system-preference detection, glassmorphism,
  Framer Motion entrance animations, reduced-motion support, and a mobile-first responsive
  layout built with Tailwind + a small shadcn-style component set.

### Reference pattern

**Statements** and **Articles** are fully wired end-to-end (public pages, admin list, admin
create/edit forms, API routes with validation + audit logging) — use them as the template.
Announcements, Notes, Thoughts, and Portfolio follow the identical pattern and are already
functional; Services, Skills, Categories, and Tags use a simpler single-page list+form UI
since their fields are simpler.

---

## 2. Local setup

### Prerequisites
- Node.js 18+
- A PostgreSQL database (local install, or a free hosted instance from
  [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app))

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env
# Edit .env and set:
#   DATABASE_URL      — your PostgreSQL connection string
#   NEXTAUTH_SECRET    — generate with: openssl rand -base64 32
#   ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME — your login, used by the seed script

# 3. Create the database schema
npm run db:migrate

# 4. Seed sample content + your admin account
npm run db:seed

# 5. Run the development server
npm run dev
```

Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin/login`
to sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `.env`.

**Change your seeded password immediately** — either via the database directly or by
extending the seed script — since it starts as plain text you chose in `.env`.

---

## 3. Media uploads

The starter stores uploaded images on local disk (`public/uploads`) and optimizes them with
`sharp` on upload. This works for local development and single-instance deployments, but
**local disk storage does not persist across deployments on platforms like Vercel**.

For production, swap the implementation in `src/app/api/media/route.ts` for an object storage
provider:
- **Vercel Blob** (simplest if deploying to Vercel)
- **Cloudflare R2** or **AWS S3** (works anywhere)

The upload route already validates file type (JPG/PNG/WEBP/GIF), enforces an 8MB size limit,
and returns a `Media` database record — only the storage destination needs to change.

---

## 4. Deployment (Vercel + hosted Postgres)

1. Push this project to a GitHub repository.
2. Create a Postgres database on Neon, Supabase, or Railway; copy its connection string.
3. Import the repository into [Vercel](https://vercel.com/new).
4. In Vercel → Project Settings → Environment Variables, add everything from `.env.example`:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET` (generate a new one for production)
   - `NEXTAUTH_URL` → your production URL, e.g. `https://abdirahmandigital.com`
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`
   - `NEXT_PUBLIC_SITE_URL` → your production URL
   - `NEXT_PUBLIC_SITE_NAME` → `Abdirahman Digital`
5. Deploy. Vercel runs `npm install` (which triggers `prisma generate` via `postinstall`) and
   `npm run build` automatically.
6. Run the production migration and seed once, from your local machine, pointed at the
   production `DATABASE_URL`:
   ```bash
   DATABASE_URL="your-production-url" npm run db:deploy
   DATABASE_URL="your-production-url" npm run db:seed
   ```
7. **Connect your domain**: Vercel → Project Settings → Domains → add
   `abdirahmandigital.com` (or whatever you choose) and follow the DNS instructions. Vercel
   provisions HTTPS automatically.
8. Swap the media upload route to object storage before relying on uploads in production
   (see section 3).

---

## 5. Project structure

```
prisma/
  schema.prisma        # Full data model (see section 6)
  seed.ts               # Sample content + admin account
src/
  app/
    (public pages)       # Home, About, Statements, Articles, Notes, Thoughts,
                          # Portfolio, Services, Contact, Search, Privacy
    admin/
      login/              # Unprotected login page
      (dashboard)/        # Sidebar-wrapped, auth-protected admin screens
    api/                  # REST-style API routes (Next.js Route Handlers)
    sitemap.ts, robots.ts, not-found.tsx, error.tsx
  components/
    ui/                   # Button, Card — small shadcn-style primitives
    admin/                # Sidebar, rich text editor, forms, status badges
    (shared)               # Navbar, Footer, Hero, ContactForm, ShareButtons
  lib/
    prisma.ts             # Prisma client singleton
    auth.ts                # NextAuth configuration
    admin-auth.ts          # requireAdminSession + audit logging helper
    rate-limit.ts           # Login + contact-form rate limiting
    validations.ts          # Zod schemas for every content type
    data.ts, utils.ts
  middleware.ts             # Protects /admin/* (except /admin/login)
```

---

## 6. Database schema

Every content type (Statement, Announcement, Article, Note, Thought, PortfolioProject,
Service, Skill) plus User, Session, LoginAttempt, AuditLog, SiteSetting, Category, Tag,
Media, ContactMessage, and PageView is modeled in `prisma/schema.prisma`, with foreign
keys, unique constraints, and indexes on the columns used for public queries (status +
publish date) and lookups (slug). Run `npm run db:studio` any time to browse the database
visually.

---

## 7. What to build next

- Wire an email provider (Resend, AWS SES) into `src/app/api/contact/route.ts` to get
  notified of new messages instead of only checking the admin inbox.
- Add object storage for media (see section 3) before you rely on production uploads.
- If traffic grows, add Redis-backed rate limiting in place of the in-memory limiter in
  `src/lib/rate-limit.ts` (the in-memory version resets on every deploy/restart).
- The PageView model is in the schema but not yet wired to a tracking call — add a
  lightweight `fetch('/api/pageview')` call in a client component if you want the
  Analytics section the spec described.
