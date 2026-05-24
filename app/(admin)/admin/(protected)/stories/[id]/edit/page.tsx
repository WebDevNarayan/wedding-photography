import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StoryForm } from "@/components/admin/story-form";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const story = await prisma.story.findUnique({ where: { id }, select: { title: true } });
  return { title: story ? `Edit — ${story.title}` : "Edit Story" };
}

export default async function EditStoryPage({ params }: Props) {
  const { id } = await params;

  const [story, galleries] = await Promise.all([
    prisma.story.findUnique({ where: { id } }),
    prisma.gallery.findMany({
      where: { published: true },
      orderBy: { title: "asc" },
      select: { id: true, title: true },
    }),
  ]);

  if (!story) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-light tracking-tight">Edit Story</h1>
        <p className="mt-1 text-sm text-muted-foreground">{story.title}</p>
      </div>
      <StoryForm
        storyId={id}
        galleries={galleries}
        defaultValues={{
          title: story.title,
          slug: story.slug,
          excerpt: story.excerpt,
          content: story.content,
          coverImageUrl: story.coverImageUrl,
          published: story.published,
          publishedAt: story.publishedAt
            ? story.publishedAt.toISOString().split("T")[0]
            : undefined,
          galleryId: story.galleryId ?? undefined,
        }}
      />
    </div>
  );
}
