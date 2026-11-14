import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession, logAudit } from "@/lib/admin-auth";
import { noteSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const notes = await prisma.note.findMany({ orderBy: { updatedAt: "desc" }, include: { category: true } });
  return NextResponse.json({ notes });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = noteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const data = parsed.data;

  let slug = slugify(data.title);
  if (await prisma.note.findUnique({ where: { slug } })) slug = `${slug}-${Date.now().toString(36)}`;

  const note = await prisma.note.create({
    data: {
      title: data.title,
      slug,
      content: data.content,
      categoryId: data.categoryId || null,
      status: data.status,
      authorId: (session.user as any).id,
      tags: data.tagIds?.length ? { create: data.tagIds.map((tagId) => ({ tagId })) } : undefined,
    },
  });

  await logAudit({ userId: (session.user as any).id, action: "NOTE_CREATED", entityType: "Note", entityId: note.id, req });
  return NextResponse.json({ note }, { status: 201 });
}
