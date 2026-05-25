"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

const NAV_BLOCKS = [
  { label: "Work", href: "/portfolio" },
  { label: "Journal", href: "/journal" },
  { label: "Investment", href: "/investment" },
  { label: "Contact", href: "/contact" },
];

function Block({
  label,
  href,
  image,
}: {
  label: string;
  href: string;
  image?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <Link
      ref={ref}
      href={href}
      className="group relative flex h-[60vh] w-full items-center justify-center overflow-hidden bg-muted"
    >
      {image && (
        <motion.div style={{ y }} className="absolute inset-0 scale-125">
          <Image src={image} alt="" fill priority className="object-cover" />
        </motion.div>
      )}
      <div className="absolute inset-0 bg-black/40 transition-colors duration-500 group-hover:bg-black/55" />
      <span className="relative z-10 font-heading text-5xl md:text-6xl font-light uppercase tracking-widest text-white transition-transform duration-500 group-hover:scale-95">
        {label}
      </span>
    </Link>
  );
}

export function SectionNavBlocks({ images = [] }: { images?: string[] }) {
  return (
    <div className="flex flex-col">
      {NAV_BLOCKS.map((b, i) => (
        <Block key={b.href} {...b} image={images[i]} />
      ))}
    </div>
  );
}
