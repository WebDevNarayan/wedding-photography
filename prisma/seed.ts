import { PrismaClient } from "../lib/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO = "https://res.cloudinary.com/demo/image/upload";

// Cloudinary demo images — stand-ins until real uploads replace them
const IMAGES = {
  landscape1: `${DEMO}/v1/samples/imagecon-group.jpg`,
  landscape2: `${DEMO}/v1/samples/landscapes/girl-urban-view.jpg`,
  landscape3: `${DEMO}/v1/samples/landscapes/beach-boat.jpg`,
  landscape4: `${DEMO}/v1/samples/landscapes/architecture-signs.jpg`,
  landscape5: `${DEMO}/v1/samples/sheep.jpg`,
  people1: `${DEMO}/v1/samples/people/smiling-man.jpg`,
  people2: `${DEMO}/v1/samples/people/jazz.jpg`,
  people3: `${DEMO}/v1/samples/people/boy-snow-hoodie.jpg`,
  people4: `${DEMO}/v1/samples/people/kitchen-bar.jpg`,
  people5: `${DEMO}/v1/samples/people/bicycle.jpg`,
  food1: `${DEMO}/v1/samples/food/spices.jpg`,
  food2: `${DEMO}/v1/samples/food/near-east-restaurant-supplies.jpg`,
  balloons: `${DEMO}/v1/samples/balloons.jpg`,
  bike: `${DEMO}/v1/samples/bike.jpg`,
};

async function main() {
  // ── Admin user ──────────────────────────────────────────────────────────
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

  // ── Site settings ────────────────────────────────────────────────────────
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      heroHeadline: "Love Stories, Beautifully Told",
      heroSubheading: "Luxury wedding photography in New York and beyond",
      aboutText:
        "I'm Cara Wei, a wedding photographer based in New York City. I believe every love story deserves to be told with intention and artistry.\n\nMy approach is documentary at heart — I capture the quiet glances, the nervous laughs, the tears of joy — the real moments that make your day uniquely yours.\n\nWith a background in fine art photography and a love for film aesthetics, I craft images that feel timeless.",
      aboutImageUrl: IMAGES.people1,
      instagramUrl: "https://instagram.com/caraweiphoto",
      email: "hello@carawei.com",
      phone: "+1 (212) 555-0100",
    },
  });

  // ── Galleries ─────────────────────────────────────────────────────────────
  const [g1, g2, g3, g4, g5, g6] = await Promise.all([
    prisma.gallery.upsert({
      where: { slug: "emma-james-hudson-valley" },
      update: {},
      create: {
        slug: "emma-james-hudson-valley",
        title: "Emma & James",
        description:
          "A golden autumn wedding in the Hudson Valley, surrounded by turning leaves and warmth.",
        coverImageUrl: IMAGES.landscape1,
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
        coverImageUrl: IMAGES.landscape2,
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
        coverImageUrl: IMAGES.landscape3,
        location: "Finger Lakes, NY",
        date: new Date("2024-08-03"),
        featured: true,
        category: "WEDDING",
        published: true,
      },
    }),
    prisma.gallery.upsert({
      where: { slug: "olivia-ben-montauk" },
      update: {},
      create: {
        slug: "olivia-ben-montauk",
        title: "Olivia & Ben",
        description:
          "A barefoot ceremony on the dunes of Montauk, with the Atlantic as a backdrop.",
        coverImageUrl: IMAGES.landscape3,
        location: "Montauk, NY",
        date: new Date("2024-07-14"),
        featured: true,
        category: "WEDDING",
        published: true,
      },
    }),
    prisma.gallery.upsert({
      where: { slug: "charlotte-ryan-brooklyn" },
      update: {},
      create: {
        slug: "charlotte-ryan-brooklyn",
        title: "Charlotte & Ryan",
        description:
          "A rooftop celebration in Brooklyn with skyline views and a downtown edge.",
        coverImageUrl: IMAGES.landscape4,
        location: "Brooklyn, NY",
        date: new Date("2024-06-08"),
        featured: false,
        category: "WEDDING",
        published: true,
      },
    }),
    prisma.gallery.upsert({
      where: { slug: "maya-jordan-catskills" },
      update: {},
      create: {
        slug: "maya-jordan-catskills",
        title: "Maya & Jordan",
        description:
          "A weekend-long mountain celebration in the Catskills, wild and deeply personal.",
        coverImageUrl: IMAGES.landscape5,
        location: "Catskills, NY",
        date: new Date("2024-05-25"),
        featured: false,
        category: "WEDDING",
        published: true,
      },
    }),
  ]);

  // ── Gallery images (delete-then-insert to stay idempotent) ────────────────
  await Promise.all([
    prisma.galleryImage.deleteMany({ where: { galleryId: g1.id } }),
    prisma.galleryImage.deleteMany({ where: { galleryId: g2.id } }),
    prisma.galleryImage.deleteMany({ where: { galleryId: g3.id } }),
    prisma.galleryImage.deleteMany({ where: { galleryId: g4.id } }),
    prisma.galleryImage.deleteMany({ where: { galleryId: g5.id } }),
    prisma.galleryImage.deleteMany({ where: { galleryId: g6.id } }),
  ]);

  await prisma.galleryImage.createMany({
    data: [
      // Emma & James — Hudson Valley
      { galleryId: g1.id, url: IMAGES.landscape1, order: 1, caption: "Ceremony in the barn" },
      { galleryId: g1.id, url: IMAGES.people2,    order: 2, caption: "First look" },
      { galleryId: g1.id, url: IMAGES.landscape2, order: 3, caption: "The vows" },
      { galleryId: g1.id, url: IMAGES.people3,    order: 4, caption: "Signing the register" },
      { galleryId: g1.id, url: IMAGES.landscape3, order: 5, caption: "Golden hour portraits" },
      { galleryId: g1.id, url: IMAGES.people4,    order: 6, caption: "Reception tables" },
      { galleryId: g1.id, url: IMAGES.balloons,   order: 7, caption: "First dance" },
      { galleryId: g1.id, url: IMAGES.landscape5, order: 8, caption: "End of the evening" },

      // Sophia & Mark — Central Park
      { galleryId: g2.id, url: IMAGES.landscape2, order: 1, caption: "Bethesda Terrace" },
      { galleryId: g2.id, url: IMAGES.people1,    order: 2, caption: "The bridge" },
      { galleryId: g2.id, url: IMAGES.landscape4, order: 3, caption: "Golden path" },
      { galleryId: g2.id, url: IMAGES.people5,    order: 4, caption: "Candid walk" },
      { galleryId: g2.id, url: IMAGES.landscape1, order: 5, caption: "Boathouse light" },
      { galleryId: g2.id, url: IMAGES.people2,    order: 6, caption: "Dusk portraits" },

      // Claire & Thomas — Finger Lakes
      { galleryId: g3.id, url: IMAGES.landscape3, order: 1, caption: "Vineyard ceremony" },
      { galleryId: g3.id, url: IMAGES.people3,    order: 2, caption: "Ring exchange" },
      { galleryId: g3.id, url: IMAGES.food1,      order: 3, caption: "The reception table" },
      { galleryId: g3.id, url: IMAGES.landscape1, order: 4, caption: "Vineyard portraits" },
      { galleryId: g3.id, url: IMAGES.people4,    order: 5, caption: "Sunset walk" },
      { galleryId: g3.id, url: IMAGES.food2,      order: 6, caption: "Dinner details" },
      { galleryId: g3.id, url: IMAGES.landscape5, order: 7, caption: "Night send-off" },

      // Olivia & Ben — Montauk
      { galleryId: g4.id, url: IMAGES.landscape3, order: 1, caption: "Dune ceremony" },
      { galleryId: g4.id, url: IMAGES.people1,    order: 2, caption: "Exchange of rings" },
      { galleryId: g4.id, url: IMAGES.landscape5, order: 3, caption: "Shoreline portraits" },
      { galleryId: g4.id, url: IMAGES.people2,    order: 4, caption: "Walking the beach" },
      { galleryId: g4.id, url: IMAGES.landscape2, order: 5, caption: "Atlantic light" },
      { galleryId: g4.id, url: IMAGES.balloons,   order: 6, caption: "Reception at the lighthouse" },
      { galleryId: g4.id, url: IMAGES.people5,    order: 7, caption: "First dance on the deck" },
      { galleryId: g4.id, url: IMAGES.landscape4, order: 8, caption: "Sending off" },

      // Charlotte & Ryan — Brooklyn
      { galleryId: g5.id, url: IMAGES.landscape4, order: 1, caption: "Rooftop ceremony" },
      { galleryId: g5.id, url: IMAGES.people4,    order: 2, caption: "Skyline vows" },
      { galleryId: g5.id, url: IMAGES.landscape2, order: 3, caption: "Brooklyn Bridge view" },
      { galleryId: g5.id, url: IMAGES.people3,    order: 4, caption: "Portraits in the stairwell" },
      { galleryId: g5.id, url: IMAGES.bike,       order: 5, caption: "Street portraits" },
      { galleryId: g5.id, url: IMAGES.food1,      order: 6, caption: "Cocktail hour" },
      { galleryId: g5.id, url: IMAGES.landscape1, order: 7, caption: "Reception at dusk" },

      // Maya & Jordan — Catskills
      { galleryId: g6.id, url: IMAGES.landscape5, order: 1, caption: "Mountain ceremony" },
      { galleryId: g6.id, url: IMAGES.people5,    order: 2, caption: "Forest portraits" },
      { galleryId: g6.id, url: IMAGES.landscape1, order: 3, caption: "Meadow light" },
      { galleryId: g6.id, url: IMAGES.people2,    order: 4, caption: "Wildflower walk" },
      { galleryId: g6.id, url: IMAGES.food2,      order: 5, caption: "Farm table dinner" },
      { galleryId: g6.id, url: IMAGES.landscape3, order: 6, caption: "Bonfire send-off" },
      { galleryId: g6.id, url: IMAGES.bike,       order: 7, caption: "Morning after portraits" },
    ],
  });

  // ── Stories ───────────────────────────────────────────────────────────────
  await Promise.all([
    prisma.story.upsert({
      where: { slug: "emma-james-hudson-valley-story" },
      update: {},
      create: {
        slug: "emma-james-hudson-valley-story",
        title: "Emma & James: A Hudson Valley Autumn",
        excerpt:
          "When Emma told me she wanted her wedding to feel like a painting, I knew exactly what she meant.",
        content: `When Emma told me she wanted her wedding to feel like a painting, I knew exactly what she meant.

The Hudson Valley in October is unlike anywhere else. The air carries that particular crispness that makes everything feel sharper, more alive. The trees were ablaze in amber and crimson.

Emma and James had been together for seven years before he proposed on the same hiking trail where they had their first date. They wanted their wedding to reflect who they are — unpretentious, warm, deeply in love.

The ceremony was held in a restored barn with wildflower arrangements and candlelight. James wept when he saw Emma walk in. That is the moment I always wait for.

We spent the golden hour walking the property, the low October sun painting everything copper. Emma kept laughing — that real, unselfconscious laugh. It made every frame.`,
        coverImageUrl: IMAGES.landscape1,
        published: true,
        publishedAt: new Date("2024-10-20"),
        galleryId: g1.id,
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
        content: `There is something about the warmth of film that digital can chase but rarely fully capture.

I started my career shooting on 35mm film. The grain, the latitude in highlights, the way skin tones rendered — it spoiled me. When I moved to digital, I spent years trying to recreate that feeling.

My editing process starts with a base of gentle warmth. I pull shadows toward a slight green-teal, push highlights toward cream. I never over-saturate. The goal is always: does this look like a memory?

Because that is what photographs become. Not documents of what happened, but the way it felt.

The most common question I get is what presets I use. The honest answer is none. Every gallery is hand-edited, image by image. A preset is a starting point; editing is the work.`,
        coverImageUrl: IMAGES.landscape2,
        published: true,
        publishedAt: new Date("2024-09-01"),
        galleryId: g2.id,
      },
    }),

    prisma.story.upsert({
      where: { slug: "olivia-ben-montauk-story" },
      update: {},
      create: {
        slug: "olivia-ben-montauk-story",
        title: "Olivia & Ben: Salt Air and Bare Feet",
        excerpt:
          "They wanted no shoes, no schedule, and no plan. What we got was one of the most honest days I've ever photographed.",
        content: `They wanted no shoes, no schedule, and no plan. What we got was one of the most honest days I've ever photographed.

Olivia and Ben told me their vision in three words: barefoot, windswept, us. I didn't need more than that.

Montauk in July is searingly beautiful — the light comes in low off the Atlantic and turns everything gold by four in the afternoon. We started at the lighthouse and worked our way down to the dunes.

The ceremony was just the two of them, their families, and fifteen close friends standing in a circle on the sand. No officiant's podium. No floral arch. Just the ocean and the words they'd written to each other.

Ben cried before Olivia even reached him. She laughed at him for it — lovingly — and then cried herself. I photographed all of it.

Afterwards, we walked the shoreline for an hour. No direction from me. Just the two of them, the waves, and whatever came next.`,
        coverImageUrl: IMAGES.landscape3,
        published: true,
        publishedAt: new Date("2024-07-22"),
        galleryId: g4.id,
      },
    }),

    prisma.story.upsert({
      where: { slug: "charlotte-ryan-brooklyn-story" },
      update: {},
      create: {
        slug: "charlotte-ryan-brooklyn-story",
        title: "Charlotte & Ryan: Brooklyn on Their Terms",
        excerpt:
          "A rooftop, a skyline, and two people who built their life in the city they love.",
        content: `Charlotte and Ryan met at a bar in Williamsburg on a night neither of them had planned to go out. Six years later, they got married on a rooftop three blocks from that bar.

That kind of symmetry is rare. And it shapes how you photograph a day.

The ceremony was at six in the evening, timed so the sun would set over the Manhattan skyline just as they exchanged rings. It worked. The light was extraordinary — that particular shade of amber that only exists for about eight minutes and makes photographers nervous and grateful in equal measure.

We snuck away from cocktail hour to do portraits in the stairwell of the building. Concrete and fluorescent light. It shouldn't have worked. It absolutely worked.

Brooklyn weddings have a specific energy — less formal, more alive. People dance like they mean it. Charlotte's mother gave a toast that had the whole room laughing, then crying, then laughing again.

I drove home across the bridge at midnight with a full card and a full heart.`,
        coverImageUrl: IMAGES.landscape4,
        published: true,
        publishedAt: new Date("2024-06-15"),
        galleryId: g5.id,
      },
    }),

    prisma.story.upsert({
      where: { slug: "on-being-invisible" },
      update: {},
      create: {
        slug: "on-being-invisible",
        title: "On Being Invisible: The Art of Documentary Wedding Photography",
        excerpt:
          "The best wedding photographs are taken when no one knows they're being taken. Here's how I disappear.",
        content: `The best wedding photographs are taken when no one knows they're being taken.

This sounds counterintuitive. Aren't I hired to be there? Yes — but being there and being noticed are different things.

When I arrive at a wedding, I spend the first thirty minutes doing very little. I move slowly. I stay quiet. I let the room forget I'm holding a camera. This is not laziness. It is the most important work I do all day.

People perform for cameras. They pull their chins in. They hold smiles a beat too long. The moment they stop performing — the moment they turn back to their drink or their conversation or the person they love — that is when the real photograph happens.

My kit is deliberately small. A single body, two primes. No flash during the ceremony. No assistant with a reflector. Nothing that announces itself.

The goal is to disappear into the day — and come back, weeks later, with images that make the couple say: I forgot you were even there.

That is the whole job.`,
        coverImageUrl: IMAGES.people2,
        published: true,
        publishedAt: new Date("2024-08-10"),
        galleryId: null,
      },
    }),

    prisma.story.upsert({
      where: { slug: "maya-jordan-catskills-story" },
      update: {},
      create: {
        slug: "maya-jordan-catskills-story",
        title: "Maya & Jordan: Three Days in the Mountains",
        excerpt:
          "They didn't want a wedding day. They wanted a wedding weekend. What followed was the most alive I've felt behind a camera in years.",
        content: `They didn't want a wedding day. They wanted a wedding weekend. What followed was the most alive I've felt behind a camera in years.

Maya and Jordan rented a farmhouse in the Catskills for three days and invited seventy people to come and stay. Friday was arrivals and a bonfire. Saturday was the ceremony and dinner. Sunday was coffee on the porch and slow goodbyes.

I photographed all of it.

The ceremony was in a meadow at the edge of the woods, at five in the afternoon when the light comes in sideways through the trees. Jordan wore a cream linen suit. Maya wore her grandmother's earrings and a dress she'd had made in Oaxaca.

What I remember most is the farm table dinner that went on for four hours. Course after course, wine, toasts that turned into stories that turned into more toasts. I moved around the table all evening, mostly unnoticed, filling a card with the best images of the trip.

The bonfire on Sunday night was unplanned. Someone brought a guitar. I shot one more roll and put the camera down.

Some weekends you photograph. Some you live inside. This was both.`,
        coverImageUrl: IMAGES.landscape5,
        published: true,
        publishedAt: new Date("2024-06-02"),
        galleryId: g6.id,
      },
    }),
  ]);

  console.log("Seed complete — 6 galleries, 44 images, 6 stories.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
