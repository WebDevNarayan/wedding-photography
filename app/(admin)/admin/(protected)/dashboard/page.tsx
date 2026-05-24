import { type Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Images, BookOpen, Mail, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const [totalGalleries, publishedGalleries, totalStories, newInquiries] =
    await Promise.all([
      prisma.gallery.count(),
      prisma.gallery.count({ where: { published: true } }),
      prisma.story.count(),
      prisma.inquiry.count({ where: { status: "NEW" } }),
    ]);

  const stats = [
    {
      label: "Total Galleries",
      value: totalGalleries,
      icon: Images,
    },
    {
      label: "Published Galleries",
      value: publishedGalleries,
      icon: Eye,
    },
    {
      label: "Total Stories",
      value: totalStories,
      icon: BookOpen,
    },
    {
      label: "New Inquiries",
      value: newInquiries,
      icon: Mail,
      highlight: newInquiries > 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-light tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your site content
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, highlight }) => (
          <Card key={label} className={highlight ? "border-primary/40 bg-primary/5" : ""}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-light tabular-nums">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
