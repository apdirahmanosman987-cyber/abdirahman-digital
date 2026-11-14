import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticRoutes = [
    "",
    "/about",
    "/statements",
    "/announcements",
    "/articles",
    "/notes",
    "/thoughts",
    "/portfolio",
    "/services",
    "/contact",
    "/privacy",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const [statements, articles, notes, portfolios] = await Promise.all([
    prisma.statement.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.article.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.note.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.portfolioProject.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
  ]);

  const dynamicRoutes = [
    ...statements.map((s) => ({ url: `${siteUrl}/statements/${s.slug}`, lastModified: s.updatedAt })),
    ...articles.map((a) => ({ url: `${siteUrl}/articles/${a.slug}`, lastModified: a.updatedAt })),
    ...notes.map((n) => ({ url: `${siteUrl}/notes/${n.slug}`, lastModified: n.updatedAt })),
    ...portfolios.map((p) => ({ url: `${siteUrl}/portfolio/${p.slug}`, lastModified: p.updatedAt })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
