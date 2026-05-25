// generateMetadata checklist — all public pages confirmed:
// ✓ /                  — app/(site)/page.tsx              (metadata export)
// ✓ /about             — app/(site)/about/page.tsx        (generateMetadata)
// ✓ /portfolio         — app/(site)/portfolio/page.tsx    (metadata export)
// ✓ /journal           — app/(site)/journal/page.tsx      (metadata export)
// ✓ /investment        — app/(site)/investment/page.tsx   (metadata export)
// ✓ /contact           — app/(site)/contact/page.tsx      (metadata export)
// ✓ /portfolio/[slug]  — portfolio/[slug]/page.tsx        (generateMetadata)
// ✓ /journal/[slug]    — journal/[slug]/page.tsx          (generateMetadata)

import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://carawei.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [galleries, stories] = await Promise.all([
    prisma.gallery.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.story.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "/",           priority: 1.0 },
    { path: "/about",      priority: 0.8 },
    { path: "/portfolio",  priority: 0.9 },
    { path: "/journal",    priority: 0.8 },
    { path: "/investment", priority: 0.7 },
    { path: "/contact",    priority: 0.7 },
  ].map(({ path, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority,
  }));

  const galleryRoutes: MetadataRoute.Sitemap = galleries.map((g) => ({
    url: `${BASE_URL}/portfolio/${g.slug}`,
    lastModified: g.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const storyRoutes: MetadataRoute.Sitemap = stories.map((s) => ({
    url: `${BASE_URL}/journal/${s.slug}`,
    lastModified: s.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...galleryRoutes, ...storyRoutes];
}
