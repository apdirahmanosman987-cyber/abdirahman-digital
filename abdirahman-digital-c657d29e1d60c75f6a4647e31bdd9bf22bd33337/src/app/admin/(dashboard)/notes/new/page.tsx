import { NoteForm } from "@/components/admin/note-form";

export default function NewNotePage() {
  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl font-semibold mb-1">New Note</h1>
      <p className="text-sm text-muted-foreground mb-8">Publish a new note.</p>
      <NoteForm />
    </div>
  );
}
