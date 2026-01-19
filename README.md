# People's Renaissance Movement - Web Platform

A comprehensive web platform for the People's Renaissance Movement political party in Kenya, combining website content with party operations management.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **Payments:** 
  - M-Pesa (Safaricom Daraja API)
  - Stripe (for card payments)
- **Deployment:** Vercel (recommended) or Railway/Render

## Features

### Public Features
- **Home Page:** Hero section, featured content, call-to-action
- **About Us:** Party vision, mission, values, and goals
- **Membership Management:** Integration with IPPMS (Integrated Political Party Management System)
- **Volunteer Application:** Open application form for volunteers
- **Donations:** Support for both M-Pesa STK Push and card payments
- **Articles & News:** Dynamic content management
- **Events:** Event listing and details
- **Contact & Location:** Contact information and location map

### Admin Features
- **Admin Dashboard:** Overview with statistics and reports
- **Content Management:** Create and manage articles and events
- **Member Management:** View and manage party members
- **Volunteer Management:** Review and manage volunteer applications
- **Donation Reports:** View donation statistics and reports

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- M-Pesa Daraja API credentials (for M-Pesa payments)
- Stripe account (for card payments)
- IPPMS API credentials (for membership integration)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd webapp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and fill in all required values:
- Database connection string
- NextAuth secret (generate with `openssl rand -base64 32`)
- M-Pesa API credentials
- Stripe API keys
- IPPMS API credentials

4. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations
npm run db:migrate
```

5. Initialize admin user:
```bash
npx ts-node scripts/init-admin.ts
```

6. Run the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Set up PostgreSQL database (Vercel Postgres or external provider)
5. Deploy

### Railway/Render

1. Connect your GitHub repository
2. Add PostgreSQL database
3. Set environment variables
4. Deploy

### Environment Variables for Production

Ensure all environment variables from `.env.example` are set in your deployment platform:
- `DATABASE_URL`
- `NEXTAUTH_URL` (your production domain)
- `NEXTAUTH_SECRET`
- `MPESA_*` variables
- `STRIPE_*` variables
- `IPPMS_*` variables

## Project Structure

```
webapp/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   ├── articles/          # Article pages
│   ├── events/            # Event pages
│   └── ...                # Other pages
├── components/            # React components
│   ├── admin/             # Admin components
│   ├── home/              # Home page components
│   └── layout/            # Layout components
├── lib/                   # Utility functions
├── prisma/                # Prisma schema
└── scripts/               # Utility scripts
```

## Color Scheme

The platform uses colors matching the party logo:
- **Primary Blue:** #003366
- **Primary Red:** #C41E3A
- **Light Blue:** #EFF6FF

## API Integration

### IPPMS Integration

The platform integrates with IPPMS for membership management. Members registered in IPPMS can fetch their details using their IPPMS ID and create a profile on the platform.

### M-Pesa Integration

M-Pesa payments use Safaricom's Daraja API. Configure your credentials in environment variables and ensure your callback URL is accessible.

### Stripe Integration

Card payments are processed through Stripe. Set up your Stripe account and configure webhook endpoints for payment confirmation.

## Security

- Admin routes are protected with NextAuth.js
- Passwords are hashed using bcrypt
- API routes validate authentication and authorization
- Environment variables are used for sensitive data

## Support

For issues or questions, contact the development team or refer to the documentation.

## License

Copyright © 2024 People's Renaissance Movement. All rights reserved.

