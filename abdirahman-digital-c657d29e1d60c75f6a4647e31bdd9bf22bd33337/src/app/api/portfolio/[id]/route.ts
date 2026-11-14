import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession, logAudit } from "@/lib/admin-auth";
import { portfolioSchema } from "@/lib/validations";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = portfolioSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const data = parsed.data;

  const existing = await prisma.portfolioProject.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const project = await prisma.portfolioProject.update({
    where: { id: params.id },
    data: {
      title: data.title,
      description: data.description,
      image: data.image,
      screenshots: data.screenshots,
      technologies: data.technologies,
      projectUrl: data.projectUrl,
      githubUrl: data.githubUrl,
      completionDate: data.completionDate ? new Date(data.completionDate) : null,
      categoryId: data.categoryId || null,
      featured: data.featured,
      status: data.status,
    },
  });

  await logAudit({ userId: (session.user as any).id, action: `PORTFOLIO_${data.status === "PUBLISHED" ? "PUBLISHED" : "UPDATED"}`, entityType: "PortfolioProject", entityId: project.id, req });
  return NextResponse.json({ project });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.portfolioProject.delete({ where: { id: params.id } });
  await logAudit({ userId: (session.user as any).id, action: "PORTFOLIO_DELETED", entityType: "PortfolioProject", entityId: params.id, req });
  return NextResponse.json({ success: true });
}
