import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate, excerptFromHtml } from "@/lib/utils";
import { ShareButtons } from "@/components/share-buttons";

export const revalidate = 60;

async function getArticle(slug: string) {
  return prisma.article.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { category: true, tags: { include: { tag: true } }, author: true },
  });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return {};
  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt || excerptFromHtml(article.content),
    openGraph: {
      title: article.title,
      description: article.seoDescription || article.excerpt || excerptFromHtml(article.content),
      images: article.ogImage || article.coverImage ? [article.ogImage || article.coverImage!] : undefined,
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
    },
    twitter: { card: "summary_large_image" },
    alternates: { canonical: `/articles/${article.slug}` },
  };
}

export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  // increment views best-effort, fire and forget
  prisma.article.update({ where: { id: article.id }, data: { views: { increment: 1 } } }).catch(() => {});

  const related = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: article.id },
      categoryId: article.categoryId ?? undefined,
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  const url = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/articles/${article.slug}`;

  return (
    <article className="container py-16 max-w-3xl">
      {article.category && (
        <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-3">{article.category.name}</p>
      )}
      <h1 className="font-serif text-4xl font-semibold tracking-tight">{article.title}</h1>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span>By {article.author.name}</span>
          <span>·</span>
          <span>{formatDate(article.publishedAt)}</span>
          <span>·</span>
          <span>{article.readingTimeMins} min read</span>
        </div>
        <ShareButtons title={article.title} url={url} />
      </div>

      {article.coverImage && (
        <img src={article.coverImage} alt={article.title} className="mt-8 w-full rounded-2xl border border-border" />
      )}

      <div
        className="prose prose-neutral dark:prose-invert max-w-none mt-8"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {article.tags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2">
          {article.tags.map(({ tag }) => (
            <span key={tag.id} className="rounded-full bg-secondary px-3 py-1 text-xs">#{tag.name}</span>
          ))}
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-16 border-t border-border pt-10">
          <h3 className="font-serif text-xl font-semibold mb-6">Related Articles</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <Link key={r.id} href={`/articles/${r.slug}`} className="text-sm font-medium hover:text-primary transition-colors">
                {r.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
