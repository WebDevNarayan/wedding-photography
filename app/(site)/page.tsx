import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/site/hero";
import { SectionNavBlocks } from "@/components/site/section-nav-blocks";
import { FadeIn } from "@/components/shared/fade-in";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cara Wei Photography — Luxury Wedding Photography in New York",
  description:
    "Documentary wedding photography in New York and beyond. Timeless, unposed, beautifully told.",
};

export const revalidate = 60;

const testimonials = [
  {
    quote:
      "Cara captured moments we didn't even know were happening. Looking at our photos feels like reliving the whole day.",
    name: "Emma & James",
    detail: "Hudson Valley, October 2024",
  },
  {
    quote:
      "We wanted documentary, not posed — and she delivered something far beyond what we imagined.",
    name: "Sophia & Mark",
    detail: "Central Park, September 2024",
  },
  {
    quote: "Every photograph is a painting. We couldn't be more grateful.",
    name: "Claire & Thomas",
    detail: "Finger Lakes, August 2024",
  },
];

export default async function HomePage() {
  const [settings, stories, heroGallery, navGalleries] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    prisma.story.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
    prisma.gallery.findFirst({
      where: { featured: true, published: true },
      orderBy: { date: "desc" },
      select: { coverImageUrl: true },
    }),
    prisma.gallery.findMany({
      where: { published: true },
      orderBy: { date: "desc" },
      take: 4,
      select: { coverImageUrl: true },
    }),
  ]);

  const heroImageUrl = heroGallery?.coverImageUrl;
  // Use explicit nav images from settings when set, otherwise fall back to gallery date order
  const fallbackImages = navGalleries.map((g) => g.coverImageUrl);
  const navImages = [
    settings?.navImageWork        || fallbackImages[0],
    settings?.navImageJournal     || fallbackImages[1],
    settings?.navImageInvestment  || fallbackImages[2],
    settings?.navImageContact     || fallbackImages[3],
  ];

  return (
    <>
      <Hero
        headline={settings?.heroHeadline ?? "Love Stories, Beautifully Told"}
        imageUrl={heroImageUrl}
      />

      {/* Tagline strip */}
      <FadeIn className="flex items-center justify-center py-10 bg-background">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Timeless · Unposed · Documentary
        </p>
      </FadeIn>

      <SectionNavBlocks images={navImages} />

      {/* About teaser */}
      <section className="bg-background py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-20 items-center">
            <FadeIn className="md:col-span-2">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={
                    settings?.aboutImageUrl ??
                    "https://res.cloudinary.com/demo/image/upload/v1/samples/people/smiling-man.jpg"
                  }
                  alt="Cara Wei"
                  fill
                  className="object-cover"
                />
              </div>
            </FadeIn>
            <FadeIn delay={0.1} className="md:col-span-3 space-y-6">
              <h2 className="font-heading text-3xl md:text-4xl font-normal tracking-tight">
                A photographer who listens before she shoots.
              </h2>
              <div className="space-y-4">
                {(settings?.aboutText ?? "")
                  .split("\n\n")
                  .slice(0, 2)
                  .map((para, i) => (
                    <p
                      key={i}
                      className="font-sans text-base font-light leading-7 text-muted-foreground"
                    >
                      {para}
                    </p>
                  ))}
              </div>
              <Link
                href="/about"
                className="inline-block font-sans text-xs uppercase tracking-[0.2em] border-b border-foreground pb-0.5 hover:border-primary hover:text-primary transition-colors"
              >
                Meet Me →
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.08}>
              <blockquote className="space-y-4">
                <p className="font-heading italic text-xl md:text-2xl font-light leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="space-y-1">
                  <cite className="font-sans text-xs uppercase tracking-widest not-italic">
                    {t.name}
                  </cite>
                  <p className="font-sans text-xs text-muted-foreground">
                    {t.detail}
                  </p>
                </footer>
              </blockquote>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Journal preview */}
      {stories.length > 0 && (
        <section className="bg-background py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-20">
            <div className="mb-12 flex items-end justify-between">
              <h2 className="font-heading text-3xl md:text-4xl font-normal tracking-tight">
                From the Journal
              </h2>
              <Link
                href="/journal"
                className="font-sans text-xs uppercase tracking-[0.2em] border-b border-foreground pb-0.5 hover:border-primary hover:text-primary transition-colors"
              >
                All Stories
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {stories.map((story, i) => (
                <FadeIn key={story.id} delay={i * 0.08}>
                <Link
                  href={`/journal/${story.slug}`}
                  className="group block space-y-4"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={story.coverImageUrl}
                      alt={story.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
                      {story.publishedAt
                        ? new Intl.DateTimeFormat("en-US", {
                            month: "long",
                            year: "numeric",
                          }).format(story.publishedAt)
                        : ""}
                    </p>
                    <h3 className="font-heading text-2xl font-normal tracking-tight transition-colors group-hover:text-primary">
                      {story.title}
                    </h3>
                    <p className="line-clamp-2 font-sans text-sm font-light text-muted-foreground">
                      {story.excerpt}
                    </p>
                  </div>
                </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-muted py-24 md:py-32">
        <FadeIn className="mx-auto max-w-2xl px-6 text-center space-y-8">
          <h2 className="font-heading text-3xl md:text-5xl font-normal tracking-tight">
            Let&rsquo;s make something beautiful.
          </h2>
          <p className="font-sans text-base font-light leading-7 text-muted-foreground">
            A limited number of weddings are accepted each year. Reach out to
            check availability for your date.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-foreground text-background font-sans text-xs uppercase tracking-[0.2em] px-10 py-4 hover:opacity-90 transition-opacity"
          >
            Get in Touch
          </Link>
        </FadeIn>
      </section>
    </>
  );
}
