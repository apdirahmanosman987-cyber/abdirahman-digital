"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log to your monitoring service in production — never render error.message to users.
    console.error(error);
  }, [error]);

  return (
    <div className="container py-32 text-center">
      <p className="font-serif text-7xl font-semibold text-gradient-brand">500</p>
      <h1 className="mt-4 text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">
        An unexpected error occurred. It's been logged and I'll take a look.
      </p>
      <Button variant="brand" className="mt-8" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
