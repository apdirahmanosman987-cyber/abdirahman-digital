import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession, logAudit } from "@/lib/admin-auth";
import { announcementSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const announcements = await prisma.announcement.findMany({ orderBy: { updatedAt: "desc" }, include: { category: true } });
  return NextResponse.json({ announcements });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = announcementSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const data = parsed.data;

  let slug = slugify(data.title);
  if (await prisma.announcement.findUnique({ where: { slug } })) slug = `${slug}-${Date.now().toString(36)}`;

  const announcement = await prisma.announcement.create({
    data: {
      title: data.title,
      slug,
      content: data.content,
      image: data.image,
      categoryId: data.categoryId || null,
      status: data.status,
      featured: data.featured,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      authorId: (session.user as any).id,
      tags: data.tagIds?.length ? { create: data.tagIds.map((tagId) => ({ tagId })) } : undefined,
    },
  });

  await logAudit({ userId: (session.user as any).id, action: "ANNOUNCEMENT_CREATED", entityType: "Announcement", entityId: announcement.id, req });
  return NextResponse.json({ announcement }, { status: 201 });
}
