"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface Values { title: string; content: string; categoryId: string; status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED"; }
const EMPTY: Values = { title: "", content: "", categoryId: "", status: "DRAFT" };

export function NoteForm({ id }: { id?: string }) {
  const router = useRouter();
  const [values, setValues] = React.useState<Values>(EMPTY);
  const [saving, setSaving] = React.useState(false);
  const { data: categoriesData } = useSWR("/api/categories?scope=note", fetcher);
  const { data: existing } = useSWR(id ? `/api/notes/${id}` : null, fetcher);

  React.useEffect(() => {
    if (existing?.note) {
      const n = existing.note;
      setValues({ title: n.title, content: n.content, categoryId: n.categoryId || "", status: n.status });
    }
  }, [existing]);

  function update<K extends keyof Values>(key: K, value: Values[K]) { setValues((v) => ({ ...v, [key]: value })); }

  async function save(statusOverride?: Values["status"]) {
    if (!values.title.trim() || !values.content.trim()) { toast.error("Title and content are required"); return; }
    setSaving(true);
    const payload = { ...values, status: statusOverride ?? values.status, categoryId: values.categoryId || null };
    const url = id ? `/api/notes/${id}` : "/api/notes";
    try {
      const res = await fetch(url, { method: id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      toast.success(id ? "Note updated" : "Note created");
      router.push("/admin/notes");
      router.refresh();
    } catch (err: any) { toast.error(err.message); } finally { setSaving(false); }
  }

  const categories = categoriesData?.categories || [];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <input value={values.title} onChange={(e) => update("title", e.target.value)} placeholder="Note title" className="w-full rounded-xl border border-border bg-card px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        <RichTextEditor content={values.content} onChange={(html) => update("content", html)} />
      </div>
      <div className="space-y-4">
        <div className="rounded-xl border border-border p-4 space-y-3">
          <p className="text-sm font-medium">Publishing</p>
          <select value={values.status} onChange={(e) => update("status", e.target.value as any)} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" disabled={saving} onClick={() => save("DRAFT")}>{saving && <Loader2 className="h-4 w-4 animate-spin" />} Save draft</Button>
            <Button variant="brand" className="flex-1" disabled={saving} onClick={() => save("PUBLISHED")}>Publish</Button>
          </div>
        </div>
        <div className="rounded-xl border border-border p-4 space-y-3">
          <p className="text-sm font-medium">Category</p>
          <p className="text-xs text-muted-foreground">Note categories: Technology, Programming, Database, Networking, CCTV, Graphic Design, Video Editing, AI, Personal Development, Other — editable under Admin → Categories.</p>
          <select value={values.categoryId} onChange={(e) => update("categoryId", e.target.value)} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm">
            <option value="">No category</option>
            {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
