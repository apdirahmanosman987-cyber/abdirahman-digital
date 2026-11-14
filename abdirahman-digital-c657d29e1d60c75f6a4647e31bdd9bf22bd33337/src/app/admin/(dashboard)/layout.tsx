import { AdminSidebar } from "@/components/admin/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
