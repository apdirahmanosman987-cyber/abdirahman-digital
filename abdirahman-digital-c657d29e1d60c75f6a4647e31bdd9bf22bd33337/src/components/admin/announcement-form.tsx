"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface Values {
  title: string;
  content: string;
  image: string;
  categoryId: string;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  featured: boolean;
}

const EMPTY: Values = { title: "", content: "", image: "", categoryId: "", status: "DRAFT", featured: false };

export function AnnouncementForm({ id }: { id?: string }) {
  const router = useRouter();
  const [values, setValues] = React.useState<Values>(EMPTY);
  const [saving, setSaving] = React.useState(false);
  const { data: categoriesData } = useSWR("/api/categories?scope=general", fetcher);
  const { data: existing } = useSWR(id ? `/api/announcements/${id}` : null, fetcher);

  React.useEffect(() => {
    if (existing?.announcement) {
      const a = existing.announcement;
      setValues({ title: a.title, content: a.content, image: a.image || "", categoryId: a.categoryId || "", status: a.status, featured: a.featured });
    }
  }, [existing]);

  function update<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function save(statusOverride?: Values["status"]) {
    if (!values.title.trim() || !values.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    setSaving(true);
    const payload = { ...values, status: statusOverride ?? values.status, categoryId: values.categoryId || null };
    const url = id ? `/api/announcements/${id}` : "/api/announcements";
    try {
      const res = await fetch(url, { method: id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      toast.success(id ? "Announcement updated" : "Announcement created");
      router.push("/admin/announcements");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  const categories = categoriesData?.categories || [];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <input value={values.title} onChange={(e) => update("title", e.target.value)} placeholder="Announcement title" className="w-full rounded-xl border border-border bg-card px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        <RichTextEditor content={values.content} onChange={(html) => update("content", html)} />
      </div>
      <div className="space-y-4">
        <div className="rounded-xl border border-border p-4 space-y-3">
          <p className="text-sm font-medium">Publishing</p>
          <select value={values.status} onChange={(e) => update("status", e.target.value as any)} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm">
            <option value="DRAFT">Draft</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={values.featured} onChange={(e) => update("featured", e.target.checked)} /> Featured
          </label>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" disabled={saving} onClick={() => save("DRAFT")}>{saving && <Loader2 className="h-4 w-4 animate-spin" />} Save draft</Button>
            <Button variant="brand" className="flex-1" disabled={saving} onClick={() => save("PUBLISHED")}>Publish</Button>
          </div>
        </div>
        <div className="rounded-xl border border-border p-4 space-y-3">
          <p className="text-sm font-medium">Category & Image</p>
          <select value={values.categoryId} onChange={(e) => update("categoryId", e.target.value)} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm">
            <option value="">No category</option>
            {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input value={values.image} onChange={(e) => update("image", e.target.value)} placeholder="Image URL" className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm" />
        </div>
      </div>
    </div>
  );
}
