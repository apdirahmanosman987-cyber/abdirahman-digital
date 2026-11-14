import { ThoughtForm } from "@/components/admin/thought-form";

export default function EditThoughtPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl font-semibold mb-1">Edit Thought</h1>
      <p className="text-sm text-muted-foreground mb-8">Update this thought.</p>
      <ThoughtForm id={params.id} />
    </div>
  );
}
