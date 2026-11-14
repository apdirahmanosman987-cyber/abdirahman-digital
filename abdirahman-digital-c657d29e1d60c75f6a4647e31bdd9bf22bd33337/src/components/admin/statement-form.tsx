"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface StatementFormValues {
  title: string;
  subtitle: string;
  content: string;
  featuredImage: string;
  categoryId: string;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
}

const EMPTY: StatementFormValues = {
  title: "",
  subtitle: "",
  content: "",
  featuredImage: "",
  categoryId: "",
  status: "DRAFT",
  featured: false,
  seoTitle: "",
  seoDescription: "",
};

export function StatementForm({ statementId }: { statementId?: string }) {
  const router = useRouter();
  const [values, setValues] = React.useState<StatementFormValues>(EMPTY);
  const [saving, setSaving] = React.useState(false);
  const { data: categoriesData } = useSWR("/api/categories?scope=general", fetcher);
  const { data: existing } = useSWR(statementId ? `/api/statements/${statementId}` : null, fetcher);

  React.useEffect(() => {
    if (existing?.statement) {
      const s = existing.statement;
      setValues({
        title: s.title,
        subtitle: s.subtitle || "",
        content: s.content,
        featuredImage: s.featuredImage || "",
        categoryId: s.categoryId || "",
        status: s.status,
        featured: s.featured,
        seoTitle: s.seoTitle || "",
        seoDescription: s.seoDescription || "",
      });
    }
  }, [existing]);

  function update<K extends keyof StatementFormValues>(key: K, value: StatementFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function save(statusOverride?: StatementFormValues["status"]) {
    if (!values.title.trim() || !values.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    setSaving(true);
    const payload = { ...values, status: statusOverride ?? values.status, categoryId: values.categoryId || null };
    const url = statementId ? `/api/statements/${statementId}` : "/api/statements";
    const method = statementId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      toast.success(statementId ? "Statement updated" : "Statement created");
      router.push("/admin/statements");
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
        <input
          value={values.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="Statement title"
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          value={values.subtitle}
          onChange={(e) => update("subtitle", e.target.value)}
          placeholder="Subtitle (optional)"
          className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <RichTextEditor content={values.content} onChange={(html) => update("content", html)} />
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-border p-4 space-y-3">
          <p className="text-sm font-medium">Publishing</p>
          <select
            value={values.status}
            onChange={(e) => update("status", e.target.value as any)}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            <option value="DRAFT">Draft</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={values.featured} onChange={(e) => update("featured", e.target.checked)} />
            Featured on homepage
          </label>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" disabled={saving} onClick={() => save("DRAFT")}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save draft
            </Button>
            <Button variant="brand" className="flex-1" disabled={saving} onClick={() => save("PUBLISHED")}>
              Publish
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border p-4 space-y-3">
          <p className="text-sm font-medium">Category & Image</p>
          <select
            value={values.categoryId}
            onChange={(e) => update("categoryId", e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            <option value="">No category</option>
            {categories.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input
            value={values.featuredImage}
            onChange={(e) => update("featuredImage", e.target.value)}
            placeholder="Featured image URL"
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
          />
        </div>

        <div className="rounded-xl border border-border p-4 space-y-3">
          <p className="text-sm font-medium">SEO</p>
          <input
            value={values.seoTitle}
            onChange={(e) => update("seoTitle", e.target.value)}
            placeholder="SEO title"
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
          />
          <textarea
            value={values.seoDescription}
            onChange={(e) => update("seoDescription", e.target.value)}
            placeholder="Meta description"
            rows={3}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm resize-none"
          />
        </div>
      </div>
    </div>
  );
}
