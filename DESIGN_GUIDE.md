# Design Guide — Wedding Photography Site

> This file is the authoritative design reference. It overrides any conflicting descriptions
> in CLAUDE_PROMPTS.md. Every public-facing page must follow this guide.

---

## Inspiration
**caroweiss.com** — luxury documentary wedding photography.
- Photography is the UI. Every design decision exists to get out of the photo's way.
- No decorative chrome. No gradients. No shadows unless absolutely necessary.
- The site should feel like a high-end editorial magazine, not a template.

---

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| Background | `#FDFAF7` | Page background — warm off-white, never pure white |
| Foreground | `#1A1A18` | Primary text — near-black, never pure black |
| Primary | `#C8A97E` | Warm gold — **accent only**: underlines, borders, hover states, icons. NEVER as a fill/background on large areas |
| Muted | `#F0EBE3` | Section backgrounds, card backgrounds |
| Muted foreground | `#7A6E65` | Secondary text, captions, metadata |
| Border | `#E5DDD4` | Dividers, card borders — use sparingly |
| Accent | `#E8D5B7` | Champagne — hover backgrounds, subtle highlights |

### Color rules
- Gold (`#C8A97E`) used on large areas = AI slop. Gold as a 1px underline on hover = editorial.
- Sections alternate between `#FDFAF7` and `#F0EBE3` for rhythm — never use a third background color.
- No box shadows except `shadow-sm` on cards in the admin panel.

---

## Typography

### Fonts
| Font | Variable | Use |
|---|---|---|
| Cormorant Garamond | `font-heading` | All headings, display text, pull quotes, hero text |
| Inter | `font-sans` | Body copy, UI labels, nav links, captions, metadata |

### The rules that make it look premium (not AI slop)

**Cormorant Garamond:**
- Hero / display: `text-[72px] md:text-[96px] lg:text-[120px]` — `font-light` (300) — `leading-none` — `tracking-tight`
- H1: `text-5xl md:text-6xl` — `font-light` — `leading-tight` — `tracking-tight`
- H2 (section): `text-3xl md:text-4xl` — `font-normal` (400) — `tracking-tight`
- H3 (card/item): `text-2xl` — `font-normal`
- Pull quotes / italic: `italic font-light text-2xl md:text-3xl` — this is Cormorant's killer feature
- **NEVER use `font-bold` or `font-semibold` on Cormorant headings** — it destroys the elegance

**Inter:**
- Nav links: `text-xs font-normal uppercase tracking-[0.2em]` — ALL CAPS with wide tracking
- Body: `text-base font-light leading-7` (font-weight 300)
- Caption / label: `text-xs uppercase tracking-widest text-muted-foreground`
- Metadata (date, location): `text-sm font-normal text-muted-foreground`

### Size scale
```
Display  120px / line-height: 1     / Cormorant Light    — hero only
H1        48px / line-height: 1.15  / Cormorant Light
H2        36px / line-height: 1.2   / Cormorant Regular
H3        24px / line-height: 1.3   / Cormorant Regular
Body      16px / line-height: 1.75  / Inter Light (300)
Small     14px / line-height: 1.6   / Inter Regular
Caption   12px / line-height: 1.5   / Inter Regular uppercase tracking-widest
```

---

## Navigation

### Public header
- Logo: left-aligned — Cormorant Garamond, `text-xl font-light tracking-widest uppercase`
- Nav links: right-aligned — Inter, `text-xs uppercase tracking-[0.2em] font-normal`
- Link labels (exact): **Work · About · Journal · Investment · Contact**
- Active state: 1px underline using `border-b border-foreground` — not color change
- Header: transparent at top → `bg-background/95 backdrop-blur` on scroll
- Height: `h-20` desktop, `h-14` mobile
- No heavy borders or shadows on header

### Mobile nav
- Hamburger → full-screen overlay, background `bg-background`
- Nav items stack vertically, large Cormorant text (`text-4xl font-light`)

---

## Page Structure

### Homepage (caroweiss.com order)
1. **Hero** — full-viewport, stacked editorial portrait images. Parallax scroll effect on images. Text overlaid: Display-size Cormorant headline, NO subheading cluttering it.
2. **Tagline strip** — centered, ALL-CAPS Inter, `text-xs tracking-[0.3em]`, `text-muted-foreground`. E.g. `"TIMELESS · UNPOSED · DOCUMENTARY"`
3. **Section nav blocks** — 4 full-width blocks stacked: Work / Journal / Investment / Contact. Each block: background image (cover photo) + dark overlay + label in ALL-CAPS Cormorant `text-5xl font-light`. Hover: overlay darkens, subtle scale on image. Height `60vh` each.
4. **About teaser** — 2 col: image left (40%), text right (60%). Cormorant H2 + Inter body. `"Meet Me →"` link in small caps.
5. **Testimonials** — 3 quotes. Client name: Inter `text-xs uppercase tracking-widest`. Quote: Cormorant `italic text-xl font-light`.
6. **Journal preview** — 3 posts in a row. Image + Cormorant title + Inter date/excerpt.
7. **CTA strip** — `bg-muted`, centered, Cormorant H2 `"Let's make something beautiful"` + Button.

### Work/Portfolio page
- NO grid. Vertical scroll feed of images — single column.
- Images alternate: some full-width, some 60% centered, some paired side-by-side.
- NO text overlays on images.
- Click → lightbox.
- Page title: Cormorant Display, left-aligned, very large. Just `"Work"`.

### About page
- Large portrait image top (full-width, max-height 80vh)
- Text below: max-w-2xl centered, Cormorant H2 + Inter body paragraphs
- Values: 3 simple text blocks, no icon cards
- Press strip: small Inter caps text `"AS SEEN IN: VOGUE · BRIDES · THE KNOT"`
- CTA at bottom

### Journal page
- Thin hero: just the word `"Journal"` in large Cormorant, centered
- Posts: 2-col grid — cover image (aspect-[3/4]) + title + date. Clean, no card borders.

### Investment page
- Editorial layout, text-heavy — NOT a SaaS pricing page
- Package names in Cormorant, prices in Inter
- No colored badges or "most popular" banners — use a thin gold border on the featured package only
- FAQ: simple accordion, no icons

### Contact page
- Minimal: personal text left, form right
- Form fields: Inter, borderless bottom-border-only style

---

## Parallax & Animation

### Rules
- Parallax: hero images scroll at 0.4× speed (framer-motion `useScroll` + `useTransform`)
- Section nav blocks: background images scroll at 0.3× speed
- All entrance animations: `opacity 0→1` + `translateY 20px→0` — duration 0.6s ease-out
- Stagger: 0.08s between items in grids/lists
- Page transitions: opacity fade 0.3s
- `prefers-reduced-motion`: all animations disabled if user has this set
- **Never animate layout properties** (width, height, padding) — only opacity and transform
- No bounce, no spring physics on content — only on interactive micro-interactions (button press)

### Install at Prompt 10 (not deferred to Prompt 18)
```
npm install framer-motion
```

---

## DO NOT
- No gradients anywhere on the public site
- No box shadows on images
- No rounded corners on images (always `rounded-none`)
- No colored buttons — primary CTA is `bg-foreground text-background` (black button)
- No gold/primary color as button background
- No card borders on the public site (admin panel only)
- No placeholder shimmer/skeleton on public pages — use blur placeholder from Cloudinary instead
- No emoji in UI
- No stock photo icons or illustration — photography only
