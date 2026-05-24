"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

const blocks = [
  {
    label: "Work",
    href: "/portfolio",
    image:
      "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/nature-italy.jpg",
  },
  {
    label: "Journal",
    href: "/journal",
    image:
      "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/girl-urban-view.jpg",
  },
  {
    label: "Investment",
    href: "/investment",
    image:
      "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/beach-boat.jpg",
  },
  {
    label: "Contact",
    href: "/contact",
    image:
      "https://res.cloudinary.com/demo/image/upload/v1/samples/people/smiling-man.jpg",
  },
];

function Block({
  label,
  href,
  image,
}: {
  label: string;
  href: string;
  image: string;
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
      className="group relative flex h-[60vh] w-full items-center justify-center overflow-hidden"
    >
      <motion.div style={{ y }} className="absolute inset-0 scale-125">
        <Image src={image} alt="" fill className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-black/40 transition-colors duration-500 group-hover:bg-black/55" />
      <span className="relative z-10 font-heading text-5xl md:text-6xl font-light uppercase tracking-widest text-white transition-transform duration-500 group-hover:scale-95">
        {label}
      </span>
    </Link>
  );
}

export function SectionNavBlocks() {
  return (
    <div className="flex flex-col">
      {blocks.map((b) => (
        <Block key={b.href} {...b} />
      ))}
    </div>
  );
}
