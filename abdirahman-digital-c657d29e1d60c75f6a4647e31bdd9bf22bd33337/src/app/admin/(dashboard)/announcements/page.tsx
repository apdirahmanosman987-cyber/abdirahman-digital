import { ContentList } from "@/components/admin/content-list";

export default function AdminAnnouncementsPage() {
  return (
    <ContentList
      title="Announcements"
      description="Manage public declarations and updates."
      apiPath="/api/announcements"
      dataKey="announcements"
      basePath="/admin/announcements"
    />
  );
}
