import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <main className="ml-60 flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
