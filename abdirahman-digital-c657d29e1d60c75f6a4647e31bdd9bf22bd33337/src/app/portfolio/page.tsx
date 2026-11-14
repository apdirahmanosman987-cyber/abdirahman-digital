import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata: Metadata = { title: "Portfolio" };
export const revalidate = 60;

export default async function PortfolioPage() {
  const projects = await prisma.portfolioProject.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    include: { category: true },
  });

  return (
    <div className="container py-16">
      <SectionHeading eyebrow="Selected work" title="Portfolio" description="Projects I've designed, built, and shipped." />

      {projects.length === 0 ? (
        <p className="text-muted-foreground">No projects published yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Link key={p.id} href={`/portfolio/${p.slug}`}>
              <Card className="h-full card-hover overflow-hidden">
                {p.image && <div className="aspect-video bg-muted bg-cover bg-center" style={{ backgroundImage: `url(${p.image})` }} />}
                <CardHeader>
                  {p.category && <span className="text-xs font-semibold uppercase tracking-wide text-accent">{p.category.name}</span>}
                  <CardTitle>{p.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{p.description}</CardDescription>
                </CardHeader>
                <div className="px-6 pb-6 flex flex-wrap gap-1.5">
                  {p.technologies.slice(0, 4).map((t) => (
                    <span key={t} className="text-xs rounded-full bg-secondary px-2.5 py-1">{t}</span>
                  ))}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
