import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Notes" };
export const revalidate = 60;

export default async function NotesPage({ searchParams }: { searchParams: { category?: string } }) {
  const [notes, categories] = await Promise.all([
    prisma.note.findMany({
      where: {
        status: "PUBLISHED",
        ...(searchParams.category ? { category: { slug: searchParams.category } } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.category.findMany({ where: { scope: "note" } }),
  ]);

  return (
    <div className="container py-16">
      <SectionHeading eyebrow="Knowledge base" title="Notes" description="Technical notes, ideas, and things I've learned." />

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <Link href="/notes" className="rounded-full border border-border px-4 py-1.5 text-sm hover:bg-secondary">
            All
          </Link>
          {categories.map((c) => (
            <Link key={c.id} href={`/notes?category=${c.slug}`} className="rounded-full border border-border px-4 py-1.5 text-sm hover:bg-secondary">
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {notes.length === 0 ? (
        <p className="text-muted-foreground">No notes published yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((n) => (
            <Link key={n.id} href={`/notes/${n.slug}`}>
              <Card className="h-full card-hover">
                <CardHeader>
                  {n.category && <span className="text-xs font-semibold uppercase tracking-wide text-accent">{n.category.name}</span>}
                  <CardTitle>{n.title}</CardTitle>
                  <CardDescription>{formatDate(n.createdAt)}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
