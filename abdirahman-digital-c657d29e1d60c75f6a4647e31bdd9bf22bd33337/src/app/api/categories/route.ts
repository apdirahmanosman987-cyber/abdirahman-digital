import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";
import { categorySchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const scope = searchParams.get("scope");
  // Categories are needed by public pages too (e.g. notes filter), so this is unauthenticated for GET.
  const categories = await prisma.category.findMany({
    where: scope ? { scope } : undefined,
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });

  const slug = slugify(parsed.data.name);

  const existing = await prisma.category.findFirst({ where: { slug, scope: parsed.data.scope } });
  if (existing) {
    return NextResponse.json(
      { error: `A category named "${parsed.data.name}" already exists in this scope.` },
      { status: 409 }
    );
  }

  const category = await prisma.category.create({
    data: { ...parsed.data, slug },
  });

  return NextResponse.json({ category }, { status: 201 });
}
