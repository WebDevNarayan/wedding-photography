import { type Metadata } from "next";
import { GalleryForm } from "@/components/admin/gallery-form";

export const metadata: Metadata = { title: "New Gallery" };

export default function NewGalleryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-light tracking-tight">New Gallery</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create a new photo gallery</p>
      </div>
      <GalleryForm />
    </div>
  );
}
