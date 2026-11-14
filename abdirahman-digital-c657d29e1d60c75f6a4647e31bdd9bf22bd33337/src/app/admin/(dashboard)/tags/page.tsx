"use client";

import * as React from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Plus, Loader2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminTagsPage() {
  const { data, mutate, isLoading } = useSWR("/api/tags", fetcher);
  const tags = data?.tags || [];
  const [name, setName] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  async function add() {
    if (!name.trim()) return toast.error("Tag name is required");
    setSaving(true);
    const res = await fetch("/api/tags", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
    setSaving(false);
    if (res.ok) { toast.success("Tag added"); setName(""); mutate(); } else toast.error("Failed to add tag");
  }

  async function remove(id: string) {
    if (!confirm("Delete this tag?")) return;
    await fetch(`/api/tags/${id}`, { method: "DELETE" });
    mutate();
  }

  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl font-semibold mb-1">Tags</h1>
      <p className="text-sm text-muted-foreground mb-8">Manage tags used across all content types.</p>

      <div className="flex gap-2 mb-6 max-w-md">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New tag" className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm" />
        <Button variant="brand" onClick={add} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!isLoading && tags.length === 0 && <p className="text-sm text-muted-foreground">No tags yet.</p>}
        {tags.map((t: any) => (
          <span key={t.id} className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm">
            #{t.name}
            <button onClick={() => remove(t.id)} className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
          </span>
        ))}
      </div>
    </div>
  );
}
