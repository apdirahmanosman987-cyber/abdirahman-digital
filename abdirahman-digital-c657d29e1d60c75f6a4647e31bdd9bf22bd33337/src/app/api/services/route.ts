import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";
import { serviceSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ services });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const slug = slugify(parsed.data.name);
  const service = await prisma.service.create({ data: { ...parsed.data, slug } });
  return NextResponse.json({ service }, { status: 201 });
}
