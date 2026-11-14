import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });
  const setting = await prisma.siteSetting.findUnique({ where: { key } });
  return NextResponse.json({ value: setting?.value ?? null });
}

export async function PUT(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { key, value } = await req.json();
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });
  const setting = await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  return NextResponse.json({ setting });
}
