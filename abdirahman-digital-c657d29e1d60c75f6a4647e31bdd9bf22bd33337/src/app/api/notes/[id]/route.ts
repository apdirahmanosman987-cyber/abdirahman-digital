import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession, logAudit } from "@/lib/admin-auth";
import { noteSchema } from "@/lib/validations";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const note = await prisma.note.findUnique({ where: { id: params.id }, include: { tags: { include: { tag: true } } } });
  if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ note });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = noteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const data = parsed.data;

  const existing = await prisma.note.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.noteTag.deleteMany({ where: { noteId: params.id } });

  const note = await prisma.note.update({
    where: { id: params.id },
    data: {
      title: data.title,
      content: data.content,
      categoryId: data.categoryId || null,
      status: data.status,
      tags: data.tagIds?.length ? { create: data.tagIds.map((tagId) => ({ tagId })) } : undefined,
    },
  });

  await logAudit({ userId: (session.user as any).id, action: `NOTE_${data.status === "PUBLISHED" ? "PUBLISHED" : "UPDATED"}`, entityType: "Note", entityId: note.id, req });
  return NextResponse.json({ note });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.note.delete({ where: { id: params.id } });
  await logAudit({ userId: (session.user as any).id, action: "NOTE_DELETED", entityType: "Note", entityId: params.id, req });
  return NextResponse.json({ success: true });
}
