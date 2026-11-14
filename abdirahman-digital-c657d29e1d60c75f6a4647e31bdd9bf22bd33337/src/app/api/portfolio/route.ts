import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession, logAudit } from "@/lib/admin-auth";
import { portfolioSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const projects = await prisma.portfolioProject.findMany({ orderBy: { updatedAt: "desc" }, include: { category: true } });
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = portfolioSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const data = parsed.data;

  let slug = slugify(data.title);
  if (await prisma.portfolioProject.findUnique({ where: { slug } })) slug = `${slug}-${Date.now().toString(36)}`;

  const project = await prisma.portfolioProject.create({
    data: {
      title: data.title,
      slug,
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
      authorId: (session.user as any).id,
      tags: data.tagIds?.length ? { create: data.tagIds.map((tagId) => ({ tagId })) } : undefined,
    },
  });

  await logAudit({ userId: (session.user as any).id, action: "PORTFOLIO_CREATED", entityType: "PortfolioProject", entityId: project.id, req });
  return NextResponse.json({ project }, { status: 201 });
}
