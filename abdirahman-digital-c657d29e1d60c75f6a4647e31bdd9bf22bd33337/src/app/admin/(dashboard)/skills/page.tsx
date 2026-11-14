"use client";

import * as React from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Plus, Loader2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminSkillsPage() {
  const { data, mutate, isLoading } = useSWR("/api/skills", fetcher);
  const skills = data?.skills || [];
  const [form, setForm] = React.useState({ name: "", category: "", level: "INTERMEDIATE" });
  const [saving, setSaving] = React.useState(false);

  async function addSkill() {
    if (!form.name.trim() || !form.category.trim()) return toast.error("Name and category are required");
    setSaving(true);
    const res = await fetch("/api/skills", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    if (res.ok) {
      toast.success("Skill added");
      setForm({ name: "", category: "", level: "INTERMEDIATE" });
      mutate();
    } else toast.error("Failed to add skill");
  }

  async function remove(id: string) {
    if (!confirm("Delete this skill?")) return;
    await fetch(`/api/skills/${id}`, { method: "DELETE" });
    mutate();
  }

  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl font-semibold mb-1">Skills</h1>
      <p className="text-sm text-muted-foreground mb-8">Manage skills shown on your About and Home pages.</p>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-wrap gap-2 content-start">
          {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
          {!isLoading && skills.length === 0 && <p className="text-sm text-muted-foreground">No skills yet.</p>}
          {skills.map((s: any) => (
            <span key={s.id} className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm">
              {s.name} <span className="text-xs text-muted-foreground">· {s.category}</span>
              <button onClick={() => remove(s.id)} className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
            </span>
          ))}
        </div>

        <div className="rounded-xl border border-border p-4 space-y-3 h-fit">
          <p className="text-sm font-medium">Add a skill</p>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Skill name" className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm" />
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category (e.g. Web Development)" className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm" />
          <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm">
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
            <option value="EXPERT">Expert</option>
          </select>
          <Button variant="brand" className="w-full" onClick={addSkill} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add skill
          </Button>
        </div>
      </div>
    </div>
  );
}
