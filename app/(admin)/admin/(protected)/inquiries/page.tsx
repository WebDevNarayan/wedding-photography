"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { InquiryDetail, type Inquiry } from "@/components/admin/inquiry-detail";
import { cn } from "@/lib/utils";

type InquiryStatus = Inquiry["status"];

const STATUS_STYLES: Record<InquiryStatus, string> = {
  NEW: "bg-blue-100 text-blue-800 border-blue-200",
  READ: "bg-secondary text-secondary-foreground",
  REPLIED: "bg-green-100 text-green-800 border-green-200",
  ARCHIVED: "bg-muted text-muted-foreground",
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/inquiries")
      .then((r) => r.json())
      .then((data) => { setInquiries(data); setLoading(false); });
  }, []);

  async function handleRowClick(inquiry: Inquiry) {
    setSelected(inquiry);
    if (inquiry.status === "NEW") {
      await fetch(`/api/admin/inquiries/${inquiry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "READ" }),
      });
      setInquiries((prev) =>
        prev.map((i) => (i.id === inquiry.id ? { ...i, status: "READ" } : i))
      );
      setSelected({ ...inquiry, status: "READ" });
    }
  }

  function handleStatusChange(id: string, status: InquiryStatus) {
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    setSelected((prev) => (prev?.id === id ? { ...prev, status } : prev));
  }

  const newCount = inquiries.filter((i) => i.status === "NEW").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-light tracking-tight">Inquiries</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {inquiries.length} total
          {newCount > 0 && (
            <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
              {newCount} new
            </span>
          )}
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Wedding Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Received</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                Loading…
              </TableCell>
            </TableRow>
          )}
          {!loading && inquiries.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                No inquiries yet.
              </TableCell>
            </TableRow>
          )}
          {inquiries.map((inquiry) => (
            <TableRow
              key={inquiry.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleRowClick(inquiry)}
            >
              <TableCell className="font-medium">{inquiry.name}</TableCell>
              <TableCell className="text-muted-foreground">{inquiry.email}</TableCell>
              <TableCell className="text-muted-foreground">
                {inquiry.weddingDate
                  ? new Date(inquiry.weddingDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "—"}
              </TableCell>
              <TableCell>
                <Badge className={cn("border text-xs", STATUS_STYLES[inquiry.status])}>
                  {inquiry.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(inquiry.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <InquiryDetail
        inquiry={selected}
        onClose={() => setSelected(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
