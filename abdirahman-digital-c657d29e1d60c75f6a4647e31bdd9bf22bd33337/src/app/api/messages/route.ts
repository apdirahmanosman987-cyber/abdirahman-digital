import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ messages });
}
