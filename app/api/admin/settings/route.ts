import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";

const settingsSchema = z.object({
  heroHeadline: z.string().min(1),
  heroSubheading: z.string().min(1),
  aboutText: z.string().min(1),
  aboutImageUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  navImageWork: z.string().optional(),
  navImageJournal: z.string().optional(),
  navImageInvestment: z.string().optional(),
  navImageContact: z.string().optional(),
  featuredGalleryIds: z.array(z.string()).optional(),
});

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { featuredGalleryIds, ...settingsData } = parsed.data;

  const [settings] = await prisma.$transaction([
    prisma.siteSettings.upsert({
      where: { id: 1 },
      update: settingsData,
      create: { id: 1, ...settingsData },
    }),
    prisma.gallery.updateMany({
      where: {},
      data: { featured: false },
    }),
    ...(featuredGalleryIds && featuredGalleryIds.length > 0
      ? [
          prisma.gallery.updateMany({
            where: { id: { in: featuredGalleryIds } },
            data: { featured: true },
          }),
        ]
      : []),
  ]);

  return NextResponse.json(settings);
}
