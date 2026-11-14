import { ThoughtForm } from "@/components/admin/thought-form";

export default function NewThoughtPage() {
  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl font-semibold mb-1">New Thought</h1>
      <p className="text-sm text-muted-foreground mb-8">Share a quick idea.</p>
      <ThoughtForm />
    </div>
  );
}
