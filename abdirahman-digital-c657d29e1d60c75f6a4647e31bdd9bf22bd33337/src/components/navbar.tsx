"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/statements", label: "Statements" },
  { href: "/announcements", label: "Announcements" },
  { href: "/articles", label: "Articles" },
  { href: "/notes", label: "Notes" },
  { href: "/thoughts", label: "Thoughts" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "glass shadow-sm" : "bg-transparent"
      )}
    >
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-serif text-lg font-semibold tracking-tight">
          Abdirahman <span className="text-gradient-brand">Digital</span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-2 text-sm rounded-full transition-colors hover:bg-secondary",
                pathname === link.href ? "text-primary font-medium" : "text-foreground/80"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="hidden sm:flex h-9 w-9 rounded-full border border-border items-center justify-center hover:bg-secondary transition-colors"
          >
            <Search className="h-4 w-4" />
          </Link>
          <ThemeToggle />
          <button
            aria-label="Toggle menu"
            className="lg:hidden h-9 w-9 flex items-center justify-center rounded-full border border-border"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden glass border-t border-border animate-fade-in">
          <div className="container flex flex-col py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-3 text-sm border-b border-border/50 last:border-none"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
