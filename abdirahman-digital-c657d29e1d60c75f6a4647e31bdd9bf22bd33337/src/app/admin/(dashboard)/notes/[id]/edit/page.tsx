import { NoteForm } from "@/components/admin/note-form";

export default function EditNotePage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl font-semibold mb-1">Edit Note</h1>
      <p className="text-sm text-muted-foreground mb-8">Update this note.</p>
      <NoteForm id={params.id} />
    </div>
  );
}
