import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

export const metadata: Metadata = { title: "Services" };
export const revalidate = 60;

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ orderBy: [{ featured: "desc" }, { order: "asc" }] });

  return (
    <div className="container py-16">
      <SectionHeading eyebrow="How I can help" title="Services" description="Ways I can support your project or organization." />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Card key={s.id} className="card-hover">
            <CardHeader>
              <CardTitle>{s.name}</CardTitle>
              {s.price && <p className="text-sm text-accent font-medium">{s.price}</p>}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{s.description}</p>
              {s.features.length > 0 && (
                <ul className="space-y-1.5">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-4 text-xs text-muted-foreground">{s.availability}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
