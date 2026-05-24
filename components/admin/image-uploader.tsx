"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type UploadedFile = {
  url: string;
  blurDataUrl: string;
  previewUrl: string;
};

type Props = {
  onUpload: (urls: string[]) => void;
  multiple?: boolean;
  className?: string;
};

const MAX_SIZE = 10 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export function ImageUploader({ onUpload, multiple = false, className }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const uploadFiles = useCallback(
    async (files: File[]) => {
      const valid = files.filter(
        (f) => ACCEPTED.includes(f.type) && f.size <= MAX_SIZE
      );

      if (valid.length === 0) {
        setError("No valid files. Use JPEG, PNG or WebP under 10 MB.");
        return;
      }

      setError(null);
      setUploading(true);
      setProgress(0);

      const results: UploadedFile[] = [];

      for (let i = 0; i < valid.length; i++) {
        const file = valid[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setError(body.error ?? "Upload failed");
          setUploading(false);
          return;
        }

        const { url, blurDataUrl } = await res.json();
        results.push({ url, blurDataUrl, previewUrl: URL.createObjectURL(file) });
        setProgress(Math.round(((i + 1) / valid.length) * 100));
      }

      setUploads((prev) => [...prev, ...results]);
      onUpload(results.map((r) => r.url));
      setUploading(false);
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      uploadFiles(Array.from(e.dataTransfer.files));
    },
    [uploadFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) uploadFiles(Array.from(e.target.files));
    },
    [uploadFiles]
  );

  return (
    <div className={cn("space-y-3", className)}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-6 py-10 text-sm transition-colors",
          dragging
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/30 hover:bg-muted/60"
        )}
      >
        <p className="font-medium text-foreground">
          {dragging ? "Drop to upload" : "Drag & drop or click to select"}
        </p>
        <p className="mt-1 text-muted-foreground">JPEG, PNG, WebP — max 10 MB each</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        multiple={multiple}
        className="hidden"
        onChange={handleChange}
      />

      {uploading && (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Uploading… {progress}%</p>
          <Progress value={progress} className="h-1.5" />
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {uploads.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {uploads.map((u) => (
            <div key={u.url} className="relative aspect-square overflow-hidden rounded-md">
              <Image
                src={u.previewUrl}
                alt="Uploaded preview"
                fill
                className="object-cover"
                sizes="120px"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
