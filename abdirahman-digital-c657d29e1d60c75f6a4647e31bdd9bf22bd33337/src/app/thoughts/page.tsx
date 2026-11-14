import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "@/components/section-heading";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Thoughts" };
export const revalidate = 60;

export default async function ThoughtsPage() {
  const thoughts = await prisma.thought.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="container py-16 max-w-2xl">
      <SectionHeading eyebrow="Short-form" title="Thoughts" description="Quick ideas, reflections, and observations." />

      <div className="space-y-6">
        {thoughts.length === 0 && <p className="text-muted-foreground">Nothing here yet.</p>}
        {thoughts.map((t) => (
          <div key={t.id} className="rounded-2xl border border-border p-6 card-hover">
            {t.title && <h3 className="font-serif text-lg font-semibold mb-2">{t.title}</h3>}
            <p className="text-foreground/90 whitespace-pre-line">{t.text}</p>
            {t.image && <img src={t.image} alt={t.title ?? ""} className="mt-4 rounded-xl w-full" />}
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              {t.category && <span>{t.category.name}</span>}
              <span>·</span>
              <span>{formatDate(t.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
