"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface Values { title: string; text: string; image: string; categoryId: string; status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED"; }
const EMPTY: Values = { title: "", text: "", image: "", categoryId: "", status: "DRAFT" };

export function ThoughtForm({ id }: { id?: string }) {
  const router = useRouter();
  const [values, setValues] = React.useState<Values>(EMPTY);
  const [saving, setSaving] = React.useState(false);
  const { data: categoriesData } = useSWR("/api/categories?scope=general", fetcher);
  const { data: existing } = useSWR(id ? `/api/thoughts/${id}` : null, fetcher);

  React.useEffect(() => {
    if (existing?.thought) {
      const t = existing.thought;
      setValues({ title: t.title || "", text: t.text, image: t.image || "", categoryId: t.categoryId || "", status: t.status });
    }
  }, [existing]);

  function update<K extends keyof Values>(key: K, value: Values[K]) { setValues((v) => ({ ...v, [key]: value })); }

  async function save(statusOverride?: Values["status"]) {
    if (!values.text.trim()) { toast.error("Text is required"); return; }
    setSaving(true);
    const payload = { ...values, status: statusOverride ?? values.status, categoryId: values.categoryId || null };
    const url = id ? `/api/thoughts/${id}` : "/api/thoughts";
    try {
      const res = await fetch(url, { method: id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      toast.success(id ? "Thought updated" : "Thought published");
      router.push("/admin/thoughts");
      router.refresh();
    } catch (err: any) { toast.error(err.message); } finally { setSaving(false); }
  }

  const categories = categoriesData?.categories || [];

  return (
    <div className="max-w-xl space-y-4">
      <input value={values.title} onChange={(e) => update("title", e.target.value)} placeholder="Short title (optional)" className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      <textarea value={values.text} onChange={(e) => update("text", e.target.value)} placeholder="What's on your mind?" rows={6} className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
      <input value={values.image} onChange={(e) => update("image", e.target.value)} placeholder="Image URL (optional)" className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      <select value={values.categoryId} onChange={(e) => update("categoryId", e.target.value)} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm">
        <option value="">No category</option>
        {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" disabled={saving} onClick={() => save("DRAFT")}>{saving && <Loader2 className="h-4 w-4 animate-spin" />} Save draft</Button>
        <Button variant="brand" className="flex-1" disabled={saving} onClick={() => save("PUBLISHED")}>Publish</Button>
      </div>
    </div>
  );
}
