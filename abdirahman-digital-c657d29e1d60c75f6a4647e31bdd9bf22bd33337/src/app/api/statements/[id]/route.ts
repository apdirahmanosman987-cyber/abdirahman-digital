import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession, logAudit } from "@/lib/admin-auth";
import { statementSchema } from "@/lib/validations";
import { estimateReadingTime } from "@/lib/utils";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const statement = await prisma.statement.findUnique({
    where: { id: params.id },
    include: { tags: { include: { tag: true } } },
  });
  if (!statement) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ statement });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = statementSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }
  const data = parsed.data;

  const existing = await prisma.statement.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Replace tag associations wholesale — simplest correct approach for a small tag set
  await prisma.statementTag.deleteMany({ where: { statementId: params.id } });

  const statement = await prisma.statement.update({
    where: { id: params.id },
    data: {
      title: data.title,
      subtitle: data.subtitle,
      content: data.content,
      featuredImage: data.featuredImage,
      categoryId: data.categoryId || null,
      status: data.status,
      featured: data.featured,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      publishedAt:
        data.status === "PUBLISHED" && !existing.publishedAt ? new Date() : existing.publishedAt,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      readingTimeMins: estimateReadingTime(data.content),
      tags: data.tagIds?.length ? { create: data.tagIds.map((tagId) => ({ tagId })) } : undefined,
    },
  });

  await logAudit({
    userId: (session.user as any).id,
    action: `STATEMENT_${data.status === "PUBLISHED" ? "PUBLISHED" : "UPDATED"}`,
    entityType: "Statement",
    entityId: statement.id,
    req,
  });

  return NextResponse.json({ statement });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.statement.delete({ where: { id: params.id } });

  await logAudit({
    userId: (session.user as any).id,
    action: "STATEMENT_DELETED",
    entityType: "Statement",
    entityId: params.id,
    req,
  });

  return NextResponse.json({ success: true });
}
