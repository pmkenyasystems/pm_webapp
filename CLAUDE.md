# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

People's Renaissance Movement (PRM) — a full-stack Next.js 14 platform for a Kenyan political party. Combines a public-facing website with an admin dashboard and member portal. Key domains: content management, membership, donations (M-Pesa + Stripe), elections & aspirants, volunteers, and party geography (47 counties → constituencies → wards).

## Commands

```bash
# Development
npm run dev               # Start dev server
npm run build             # prisma generate + next build
npm run lint              # ESLint

# Database
npm run db:generate       # Generate Prisma client
npm run db:push           # Push schema changes (no migrations)
npm run db:migrate        # Run migrations (dev)
npm run db:studio         # Open Prisma Studio

# Initial setup (run once)
npm run init:admin        # Create default admin user

# Geographic data seeding
npm run seed:counties
npm run seed:constituencies
npm run seed:wards

# Member imports (bulk Excel)
npm run import:members-xlsx
```

No test suite is configured. Use `npm run lint` for static analysis.

## Architecture

### Stack
- **Next.js 14** (App Router) + TypeScript
- **PostgreSQL** via **Prisma ORM** (schema at `prisma/schema.prisma`)
- **NextAuth.js** (JWT strategy, credentials provider) for admin auth
- **Tailwind CSS** for styling
- **React Query** + **Axios** for client-side data fetching
- **React Hook Form** + **Zod** for forms and validation

### Directory Layout

```
app/
  api/          # All API routes
  admin/        # Protected admin dashboard (articles, members, elections, aspirants, volunteers, donations, positions, officials, users)
  membership/   # Member portal (login, register)
  aspirants/    # Public aspirant application flow
  donate/       # Donation page (M-Pesa + Stripe)
  volunteer/    # Volunteer signup
  about/        # Public party info pages
lib/
  auth.ts           # NextAuth config + session helper
  prisma.ts         # Prisma client singleton
  permissions.ts    # Module-based access control
  member-location.ts
  serialize-member.ts
components/
  admin/        # Admin-only UI components
  home/         # Public homepage sections
  layout/       # Navbar, Footer
scripts/        # Seeding and data import scripts (run with tsx)
prisma/
  schema.prisma
```

### Authentication & Authorization

Two roles: `super_admin` (full access) and `admin` (module-restricted). Module access is controlled via `lib/permissions.ts` with 8 modules: `news`, `elections`, `positions`, `members`, `volunteers`, `donations`, `aspirants`, `admins`.

Admin session is stored in JWT. Member portal uses a separate login (`/api/membership/login`) — members are not NextAuth users.

### Key Data Models

- **Member** — core entity; linked to county/constituency/ward; has optional subscription, aspirant records, volunteer records
- **MembershipSubscription** — 5-year fee tracking with payment status
- **Aspirant** — links Member + Election + Position + geography; approval workflow (pending → approved/rejected)
- **CountyOfficial** — party leadership roles per county (Chairperson, Secretary, Treasurer, Youth Rep, Women Rep, PWD Rep)
- **User** — admin accounts with module-level permissions
- Geographic hierarchy: **County → Constituency → Ward**

### Payment Flows

- **M-Pesa**: STK Push via Safaricom Daraja API; callback handled at `/api/donate/callback`
- **Stripe**: Card payments; webhook at `/api/stripe/webhook`
- Payment status: `pending → completed/failed`

### IPPMS Integration

Members can be fetched from an external government system (IPPMS) via `/api/membership/fetch` using `IPPMS_API_URL` + `IPPMS_API_KEY`. This is a read-only pull to pre-fill member data.

## Environment Variables

Required in `.env`:
```
DATABASE_URL
NEXTAUTH_URL
NEXTAUTH_SECRET
ADMIN_EMAIL
ADMIN_PASSWORD
MPESA_CONSUMER_KEY
MPESA_CONSUMER_SECRET
MPESA_SHORTCODE
MPESA_PASSKEY
MPESA_ENVIRONMENT        # "sandbox" or "production"
STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
IPPMS_API_URL
IPPMS_API_KEY
```

## Notable Patterns

- **Prisma client** is a singleton in `lib/prisma.ts` — always import from there, never instantiate directly.
- **BigInt serialization**: Prisma returns BigInt for some fields; `lib/serialize-member.ts` handles JSON serialization of member objects.
- **Scripts** use `tsx` (not `ts-node`). Add new scripts to `package.json` and run via `npx tsx scripts/your-script.ts`.
- **Admin route protection** is checked at the API level (session + module permissions), not just middleware.
- `db:push` is used instead of `db:migrate` for schema changes in this project — avoid running migrations in development unless intentional.
