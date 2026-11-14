"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) {
        toast.error(res.error === "CredentialsSignin" ? "Invalid email or password" : res.error);
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-sm p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-9 w-9 rounded-full bg-gradient-brand flex items-center justify-center">
            <Lock className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold">Abdirahman Digital</p>
            <p className="text-xs text-muted-foreground">Admin access</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" variant="brand" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign in
          </Button>
        </form>
      </Card>
    </div>
  );
}
