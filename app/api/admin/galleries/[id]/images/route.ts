import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";

const imageSchema = z.object({
  url: z.string().url(),
  blurDataUrl: z.string().optional(),
  caption: z.string().optional(),
  order: z.number().int().min(0),
});

const bodySchema = z.array(imageSchema);

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const gallery = await prisma.gallery.findUnique({ where: { id } });
  if (!gallery) return NextResponse.json({ error: "Gallery not found" }, { status: 404 });

  const images = await prisma.$transaction(
    parsed.data.map((img) =>
      prisma.galleryImage.create({ data: { ...img, galleryId: id } })
    )
  );

  return NextResponse.json(images, { status: 201 });
}
