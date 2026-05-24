import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { GalleryForm } from "@/components/admin/gallery-form";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const gallery = await prisma.gallery.findUnique({ where: { id }, select: { title: true } });
  return { title: gallery ? `Edit — ${gallery.title}` : "Edit Gallery" };
}

export default async function EditGalleryPage({ params }: Props) {
  const { id } = await params;

  const gallery = await prisma.gallery.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!gallery) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-light tracking-tight">Edit Gallery</h1>
        <p className="mt-1 text-sm text-muted-foreground">{gallery.title}</p>
      </div>
      <GalleryForm
        galleryId={id}
        defaultValues={{
          title: gallery.title,
          slug: gallery.slug,
          description: gallery.description ?? undefined,
          category: gallery.category as "WEDDING" | "ENGAGEMENT" | "PORTRAIT" | "EDITORIAL",
          location: gallery.location ?? undefined,
          date: gallery.date ? gallery.date.toISOString().split("T")[0] : undefined,
          coverImageUrl: gallery.coverImageUrl,
          published: gallery.published,
          featured: gallery.featured,
        }}
        existingImages={gallery.images.map((img: typeof gallery.images[number]) => ({
          id: img.id,
          url: img.url,
          caption: img.caption,
          order: img.order,
          blurDataUrl: img.blurDataUrl,
        }))}
      />
    </div>
  );
}
