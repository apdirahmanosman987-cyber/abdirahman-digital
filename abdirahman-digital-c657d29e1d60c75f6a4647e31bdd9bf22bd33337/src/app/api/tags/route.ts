import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";
import { tagSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ tags });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = tagSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });

  const slug = slugify(parsed.data.name);
  const tag = await prisma.tag.upsert({
    where: { slug },
    update: {},
    create: { name: parsed.data.name, slug },
  });

  return NextResponse.json({ tag }, { status: 201 });
}
