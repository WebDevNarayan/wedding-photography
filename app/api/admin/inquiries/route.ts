import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";

const VALID_STATUSES = ["NEW", "READ", "REPLIED", "ARCHIVED"] as const;
type InquiryStatus = typeof VALID_STATUSES[number];

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const status = req.nextUrl.searchParams.get("status") as InquiryStatus | null;

  const inquiries = await prisma.inquiry.findMany({
    where: status && VALID_STATUSES.includes(status) ? { status } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(inquiries);
}
