"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type InquiryStatus = "NEW" | "READ" | "REPLIED" | "ARCHIVED";

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  weddingDate: string | null;
  venue: string | null;
  message: string;
  status: InquiryStatus;
  createdAt: string;
};

const STATUS_STYLES: Record<InquiryStatus, string> = {
  NEW: "bg-blue-100 text-blue-800 border-blue-200",
  READ: "bg-secondary text-secondary-foreground",
  REPLIED: "bg-green-100 text-green-800 border-green-200",
  ARCHIVED: "bg-muted text-muted-foreground",
};

type Props = {
  inquiry: Inquiry | null;
  onClose: () => void;
  onStatusChange: (id: string, status: InquiryStatus) => void;
};

export function InquiryDetail({ inquiry, onClose, onStatusChange }: Props) {
  const [updating, setUpdating] = useState(false);

  async function handleStatusChange(status: InquiryStatus) {
    if (!inquiry) return;
    setUpdating(true);
    await fetch(`/api/admin/inquiries/${inquiry.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    onStatusChange(inquiry.id, status);
    setUpdating(false);
  }

  return (
    <Sheet open={!!inquiry} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        {inquiry && (
          <>
            <SheetHeader className="pb-2">
              <SheetTitle className="font-heading text-xl font-light">{inquiry.name}</SheetTitle>
              <SheetDescription>
                Received{" "}
                {new Date(inquiry.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-5 px-4 pb-8">
              <div className="flex items-center gap-3">
                <Badge className={cn("border text-xs", STATUS_STYLES[inquiry.status])}>
                  {inquiry.status}
                </Badge>
                <Select
                  defaultValue={inquiry.status}
                  onValueChange={(v) => handleStatusChange(v as InquiryStatus)}
                  disabled={updating}
                >
                  <SelectTrigger className="h-7 w-36 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["NEW", "READ", "REPLIED", "ARCHIVED"] as InquiryStatus[]).map((s) => (
                      <SelectItem key={s} value={s} className="text-xs">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-widest text-muted-foreground">Email</dt>
                  <dd>
                    <a href={`mailto:${inquiry.email}`} className="text-primary underline-offset-2 hover:underline">
                      {inquiry.email}
                    </a>
                  </dd>
                </div>

                {inquiry.phone && (
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-muted-foreground">Phone</dt>
                    <dd>{inquiry.phone}</dd>
                  </div>
                )}

                {inquiry.weddingDate && (
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-muted-foreground">Wedding Date</dt>
                    <dd>
                      {new Date(inquiry.weddingDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </dd>
                  </div>
                )}

                {inquiry.venue && (
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-muted-foreground">Venue</dt>
                    <dd>{inquiry.venue}</dd>
                  </div>
                )}
              </dl>

              <Separator />

              <div>
                <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Message</p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{inquiry.message}</p>
              </div>

              <Separator />

              <a
                href={`mailto:${inquiry.email}?subject=Re: Your Wedding Photography Inquiry`}
                className="inline-block text-sm font-medium underline underline-offset-4 hover:text-primary"
              >
                Reply via email →
              </a>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
