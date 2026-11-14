import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession, logAudit } from "@/lib/admin-auth";
import { thoughtSchema } from "@/lib/validations";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = thoughtSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const data = parsed.data;

  const existing = await prisma.thought.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const thought = await prisma.thought.update({
    where: { id: params.id },
    data: {
      title: data.title,
      text: data.text,
      image: data.image,
      categoryId: data.categoryId || null,
      status: data.status,
    },
  });

  await logAudit({ userId: (session.user as any).id, action: `THOUGHT_${data.status === "PUBLISHED" ? "PUBLISHED" : "UPDATED"}`, entityType: "Thought", entityId: thought.id, req });
  return NextResponse.json({ thought });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.thought.delete({ where: { id: params.id } });
  await logAudit({ userId: (session.user as any).id, action: "THOUGHT_DELETED", entityType: "Thought", entityId: params.id, req });
  return NextResponse.json({ success: true });
}
