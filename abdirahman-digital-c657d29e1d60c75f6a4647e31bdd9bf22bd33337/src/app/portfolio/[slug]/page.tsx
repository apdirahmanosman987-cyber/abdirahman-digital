import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

export const revalidate = 60;

async function getProject(slug: string) {
  return prisma.portfolioProject.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { category: true, tags: { include: { tag: true } } },
  });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProject(params.slug);
  if (!project) return {};
  return { title: project.title, description: project.description };
}

export default async function PortfolioDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  return (
    <article className="container py-16 max-w-4xl">
      {project.category && <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-3">{project.category.name}</p>}
      <h1 className="font-serif text-4xl font-semibold tracking-tight">{project.title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{project.description}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {project.projectUrl && (
          <Button asChild variant="brand">
            <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
              Visit project <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
        {project.githubUrl && (
          <Button asChild variant="outline">
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" /> View code
            </a>
          </Button>
        )}
      </div>

      {project.image && <img src={project.image} alt={project.title} className="mt-10 w-full rounded-2xl border border-border" />}

      {project.screenshots.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {project.screenshots.map((s, i) => (
            <img key={i} src={s} alt={`${project.title} screenshot ${i + 1}`} className="rounded-xl border border-border" />
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-2">
        {project.technologies.map((t) => (
          <span key={t} className="rounded-full bg-secondary px-3 py-1 text-xs">{t}</span>
        ))}
      </div>

      {project.completionDate && (
        <p className="mt-6 text-sm text-muted-foreground">Completed {formatDate(project.completionDate)}</p>
      )}
    </article>
  );
}
