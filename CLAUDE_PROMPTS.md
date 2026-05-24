# Wedding Photography Website — Build Prompts

> Paste each prompt into Claude Code terminal in order. Wait for completion before moving to the next.
> Reference: CLAUDE.md is active in the project root — Claude Code will follow those rules automatically.

---

## PROMPT 1 — Project Scaffolding

```
[CLAUDE.md]

TASK:
Scaffold the full Next.js project from scratch.

REQUIREMENTS:
- Init Next.js 14 with App Router, TypeScript, Tailwind CSS
- Install and init shadcn/ui (style: default, base color: neutral)
- Install: prisma @prisma/client next-auth @auth/prisma-adapter cloudinary resend zod react-hook-form @hookform/resolvers lucide-react next-cloudinary
- Install dev deps: @types/node prettier prettier-plugin-tailwindcss
- Create folder structure exactly as defined in CLAUDE.md
- Create lib/prisma.ts (singleton PrismaClient)
- Create lib/env.ts (typed env validator using process.env, throws on missing required vars)
- Create lib/utils.ts (re-export shadcn cn helper)
- Create .env.local.example with all required env var keys (no values):
    DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL,
    CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET,
    RESEND_API_KEY, NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
- Create prettier.config.js with tailwind plugin
- Set tsconfig paths: @/* → ./*
- Remove all Next.js boilerplate from app/ (keep layout.tsx skeleton only)
- app/layout.tsx: Inter font via next/font, global metadata (site name, description, openGraph)

OUTPUT: one file per response, starting with package.json
```

---

## PROMPT 2 — Theme & Design System

```
[CLAUDE.md]

TASK:
Configure the design system — colors, typography, spacing tokens, and global styles.

DESIGN DIRECTION:
Luxury wedding photography. Warm, editorial, film-inspired.
Reference: caroweiss.com aesthetic — clean whitespace, serif headings, muted warm neutrals.

COLOR PALETTE:
- Background: #FDFAF7 (warm off-white)
- Foreground: #1A1A18 (near-black)
- Primary: #C8A97E (warm gold)
- Primary foreground: #FFFFFF
- Muted: #F0EBE3 (light warm gray)
- Muted foreground: #7A6E65
- Border: #E5DDD4
- Accent: #E8D5B7 (soft champagne)
- Destructive: #C0392B

TYPOGRAPHY:
- Heading font: Cormorant Garamond (Google Fonts, weights 300 400 600 700 italic)
- Body font: Inter (next/font, weights 300 400 500)
- Display sizes: hero 72px/80px, h1 48px, h2 36px, h3 24px, body 16px, small 14px

REQUIREMENTS:
- Update tailwind.config.ts: extend colors with palette above, extend fontFamily (heading: cormorant, sans: inter)
- Update app/globals.css: CSS custom properties for shadcn theme mapped to palette, base layer resets, ::selection color
- Create components/ui/typography.tsx: typed components — Display, H1, H2, H3, H4, Body, Small, Caption, Lead — each applies correct font/weight/tracking
- Create lib/fonts.ts: next/font config for Inter + Cormorant Garamond, export both

OUTPUT: tailwind.config.ts first
```

---

## PROMPT 3 — Database Schema

```
[CLAUDE.md]

TASK:
Define the complete Prisma schema for the wedding photography site.

MODELS NEEDED:

Gallery
- id, slug (unique), title, description, coverImageUrl, location, date (DateTime), featured (bool, default false)
- images: GalleryImage[]
- category: enum (WEDDING, ENGAGEMENT, PORTRAIT, EDITORIAL)
- published: bool, default false
- createdAt, updatedAt

GalleryImage
- id, url, caption (optional), order (int), blurDataUrl (optional)
- galleryId → Gallery

Story (blog/journal)
- id, slug (unique), title, excerpt, content (Text), coverImageUrl
- published: bool, galleryId (optional FK → Gallery)
- publishedAt (optional DateTime), createdAt, updatedAt

Inquiry
- id, name, email, phone (optional), weddingDate (optional DateTime), message, venue (optional)
- status: enum (NEW, READ, REPLIED, ARCHIVED), default NEW
- createdAt

SiteSettings
- id (always 1), heroHeadline, heroSubheading, aboutText (Text), aboutImageUrl
- instagramUrl, email, phone

User (admin only)
- id, email (unique), name, hashedPassword, role: enum (ADMIN), createdAt

REQUIREMENTS:
- Write complete prisma/schema.prisma (provider: postgresql)
- Add @@index on: Gallery(slug), Gallery(featured), Story(slug), Story(published), Inquiry(status)
- Write prisma/seed.ts: seed 1 admin user (email: admin@site.com, bcrypt hashed pw: Admin1234!), 1 SiteSettings row, 3 sample galleries (published), 2 sample stories (published)
- Install bcryptjs @types/bcryptjs and use in seed

OUTPUT: prisma/schema.prisma first
```

---

## PROMPT 4 — Auth Setup

```
[CLAUDE.md]

TASK:
Implement NextAuth.js credentials-based authentication for the admin panel.

REQUIREMENTS:
- lib/auth.ts: NextAuth config — CredentialsProvider only, validate email+password against DB (bcrypt compare), session strategy: jwt, pages: { signIn: '/admin/login' }
- Use @auth/prisma-adapter with the Prisma singleton
- app/api/auth/[...nextauth]/route.ts: export GET and POST handlers
- middleware.ts: protect all routes under /admin/* except /admin/login — redirect unauthenticated to /admin/login
- lib/session.ts: helper getServerSession() that wraps next-auth getServerSession with authOptions, typed to return session or null

No registration route. Admin accounts created via seed only.

OUTPUT: lib/auth.ts first
```

---

## PROMPT 5 — Cloudinary & Image Upload Service

```
[CLAUDE.md]

TASK:
Build the image upload service using Cloudinary.

REQUIREMENTS:
- lib/cloudinary.ts: init cloudinary v2 with env vars, export uploadImage(file: File | Buffer, folder: string) → { url: string, blurDataUrl: string } — use upload_stream, generate blurDataUrl via cloudinary transformation (w_10,e_blur:1000,q_auto,f_webp)
- app/api/upload/route.ts: POST handler, admin-only (check session), accepts multipart form-data, calls uploadImage, returns { url, blurDataUrl }
- components/admin/image-uploader.tsx: "use client" drag-and-drop uploader — accepts multiple files, calls /api/upload, shows preview thumbnails, returns uploaded URLs via onUpload(urls: string[]) callback, uses shadcn Progress for upload state
- Max file size: 10MB per image, accepted: image/jpeg image/png image/webp

OUTPUT: lib/cloudinary.ts first
```

---

## PROMPT 6 — Admin Dashboard Shell

```
[CLAUDE.md]

TASK:
Build the admin dashboard layout and navigation shell.

REQUIREMENTS:
- app/(admin)/layout.tsx: server component, getServerSession → redirect to /admin/login if no session, render AdminSidebar + main content slot
- app/(admin)/admin/login/page.tsx: centered login card using shadcn Card, Form, Input, Button — react-hook-form + zod schema (email, password), POST to /api/auth/signin, show error on invalid credentials
- components/admin/sidebar.tsx: "use client" — fixed left sidebar, logo top, nav links: Dashboard, Galleries, Stories, Inquiries, Settings — active state from usePathname, sign out button at bottom using next-auth signOut()
- app/(admin)/admin/dashboard/page.tsx: overview cards — total galleries, published galleries, total stories, new inquiries (badge count) — fetch counts via Prisma directly in server component

Nav links map:
  Dashboard → /admin/dashboard
  Galleries → /admin/galleries
  Stories → /admin/stories
  Inquiries → /admin/inquiries
  Settings → /admin/settings

OUTPUT: app/(admin)/layout.tsx first
```

---

## PROMPT 7 — Admin: Galleries CRUD

```
[CLAUDE.md]

TASK:
Build complete Galleries management in the admin panel.

PAGES:
1. /admin/galleries — table of all galleries (title, category, published status, date, actions)
2. /admin/galleries/new — create gallery form
3. /admin/galleries/[id]/edit — edit gallery form (pre-populated)

API ROUTES:
- GET /api/admin/galleries — list all galleries (id, slug, title, category, published, _count images)
- POST /api/admin/galleries — create gallery, auto-generate slug from title
- GET /api/admin/galleries/[id] — single gallery with images
- PUT /api/admin/galleries/[id] — update gallery
- DELETE /api/admin/galleries/[id] — delete gallery + images
- POST /api/admin/galleries/[id]/images — add images (array of {url, blurDataUrl, caption, order})
- DELETE /api/admin/galleries/[id]/images/[imageId] — remove image

All admin API routes must verify session — return 401 if not authenticated.

FORM FIELDS (create/edit):
title (required), slug (auto from title, editable), description, category (select), location, date (date picker), coverImageUrl (image uploader), published (toggle)
After cover: image gallery uploader (multi-image, drag to reorder order field)

COMPONENTS:
- components/admin/gallery-form.tsx — shared form for create/edit
- components/admin/gallery-table.tsx — shadcn Table with DataTable pattern, sortable columns
- components/admin/image-grid.tsx — sortable image grid with drag handle (use @dnd-kit/sortable)

Install: @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

OUTPUT: API route app/api/admin/galleries/route.ts first
```

---

## PROMPT 8 — Admin: Stories CRUD

```
[CLAUDE.md]

TASK:
Build complete Stories (journal/blog) management in the admin panel.

PAGES:
1. /admin/stories — table of all stories (title, published, publishedAt, linked gallery)
2. /admin/stories/new — create story
3. /admin/stories/[id]/edit — edit story

API ROUTES:
- GET /api/admin/stories — list all
- POST /api/admin/stories — create, auto-slug from title
- GET /api/admin/stories/[id] — single story
- PUT /api/admin/stories/[id] — update
- DELETE /api/admin/stories/[id] — delete

FORM FIELDS:
title, slug (auto, editable), excerpt, content (rich text — use @uiw/react-md-editor, markdown-based), coverImageUrl (image uploader), publishedAt (date picker), published (toggle), galleryId (optional select — dropdown of existing galleries)

Install: @uiw/react-md-editor

COMPONENTS:
- components/admin/story-form.tsx
- components/admin/story-table.tsx

OUTPUT: app/api/admin/stories/route.ts first
```

---

## PROMPT 9 — Admin: Inquiries & Settings

```
[CLAUDE.md]

TASK:
Build Inquiries viewer and Site Settings editor in admin.

INQUIRIES:
- app/(admin)/admin/inquiries/page.tsx: table of inquiries — name, email, wedding date, status badge (NEW=blue, READ=gray, REPLIED=green, ARCHIVED=muted), created date, click row to open detail sheet
- components/admin/inquiry-detail.tsx: shadcn Sheet sliding panel — all inquiry fields, status dropdown to update, no delete
- API: GET /api/admin/inquiries (filter by status query param), PUT /api/admin/inquiries/[id] (update status)
- When inquiry is opened set status NEW → READ automatically via PUT

SETTINGS:
- app/(admin)/admin/settings/page.tsx: form to edit SiteSettings row (upsert id=1)
- FIELDS: heroHeadline, heroSubheading, aboutText (textarea), aboutImageUrl (image uploader), instagramUrl, email, phone
- API: GET /api/admin/settings, PUT /api/admin/settings

OUTPUT: app/api/admin/inquiries/route.ts first
```

---

## PROMPT 10 — Public Layout & Navigation

```
[CLAUDE.md]

TASK:
Build the public site layout — header, footer, and base layout.

REQUIREMENTS:
- app/(site)/layout.tsx: wraps all public pages with SiteHeader + SiteFooter
- components/site/header.tsx: "use client" — full-width, sticky, transparent on scroll-top → white on scroll-down (useScrollPosition hook), logo centered or left, nav links right (or centered below logo for editorial look):
    Work | About | Journal | Investment | Contact
  Mobile: hamburger → full-screen overlay nav with smooth open/close transition
- components/site/footer.tsx: server component — 3 columns: logo + tagline | nav links | social + email | bottom row copyright
- Logo: text-based using Cormorant Garamond — "[Photographer Name]" — placeholder "Cara Wei" editable via SiteSettings in future
- Nav uses Next.js Link, active link gets subtle underline
- Header height: 80px desktop, 60px mobile

DESIGN: minimal, editorial. No heavy borders or shadows. Letter-spacing on nav links (tracking-widest uppercase text-xs).

OUTPUT: components/site/header.tsx first
```

---

## PROMPT 11 — Homepage

```
[CLAUDE.md]

TASK:
Build the public Homepage — /app/(site)/page.tsx and all its section components.

DATA: fetch from DB in server component — SiteSettings (headline, subheading), featured galleries (featured=true, published=true, limit 6), latest stories (published=true, limit 3)

SECTIONS (in order):

1. HERO
- Full-viewport height
- Background: large editorial photo (coverImageUrl of first featured gallery) via next/image fill + object-cover
- Subtle dark overlay (bg-black/20)
- Centered text: Display-size headline from SiteSettings.heroHeadline, subheading below, CTA button "View the Work" → /portfolio
- Scroll indicator arrow at bottom

2. FEATURED GALLERIES GRID
- Section heading: "Recent Work" (H2, centered)
- Masonry-style 3-column grid (CSS columns, not JS masonry) of gallery cover images
- Each item: next/image, hover → title overlay slides up from bottom (opacity transition)
- Link to /portfolio/[slug]
- "View All Work" link below grid

3. ABOUT TEASER
- 2-col layout: left = large portrait photo, right = short text (first 300 chars of aboutText) + "More About Me" link → /about
- Warm background section (bg-muted)

4. JOURNAL PREVIEW
- 3-column story cards: cover image, title, excerpt (truncate 2 lines), date
- Link to /journal/[slug]
- "Read the Journal" link below

5. INSTAGRAM CTA
- Centered section: italic quote or tagline, Instagram handle link, soft background

generateMetadata: title = SiteSettings.heroHeadline, description = subheading

OUTPUT: app/(site)/page.tsx first
```

---

## PROMPT 12 — Portfolio Page

```
[CLAUDE.md]

TASK:
Build the Portfolio page — /portfolio and /portfolio/[slug] gallery detail.

PORTFOLIO INDEX (/portfolio):
- app/(site)/portfolio/page.tsx: server component, ISR revalidate 60
- Fetch all published galleries grouped by category
- Hero: full-width thin banner — "The Work" in large Cormorant, subtitle
- Category filter tabs (WEDDING, ENGAGEMENT, PORTRAIT, EDITORIAL) — "use client" FilterTabs component, filters gallery grid client-side (no navigation)
- Gallery grid: 2-col on mobile, 3-col on desktop — each card: cover image (aspect-[3/4]), location + title below, hover scale-[1.02] transition
- generateMetadata: title "Portfolio | [Site Name]"

GALLERY DETAIL (/portfolio/[slug]):
- app/(site)/portfolio/[slug]/page.tsx: server component, generateStaticParams for all published slugs, ISR revalidate 60
- generateMetadata: title = gallery.title + location, openGraph image = coverImageUrl
- SECTIONS:
  1. Full-width hero: cover image, title + location + date overlaid bottom-left
  2. Story section (if linked story exists): quote-style excerpt in italics, Cormorant font, link to full story
  3. Image gallery: alternating layouts — single full-width, 2-col, 3-col — using CSS grid, each image next/image with blurDataURL placeholder
  4. Next/Prev gallery navigation at bottom (adjacent published galleries)

COMPONENTS:
- components/site/gallery-grid.tsx — filterable grid
- components/site/gallery-detail-images.tsx — "use client" lightbox on click (use yet-another-react-lightbox)

Install: yet-another-react-lightbox

OUTPUT: app/(site)/portfolio/page.tsx first
```

---

## PROMPT 13 — About Page

```
[CLAUDE.md]

TASK:
Build the About page — /about.

DATA: fetch SiteSettings from DB (aboutText, aboutImageUrl)

SECTIONS:

1. PAGE HERO
- Thin full-width hero: "About" in Display Cormorant, soft muted background

2. MAIN CONTENT (2-col, text-heavy editorial layout)
- Left col (60%): H2 "Hello, I'm [Name]", body text from SiteSettings.aboutText (render as paragraphs split by \n\n), warm and personal voice
- Right col (40%): photographer portrait image (aboutImageUrl), sticky on desktop

3. APPROACH / PHILOSOPHY SECTION
- 3 values cards with icon (lucide), heading, short paragraph
- Suggested values: "Candid Moments", "Timeless Editing", "Stress-Free Experience"
- Soft background strip

4. AWARDS / FEATURES SECTION (static — hard-code placeholder names)
- Simple horizontal text list: "As featured in: Vogue, Brides, The Knot, Martha Stewart Weddings"
- Muted, small text

5. CTA
- Centered: "Let's create something beautiful together" + Button → /contact

generateMetadata: title "About | [Site Name]", description from first 160 chars of aboutText

OUTPUT: app/(site)/about/page.tsx
```

---

## PROMPT 14 — Journal (Blog) Page

```
[CLAUDE.md]

TASK:
Build the Journal (blog) index and story detail pages.

JOURNAL INDEX (/journal):
- app/(site)/journal/page.tsx: server component, ISR revalidate 60
- Fetch all published stories ordered by publishedAt DESC
- Hero: thin banner "Journal" in Cormorant Display
- Story grid: 2-col on desktop — card: cover image (aspect-video), date (small muted), title (H3 Cormorant), excerpt (2-line clamp), "Read More →" link
- generateMetadata: title "Journal | [Site Name]"

STORY DETAIL (/journal/[slug]):
- app/(site)/journal/[slug]/page.tsx: ISR revalidate 60, generateStaticParams for published stories
- generateMetadata: title = story.title, description = story.excerpt, openGraph image = coverImageUrl
- LAYOUT:
  1. Hero: cover image full-width (max-height 70vh, object-cover), title overlaid at bottom
  2. Article body: max-w-2xl centered, date + reading time (calc from content word count), render markdown content (use react-markdown with remark-gfm)
  3. If linked gallery: "See the Full Gallery →" CTA block with gallery cover image
  4. Back to Journal link at bottom

Install: react-markdown remark-gfm

OUTPUT: app/(site)/journal/page.tsx first
```

---

## PROMPT 15 — Investment Page

```
[CLAUDE.md]

TASK:
Build the Investment (pricing) page — /investment.

NOTE: All content is static (no DB). Placeholder pricing and text — client can update via a future settings page.

SECTIONS:

1. PAGE HERO
- "Investment" in Display Cormorant, subtitle: "Transparent pricing. No surprises."
- Soft muted background

2. INTRO TEXT
- 2-3 short paragraphs about the experience, value, and what is included
- Max-w-2xl centered

3. PACKAGES
- 3 package cards in a row (or stack on mobile)
- Package 1: "Essential" — half-day coverage, 300 edited images, online gallery
- Package 2: "Full Day" ★ Most Popular — full-day coverage, 500+ images, engagement session, album credit
- Package 3: "Premium Collection" — two photographers, full day, rehearsal dinner, luxury album
- Price: displayed as "From $X,XXX" (placeholder values)
- Featured (middle) card: slightly elevated with primary border
- Each card: shadcn Card, list of inclusions with checkmark icons, CTA "Inquire Now" → /contact

4. ADD-ONS
- Simple list: Engagement Session, Rehearsal Dinner, Second Shooter, Fine Art Album, Rush Delivery — each with short description + price

5. FAQ ACCORDION
- 6 common questions using shadcn Accordion
- Questions: booking process, deposit, turnaround time, travel fees, RAW files policy, print rights

6. CTA STRIP
- "Ready to book your date?" + Book Now button → /contact

generateMetadata: title "Investment | [Site Name]"

OUTPUT: app/(site)/investment/page.tsx
```

---

## PROMPT 16 — Contact Page

```
[CLAUDE.md]

TASK:
Build the Contact page — /contact — with a working inquiry form.

PAGE LAYOUT:
- app/(site)/contact/page.tsx: server component wrapper
- Left col (40%): contact info — email, phone, Instagram, location blurb, availability note ("Currently booking 2025–2026")
- Right col (60%): inquiry form

FORM FIELDS (react-hook-form + zod):
- name (required)
- email (required, email format)
- phone (optional)
- weddingDate (date input, optional)
- venue (text, optional)
- message (textarea, required, min 20 chars)

API ROUTE — POST /api/contact:
- Validate with zod (same schema as form)
- Save Inquiry to DB via Prisma
- Send email notification to admin using Resend:
    To: process.env.ADMIN_EMAIL
    Subject: "New Inquiry from [name]"
    HTML: formatted inquiry details
- Return { success: true } or { error: string }

Add ADMIN_EMAIL to .env.local.example

FORM UX:
- react-hook-form with zodResolver
- Inline field errors
- Submit button shows loading spinner (shadcn Button with Loader2 icon) during submission
- On success: replace form with thank-you message — "Thank you [name]! I'll be in touch within 48 hours."
- On error: show toast (shadcn Sonner) with error message

Add Sonner to app/layout.tsx.

generateMetadata: title "Contact | [Site Name]"

OUTPUT: app/api/contact/route.ts first
```

---

## PROMPT 17 — SEO, Sitemap & Performance

```
[CLAUDE.md]

TASK:
Implement site-wide SEO infrastructure, sitemap, robots.txt, and performance optimizations.

REQUIREMENTS:

SEO:
- app/sitemap.ts: generate sitemap dynamically — static routes (/, /about, /portfolio, /journal, /investment, /contact) + all published gallery slugs + all published story slugs — fetch from Prisma, return MetadataRoute.Sitemap
- app/robots.ts: allow all, disallow /admin/*, sitemap URL
- app/opengraph-image.tsx: default OG image using next/og — site name in Cormorant-style text on warm background
- Verify every page already exports generateMetadata (do not add — just confirm in a checklist comment at top of this file)

PERFORMANCE:
- Add next.config.ts:
    - images.domains: ['res.cloudinary.com']
    - images.formats: ['image/avif', 'image/webp']
    - Enable experimental.optimizeCss: false (keep off, Tailwind handles it)
    - headers() for Cache-Control on /api/* routes (no-store) and static assets (public, max-age=31536000)
- Create components/shared/blur-image.tsx: wrapper around next/image that accepts blurDataUrl prop and applies placeholder="blur" — use everywhere instead of raw next/image in gallery/story pages

STRUCTURED DATA:
- Create lib/structured-data.ts: functions returning JSON-LD objects for:
    - WebSite schema (name, url, sameAs Instagram)
    - Photograph schema (for gallery detail pages)
    - BlogPosting schema (for story detail pages)
- Add WebSite JSON-LD to app/layout.tsx via <Script> with strategy="afterInteractive" type="application/ld+json"
- Add Photograph JSON-LD to portfolio/[slug]/page.tsx
- Add BlogPosting JSON-LD to journal/[slug]/page.tsx

OUTPUT: app/sitemap.ts first
```

---

## PROMPT 18 — Final Polish & Animations

```
[CLAUDE.md]

TASK:
Add subtle entrance animations and polish across the public site.

REQUIREMENTS:
- Install: framer-motion
- Create components/shared/fade-in.tsx: "use client" wrapper component — uses framer-motion, fades in + translates Y from 20px, triggers on viewport entry (viewport: { once: true, margin: "-50px" }), accepts delay prop (default 0)
- Wrap section headings and content blocks with FadeIn on: Homepage (all sections), About, Journal index cards, Portfolio grid cards
- components/site/header.tsx: add smooth height transition on scroll (80px → 64px), smooth background transition transparent → white
- components/site/gallery-detail-images.tsx: staggered image reveal — each image fades in with 0.05s stagger delay based on index
- Homepage hero: title animates in on load (scale from 0.95 → 1, opacity 0 → 1, 0.8s ease-out)
- Cursor: no custom cursor (keep default — avoid gimmicks)
- Page transitions: add a simple opacity fade between page navigations using a layout-level motion.div in app/(site)/layout.tsx

RULES:
- All animations: duration ≤ 0.6s, ease-out, no bounce
- Never animate layout (no width/height animations — only opacity and transform)
- Respect prefers-reduced-motion: wrap all motion components to check useReducedMotion() and skip animation if true

OUTPUT: components/shared/fade-in.tsx first
```

---

## PROMPT 19 — Admin: Site Settings / Homepage Editor

```
[CLAUDE.md]

TASK:
Extend the admin settings page to allow editing all homepage content.

REQUIREMENTS:
- app/(admin)/admin/settings/page.tsx: full settings editor — hero headline, hero subheading, about text, about image (image uploader), contact email, phone, Instagram URL
- Featured gallery picker: multi-select checkboxes from all published galleries, saves as featured=true on Gallery model
- Preview link: "Preview Homepage →" opens /  in new tab
- API: GET /api/admin/settings already exists (PROMPT 9) — extend PUT handler to also accept featuredGalleryIds: string[] and batch update Gallery.featured field in a Prisma transaction

OUTPUT: app/api/admin/settings/route.ts (full updated file)
```

---

## PROMPT 20 — Deployment Checklist & Environment

```
[CLAUDE.md]

TASK:
Create deployment configuration and environment setup files.

REQUIREMENTS:
- vercel.json: configure build command (prisma generate && next build), add environment variable keys (not values)
- Create scripts/setup-db.sh: bash script that runs prisma migrate deploy && prisma db seed — for use in CI or first deploy
- Create DEPLOYMENT.md (exception to no-docs rule — this is operational, not code docs):
    - Required env vars with descriptions
    - Supabase Postgres setup steps (connection string format)
    - Cloudinary setup steps (create upload preset)
    - Vercel deployment steps
    - How to create the first admin user (run seed or direct DB insert)
    - How to add a Resend domain

OUTPUT: vercel.json first
```

---

## ORDER OF EXECUTION

```
1  → Project Scaffolding
2  → Theme & Design System
3  → Database Schema
4  → Auth Setup
5  → Cloudinary & Upload Service
6  → Admin Shell
7  → Admin: Galleries CRUD
8  → Admin: Stories CRUD
9  → Admin: Inquiries & Settings
10 → Public Layout & Navigation
11 → Homepage
12 → Portfolio Page
13 → About Page
14 → Journal Page
15 → Investment Page
16 → Contact Page
17 → SEO, Sitemap & Performance
18 → Final Polish & Animations
19 → Admin: Homepage Editor
20 → Deployment
```

> After each prompt completes, run `npm run build` to check for TypeScript errors before moving to the next prompt.
