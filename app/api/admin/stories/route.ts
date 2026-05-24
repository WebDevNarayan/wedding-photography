import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";
import { slugify } from "@/lib/utils";

const createSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).optional(),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  coverImageUrl: z.string().optional(),
  published: z.boolean(),
  publishedAt: z.string().optional(),
  galleryId: z.string().optional(),
});

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const stories = await prisma.story.findMany({
    orderBy: { createdAt: "desc" },
    include: { gallery: { select: { id: true, title: true } } },
  });

  return NextResponse.json(stories);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { title, slug, publishedAt, galleryId, ...rest } = parsed.data;
  const finalSlug = slug ?? slugify(title);

  const existing = await prisma.story.findUnique({ where: { slug: finalSlug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const story = await prisma.story.create({
    data: {
      title,
      slug: finalSlug,
      publishedAt: publishedAt ? new Date(publishedAt) : undefined,
      galleryId: galleryId || undefined,
      ...rest,
    },
  });

  return NextResponse.json(story, { status: 201 });
}
