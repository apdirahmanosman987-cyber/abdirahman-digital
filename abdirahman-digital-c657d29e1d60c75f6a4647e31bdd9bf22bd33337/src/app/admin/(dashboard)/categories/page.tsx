"use client";

import * as React from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Plus, Loader2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const SCOPES = ["general", "note", "portfolio"];

export default function AdminCategoriesPage() {
  const { data, mutate, isLoading } = useSWR("/api/categories", fetcher);
  const categories = data?.categories || [];
  const [form, setForm] = React.useState({ name: "", scope: "general" });
  const [saving, setSaving] = React.useState(false);

  async function add() {
    if (!form.name.trim()) return toast.error("Name is required");
    setSaving(true);
    const res = await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    if (res.ok) {
      toast.success("Category added");
      setForm({ name: "", scope: "general" });
      mutate();
    } else toast.error("Failed to add category");
  }

  async function remove(id: string) {
    if (!confirm("Delete this category? Content using it will be uncategorized.")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    mutate();
  }

  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl font-semibold mb-1">Categories</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Organize content by category. "note" scope powers Notes filters, "portfolio" scope powers Portfolio, "general" applies everywhere else.
      </p>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border divide-y divide-border">
          {isLoading && <p className="p-5 text-sm text-muted-foreground">Loading…</p>}
          {!isLoading && categories.length === 0 && <p className="p-5 text-sm text-muted-foreground">No categories yet.</p>}
          {categories.map((c: any) => (
            <div key={c.id} className="flex items-center justify-between p-4">
              <span className="text-sm font-medium">{c.name} <span className="text-xs text-muted-foreground">· {c.scope}</span></span>
              <button onClick={() => remove(c.id)} className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-destructive/10 text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border p-4 space-y-3 h-fit">
          <p className="text-sm font-medium">Add a category</p>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Category name" className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm" />
          <select value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm">
            {SCOPES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <Button variant="brand" className="w-full" onClick={add} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add category
          </Button>
        </div>
      </div>
    </div>
  );
}
