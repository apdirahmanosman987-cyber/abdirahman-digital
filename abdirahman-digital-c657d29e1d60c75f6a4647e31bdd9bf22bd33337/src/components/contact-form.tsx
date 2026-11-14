"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactMessageSchema } from "@/lib/validations";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type FormValues = z.infer<typeof contactMessageSchema>;

export function ContactForm() {
  const [submitting, setSubmitting] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(contactMessageSchema) });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      toast.success("Message sent — thank you! I'll get back to you soon.");
      reset();
    } catch (err: any) {
      toast.error(err.message || "Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Honeypot field — hidden from real users, bots tend to fill every input */}
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("website")} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Name</label>
          <input
            {...register("name")}
            className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Your name"
          />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            {...register("email")}
            type="email"
            className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="you@example.com"
          />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Subject</label>
        <input
          {...register("subject")}
          className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="What's this about?"
        />
        {errors.subject && <p className="mt-1 text-xs text-destructive">{errors.subject.message}</p>}
      </div>

      <div>
        <label className="text-sm font-medium">Message</label>
        <textarea
          {...register("message")}
          rows={6}
          className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          placeholder="Tell me more…"
        />
        {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>}
      </div>

      <Button type="submit" variant="brand" size="lg" disabled={submitting} className="w-full sm:w-auto">
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Send message
      </Button>
    </form>
  );
}
