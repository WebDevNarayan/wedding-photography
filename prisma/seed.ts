import { PrismaClient } from "../lib/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Admin1234!", 12);

  await prisma.user.upsert({
    where: { email: "admin@site.com" },
    update: {},
    create: {
      email: "admin@site.com",
      name: "Admin",
      hashedPassword,
      role: "ADMIN",
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      heroHeadline: "Love Stories, Beautifully Told",
      heroSubheading: "Luxury wedding photography in New York and beyond",
      aboutText:
        "I'm Cara Wei, a wedding photographer based in New York City. I believe every love story deserves to be told with intention and artistry.\n\nMy approach is documentary at heart — I capture the quiet glances, the nervous laughs, the tears of joy — the real moments that make your day uniquely yours.\n\nWith a background in fine art photography and a love for film aesthetics, I craft images that feel timeless.",
      aboutImageUrl:
        "https://res.cloudinary.com/demo/image/upload/v1/samples/people/smiling-man.jpg",
      instagramUrl: "https://instagram.com/caraweiphoto",
      email: "hello@carawei.com",
      phone: "+1 (212) 555-0100",
    },
  });

  const [gallery1, gallery2, gallery3] = await Promise.all([
    prisma.gallery.upsert({
      where: { slug: "emma-james-hudson-valley" },
      update: {},
      create: {
        slug: "emma-james-hudson-valley",
        title: "Emma & James",
        description:
          "A golden autumn wedding in the Hudson Valley, surrounded by turning leaves and warmth.",
        coverImageUrl:
          "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/nature-italy.jpg",
        location: "Hudson Valley, NY",
        date: new Date("2024-10-12"),
        featured: true,
        category: "WEDDING",
        published: true,
      },
    }),
    prisma.gallery.upsert({
      where: { slug: "sophia-mark-central-park" },
      update: {},
      create: {
        slug: "sophia-mark-central-park",
        title: "Sophia & Mark",
        description:
          "A candid engagement session in Central Park as the light faded to gold.",
        coverImageUrl:
          "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/girl-urban-view.jpg",
        location: "Central Park, NYC",
        date: new Date("2024-09-20"),
        featured: true,
        category: "ENGAGEMENT",
        published: true,
      },
    }),
    prisma.gallery.upsert({
      where: { slug: "claire-thomas-finger-lakes" },
      update: {},
      create: {
        slug: "claire-thomas-finger-lakes",
        title: "Claire & Thomas",
        description:
          "An intimate vineyard ceremony in the Finger Lakes with just family and close friends.",
        coverImageUrl:
          "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/beach-boat.jpg",
        location: "Finger Lakes, NY",
        date: new Date("2024-08-03"),
        featured: true,
        category: "WEDDING",
        published: true,
      },
    }),
  ]);

  await Promise.all([
    prisma.story.upsert({
      where: { slug: "emma-james-hudson-valley-story" },
      update: {},
      create: {
        slug: "emma-james-hudson-valley-story",
        title: "Emma & James: A Hudson Valley Autumn",
        excerpt:
          "When Emma told me she wanted her wedding to feel like a painting, I knew exactly what she meant.",
        content: `When Emma told me she wanted her wedding to feel like a painting, I knew exactly what she meant.\n\nThe Hudson Valley in October is unlike anywhere else. The air carries that particular crispness that makes everything feel sharper, more alive. The trees were ablaze in amber and crimson.\n\nEmma and James had been together for seven years before he proposed on the same hiking trail where they had their first date. They wanted their wedding to reflect who they are — unpretentious, warm, deeply in love.\n\nThe ceremony was held in a restored barn with wildflower arrangements and candlelight. James wept when he saw Emma walk in. That is the moment I always wait for.`,
        coverImageUrl:
          "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/nature-italy.jpg",
        published: true,
        publishedAt: new Date("2024-10-20"),
        galleryId: gallery1.id,
      },
    }),
    prisma.story.upsert({
      where: { slug: "why-i-shoot-film-inspired" },
      update: {},
      create: {
        slug: "why-i-shoot-film-inspired",
        title: "Why I Edit with a Film-Inspired Aesthetic",
        excerpt:
          "There's something about the warmth of film that digital can chase but rarely fully capture. Here's my process.",
        content: `There is something about the warmth of film that digital can chase but rarely fully capture.\n\nI started my career shooting on 35mm film. The grain, the latitude in highlights, the way skin tones rendered — it spoiled me. When I moved to digital, I spent years trying to recreate that feeling.\n\nMy editing process starts with a base of gentle warmth. I pull shadows toward a slight green-teal, push highlights toward cream. I never over-saturate. The goal is always: does this look like a memory?\n\nBecause that is what photographs become. Not documents of what happened, but the way it felt.`,
        coverImageUrl:
          "https://res.cloudinary.com/demo/image/upload/v1/samples/landscapes/girl-urban-view.jpg",
        published: true,
        publishedAt: new Date("2024-09-01"),
        galleryId: gallery2.id,
      },
    }),
  ]);

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
