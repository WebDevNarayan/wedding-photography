"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

type GalleryImage = {
  id: string;
  url: string;
  caption: string | null;
  order: number;
  blurDataUrl: string | null;
};

// Repeating 6-slot editorial layout pattern
const LAYOUT = [
  { col: "col-span-3", aspect: "aspect-[16/7]" },
  { col: "col-span-2", aspect: "aspect-[3/4]" },
  { col: "col-span-1", aspect: "aspect-[3/4]" },
  { col: "col-span-1", aspect: "aspect-[3/4]" },
  { col: "col-span-2", aspect: "aspect-[3/4]" },
  { col: "col-span-3", aspect: "aspect-[21/9]" },
] as const;

export function GalleryDetailImages({ images }: { images: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  return (
    <>
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {images.map((image, i) => {
          const layout = LAYOUT[i % LAYOUT.length];
          return (
            <button
              key={image.id}
              onClick={() => setLightboxIndex(i)}
              className={`block ${layout.col} ${layout.aspect} relative overflow-hidden cursor-zoom-in group`}
            >
              <Image
                src={image.url}
                alt={image.caption ?? ""}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                placeholder={image.blurDataUrl ? "blur" : "empty"}
                blurDataURL={image.blurDataUrl ?? undefined}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 60vw"
              />
            </button>
          );
        })}
      </div>

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={images.map((img) => ({
          src: img.url,
          alt: img.caption ?? undefined,
        }))}
      />
    </>
  );
}
