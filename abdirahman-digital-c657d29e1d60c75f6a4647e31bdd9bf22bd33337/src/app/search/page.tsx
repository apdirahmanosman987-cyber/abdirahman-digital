import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "@/components/section-heading";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q?.trim();

  let results: { type: string; title: string; href: string; date: Date | null }[] = [];

  if (q) {
    const mode = "insensitive" as const;
    const [statements, articles, notes, announcements, thoughts, portfolios] = await Promise.all([
      prisma.statement.findMany({ where: { status: "PUBLISHED", title: { contains: q, mode } }, take: 10 }),
      prisma.article.findMany({ where: { status: "PUBLISHED", title: { contains: q, mode } }, take: 10 }),
      prisma.note.findMany({ where: { status: "PUBLISHED", title: { contains: q, mode } }, take: 10 }),
      prisma.announcement.findMany({ where: { status: "PUBLISHED", title: { contains: q, mode } }, take: 10 }),
      prisma.thought.findMany({ where: { status: "PUBLISHED", text: { contains: q, mode } }, take: 10 }),
      prisma.portfolioProject.findMany({ where: { status: "PUBLISHED", title: { contains: q, mode } }, take: 10 }),
    ]);

    results = [
      ...statements.map((s) => ({ type: "Statement", title: s.title, href: `/statements/${s.slug}`, date: s.publishedAt })),
      ...articles.map((a) => ({ type: "Article", title: a.title, href: `/articles/${a.slug}`, date: a.publishedAt })),
      ...notes.map((n) => ({ type: "Note", title: n.title, href: `/notes/${n.slug}`, date: n.createdAt })),
      ...announcements.map((a) => ({ type: "Announcement", title: a.title, href: `/announcements`, date: a.publishedAt })),
      ...thoughts.map((t) => ({ type: "Thought", title: t.title || t.text.slice(0, 60), href: `/thoughts`, date: t.createdAt })),
      ...portfolios.map((p) => ({ type: "Portfolio", title: p.title, href: `/portfolio/${p.slug}`, date: p.createdAt })),
    ];
  }

  return (
    <div className="container py-16 max-w-2xl">
      <SectionHeading eyebrow="Find anything" title="Search" />

      <form className="mb-10">
        <input
          type="search"
          name="q"
          defaultValue={q}
          autoFocus
          placeholder="Search statements, articles, notes…"
          className="w-full rounded-full border border-border bg-card px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </form>

      {q && (
        <>
          <p className="text-sm text-muted-foreground mb-6">
            {results.length} result{results.length !== 1 ? "s" : ""} for "{q}"
          </p>
          <div className="space-y-3">
            {results.map((r, i) => (
              <Link key={i} href={r.href} className="flex items-center justify-between border-b border-border py-3 hover:text-primary transition-colors">
                <span>
                  <span className="text-xs uppercase tracking-wide text-accent mr-2">{r.type}</span>
                  {r.title}
                </span>
                <span className="text-xs text-muted-foreground">{formatDate(r.date)}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
