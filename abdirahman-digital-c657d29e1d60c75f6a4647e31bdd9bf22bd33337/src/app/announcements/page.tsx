import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Announcements" };
export const revalidate = 60;

export default async function AnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="container py-16 max-w-3xl">
      <SectionHeading eyebrow="Bayaanaan" title="Announcements" description="Public declarations and updates." />

      <div className="relative border-l border-border pl-8 space-y-8">
        {announcements.length === 0 && <p className="text-muted-foreground">No announcements yet.</p>}
        {announcements.map((a) => (
          <div key={a.id} className="relative">
            <span className="absolute -left-[2.35rem] top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
            <Card className="card-hover">
              {a.image && <img src={a.image} alt={a.title} className="w-full aspect-video object-cover rounded-t-2xl" />}
              <CardHeader>
                {a.category && <span className="text-xs font-semibold uppercase tracking-wide text-accent">{a.category.name}</span>}
                <CardTitle>{a.title}</CardTitle>
                <CardDescription>{formatDate(a.publishedAt)}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
