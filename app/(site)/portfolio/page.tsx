import { prisma } from "@/lib/prisma";
import { PortfolioFeed } from "@/components/site/portfolio-feed";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work | Cara Wei Photography",
  description: "Documentary wedding photography in New York and beyond.",
};

export const revalidate = 60;

export default async function PortfolioPage() {
  const galleries = await prisma.gallery.findMany({
    where: { published: true },
    orderBy: { date: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      location: true,
      date: true,
      coverImageUrl: true,
    },
  });

  const serialized = galleries.map((g) => ({
    ...g,
    date: g.date ? g.date.toISOString() : null,
  }));

  return (
    <main className="min-h-screen bg-background">
      <div className="px-6 md:px-12 lg:px-20 pt-32 pb-16">
        <h1 className="font-heading text-[72px] md:text-[96px] lg:text-[120px] font-light leading-none tracking-tight">
          Work
        </h1>
      </div>
      <PortfolioFeed galleries={serialized} />
    </main>
  );
}
