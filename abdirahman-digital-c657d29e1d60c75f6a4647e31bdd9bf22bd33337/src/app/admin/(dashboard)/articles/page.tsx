"use client";

import * as React from "react";
import Link from "next/link";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatDate } from "@/lib/utils";
import { Plus, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminArticlesPage() {
  const { data, mutate, isLoading } = useSWR("/api/articles", fetcher);
  const articles = data?.articles || [];

  async function handleDelete(id: string) {
    if (!confirm("Delete this article? This cannot be undone.")) return;
    const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Article deleted");
      mutate();
    } else {
      toast.error("Failed to delete article");
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Articles</h1>
          <p className="text-sm text-muted-foreground">Manage your blog posts and articles.</p>
        </div>
        <Button asChild variant="brand">
          <Link href="/admin/articles/new">
            <Plus className="h-4 w-4" /> New article
          </Link>
        </Button>
      </div>

      <div className="rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left">
            <tr>
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Views</th>
              <th className="px-5 py-3 font-medium">Updated</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr><td colSpan={5} className="px-5 py-6 text-center text-muted-foreground">Loading…</td></tr>
            )}
            {!isLoading && articles.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-6 text-center text-muted-foreground">No articles yet.</td></tr>
            )}
            {articles.map((a: any) => (
              <tr key={a.id}>
                <td className="px-5 py-3 font-medium">{a.title}</td>
                <td className="px-5 py-3"><StatusBadge status={a.status} /></td>
                <td className="px-5 py-3 text-muted-foreground">{a.views}</td>
                <td className="px-5 py-3 text-muted-foreground">{formatDate(a.updatedAt)}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link href={`/admin/articles/${a.id}/edit`} className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-secondary">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button onClick={() => handleDelete(a.id)} className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-destructive/10 text-destructive">
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
