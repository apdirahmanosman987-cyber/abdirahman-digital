import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import {
  FileText,
  Newspaper,
  Briefcase,
  Mail,
  FolderTree,
  Activity,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const [
    statementsCount,
    articlesCount,
    articleDraftsCount,
    statementDraftsCount,
    portfolioCount,
    categoriesCount,
    unreadMessages,
    recentAuditLogs,
  ] = await Promise.all([
    prisma.statement.count(),
    prisma.article.count(),
    prisma.article.count({ where: { status: "DRAFT" } }),
    prisma.statement.count({ where: { status: "DRAFT" } }),
    prisma.portfolioProject.count(),
    prisma.category.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { user: true },
    }),
  ]);

  const draftsCount = articleDraftsCount + statementDraftsCount;

  const stats = [
    { label: "Statements", value: statementsCount, icon: FileText, href: "/admin/statements" },
    { label: "Articles", value: articlesCount, icon: Newspaper, href: "/admin/articles" },
    { label: "Draft posts", value: draftsCount, icon: Activity, href: "/admin/articles" },
    { label: "Portfolio projects", value: portfolioCount, icon: Briefcase, href: "/admin/portfolio" },
    { label: "Categories", value: categoriesCount, icon: FolderTree, href: "/admin/categories" },
    { label: "Unread messages", value: unreadMessages, icon: Mail, href: "/admin/messages" },
  ];

  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl font-semibold mb-1">Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-8">Overview of your content and activity.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="card-hover">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <s.icon className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">{s.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="font-serif text-lg font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-0">
            {recentAuditLogs.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">No activity recorded yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {recentAuditLogs.map((log) => (
                  <li key={log.id} className="flex items-center justify-between px-6 py-3 text-sm">
                    <span>
                      <span className="font-medium">{log.user.name}</span>{" "}
                      <span className="text-muted-foreground">{log.action.replace(/_/g, " ").toLowerCase()}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">{formatDate(log.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
