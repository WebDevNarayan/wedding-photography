"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Work", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Journal", href: "/journal" },
  { label: "Investment", href: "/investment" },
  { label: "Contact", href: "/contact" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isHomePage = pathname === "/";
  const headerSolid = scrolled || menuOpen;
  // Only use white text on the home page hero — all other pages have light backgrounds
  const lightText = isHomePage && !headerSolid;

  return (
    <>
      {/* ── Header bar ── */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-all duration-500",
          "flex h-14 items-center px-6 md:h-20 md:px-12 lg:px-16",
          headerSolid
            ? "bg-background/95 backdrop-blur-md border-b border-border/60"
            : "bg-transparent"
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            "font-heading text-sm font-light tracking-[0.28em] uppercase transition-colors duration-300 md:text-base",
            lightText ? "text-white" : "text-foreground"
          )}
        >
          Cara Wei
        </Link>

        {/* Desktop navigation */}
        <nav className="ml-auto hidden items-center gap-10 md:flex" aria-label="Main navigation">
          {NAV_ITEMS.map(({ label, href }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative text-xs uppercase tracking-[0.22em] transition-colors duration-300 pb-px",
                  "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100",
                  lightText
                    ? "text-white/80 hover:text-white after:bg-white"
                    : "text-muted-foreground hover:text-foreground after:bg-foreground",
                  active && (lightText
                    ? "text-white after:scale-x-100 after:bg-white"
                    : "text-foreground after:scale-x-100 after:bg-foreground")
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className={cn(
            "ml-auto rounded-sm p-1 transition-colors duration-300 md:hidden",
            lightText ? "text-white" : "text-foreground"
          )}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <AnimatePresence mode="wait" initial={false}>
            {menuOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="block"
              >
                <X className="h-5 w-5" />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="block"
              >
                <Menu className="h-5 w-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </header>

      {/* ── Mobile full-screen overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-background md:hidden"
            aria-modal="true"
          >
            <nav className="flex flex-col items-center gap-7" aria-label="Mobile navigation">
              {NAV_ITEMS.map(({ label, href }, i) => {
                const active = pathname === href;
                return (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.08 + i * 0.065, ease: "easeOut" }}
                  >
                    <Link
                      href={href}
                      className={cn(
                        "font-heading text-[2.5rem] font-light leading-none tracking-tight transition-colors",
                        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Social links at bottom */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="absolute bottom-12 flex gap-8"
            >
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
              >
                Instagram
              </a>
              <a
                href="mailto:hello@carawei.com"
                className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
              >
                Email
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
