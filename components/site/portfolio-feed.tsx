import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/shared/fade-in";

type GalleryItem = {
  id: string;
  slug: string;
  title: string;
  location: string | null;
  date: string | null;
  coverImageUrl: string;
};

type FeedBlock =
  | { type: "full"; gallery: GalleryItem }
  | { type: "centered"; gallery: GalleryItem }
  | { type: "pair"; galleries: GalleryItem[] };

function buildBlocks(galleries: GalleryItem[]): FeedBlock[] {
  const blocks: FeedBlock[] = [];
  let i = 0;
  let slot = 0;
  while (i < galleries.length) {
    const s = slot % 3;
    if (s === 0) {
      blocks.push({ type: "full", gallery: galleries[i] });
      i++;
    } else if (s === 1) {
      blocks.push({
        type: "pair",
        galleries: galleries.slice(i, Math.min(i + 2, galleries.length)),
      });
      i += 2;
    } else {
      blocks.push({ type: "centered", gallery: galleries[i] });
      i++;
    }
    slot++;
  }
  return blocks;
}

function GalleryCard({
  gallery,
  aspectClass,
}: {
  gallery: GalleryItem;
  aspectClass: string;
}) {
  return (
    <Link href={`/portfolio/${gallery.slug}`} className="block group">
      <div className={`relative ${aspectClass} overflow-hidden`}>
        <Image
          src={gallery.coverImageUrl}
          alt={gallery.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 80vw"
        />
      </div>
      <div className="mt-4 space-y-1">
        <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
          {gallery.location}
          {gallery.date && (
            <>
              {" · "}
              {new Intl.DateTimeFormat("en-US", {
                month: "long",
                year: "numeric",
              }).format(new Date(gallery.date))}
            </>
          )}
        </p>
        <h2 className="font-heading text-2xl font-normal tracking-tight transition-colors group-hover:text-primary">
          {gallery.title}
        </h2>
      </div>
    </Link>
  );
}

export function PortfolioFeed({ galleries }: { galleries: GalleryItem[] }) {
  const blocks = buildBlocks(galleries);

  return (
    <div className="px-6 md:px-12 lg:px-20 pb-32 space-y-20 md:space-y-28">
      {blocks.map((block, i) => {
        if (block.type === "full") {
          return (
            <FadeIn key={block.gallery.id}>
              <GalleryCard gallery={block.gallery} aspectClass="aspect-[16/9]" />
            </FadeIn>
          );
        }
        if (block.type === "centered") {
          return (
            <FadeIn key={block.gallery.id} className="w-[62%] mx-auto">
              <GalleryCard gallery={block.gallery} aspectClass="aspect-[3/4]" />
            </FadeIn>
          );
        }
        return (
          <FadeIn key={i}>
            <div className="grid grid-cols-2 gap-6 md:gap-10">
              {block.galleries.map((g) => (
                <GalleryCard key={g.id} gallery={g} aspectClass="aspect-[3/4]" />
              ))}
            </div>
          </FadeIn>
        );
      })}
    </div>
  );
}
