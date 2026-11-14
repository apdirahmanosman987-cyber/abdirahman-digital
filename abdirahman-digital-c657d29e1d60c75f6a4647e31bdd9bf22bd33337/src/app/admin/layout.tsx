import { AdminSessionProvider } from "@/components/admin/session-provider";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };

// Wraps both /admin/login (no sidebar) and the (dashboard) route group (with
// sidebar) so next-auth's client hooks work everywhere under /admin.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminSessionProvider>{children}</AdminSessionProvider>;
}
