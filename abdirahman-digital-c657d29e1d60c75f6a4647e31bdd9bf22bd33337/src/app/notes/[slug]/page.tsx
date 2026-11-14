import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatDate, excerptFromHtml } from "@/lib/utils";

export const revalidate = 60;

async function getNote(slug: string) {
  return prisma.note.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { category: true, tags: { include: { tag: true } } },
  });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const note = await getNote(params.slug);
  if (!note) return {};
  return { title: note.title, description: excerptFromHtml(note.content) };
}

export default async function NoteDetailPage({ params }: { params: { slug: string } }) {
  const note = await getNote(params.slug);
  if (!note) notFound();

  return (
    <article className="container py-16 max-w-3xl">
      {note.category && <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-3">{note.category.name}</p>}
      <h1 className="font-serif text-4xl font-semibold tracking-tight">{note.title}</h1>
      <p className="mt-4 text-sm text-muted-foreground">{formatDate(note.createdAt)}</p>
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-8" dangerouslySetInnerHTML={{ __html: note.content }} />
      {note.tags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2">
          {note.tags.map(({ tag }) => (
            <span key={tag.id} className="rounded-full bg-secondary px-3 py-1 text-xs">#{tag.name}</span>
          ))}
        </div>
      )}
    </article>
  );
}
