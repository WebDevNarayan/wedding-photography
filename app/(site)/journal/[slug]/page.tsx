import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  const stories = await prisma.story.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return stories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = await prisma.story.findUnique({
    where: { slug },
    select: { title: true, excerpt: true, coverImageUrl: true },
  });
  if (!story) return {};
  return {
    title: `${story.title} | Cara Wei Photography`,
    description: story.excerpt,
    openGraph: { images: [story.coverImageUrl] },
  };
}

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const story = await prisma.story.findUnique({
    where: { slug, published: true },
    include: {
      gallery: {
        select: { slug: true, title: true, coverImageUrl: true },
      },
    },
  });

  if (!story) notFound();

  const minutes = readingTime(story.content);

  return (
    <main className="bg-background min-h-screen">
      {/* Hero */}
      <div className="relative w-full h-[70vh] overflow-hidden">
        <Image
          src={story.coverImageUrl}
          alt={story.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-10 left-6 md:left-12 lg:left-20 max-w-3xl space-y-3">
          {story.publishedAt && (
            <p className="font-sans text-xs uppercase tracking-widest text-white/70">
              {new Intl.DateTimeFormat("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }).format(story.publishedAt)}
            </p>
          )}
          <h1 className="font-heading text-4xl md:text-6xl font-light leading-tight tracking-tight text-white">
            {story.title}
          </h1>
        </div>
      </div>

      {/* Article */}
      <article className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        <div className="mb-10 flex items-center gap-4 font-sans text-xs uppercase tracking-widest text-muted-foreground">
          {story.publishedAt && (
            <span>
              {new Intl.DateTimeFormat("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }).format(story.publishedAt)}
            </span>
          )}
          <span>&middot;</span>
          <span>{minutes} min read</span>
        </div>

        <div className="prose prose-stone prose-lg max-w-none font-sans font-light leading-7 [&_h1]:font-heading [&_h2]:font-heading [&_h3]:font-heading [&_h1]:font-normal [&_h2]:font-normal [&_h3]:font-normal [&_blockquote]:font-heading [&_blockquote]:italic [&_blockquote]:not-italic [&_blockquote]:font-light [&_blockquote]:text-2xl [&_a]:text-foreground [&_a]:underline-offset-4">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {story.content}
          </ReactMarkdown>
        </div>
      </article>

      {/* Linked gallery CTA */}
      {story.gallery && (
        <section className="bg-muted py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-6 md:px-12">
            <Link
              href={`/portfolio/${story.gallery.slug}`}
              className="group grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={story.gallery.coverImageUrl}
                  alt={story.gallery.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="space-y-4">
                <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
                  Full Gallery
                </p>
                <h3 className="font-heading text-3xl font-normal tracking-tight">
                  {story.gallery.title}
                </h3>
                <span className="inline-block font-sans text-xs uppercase tracking-[0.2em] border-b border-foreground pb-0.5 group-hover:border-primary group-hover:text-primary transition-colors">
                  See the Full Gallery →
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Back link */}
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link
          href="/journal"
          className="font-sans text-xs uppercase tracking-[0.2em] border-b border-foreground pb-0.5 hover:border-primary hover:text-primary transition-colors"
        >
          ← Back to Journal
        </Link>
      </div>
    </main>
  );
}
