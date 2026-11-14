import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession, logAudit } from "@/lib/admin-auth";
import { articleSchema } from "@/lib/validations";
import { estimateReadingTime, excerptFromHtml } from "@/lib/utils";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const article = await prisma.article.findUnique({
    where: { id: params.id },
    include: { tags: { include: { tag: true } } },
  });
  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ article });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = articleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }
  const data = parsed.data;

  const existing = await prisma.article.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.articleTag.deleteMany({ where: { articleId: params.id } });

  const article = await prisma.article.update({
    where: { id: params.id },
    data: {
      title: data.title,
      excerpt: data.excerpt || excerptFromHtml(data.content, 160),
      content: data.content,
      coverImage: data.coverImage,
      categoryId: data.categoryId || null,
      status: data.status,
      featured: data.featured,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      publishedAt:
        data.status === "PUBLISHED" && !existing.publishedAt ? new Date() : existing.publishedAt,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      ogImage: data.ogImage,
      readingTimeMins: estimateReadingTime(data.content),
      tags: data.tagIds?.length ? { create: data.tagIds.map((tagId) => ({ tagId })) } : undefined,
    },
  });

  await logAudit({
    userId: (session.user as any).id,
    action: `ARTICLE_${data.status === "PUBLISHED" ? "PUBLISHED" : "UPDATED"}`,
    entityType: "Article",
    entityId: article.id,
    req,
  });

  return NextResponse.json({ article });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.article.delete({ where: { id: params.id } });

  await logAudit({
    userId: (session.user as any).id,
    action: "ARTICLE_DELETED",
    entityType: "Article",
    entityId: params.id,
    req,
  });

  return NextResponse.json({ success: true });
}
