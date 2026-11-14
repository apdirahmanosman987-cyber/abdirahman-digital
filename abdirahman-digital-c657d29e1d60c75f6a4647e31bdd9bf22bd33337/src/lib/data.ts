import { prisma } from "@/lib/prisma";

// All public-facing queries filter status: PUBLISHED so drafts never leak.
// This is the single choke point that enforces "only published content is public".

export async function getHomeFeatured() {
  const [statements, articles, portfolios, services, skills] = await Promise.all([
    prisma.statement.findMany({
      where: { status: "PUBLISHED", featured: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
    prisma.article.findMany({
      where: { status: "PUBLISHED", featured: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
      include: { category: true },
    }),
    prisma.portfolioProject.findMany({
      where: { status: "PUBLISHED", featured: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.service.findMany({ orderBy: { order: "asc" }, take: 6 }),
    prisma.skill.findMany({ orderBy: { order: "asc" }, take: 12 }),
  ]);

  return { statements, articles, portfolios, services, skills };
}

export async function getLatestPosts(limit = 6) {
  const [articles, thoughts, notes] = await Promise.all([
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: limit,
    }),
    prisma.thought.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    prisma.note.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
  ]);
  return { articles, thoughts, notes };
}

export async function getSiteSetting<T = any>(key: string): Promise<T | null> {
  const row = await prisma.siteSetting.findUnique({ where: { key } });
  return (row?.value as T) ?? null;
}
