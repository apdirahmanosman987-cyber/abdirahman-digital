import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="container py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-lg font-semibold">
            Abdirahman <span className="text-gradient-brand">Digital</span>
          </p>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            A personal digital space for statements, ideas, articles and projects — built and maintained by Abdirahman.
          </p>
        </div>

        <div>
          <p className="text-sm font-medium mb-3">Explore</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/statements" className="hover:text-foreground">Statements</Link></li>
            <li><Link href="/articles" className="hover:text-foreground">Articles</Link></li>
            <li><Link href="/notes" className="hover:text-foreground">Notes</Link></li>
            <li><Link href="/portfolio" className="hover:text-foreground">Portfolio</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium mb-3">Company</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-foreground">About</Link></li>
            <li><Link href="/services" className="hover:text-foreground">Services</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium mb-3">Contact</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>oapdirahman466@gmail.com</li>
            <li>+252 63 635 6228</li>
          </ul>
        </div>
      </div>

      <div className="container py-6 border-t border-border/60 text-xs text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
        <p>© {new Date().getFullYear()} Abdirahman Digital. All rights reserved.</p>
        <p>Designed and built by Abdirahman.</p>
      </div>
    </footer>
  );
}
