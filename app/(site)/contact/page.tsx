import { ContactForm } from "@/components/site/contact-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Cara Wei Photography",
  description:
    "Get in touch to discuss your wedding day. Currently booking 2025–2026.",
};

export default function ContactPage() {
  return (
    <main className="bg-background min-h-screen">
      {/* Hero */}
      <div className="bg-muted pt-32 pb-16 text-center px-6">
        <h1 className="font-heading text-[72px] md:text-[96px] font-light leading-none tracking-tight">
          Contact
        </h1>
        <p className="mt-4 font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Let's start a conversation
        </p>
      </div>

      {/* Two-column layout */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-16 md:gap-24">
            {/* Left col — 40% */}
            <aside className="md:col-span-2 space-y-10">
              <div className="space-y-2">
                <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
                  Email
                </p>
                <a
                  href="mailto:hello@carawei.com"
                  className="font-sans text-sm font-light hover:text-primary transition-colors"
                >
                  hello@carawei.com
                </a>
              </div>

              <div className="space-y-2">
                <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
                  Phone
                </p>
                <a
                  href="tel:+12125550100"
                  className="font-sans text-sm font-light hover:text-primary transition-colors"
                >
                  +1 (212) 555-0100
                </a>
              </div>

              <div className="space-y-2">
                <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
                  Instagram
                </p>
                <a
                  href="https://instagram.com/caraweiphoto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm font-light hover:text-primary transition-colors"
                >
                  @caraweiphoto
                </a>
              </div>

              <div className="space-y-2">
                <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
                  Based In
                </p>
                <p className="font-sans text-sm font-light">
                  New York City — available worldwide
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Availability
                </p>
                <p className="font-heading text-xl font-light tracking-tight">
                  Currently booking 2025–2026
                </p>
              </div>
            </aside>

            {/* Right col — 60% */}
            <div className="md:col-span-3">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
