import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatDate, excerptFromHtml } from "@/lib/utils";

export const metadata: Metadata = { title: "Articles" };
export const revalidate = 60;

const PAGE_SIZE = 9;

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: { page?: string; q?: string };
}) {
  const page = Math.max(1, Number(searchParams.page) || 1);
  const q = searchParams.q?.trim();

  const where = {
    status: "PUBLISHED" as const,
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { excerpt: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { category: true },
    }),
    prisma.article.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="container py-16">
      <SectionHeading eyebrow="Blog" title="Articles" description="Long-form writing on tech, ideas, and everything in between." />

      <form className="mb-10 max-w-md">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search articles…"
          className="w-full rounded-full border border-border bg-card px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </form>

      {articles.length === 0 ? (
        <p className="text-muted-foreground">No articles found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <Link key={a.id} href={`/articles/${a.slug}`}>
              <Card className="h-full card-hover overflow-hidden">
                {a.coverImage && (
                  <div className="aspect-video bg-muted bg-cover bg-center" style={{ backgroundImage: `url(${a.coverImage})` }} />
                )}
                <CardHeader>
                  {a.category && <span className="text-xs font-semibold uppercase tracking-wide text-accent">{a.category.name}</span>}
                  <CardTitle className="line-clamp-2">{a.title}</CardTitle>
                  <CardDescription>{formatDate(a.publishedAt)} · {a.readingTimeMins} min read</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground line-clamp-3">
                  {a.excerpt || excerptFromHtml(a.content, 140)}
                </CardContent>
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
              href={`/articles?page=${i + 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
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
