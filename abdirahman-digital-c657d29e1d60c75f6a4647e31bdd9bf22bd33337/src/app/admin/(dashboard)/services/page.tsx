"use client";

import * as React from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Plus, Loader2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminServicesPage() {
  const { data, mutate, isLoading } = useSWR("/api/services", fetcher);
  const services = data?.services || [];
  const [form, setForm] = React.useState({ name: "", description: "", price: "", features: "" });
  const [saving, setSaving] = React.useState(false);

  async function addService() {
    if (!form.name.trim() || !form.description.trim()) return toast.error("Name and description are required");
    setSaving(true);
    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, features: form.features.split(",").map((f) => f.trim()).filter(Boolean) }),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Service added");
      setForm({ name: "", description: "", price: "", features: "" });
      mutate();
    } else toast.error("Failed to add service");
  }

  async function remove(id: string) {
    if (!confirm("Delete this service?")) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    mutate();
  }

  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl font-semibold mb-1">Services</h1>
      <p className="text-sm text-muted-foreground mb-8">Manage the services you offer.</p>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border divide-y divide-border">
          {isLoading && <p className="p-5 text-sm text-muted-foreground">Loading…</p>}
          {!isLoading && services.length === 0 && <p className="p-5 text-sm text-muted-foreground">No services yet.</p>}
          {services.map((s: any) => (
            <div key={s.id} className="flex items-start justify-between p-5">
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
              <button onClick={() => remove(s.id)} className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-destructive/10 text-destructive shrink-0">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border p-4 space-y-3 h-fit">
          <p className="text-sm font-medium">Add a service</p>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Service name" className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm resize-none" />
          <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price (optional)" className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm" />
          <input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Features (comma-separated)" className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm" />
          <Button variant="brand" className="w-full" onClick={addService} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add service
          </Button>
        </div>
      </div>
    </div>
  );
}
