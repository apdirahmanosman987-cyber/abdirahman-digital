import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatDate, excerptFromHtml } from "@/lib/utils";

export const metadata: Metadata = { title: "Statements" };
export const revalidate = 60;

const PAGE_SIZE = 9;

export default async function StatementsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Math.max(1, Number(searchParams.page) || 1);

  const [statements, total] = await Promise.all([
    prisma.statement.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { category: true },
    }),
    prisma.statement.count({ where: { status: "PUBLISHED" } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="container py-16">
      <SectionHeading
        eyebrow="Statements"
        title="What I stand for"
        description="Formal statements, positions, and declarations I've published."
      />

      {statements.length === 0 ? (
        <p className="text-muted-foreground">No statements published yet — check back soon.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {statements.map((s) => (
            <Link key={s.id} href={`/statements/${s.slug}`}>
              <Card className="h-full card-hover">
                <CardHeader>
                  {s.category && (
                    <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                      {s.category.name}
                    </span>
                  )}
                  <CardTitle>{s.title}</CardTitle>
                  <CardDescription>{formatDate(s.publishedAt)} · {s.readingTimeMins} min read</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Link
              key={i}
              href={`/statements?page=${i + 1}`}
              className={`h-9 w-9 flex items-center justify-center rounded-full text-sm border border-border ${
                page === i + 1 ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
