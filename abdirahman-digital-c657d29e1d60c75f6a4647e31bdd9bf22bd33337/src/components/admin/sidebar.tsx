"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  Megaphone,
  Newspaper,
  BookOpen,
  MessageSquare,
  Briefcase,
  Wrench,
  Sparkles,
  Tags,
  FolderTree,
  Mail,
  LogOut,
  ExternalLink,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/statements", label: "Statements", icon: FileText },
      { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
      { href: "/admin/articles", label: "Articles", icon: Newspaper },
      { href: "/admin/notes", label: "Notes", icon: BookOpen },
      { href: "/admin/thoughts", label: "Thoughts", icon: MessageSquare },
      { href: "/admin/portfolio", label: "Portfolio", icon: Briefcase },
      { href: "/admin/services", label: "Services", icon: Wrench },
      { href: "/admin/skills", label: "Skills", icon: Sparkles },
    ],
  },
  {
    label: "Organize",
    items: [
      { href: "/admin/categories", label: "Categories", icon: FolderTree },
      { href: "/admin/tags", label: "Tags", icon: Tags },
      { href: "/admin/settings", label: "Site Content", icon: Settings },
    ],
  },
  {
    label: "Inbox",
    items: [{ href: "/admin/messages", label: "Messages", icon: Mail }],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-border h-screen sticky top-0 flex flex-col">
      <div className="p-5 border-b border-border">
        <p className="font-serif font-semibold">Abdirahman Digital</p>
        <p className="text-xs text-muted-foreground">Admin dashboard</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                      active ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-border space-y-1">
        <Link href="/" target="_blank" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-secondary transition-colors">
          <ExternalLink className="h-4 w-4" /> View site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-secondary transition-colors text-destructive"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </aside>
  );
}
