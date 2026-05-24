"use client";

import dynamic from "next/dynamic";
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
import { slugify } from "@/lib/utils";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse rounded-md bg-muted" />,
});

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  coverImageUrl: z.string().optional(),
  published: z.boolean(),
  publishedAt: z.string().optional(),
  galleryId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type Gallery = { id: string; title: string };

type Props = {
  storyId?: string;
  defaultValues?: Partial<FormValues>;
  galleries: Gallery[];
};

export function StoryForm({ storyId, defaultValues, galleries }: Props) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState(defaultValues?.coverImageUrl ?? "");
  const [content, setContent] = useState(defaultValues?.content ?? "");

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
      ...defaultValues,
      content: defaultValues?.content ?? "",
    },
  });

  const title = watch("title");

  useEffect(() => {
    if (!storyId && title) {
      setValue("slug", slugify(title), { shouldValidate: false });
    }
  }, [title, storyId, setValue]);

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const url = storyId ? `/api/admin/stories/${storyId}` : "/api/admin/stories";
    const method = storyId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, content }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setServerError(body.error ?? "Something went wrong");
      return;
    }

    router.push("/admin/stories");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" {...register("title")} placeholder="Emma & James: A Hudson Valley Autumn" />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug *</Label>
          <Input id="slug" {...register("slug")} placeholder="emma-james-hudson-valley" />
          {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="excerpt">Excerpt *</Label>
          <Textarea
            id="excerpt"
            {...register("excerpt")}
            rows={2}
            placeholder="A short description shown in previews…"
          />
          {errors.excerpt && <p className="text-xs text-destructive">{errors.excerpt.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Content *</Label>
        <div data-color-mode="light">
          <MDEditor
            value={content}
            onChange={(v) => setContent(v ?? "")}
            height={400}
            preview="edit"
          />
        </div>
        {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
      </div>

      <div className="space-y-3">
        <Label>Cover Image</Label>
        <ImageUploader
          onUpload={(urls) => {
            setValue("coverImageUrl", urls[0]);
            setCoverPreview(urls[0]);
          }}
        />
        {coverPreview && (
          <div className="relative h-48 w-72 overflow-hidden rounded-md">
            <Image src={coverPreview} alt="Cover preview" fill className="object-cover" sizes="288px" />
          </div>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="publishedAt">Publish Date</Label>
          <Input id="publishedAt" type="date" {...register("publishedAt")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="galleryId">Linked Gallery</Label>
          <Select
            defaultValue={defaultValues?.galleryId ?? "none"}
            onValueChange={(v) => setValue("galleryId", v === "none" ? undefined : (v ?? undefined))}
          >
            <SelectTrigger id="galleryId">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {galleries.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="published"
          defaultChecked={defaultValues?.published ?? false}
          onCheckedChange={(v) => setValue("published", v)}
        />
        <Label htmlFor="published">Published</Label>
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : storyId ? "Update story" : "Create story"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
