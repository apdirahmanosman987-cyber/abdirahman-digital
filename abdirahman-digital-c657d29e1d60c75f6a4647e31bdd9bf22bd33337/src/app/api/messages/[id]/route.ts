import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const message = await prisma.contactMessage.update({ where: { id: params.id }, data: { isRead: !!body.isRead } });
  return NextResponse.json({ message });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.contactMessage.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
