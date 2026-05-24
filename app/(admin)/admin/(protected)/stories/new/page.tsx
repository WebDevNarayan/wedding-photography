import { type Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { StoryForm } from "@/components/admin/story-form";

export const metadata: Metadata = { title: "New Story" };

export default async function NewStoryPage() {
  const galleries = await prisma.gallery.findMany({
    where: { published: true },
    orderBy: { title: "asc" },
    select: { id: true, title: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-light tracking-tight">New Story</h1>
        <p className="mt-1 text-sm text-muted-foreground">Write a new journal entry</p>
      </div>
      <StoryForm galleries={galleries} />
    </div>
  );
}
