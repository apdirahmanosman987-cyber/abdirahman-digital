import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "@/components/section-heading";
import { getSiteSetting } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about Abdirahman — background, skills, and professional journey.",
};

interface AboutContent {
  intro?: string;
  background?: string;
  journey?: string;
  goals?: string;
  interests?: string;
}

export default async function AboutPage() {
  const [content, skills] = await Promise.all([
    getSiteSetting<AboutContent>("about.profile"),
    prisma.skill.findMany({ orderBy: { order: "asc" } }),
  ]);

  const grouped = skills.reduce<Record<string, typeof skills>>((acc, sk) => {
    (acc[sk.category] ??= []).push(sk);
    return acc;
  }, {});

  return (
    <div className="container py-16 max-w-3xl">
      <SectionHeading eyebrow="Get to know me" title="About Abdirahman" />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>{content?.intro || "This section is editable from the admin dashboard — add your introduction here."}</p>
        {content?.background && (
          <>
            <h3>Background</h3>
            <p>{content.background}</p>
          </>
        )}
        {content?.journey && (
          <>
            <h3>Professional Journey</h3>
            <p>{content.journey}</p>
          </>
        )}
        {content?.interests && (
          <>
            <h3>Interests</h3>
            <p>{content.interests}</p>
          </>
        )}
        {content?.goals && (
          <>
            <h3>Goals</h3>
            <p>{content.goals}</p>
          </>
        )}
      </div>

      {Object.keys(grouped).length > 0 && (
        <div className="mt-12">
          <h3 className="font-serif text-2xl font-semibold mb-6">Skills & Technologies</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            {Object.entries(grouped).map(([category, list]) => (
              <div key={category}>
                <p className="text-sm font-semibold uppercase tracking-wide text-accent mb-2">{category}</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {list.map((sk) => (
                    <li key={sk.id}>{sk.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
