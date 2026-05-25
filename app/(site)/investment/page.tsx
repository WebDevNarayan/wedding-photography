import Link from "next/link";
import { Check } from "lucide-react";
import { FaqAccordion } from "@/components/site/faq-accordion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investment | Cara Wei Photography",
  description:
    "Transparent wedding photography pricing. Full-day coverage, fine art albums, and worldwide travel.",
};

const PACKAGES = [
  {
    name: "Essential",
    price: "From $3,500",
    description: "Perfect for intimate ceremonies and elopements.",
    inclusions: [
      "6 hours of coverage",
      "300+ edited images",
      "Online delivery gallery",
      "Personal print rights",
    ],
    featured: false,
  },
  {
    name: "Full Day",
    price: "From $5,800",
    description: "Our most-loved package for full wedding days.",
    inclusions: [
      "10 hours of coverage",
      "500+ edited images",
      "Engagement session included",
      "Online delivery gallery",
      "Album credit ($500)",
      "Personal print rights",
    ],
    featured: true,
  },
  {
    name: "Premium Collection",
    price: "From $9,500",
    description: "The complete experience, from rehearsal to reception.",
    inclusions: [
      "Two photographers",
      "12 hours of coverage",
      "Rehearsal dinner coverage",
      "800+ edited images",
      "Engagement session included",
      "Luxury fine art album",
      "Personal print rights",
    ],
    featured: false,
  },
];

const ADDONS = [
  {
    name: "Engagement Session",
    description: "2-hour session at a location of your choice.",
    price: "$650",
  },
  {
    name: "Rehearsal Dinner",
    description: "3 hours of coverage the evening before.",
    price: "$900",
  },
  {
    name: "Second Photographer",
    description: "Full-day additional coverage for large venues.",
    price: "$800",
  },
  {
    name: "Fine Art Album",
    description: "Heirloom-quality layflat album, 30–50 spreads.",
    price: "From $1,200",
  },
  {
    name: "Rush Delivery",
    description: "Full gallery delivered within 3 weeks.",
    price: "$400",
  },
];

export default function InvestmentPage() {
  return (
    <main className="bg-background min-h-screen">
      {/* Hero */}
      <div className="bg-muted pt-32 pb-16 text-center px-6">
        <h1 className="font-heading text-[72px] md:text-[96px] font-light leading-none tracking-tight">
          Investment
        </h1>
        <p className="mt-4 font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Transparent pricing. No surprises.
        </p>
      </div>

      {/* Intro */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-2xl px-6 space-y-6">
          <p className="font-sans text-base font-light leading-7 text-muted-foreground">
            Wedding photography is one of the few things from your day you'll
            still have in 40 years. I take that seriously — in how I shoot, how
            I edit, and how I deliver your gallery.
          </p>
          <p className="font-sans text-base font-light leading-7 text-muted-foreground">
            Every package includes thoughtful, color-accurate editing, an
            easy-to-use delivery gallery, and personal print rights so you can
            share and display your images however you like.
          </p>
          <p className="font-sans text-base font-light leading-7 text-muted-foreground">
            Pricing below is a starting point. Reach out and I'll put together
            something tailored to your day.
          </p>
        </div>
      </section>

      {/* Packages */}
      <section className="bg-muted py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className={`flex flex-col p-8 md:p-10 bg-background ${
                  pkg.featured ? "border border-primary" : ""
                }`}
              >
                <div className="space-y-2 mb-8">
                  <h3 className="font-heading text-2xl font-normal tracking-tight">
                    {pkg.name}
                  </h3>
                  <p className="font-sans text-2xl font-light text-foreground">
                    {pkg.price}
                  </p>
                  <p className="font-sans text-sm font-light text-muted-foreground">
                    {pkg.description}
                  </p>
                </div>
                <ul className="space-y-3 flex-1 mb-10">
                  {pkg.inclusions.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="size-4 shrink-0 mt-0.5 text-primary" />
                      <span className="font-sans text-sm font-light">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`block text-center font-sans text-xs uppercase tracking-[0.2em] py-3 transition-colors ${
                    pkg.featured
                      ? "bg-foreground text-background hover:opacity-90"
                      : "border border-foreground hover:bg-foreground hover:text-background"
                  }`}
                >
                  Inquire Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-heading text-3xl md:text-4xl font-normal tracking-tight mb-12">
            Add-Ons
          </h2>
          <div className="divide-y divide-border">
            {ADDONS.map((addon) => (
              <div
                key={addon.name}
                className="flex items-start justify-between py-6 gap-8"
              >
                <div className="space-y-1">
                  <p className="font-sans text-sm font-normal">{addon.name}</p>
                  <p className="font-sans text-sm font-light text-muted-foreground">
                    {addon.description}
                  </p>
                </div>
                <span className="font-sans text-sm font-light shrink-0">
                  {addon.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-heading text-3xl md:text-4xl font-normal tracking-tight mb-12">
            Common Questions
          </h2>
          <FaqAccordion />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-xl px-6 text-center space-y-8">
          <h2 className="font-heading text-3xl md:text-5xl font-normal tracking-tight">
            Ready to book your date?
          </h2>
          <Link
            href="/contact"
            className="inline-block bg-foreground text-background font-sans text-xs uppercase tracking-[0.2em] px-10 py-4 hover:bg-primary transition-colors"
          >
            Book Now
          </Link>
        </div>
      </section>
    </main>
  );
}
