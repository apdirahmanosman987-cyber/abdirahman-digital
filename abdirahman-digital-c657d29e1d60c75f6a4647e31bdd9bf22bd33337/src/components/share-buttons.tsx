"use client";

import { Twitter, Linkedin, Link2, Facebook } from "lucide-react";
import { toast } from "sonner";

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    { icon: Twitter, href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, label: "Share on X" },
    { icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, label: "Share on LinkedIn" },
    { icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, label: "Share on Facebook" },
  ];

  return (
    <div className="flex items-center gap-2">
      {links.map(({ icon: Icon, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="h-9 w-9 flex items-center justify-center rounded-full border border-border hover:bg-secondary transition-colors"
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
      <button
        aria-label="Copy link"
        onClick={() => {
          navigator.clipboard.writeText(url);
          toast.success("Link copied to clipboard");
        }}
        className="h-9 w-9 flex items-center justify-center rounded-full border border-border hover:bg-secondary transition-colors"
      >
        <Link2 className="h-4 w-4" />
      </button>
    </div>
  );
}
