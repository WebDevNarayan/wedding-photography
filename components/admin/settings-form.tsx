"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/admin/image-uploader";

const schema = z.object({
  heroHeadline: z.string().min(1, "Required"),
  heroSubheading: z.string().min(1, "Required"),
  aboutText: z.string().min(1, "Required"),
  aboutImageUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  navImageWork: z.string().optional(),
  navImageJournal: z.string().optional(),
  navImageInvestment: z.string().optional(),
  navImageContact: z.string().optional(),
  featuredGalleryIds: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof schema>;

type GalleryOption = {
  id: string;
  title: string;
  coverImageUrl: string;
  featured: boolean;
};

const NAV_IMAGE_FIELDS = [
  { key: "navImageWork",       label: "Work" },
  { key: "navImageJournal",    label: "Journal" },
  { key: "navImageInvestment", label: "Investment" },
  { key: "navImageContact",    label: "Contact" },
] as const;

export function SettingsForm({
  defaultValues,
  galleries,
}: {
  defaultValues: Partial<FormValues>;
  galleries: GalleryOption[];
}) {
  const [saved, setSaved] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [aboutImagePreview, setAboutImagePreview] = useState(defaultValues.aboutImageUrl ?? "");
  const [navPreviews, setNavPreviews] = useState<Record<string, string>>({
    navImageWork:       defaultValues.navImageWork       ?? "",
    navImageJournal:    defaultValues.navImageJournal    ?? "",
    navImageInvestment: defaultValues.navImageInvestment ?? "",
    navImageContact:    defaultValues.navImageContact    ?? "",
  });
  const [selectedIds, setSelectedIds] = useState<string[]>(
    defaultValues.featuredGalleryIds ?? []
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  function toggleGallery(id: string) {
    setSelectedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      setValue("featuredGalleryIds", next);
      return next;
    });
  }

  async function onSubmit(values: FormValues) {
    setServerError(null);
    setSaved(false);

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, featuredGalleryIds: selectedIds }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setServerError(body.error ?? "Something went wrong");
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <section className="space-y-4">
        <h2 className="font-heading text-lg font-normal tracking-tight">Homepage</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="heroHeadline">Hero Headline *</Label>
            <Input id="heroHeadline" {...register("heroHeadline")} />
            {errors.heroHeadline && <p className="text-xs text-destructive">{errors.heroHeadline.message}</p>}
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="heroSubheading">Hero Subheading *</Label>
            <Input id="heroSubheading" {...register("heroSubheading")} />
            {errors.heroSubheading && <p className="text-xs text-destructive">{errors.heroSubheading.message}</p>}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-normal tracking-tight">About</h2>
        <div className="space-y-1.5">
          <Label htmlFor="aboutText">About Text *</Label>
          <Textarea id="aboutText" {...register("aboutText")} rows={6} />
          {errors.aboutText && <p className="text-xs text-destructive">{errors.aboutText.message}</p>}
        </div>
        <div className="space-y-3">
          <Label>About Image</Label>
          <ImageUploader
            onUpload={(urls) => {
              setValue("aboutImageUrl", urls[0]);
              setAboutImagePreview(urls[0]);
            }}
          />
          {aboutImagePreview && (
            <div className="relative h-48 w-48 overflow-hidden rounded-md">
              <Image src={aboutImagePreview} alt="About preview" fill className="object-cover" sizes="192px" />
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-heading text-lg font-normal tracking-tight">Homepage Nav Images</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Set a specific photo for each section block. If left empty, the most recent gallery photo is used.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {NAV_IMAGE_FIELDS.map(({ key, label }) => (
            <div key={key} className="space-y-2">
              <Label>{label}</Label>
              <ImageUploader
                onUpload={(urls) => {
                  setValue(key, urls[0]);
                  setNavPreviews((p) => ({ ...p, [key]: urls[0] }));
                }}
              />
              {navPreviews[key] && (
                <div className="relative h-28 w-full overflow-hidden rounded-md">
                  <Image src={navPreviews[key]} alt={label} fill className="object-cover" sizes="50vw" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-heading text-lg font-normal tracking-tight">Hero Image Source</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Check one or more galleries. The most recently dated checked gallery's cover photo becomes the full-screen background on the homepage hero.
          </p>
        </div>
        {galleries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No published galleries yet.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {galleries.map((gallery) => {
              const checked = selectedIds.includes(gallery.id);
              return (
                <label
                  key={gallery.id}
                  className={`flex items-center gap-3 rounded-md border p-3 cursor-pointer transition-colors ${
                    checked ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleGallery(gallery.id)}
                    className="h-4 w-4 shrink-0 accent-foreground cursor-pointer"
                  />
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded">
                    <Image
                      src={gallery.coverImageUrl}
                      alt={gallery.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <span className="text-sm leading-tight line-clamp-2">{gallery.title}</span>
                </label>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-normal tracking-tight">Contact & Social</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register("phone")} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="instagramUrl">Instagram URL</Label>
            <Input id="instagramUrl" {...register("instagramUrl")} placeholder="https://instagram.com/…" />
          </div>
        </div>
      </section>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save settings"}
        </Button>
        {saved && <p className="text-sm text-green-600">Saved successfully</p>}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto font-sans text-xs uppercase tracking-[0.15em] border-b border-foreground pb-0.5 hover:border-primary hover:text-primary transition-colors"
        >
          Preview Homepage →
        </Link>
      </div>
    </form>
  );
}
