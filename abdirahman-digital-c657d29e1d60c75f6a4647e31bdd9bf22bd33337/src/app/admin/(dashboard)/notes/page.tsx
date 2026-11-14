import { ContentList } from "@/components/admin/content-list";

export default function AdminNotesPage() {
  return (
    <ContentList
      title="Notes"
      description="Manage technical notes and knowledge base entries."
      apiPath="/api/notes"
      dataKey="notes"
      basePath="/admin/notes"
    />
  );
}
