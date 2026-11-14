import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate, excerptFromHtml } from "@/lib/utils";

export const revalidate = 60;

async function getStatement(slug: string) {
  return prisma.statement.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { category: true, tags: { include: { tag: true } }, author: true },
  });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const statement = await getStatement(params.slug);
  if (!statement) return {};
  return {
    title: statement.seoTitle || statement.title,
    description: statement.seoDescription || excerptFromHtml(statement.content),
    openGraph: {
      title: statement.title,
      description: statement.seoDescription || excerptFromHtml(statement.content),
      images: statement.featuredImage ? [statement.featuredImage] : undefined,
    },
    alternates: { canonical: `/statements/${statement.slug}` },
  };
}

export default async function StatementDetailPage({ params }: { params: { slug: string } }) {
  const statement = await getStatement(params.slug);
  if (!statement) notFound();

  return (
    <article className="container py-16 max-w-3xl">
      {statement.category && (
        <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-3">
          {statement.category.name}
        </p>
      )}
      <h1 className="font-serif text-4xl font-semibold tracking-tight">{statement.title}</h1>
      {statement.subtitle && <p className="mt-3 text-lg text-muted-foreground">{statement.subtitle}</p>}

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span>By {statement.author.name}</span>
        <span>·</span>
        <span>{formatDate(statement.publishedAt)}</span>
        <span>·</span>
        <span>{statement.readingTimeMins} min read</span>
      </div>

      {statement.featuredImage && (
        <img
          src={statement.featuredImage}
          alt={statement.title}
          className="mt-8 w-full rounded-2xl border border-border"
        />
      )}

      <div
        className="prose prose-neutral dark:prose-invert max-w-none mt-8"
        dangerouslySetInnerHTML={{ __html: statement.content }}
      />

      {statement.tags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2">
          {statement.tags.map(({ tag }) => (
            <span key={tag.id} className="rounded-full bg-secondary px-3 py-1 text-xs">
              #{tag.name}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
