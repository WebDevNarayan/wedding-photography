import Link from "next/link";
import { prisma } from "@/lib/prisma";

const NAV_ITEMS = [
  { label: "Work", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Journal", href: "/journal" },
  { label: "Investment", href: "/investment" },
  { label: "Contact", href: "/contact" },
] as const;

export async function SiteFooter() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-12 lg:px-16">

        {/* Main columns */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">

          {/* Logo + tagline */}
          <div className="space-y-5">
            <Link
              href="/"
              className="block font-heading text-2xl font-light tracking-[0.25em] uppercase text-foreground"
            >
              Cara Wei
            </Link>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground leading-relaxed">
              Documentary Wedding<br />Photography
            </p>
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground/70">
              New York & Worldwide
            </p>
          </div>

          {/* Site navigation */}
          <nav aria-label="Footer navigation" className="space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-foreground mb-5">Navigate</p>
            {NAV_ITEMS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="block text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Contact + Social */}
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-foreground mb-5">Connect</p>
            {settings?.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Instagram
              </a>
            )}
            {settings?.email && (
              <a
                href={`mailto:${settings.email}`}
                className="block text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {settings.email}
              </a>
            )}
            {settings?.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="block text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {settings.phone}
              </a>
            )}
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-16 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground/70">
            © {new Date().getFullYear()} Cara Wei Photography. All rights reserved.
          </p>
          <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground/50">
            Currently booking 2025–2026
          </p>
        </div>
      </div>
    </footer>
  );
}
