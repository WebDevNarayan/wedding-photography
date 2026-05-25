import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";
import { slugify } from "@/lib/utils";

const CATEGORIES = ["WEDDING", "ENGAGEMENT", "PORTRAIT", "EDITORIAL"] as const;

const createSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.enum(CATEGORIES),
  location: z.string().optional(),
  date: z.string().optional(),
  coverImageUrl: z.string().url(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
});

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const galleries = await prisma.gallery.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { images: true } } },
  });

  return NextResponse.json(galleries);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { title, slug, date, coverImageUrl, ...rest } = parsed.data;
  const finalSlug = slug ?? slugify(title);

  const existing = await prisma.gallery.findUnique({ where: { slug: finalSlug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const gallery = await prisma.gallery.create({
    data: {
      title,
      slug: finalSlug,
      coverImageUrl,
      date: date ? new Date(date) : undefined,
      ...rest,
    },
  });

  return NextResponse.json(gallery, { status: 201 });
}
