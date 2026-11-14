"use client";

import Link from "next/link";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatDate } from "@/lib/utils";
import { Plus, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function ContentList({
  title,
  description,
  apiPath,
  dataKey,
  basePath,
  hasStatus = true,
}: {
  title: string;
  description: string;
  apiPath: string;
  dataKey: string;
  basePath: string;
  hasStatus?: boolean;
}) {
  const { data, mutate, isLoading } = useSWR(apiPath, fetcher);
  const items: any[] = data?.[dataKey] || [];

  async function handleDelete(id: string) {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    const res = await fetch(`${apiPath}/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Deleted");
      mutate();
    } else {
      toast.error("Failed to delete");
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button asChild variant="brand">
          <Link href={`${basePath}/new`}>
            <Plus className="h-4 w-4" /> New
          </Link>
        </Button>
      </div>

      <div className="rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left">
            <tr>
              <th className="px-5 py-3 font-medium">Title</th>
              {hasStatus && <th className="px-5 py-3 font-medium">Status</th>}
              <th className="px-5 py-3 font-medium">Updated</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr><td colSpan={4} className="px-5 py-6 text-center text-muted-foreground">Loading…</td></tr>
            )}
            {!isLoading && items.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-6 text-center text-muted-foreground">Nothing here yet.</td></tr>
            )}
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-5 py-3 font-medium">{item.title || item.name || item.text?.slice(0, 60)}</td>
                {hasStatus && <td className="px-5 py-3"><StatusBadge status={item.status} /></td>}
                <td className="px-5 py-3 text-muted-foreground">{formatDate(item.updatedAt)}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link href={`${basePath}/${item.id}/edit`} className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-secondary">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button onClick={() => handleDelete(item.id)} className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-destructive/10 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
