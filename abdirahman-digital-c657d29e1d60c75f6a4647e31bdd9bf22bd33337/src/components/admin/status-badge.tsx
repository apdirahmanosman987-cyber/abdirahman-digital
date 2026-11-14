import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  DRAFT: "bg-secondary text-secondary-foreground",
  SCHEDULED: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
  PUBLISHED: "bg-accent/15 text-accent",
  ARCHIVED: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium capitalize", STYLES[status] || STYLES.DRAFT)}>
      {status.toLowerCase()}
    </span>
  );
}
