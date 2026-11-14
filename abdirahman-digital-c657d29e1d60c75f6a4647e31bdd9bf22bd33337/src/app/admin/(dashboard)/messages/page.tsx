"use client";

import useSWR from "swr";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { Mail, MailOpen, Trash2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminMessagesPage() {
  const { data, mutate, isLoading } = useSWR("/api/messages", fetcher);
  const messages = data?.messages || [];

  async function toggleRead(id: string, isRead: boolean) {
    await fetch(`/api/messages/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isRead: !isRead }) });
    mutate();
  }

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/messages/${id}`, { method: "DELETE" });
    toast.success("Message deleted");
    mutate();
  }

  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl font-semibold mb-1">Messages</h1>
      <p className="text-sm text-muted-foreground mb-8">Messages submitted through your contact form.</p>

      <div className="space-y-3 max-w-3xl">
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!isLoading && messages.length === 0 && <p className="text-sm text-muted-foreground">No messages yet.</p>}
        {messages.map((m: any) => (
          <Card key={m.id} className={`p-5 ${!m.isRead ? "border-primary/40" : ""}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{m.subject}</p>
                <p className="text-sm text-muted-foreground">{m.name} · {m.email}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => toggleRead(m.id, m.isRead)} className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-secondary" title={m.isRead ? "Mark unread" : "Mark read"}>
                  {m.isRead ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4 text-primary" />}
                </button>
                <button onClick={() => remove(m.id)} className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-destructive/10 text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="mt-3 text-sm whitespace-pre-line">{m.message}</p>
            <p className="mt-3 text-xs text-muted-foreground">{formatDate(m.createdAt)}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
