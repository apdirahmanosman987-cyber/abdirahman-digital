import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-10 max-w-2xl", className)}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">{eyebrow}</p>
      )}
      <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight">{title}</h2>
      {description && <p className="mt-3 text-muted-foreground">{description}</p>}
    </div>
  );
}
