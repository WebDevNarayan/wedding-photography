"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Image from "next/image";

interface HeroProps {
  headline: string;
  imageUrl?: string;
}

export function Hero({ headline, imageUrl }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 scale-110">
        <Image
          src={
            imageUrl ??
            "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/nature-italy.jpg"
          }
          alt=""
          fill
          className="object-cover"
          priority
        />
      </motion.div>
      <div className="absolute inset-0 bg-black/35" />
      <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
        <h1 className="font-heading text-[72px] md:text-[96px] lg:text-[120px] font-light leading-none tracking-tight text-white max-w-5xl">
          {headline}
        </h1>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <span className="font-sans text-xs uppercase tracking-[0.3em] text-white/60">
          Scroll
        </span>
      </div>
    </section>
  );
}
