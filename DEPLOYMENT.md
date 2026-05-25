# Deployment Guide

## Stack
- **Frontend + API**: Vercel
- **Database**: Supabase (PostgreSQL)
- **Storage**: Cloudinary
- **Email**: Resend

---

## Required Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Supabase pooled connection string (port 6543) |
| `DIRECT_URL` | Supabase direct connection string (port 5432) — used by Prisma migrations |
| `NEXTAUTH_SECRET` | Random 32+ char string — run `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your production URL, e.g. `https://carawei.com` |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Same value as `CLOUDINARY_CLOUD_NAME` (exposed to browser) |
| `RESEND_API_KEY` | From Resend dashboard |
| `ADMIN_EMAIL` | Email address that receives contact form inquiries |

---

## 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings → Database → Connection string**
3. Copy both connection strings:
   - **Pooling** (port 6543) → `DATABASE_URL`
   - **Direct** (port 5432) → `DIRECT_URL`
4. Append `?pgbouncer=true` to `DATABASE_URL` and `?schema=public` to `DIRECT_URL`

```
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres?schema=public"
```

---

## 2. Cloudinary Setup

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. From the dashboard, copy **Cloud Name**, **API Key**, **API Secret**
3. Go to **Settings → Upload → Upload presets**
4. Click **Add upload preset**:
   - Preset name: `wedding_photos`
   - Signing mode: **Unsigned**
   - Folder: `wedding`
   - Save
5. Use this preset name in `lib/cloudinary.ts` if not already set

---

## 3. Resend Setup

1. Create an account at [resend.com](https://resend.com)
2. Go to **API Keys** → Create key → copy it as `RESEND_API_KEY`
3. Go to **Domains** → Add your domain (e.g. `carawei.com`)
4. Add the DNS records shown (MX, TXT, DKIM) to your domain registrar
5. Wait for verification (usually under 10 minutes)
6. Update your `from` address in `app/api/contact/route.ts` to use your verified domain

---

## 4. Vercel Deployment

1. Push the repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo
3. Framework preset: **Next.js** (auto-detected)
4. Go to **Settings → Environment Variables** and add all variables from the table above
5. Deploy — Vercel will run `prisma generate && next build` automatically via `vercel.json`

### After First Deploy

Run the DB setup script once to apply migrations and seed initial data:

```bash
# From your local machine with .env.local set
bash scripts/setup-db.sh
```

Or trigger it from Vercel's **Functions** tab if you add it as a one-off job.

---

## 5. Creating the First Admin User

The seed script creates an admin user. To create one manually:

```bash
# Generate a bcrypt hash for your password
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('yourpassword', 10).then(console.log)"

# Then insert via psql or Supabase SQL editor:
INSERT INTO "User" (id, email, "passwordHash", role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'you@example.com', '<hash>', 'ADMIN', now(), now());
```

Or re-run the seed (it upserts, so it won't duplicate):

```bash
npx dotenvx run -f .env.local -- npx tsx prisma/seed.ts
```

---

## 6. Custom Domain on Vercel

1. Vercel dashboard → your project → **Settings → Domains**
2. Add your domain (e.g. `carawei.com`)
3. Add the DNS records Vercel shows to your registrar
4. Update `NEXTAUTH_URL` to match the production domain
5. Update `robots.ts` sitemap URL if the domain changes

---

## Post-Deployment Checklist

- [ ] Contact form sends email (test via `/contact`)
- [ ] Admin login works at `/admin/login`
- [ ] Gallery upload works (Cloudinary preset configured)
- [ ] Hero image shows on homepage
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] OG image appears when sharing a link
