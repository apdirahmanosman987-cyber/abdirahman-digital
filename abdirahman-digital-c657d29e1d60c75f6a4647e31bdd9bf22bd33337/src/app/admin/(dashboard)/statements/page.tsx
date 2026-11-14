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

export default function AdminStatementsPage() {
  const { data, mutate, isLoading } = useSWR("/api/statements", fetcher);
  const statements = data?.statements || [];

  async function handleDelete(id: string) {
    if (!confirm("Delete this statement? This cannot be undone.")) return;
    const res = await fetch(`/api/statements/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Statement deleted");
      mutate();
    } else {
      toast.error("Failed to delete statement");
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Statements</h1>
          <p className="text-sm text-muted-foreground">Manage your published and draft statements.</p>
        </div>
        <Button asChild variant="brand">
          <Link href="/admin/statements/new">
            <Plus className="h-4 w-4" /> New statement
          </Link>
        </Button>
      </div>

      <div className="rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left">
            <tr>
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Updated</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr><td colSpan={4} className="px-5 py-6 text-center text-muted-foreground">Loading…</td></tr>
            )}
            {!isLoading && statements.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-6 text-center text-muted-foreground">No statements yet.</td></tr>
            )}
            {statements.map((s: any) => (
              <tr key={s.id}>
                <td className="px-5 py-3 font-medium">{s.title}</td>
                <td className="px-5 py-3"><StatusBadge status={s.status} /></td>
                <td className="px-5 py-3 text-muted-foreground">{formatDate(s.updatedAt)}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link href={`/admin/statements/${s.id}/edit`} className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-secondary">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button onClick={() => handleDelete(s.id)} className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-destructive/10 text-destructive">
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
