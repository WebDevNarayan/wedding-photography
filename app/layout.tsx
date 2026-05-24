import type { Metadata } from "next";
import { inter, cormorant } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Cara Wei Photography",
    template: "%s | Cara Wei Photography",
  },
  description:
    "Luxury wedding and editorial photography. Capturing timeless, authentic moments with a warm, film-inspired aesthetic.",
  keywords: ["wedding photography", "editorial photography", "luxury photographer"],
  authors: [{ name: "Cara Wei" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Cara Wei Photography",
    title: "Cara Wei Photography",
    description:
      "Luxury wedding and editorial photography. Capturing timeless, authentic moments with a warm, film-inspired aesthetic.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cara Wei Photography",
    description:
      "Luxury wedding and editorial photography. Capturing timeless, authentic moments.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
