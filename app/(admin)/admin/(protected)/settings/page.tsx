import { type Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const [settings, galleries] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    prisma.gallery.findMany({
      where: { published: true },
      orderBy: { date: "desc" },
      select: { id: true, title: true, coverImageUrl: true, featured: true },
    }),
  ]);

  const featuredGalleryIds = galleries.filter((g) => g.featured).map((g) => g.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-light tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your site content</p>
      </div>

      <SettingsForm
        galleries={galleries}
        defaultValues={{
          heroHeadline: settings?.heroHeadline ?? "",
          heroSubheading: settings?.heroSubheading ?? "",
          aboutText: settings?.aboutText ?? "",
          aboutImageUrl: settings?.aboutImageUrl ?? undefined,
          instagramUrl: settings?.instagramUrl ?? undefined,
          email: settings?.email ?? undefined,
          phone: settings?.phone ?? undefined,
          navImageWork: settings?.navImageWork ?? undefined,
          navImageJournal: settings?.navImageJournal ?? undefined,
          navImageInvestment: settings?.navImageInvestment ?? undefined,
          navImageContact: settings?.navImageContact ?? undefined,
          featuredGalleryIds,
        }}
      />
    </div>
  );
}
