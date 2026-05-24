import { type Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-light tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your site content</p>
      </div>

      <SettingsForm
        defaultValues={{
          heroHeadline: settings?.heroHeadline ?? "",
          heroSubheading: settings?.heroSubheading ?? "",
          aboutText: settings?.aboutText ?? "",
          aboutImageUrl: settings?.aboutImageUrl ?? undefined,
          instagramUrl: settings?.instagramUrl ?? undefined,
          email: settings?.email ?? undefined,
          phone: settings?.phone ?? undefined,
        }}
      />
    </div>
  );
}
