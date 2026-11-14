import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import slugifyLib from "slugify";
import readingTimeLib from "reading-time";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return slugifyLib(text, { lower: true, strict: true });
}

export function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ");
  const stats = readingTimeLib(text);
  return Math.max(1, Math.round(stats.minutes));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function excerptFromHtml(html: string, length = 160): string {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > length ? text.slice(0, length).trim() + "…" : text;
}
