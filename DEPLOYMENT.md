# Deployment Guide

## Tech Stack Summary

### Frontend & Framework
- **Next.js 14** (App Router) - React framework with server-side rendering
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React 18** - UI library

### Backend & Database
- **PostgreSQL** - Relational database
- **Prisma ORM** - Database toolkit and ORM
- **Next.js API Routes** - Serverless API endpoints

### Authentication & Security
- **NextAuth.js** - Authentication solution
- **bcryptjs** - Password hashing

### Payment Integration
- **M-Pesa Daraja API** - Mobile money payments (Safaricom)
- **Stripe** - Card payment processing

### External APIs
- **IPPMS API** - Integrated Political Party Management System integration

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the recommended platform as it's built by the Next.js team and offers seamless integration.

#### Steps:

1. **Prepare your repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login and click "New Project"
   - Import your GitHub repository
   - Configure project settings

3. **Set up PostgreSQL:**
   - Use Vercel Postgres (recommended) or external provider
   - Add `DATABASE_URL` environment variable

4. **Configure Environment Variables:**
   Add all variables from `.env.example`:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (your Vercel domain)
   - `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
   - `MPESA_*` variables
   - `STRIPE_*` variables
   - `IPPMS_*` variables

5. **Run database migrations:**
   - After first deployment, run migrations:
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   npm run init:admin
   ```

6. **Deploy:**
   - Vercel will automatically deploy on every push to main branch

### Option 2: Railway

Railway provides easy PostgreSQL setup and deployment.

#### Steps:

1. **Create Railway account:**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create new project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add PostgreSQL:**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will automatically set `DATABASE_URL`

4. **Configure Environment Variables:**
   - Go to project settings → Variables
   - Add all required environment variables

5. **Deploy:**
   - Railway will automatically build and deploy
   - Run migrations after first deployment:
   ```bash
   railway run npx prisma migrate deploy
   railway run npm run init:admin
   ```

### Option 3: Render

Render offers free PostgreSQL and easy deployment.

#### Steps:

1. **Create Render account:**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create PostgreSQL database:**
   - New → PostgreSQL
   - Note the connection string

3. **Create Web Service:**
   - New → Web Service
   - Connect your GitHub repository
   - Build command: `npm install && npm run build`
   - Start command: `npm start`

4. **Configure Environment Variables:**
   - Add all required variables in Environment section
   - Set `DATABASE_URL` to your PostgreSQL connection string

5. **Run migrations:**
   - Use Render Shell or SSH to run:
   ```bash
   npx prisma migrate deploy
   npm run init:admin
   ```

## Post-Deployment Setup

### 1. Initialize Database

After deployment, run:
```bash
npx prisma generate
npx prisma migrate deploy
npm run init:admin
```

### 2. Configure M-Pesa

1. Register for M-Pesa Daraja API at [developer.safaricom.co.ke](https://developer.safaricom.co.ke)
2. Get your Consumer Key and Consumer Secret
3. Configure your callback URL: `https://yourdomain.com/api/donate/callback`
4. Update environment variables

### 3. Configure Stripe

1. Create Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from dashboard
3. Configure webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
4. Update environment variables

### 4. Configure IPPMS

1. Get IPPMS API credentials from IPPMS system
2. Update `IPPMS_API_URL` and `IPPMS_API_KEY` environment variables

### 5. Add Logo

Replace the logo placeholder in `components/layout/Navbar.tsx` with your actual logo image:
- Recommended size: 64x64px
- Format: PNG or SVG
- Place in `public/logo.png` or `public/logo.svg`

### 6. Update Contact Information

Update contact details in:
- `app/contact/page.tsx`
- `components/layout/Footer.tsx`

## Environment Variables Checklist

Ensure all these are set in your deployment platform:

- [ ] `DATABASE_URL`
- [ ] `NEXTAUTH_URL`
- [ ] `NEXTAUTH_SECRET`
- [ ] `ADMIN_EMAIL`
- [ ] `ADMIN_PASSWORD`
- [ ] `MPESA_CONSUMER_KEY`
- [ ] `MPESA_CONSUMER_SECRET`
- [ ] `MPESA_SHORTCODE`
- [ ] `MPESA_PASSKEY`
- [ ] `MPESA_ENVIRONMENT`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_PUBLISHABLE_KEY`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `IPPMS_API_URL`
- [ ] `IPPMS_API_KEY`

## Monitoring & Maintenance

### Database Backups
- Set up automated backups for your PostgreSQL database
- Vercel Postgres: Automatic daily backups
- Railway: Configure backup schedule
- Render: Enable automatic backups

### Logs
- Monitor application logs in your deployment platform
- Set up error tracking (e.g., Sentry)

### Updates
- Keep dependencies updated: `npm update`
- Run migrations for schema changes: `npx prisma migrate deploy`

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check if database is accessible from deployment platform
- Ensure SSL is configured if required

### Authentication Issues
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies and try again

### Payment Issues
- Verify M-Pesa/Stripe credentials
- Check callback URLs are accessible
- Review payment logs in admin dashboard

## Support

For deployment issues, refer to:
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)

