import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Journal | Cara Wei Photography",
  description: "Stories, reflections, and wedding days beautifully told.",
};

export default async function JournalPage() {
  const stories = await prisma.story.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      coverImageUrl: true,
      publishedAt: true,
    },
  });

  return (
    <main className="bg-background min-h-screen">
      {/* Hero */}
      <div className="bg-muted pt-32 pb-16 text-center">
        <h1 className="font-heading text-[72px] md:text-[96px] font-light leading-none tracking-tight">
          Journal
        </h1>
      </div>

      {/* Grid */}
      <section className="mx-auto max-w-6xl px-6 md:px-12 lg:px-20 py-20 md:py-28">
        {stories.length === 0 ? (
          <p className="font-sans text-sm text-muted-foreground text-center py-20">
            No stories published yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            {stories.map((story) => (
              <Link
                key={story.id}
                href={`/journal/${story.slug}`}
                className="group block space-y-4"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={story.coverImageUrl}
                    alt={story.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="space-y-2">
                  {story.publishedAt && (
                    <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }).format(story.publishedAt)}
                    </p>
                  )}
                  <h3 className="font-heading text-2xl font-normal tracking-tight transition-colors group-hover:text-primary">
                    {story.title}
                  </h3>
                  <p className="font-sans text-sm font-light leading-6 text-muted-foreground line-clamp-2">
                    {story.excerpt}
                  </p>
                  <span className="inline-block font-sans text-xs uppercase tracking-[0.2em] border-b border-foreground pb-0.5 group-hover:border-primary group-hover:text-primary transition-colors">
                    Read More →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
