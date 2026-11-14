import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container py-32 text-center">
      <p className="font-serif text-7xl font-semibold text-gradient-brand">404</p>
      <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
      <Button asChild variant="brand" className="mt-8">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
