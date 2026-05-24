import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  return {
    title: "About | Cara Wei Photography",
    description:
      settings?.aboutText?.slice(0, 160) ??
      "Documentary wedding photographer based in New York.",
  };
}

const VALUES = [
  {
    heading: "Candid Moments",
    body: "I stay quiet, move slowly, and let the day unfold. The images that matter most are never posed.",
  },
  {
    heading: "Timeless Editing",
    body: "Film-inspired tones, rich shadows, and natural skin. No trends, no filters — just photographs that age beautifully.",
  },
  {
    heading: "Stress-Free Experience",
    body: "From the first email to the final gallery, I handle every detail so you can be fully present on your day.",
  },
];

export default async function AboutPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  const paragraphs = (settings?.aboutText ?? "").split("\n\n").filter(Boolean);

  return (
    <main className="bg-background">
      {/* Portrait image */}
      {settings?.aboutImageUrl && (
        <div className="relative w-full h-[80vh] overflow-hidden">
          <Image
            src={settings.aboutImageUrl}
            alt="Cara Wei"
            fill
            priority
            className="object-cover object-top"
            sizes="100vw"
          />
        </div>
      )}

      {/* Bio text */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-2xl px-6 space-y-8">
          <h1 className="font-heading text-5xl md:text-6xl font-light leading-tight tracking-tight">
            Hello, I&rsquo;m Cara.
          </h1>
          {paragraphs.length > 0 ? (
            <div className="space-y-6">
              {paragraphs.map((para, i) => (
                <p
                  key={i}
                  className="font-sans text-base font-light leading-7 text-muted-foreground"
                >
                  {para}
                </p>
              ))}
            </div>
          ) : (
            <p className="font-sans text-base font-light leading-7 text-muted-foreground">
              I&rsquo;m a documentary wedding photographer based in New York,
              capturing love stories as they naturally unfold.
            </p>
          )}
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {VALUES.map((v) => (
              <div key={v.heading} className="space-y-4">
                <h3 className="font-heading text-2xl font-normal tracking-tight">
                  {v.heading}
                </h3>
                <p className="font-sans text-sm font-light leading-6 text-muted-foreground">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press strip */}
      <section className="py-10 border-t border-b border-border">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground">
            As Seen In &nbsp;&middot;&nbsp; Vogue &nbsp;&middot;&nbsp; Brides
            &nbsp;&middot;&nbsp; The Knot &nbsp;&middot;&nbsp; Martha Stewart
            Weddings
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-xl px-6 text-center space-y-8">
          <h2 className="font-heading text-3xl md:text-5xl font-normal tracking-tight">
            Let&rsquo;s create something beautiful together.
          </h2>
          <Link
            href="/contact"
            className="inline-block bg-foreground text-background font-sans text-xs uppercase tracking-[0.2em] px-10 py-4 hover:bg-primary transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </main>
  );
}
