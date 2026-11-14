import { ContentList } from "@/components/admin/content-list";

export default function AdminThoughtsPage() {
  return (
    <ContentList
      title="Thoughts"
      description="Manage short-form posts and ideas."
      apiPath="/api/thoughts"
      dataKey="thoughts"
      basePath="/admin/thoughts"
    />
  );
}
