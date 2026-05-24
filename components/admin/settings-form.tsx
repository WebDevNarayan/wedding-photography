"use client";

import { useState } from "react";
import Image from "next/image";
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
});

type FormValues = z.infer<typeof schema>;

export function SettingsForm({ defaultValues }: { defaultValues: Partial<FormValues> }) {
  const [saved, setSaved] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [aboutImagePreview, setAboutImagePreview] = useState(defaultValues.aboutImageUrl ?? "");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    setSaved(false);

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
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
      </div>
    </form>
  );
}
