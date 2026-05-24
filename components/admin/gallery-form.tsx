"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/image-uploader";
import { ImageGrid, type GridImage } from "@/components/admin/image-grid";
import { slugify } from "@/lib/utils";

const CATEGORIES = ["WEDDING", "ENGAGEMENT", "PORTRAIT", "EDITORIAL"] as const;

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  category: z.enum(CATEGORIES),
  location: z.string().optional(),
  date: z.string().optional(),
  coverImageUrl: z.string().optional(),
  published: z.boolean(),
  featured: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

type ExistingImage = GridImage & { order: number; blurDataUrl?: string | null };

type Props = {
  galleryId?: string;
  defaultValues?: Partial<FormValues>;
  existingImages?: ExistingImage[];
};

export function GalleryForm({ galleryId, defaultValues, existingImages = [] }: Props) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState(defaultValues?.coverImageUrl ?? "");
  const [gridImages, setGridImages] = useState<ExistingImage[]>(existingImages);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      published: false,
      featured: false,
      category: "WEDDING",
      ...defaultValues,
    },
  });

  const title = watch("title");

  useEffect(() => {
    if (!galleryId && title) {
      setValue("slug", slugify(title), { shouldValidate: false });
    }
  }, [title, galleryId, setValue]);

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const url = galleryId ? `/api/admin/galleries/${galleryId}` : "/api/admin/galleries";
    const method = galleryId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setServerError(body.error ?? "Something went wrong");
      return;
    }

    const gallery = await res.json();

    if (!galleryId && gridImages.length > 0) {
      await fetch(`/api/admin/galleries/${gallery.id}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          gridImages.map((img, i) => ({
            url: img.url,
            blurDataUrl: img.blurDataUrl,
            caption: img.caption,
            order: i,
          }))
        ),
      });
    }

    router.push("/admin/galleries");
    router.refresh();
  }

  async function handleImageOrderChange(images: GridImage[]) {
    setGridImages(images as ExistingImage[]);
    if (galleryId) {
      await Promise.all(
        images.map((img, i) =>
          fetch(`/api/admin/galleries/${galleryId}/images`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify([{ url: img.url, order: i }]),
          })
        )
      );
    }
  }

  async function handleImageRemove(imageId: string) {
    setGridImages((prev) => prev.filter((i) => i.id !== imageId));
    if (galleryId) {
      await fetch(`/api/admin/galleries/${galleryId}/images/${imageId}`, {
        method: "DELETE",
      });
    }
  }

  function handleNewImages(urls: string[]) {
    const newImages: ExistingImage[] = urls.map((url, i) => ({
      id: `new-${Date.now()}-${i}`,
      url,
      order: gridImages.length + i,
    }));
    setGridImages((prev) => [...prev, ...newImages]);

    if (galleryId) {
      fetch(`/api/admin/galleries/${galleryId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newImages.map((img) => ({ url: img.url, order: img.order }))),
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" {...register("title")} placeholder="Emma & James" />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug *</Label>
          <Input id="slug" {...register("slug")} placeholder="emma-james" />
          {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="category">Category *</Label>
          <Select
            defaultValue={defaultValues?.category ?? "WEDDING"}
            onValueChange={(v) => setValue("category", v as typeof CATEGORIES[number])}
          >
            <SelectTrigger id="category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c.charAt(0) + c.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...register("location")} placeholder="Hudson Valley, NY" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" {...register("date")} />
        </div>

        <div className="space-y-3 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register("description")} rows={3} placeholder="A short description of the gallery…" />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Cover Image</Label>
        <ImageUploader onUpload={(urls) => { setValue("coverImageUrl", urls[0]); setCoverPreview(urls[0]); }} />
        {coverPreview && (
          <div className="relative h-48 w-48 overflow-hidden rounded-md">
            <Image src={coverPreview} alt="Cover preview" fill className="object-cover" sizes="192px" />
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Label>Gallery Images</Label>
        <ImageGrid
          images={gridImages}
          onChange={handleImageOrderChange}
          onRemove={handleImageRemove}
        />
        <ImageUploader onUpload={handleNewImages} multiple />
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <Switch
            id="published"
            defaultChecked={defaultValues?.published ?? false}
            onCheckedChange={(v) => setValue("published", v)}
          />
          <Label htmlFor="published">Published</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="featured"
            defaultChecked={defaultValues?.featured ?? false}
            onCheckedChange={(v) => setValue("featured", v)}
          />
          <Label htmlFor="featured">Featured on homepage</Label>
        </div>
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : galleryId ? "Update gallery" : "Create gallery"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
