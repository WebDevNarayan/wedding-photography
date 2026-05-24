import { type Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { StoryTable } from "@/components/admin/story-table";
import { Plus } from "lucide-react";

export const metadata: Metadata = { title: "Stories" };

export default async function StoriesPage() {
  const stories = await prisma.story.findMany({
    orderBy: { createdAt: "desc" },
    include: { gallery: { select: { id: true, title: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-light tracking-tight">Stories</h1>
          <p className="mt-1 text-sm text-muted-foreground">{stories.length} total</p>
        </div>
        <Button render={<Link href="/admin/stories/new" />}>
          <Plus className="mr-2 h-4 w-4" /> New Story
        </Button>
      </div>

      <StoryTable stories={stories} />
    </div>
  );
}
