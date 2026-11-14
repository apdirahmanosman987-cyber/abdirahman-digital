"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface Values {
  title: string; description: string; image: string; screenshots: string; technologies: string;
  projectUrl: string; githubUrl: string; completionDate: string; categoryId: string;
  featured: boolean; status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
}
const EMPTY: Values = { title: "", description: "", image: "", screenshots: "", technologies: "", projectUrl: "", githubUrl: "", completionDate: "", categoryId: "", featured: false, status: "DRAFT" };

export function PortfolioForm({ id }: { id?: string }) {
  const router = useRouter();
  const [values, setValues] = React.useState<Values>(EMPTY);
  const [saving, setSaving] = React.useState(false);
  const { data: categoriesData } = useSWR("/api/categories?scope=portfolio", fetcher);
  const { data: existing } = useSWR(id ? `/api/portfolio/${id}` : null, fetcher);

  React.useEffect(() => {
    if (existing?.project) {
      const p = existing.project;
      setValues({
        title: p.title, description: p.description, image: p.image || "",
        screenshots: (p.screenshots || []).join(", "), technologies: (p.technologies || []).join(", "),
        projectUrl: p.projectUrl || "", githubUrl: p.githubUrl || "",
        completionDate: p.completionDate ? p.completionDate.slice(0, 10) : "",
        categoryId: p.categoryId || "", featured: p.featured, status: p.status,
      });
    }
  }, [existing]);

  function update<K extends keyof Values>(key: K, value: Values[K]) { setValues((v) => ({ ...v, [key]: value })); }

  async function save(statusOverride?: Values["status"]) {
    if (!values.title.trim() || !values.description.trim()) { toast.error("Title and description are required"); return; }
    setSaving(true);
    const payload = {
      ...values,
      status: statusOverride ?? values.status,
      categoryId: values.categoryId || null,
      screenshots: values.screenshots.split(",").map((s) => s.trim()).filter(Boolean),
      technologies: values.technologies.split(",").map((s) => s.trim()).filter(Boolean),
      completionDate: values.completionDate ? new Date(values.completionDate).toISOString() : null,
    };
    const url = id ? `/api/portfolio/${id}` : "/api/portfolio";
    try {
      const res = await fetch(url, { method: id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      toast.success(id ? "Project updated" : "Project created");
      router.push("/admin/portfolio");
      router.refresh();
    } catch (err: any) { toast.error(err.message); } finally { setSaving(false); }
  }

  const categories = categoriesData?.categories || [];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <input value={values.title} onChange={(e) => update("title", e.target.value)} placeholder="Project title" className="w-full rounded-xl border border-border bg-card px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
        <textarea value={values.description} onChange={(e) => update("description", e.target.value)} placeholder="Project description" rows={6} className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" />
        <input value={values.technologies} onChange={(e) => update("technologies", e.target.value)} placeholder="Technologies (comma-separated, e.g. Next.js, PostgreSQL, Tailwind)" className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        <input value={values.screenshots} onChange={(e) => update("screenshots", e.target.value)} placeholder="Screenshot URLs (comma-separated)" className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <div className="space-y-4">
        <div className="rounded-xl border border-border p-4 space-y-3">
          <p className="text-sm font-medium">Publishing</p>
          <select value={values.status} onChange={(e) => update("status", e.target.value as any)} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm">
            <option value="DRAFT">Draft</option>
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
          <p className="text-sm font-medium">Links & Media</p>
          <select value={values.categoryId} onChange={(e) => update("categoryId", e.target.value)} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm">
            <option value="">No category</option>
            {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input value={values.image} onChange={(e) => update("image", e.target.value)} placeholder="Main image URL" className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm" />
          <input value={values.projectUrl} onChange={(e) => update("projectUrl", e.target.value)} placeholder="Live project URL" className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm" />
          <input value={values.githubUrl} onChange={(e) => update("githubUrl", e.target.value)} placeholder="GitHub URL" className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm" />
          <input type="date" value={values.completionDate} onChange={(e) => update("completionDate", e.target.value)} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm" />
        </div>
      </div>
    </div>
  );
}
