import { prisma } from "@/lib/prisma";
import { GalleryDetailImages } from "@/components/site/gallery-detail-images";
import { photographSchema } from "@/lib/structured-data";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  const galleries = await prisma.gallery.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return galleries.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const gallery = await prisma.gallery.findUnique({
    where: { slug },
    select: { title: true, location: true, coverImageUrl: true },
  });
  if (!gallery) return {};
  const title = gallery.location
    ? `${gallery.title} · ${gallery.location}`
    : gallery.title;
  return {
    title: `${title} | Cara Wei Photography`,
    openGraph: { images: [gallery.coverImageUrl] },
  };
}

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const gallery = await prisma.gallery.findUnique({
    where: { slug, published: true },
    include: {
      images: { orderBy: { order: "asc" } },
      stories: {
        where: { published: true },
        take: 1,
        select: { slug: true, excerpt: true },
      },
    },
  });

  if (!gallery) notFound();

  const story = gallery.stories[0] ?? null;

  const [prevGallery, nextGallery] = gallery.date
    ? await Promise.all([
        prisma.gallery.findFirst({
          where: {
            published: true,
            date: { lt: gallery.date },
            slug: { not: slug },
          },
          orderBy: { date: "desc" },
          select: { slug: true, title: true, coverImageUrl: true },
        }),
        prisma.gallery.findFirst({
          where: {
            published: true,
            date: { gt: gallery.date },
            slug: { not: slug },
          },
          orderBy: { date: "asc" },
          select: { slug: true, title: true, coverImageUrl: true },
        }),
      ])
    : [null, null];

  return (
    <main className="min-h-screen bg-background">
      <Script
        id="schema-photograph"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            photographSchema({
              title: gallery.title,
              description: gallery.description,
              imageUrl: gallery.coverImageUrl,
              slug,
              date: gallery.date,
              location: gallery.location,
            })
          ),
        }}
      />
      {/* Hero */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        <Image
          src={gallery.coverImageUrl}
          alt={gallery.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-10 left-6 md:left-12 lg:left-20 space-y-2">
          <p className="font-sans text-xs uppercase tracking-widest text-white/80">
            {gallery.category}
            {gallery.location && ` · ${gallery.location}`}
            {gallery.date &&
              ` · ${new Intl.DateTimeFormat("en-US", {
                month: "long",
                year: "numeric",
              }).format(gallery.date)}`}
          </p>
          <h1 className="font-heading text-5xl md:text-6xl font-light leading-tight tracking-tight text-white">
            {gallery.title}
          </h1>
        </div>
      </div>

      {/* Story excerpt */}
      {story && (
        <section className="bg-muted py-20 md:py-28">
          <div className="mx-auto max-w-2xl px-6 text-center space-y-6">
            <p className="font-heading italic text-2xl md:text-3xl font-light leading-relaxed">
              &ldquo;{story.excerpt}&rdquo;
            </p>
            <Link
              href={`/journal/${story.slug}`}
              className="inline-block font-sans text-xs uppercase tracking-[0.2em] border-b border-foreground pb-0.5 hover:border-primary hover:text-primary transition-colors"
            >
              Read the Story →
            </Link>
          </div>
        </section>
      )}

      {/* Images */}
      {gallery.images.length > 0 && (
        <section className="px-6 md:px-12 lg:px-20 py-16 md:py-24">
          <GalleryDetailImages images={gallery.images} />
        </section>
      )}

      {/* Prev / Next */}
      {(prevGallery || nextGallery) && (
        <nav className="border-t border-border py-12 px-6 md:px-12 lg:px-20">
          <div className="flex items-center justify-between">
            {prevGallery ? (
              <Link
                href={`/portfolio/${prevGallery.slug}`}
                className="group flex items-center gap-4"
              >
                <div className="relative w-16 h-16 overflow-hidden shrink-0">
                  <Image
                    src={prevGallery.coverImageUrl}
                    alt={prevGallery.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div>
                  <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
                    ← Previous
                  </p>
                  <p className="font-heading text-xl font-normal">
                    {prevGallery.title}
                  </p>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextGallery && (
              <Link
                href={`/portfolio/${nextGallery.slug}`}
                className="group flex items-center gap-4 text-right"
              >
                <div>
                  <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
                    Next →
                  </p>
                  <p className="font-heading text-xl font-normal">
                    {nextGallery.title}
                  </p>
                </div>
                <div className="relative w-16 h-16 overflow-hidden shrink-0">
                  <Image
                    src={nextGallery.coverImageUrl}
                    alt={nextGallery.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </Link>
            )}
          </div>
        </nav>
      )}
    </main>
  );
}
