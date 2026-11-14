import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession, logAudit } from "@/lib/admin-auth";
import { statementSchema } from "@/lib/validations";
import { slugify, estimateReadingTime } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const statements = await prisma.statement.findMany({
    where: status ? { status: status as any } : undefined,
    orderBy: { updatedAt: "desc" },
    include: { category: true, tags: { include: { tag: true } } },
  });

  return NextResponse.json({ statements });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = statementSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }
  const data = parsed.data;

  let slug = slugify(data.title);
  const existing = await prisma.statement.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const statement = await prisma.statement.create({
    data: {
      title: data.title,
      subtitle: data.subtitle,
      slug,
      content: data.content,
      featuredImage: data.featuredImage,
      categoryId: data.categoryId || null,
      status: data.status,
      featured: data.featured,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      readingTimeMins: estimateReadingTime(data.content),
      authorId: (session.user as any).id,
      tags: data.tagIds?.length
        ? { create: data.tagIds.map((tagId) => ({ tagId })) }
        : undefined,
    },
  });

  await logAudit({
    userId: (session.user as any).id,
    action: "STATEMENT_CREATED",
    entityType: "Statement",
    entityId: statement.id,
    req,
  });

  return NextResponse.json({ statement }, { status: 201 });
}
