import { type Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { GalleryTable } from "@/components/admin/gallery-table";
import { Plus } from "lucide-react";

export const metadata: Metadata = { title: "Galleries" };

export default async function GalleriesPage() {
  const galleries = await prisma.gallery.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { images: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-light tracking-tight">Galleries</h1>
          <p className="mt-1 text-sm text-muted-foreground">{galleries.length} total</p>
        </div>
        <Button render={<Link href="/admin/galleries/new" />}>
          <Plus className="mr-2 h-4 w-4" /> New Gallery
        </Button>
      </div>

      <GalleryTable galleries={galleries} />
    </div>
  );
}
