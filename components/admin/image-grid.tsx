"use client";

import Image from "next/image";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type GridImage = {
  id: string;
  url: string;
  caption?: string | null;
};

type Props = {
  images: GridImage[];
  onChange: (images: GridImage[]) => void;
  onRemove: (id: string) => void;
};

function SortableImage({
  image,
  onRemove,
}: {
  image: GridImage;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative aspect-square overflow-hidden rounded-md border border-border bg-muted",
        isDragging && "opacity-50 ring-2 ring-primary"
      )}
    >
      <Image src={image.url} alt={image.caption ?? "Gallery image"} fill className="object-cover" sizes="160px" />

      <button
        {...attributes}
        {...listeners}
        className="absolute left-1 top-1 cursor-grab rounded bg-black/50 p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-3.5 w-3.5 text-white" />
      </button>

      <button
        onClick={() => onRemove(image.id)}
        className="absolute right-1 top-1 rounded bg-black/50 p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
        aria-label="Remove image"
      >
        <X className="h-3.5 w-3.5 text-white" />
      </button>
    </div>
  );
}

export function ImageGrid({ images, onChange, onRemove }: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((i) => i.id === active.id);
      const newIndex = images.findIndex((i) => i.id === over.id);
      onChange(arrayMove(images, oldIndex, newIndex));
    }
  }

  if (images.length === 0) return null;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={images.map((i) => i.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {images.map((image) => (
            <SortableImage key={image.id} image={image} onRemove={onRemove} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
