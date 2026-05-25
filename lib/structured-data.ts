const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://carawei.com";

export function websiteSchema(instagramUrl?: string | null) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Cara Wei Photography",
    url: BASE_URL,
    ...(instagramUrl && { sameAs: [instagramUrl] }),
  };
}

export function photographSchema({
  title,
  description,
  imageUrl,
  slug,
  date,
  location,
}: {
  title: string;
  description?: string | null;
  imageUrl: string;
  slug: string;
  date?: Date | null;
  location?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Photograph",
    name: title,
    ...(description && { description }),
    contentUrl: imageUrl,
    url: `${BASE_URL}/portfolio/${slug}`,
    ...(date && { dateCreated: date.toISOString().slice(0, 10) }),
    ...(location && { locationCreated: { "@type": "Place", name: location } }),
    creator: {
      "@type": "Person",
      name: "Cara Wei",
      url: BASE_URL,
    },
  };
}

export function blogPostingSchema({
  title,
  excerpt,
  imageUrl,
  slug,
  publishedAt,
}: {
  title: string;
  excerpt: string;
  imageUrl: string;
  slug: string;
  publishedAt?: Date | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    image: imageUrl,
    url: `${BASE_URL}/journal/${slug}`,
    ...(publishedAt && { datePublished: publishedAt.toISOString() }),
    author: {
      "@type": "Person",
      name: "Cara Wei",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Cara Wei Photography",
      url: BASE_URL,
    },
  };
}
