import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession, logAudit } from "@/lib/admin-auth";
import { thoughtSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const thoughts = await prisma.thought.findMany({ orderBy: { updatedAt: "desc" }, include: { category: true } });
  return NextResponse.json({ thoughts });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = thoughtSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const data = parsed.data;

  let slug = slugify(data.title || data.text.slice(0, 40));
  if (await prisma.thought.findUnique({ where: { slug } })) slug = `${slug}-${Date.now().toString(36)}`;

  const thought = await prisma.thought.create({
    data: {
      title: data.title,
      slug,
      text: data.text,
      image: data.image,
      categoryId: data.categoryId || null,
      status: data.status,
      authorId: (session.user as any).id,
      tags: data.tagIds?.length ? { create: data.tagIds.map((tagId) => ({ tagId })) } : undefined,
    },
  });

  await logAudit({ userId: (session.user as any).id, action: "THOUGHT_CREATED", entityType: "Thought", entityId: thought.id, req });
  return NextResponse.json({ thought }, { status: 201 });
}
