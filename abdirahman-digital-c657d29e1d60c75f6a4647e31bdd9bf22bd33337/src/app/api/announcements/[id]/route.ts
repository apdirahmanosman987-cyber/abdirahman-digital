import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession, logAudit } from "@/lib/admin-auth";
import { announcementSchema } from "@/lib/validations";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const announcement = await prisma.announcement.findUnique({ where: { id: params.id }, include: { tags: { include: { tag: true } } } });
  if (!announcement) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ announcement });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = announcementSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const data = parsed.data;

  const existing = await prisma.announcement.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.announcementTag.deleteMany({ where: { announcementId: params.id } });

  const announcement = await prisma.announcement.update({
    where: { id: params.id },
    data: {
      title: data.title,
      content: data.content,
      image: data.image,
      categoryId: data.categoryId || null,
      status: data.status,
      featured: data.featured,
      publishedAt: data.status === "PUBLISHED" && !existing.publishedAt ? new Date() : existing.publishedAt,
      tags: data.tagIds?.length ? { create: data.tagIds.map((tagId) => ({ tagId })) } : undefined,
    },
  });

  await logAudit({ userId: (session.user as any).id, action: `ANNOUNCEMENT_${data.status === "PUBLISHED" ? "PUBLISHED" : "UPDATED"}`, entityType: "Announcement", entityId: announcement.id, req });
  return NextResponse.json({ announcement });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.announcement.delete({ where: { id: params.id } });
  await logAudit({ userId: (session.user as any).id, action: "ANNOUNCEMENT_DELETED", entityType: "Announcement", entityId: params.id, req });
  return NextResponse.json({ success: true });
}
