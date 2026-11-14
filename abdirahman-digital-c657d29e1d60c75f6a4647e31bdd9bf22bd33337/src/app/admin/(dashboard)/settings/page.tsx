"use client";

import * as React from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface AboutContent {
  intro: string; background: string; journey: string; interests: string; goals: string;
}
const EMPTY: AboutContent = { intro: "", background: "", journey: "", interests: "", goals: "" };

export default function AdminSettingsPage() {
  const { data, mutate, isLoading } = useSWR("/api/settings?key=about.profile", fetcher);
  const [values, setValues] = React.useState<AboutContent>(EMPTY);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (data?.value) setValues({ ...EMPTY, ...data.value });
  }, [data]);

  function update<K extends keyof AboutContent>(key: K, value: AboutContent[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function save() {
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "about.profile", value: values }),
    });
    setSaving(false);
    if (res.ok) { toast.success("About page updated"); mutate(); } else toast.error("Failed to save");
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-serif text-2xl font-semibold mb-1">Site Content</h1>
      <p className="text-sm text-muted-foreground mb-8">Edit the text shown on your About page without touching any code.</p>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Introduction</label>
            <textarea value={values.intro} onChange={(e) => update("intro", e.target.value)} rows={3} className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium">Background</label>
            <textarea value={values.background} onChange={(e) => update("background", e.target.value)} rows={3} className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium">Professional Journey</label>
            <textarea value={values.journey} onChange={(e) => update("journey", e.target.value)} rows={3} className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium">Interests</label>
            <textarea value={values.interests} onChange={(e) => update("interests", e.target.value)} rows={3} className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium">Goals</label>
            <textarea value={values.goals} onChange={(e) => update("goals", e.target.value)} rows={3} className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm resize-none" />
          </div>
          <Button variant="brand" onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save changes
          </Button>
        </div>
      )}
    </div>
  );
}
