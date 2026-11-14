import { ContentList } from "@/components/admin/content-list";

export default function AdminPortfolioPage() {
  return (
    <ContentList
      title="Portfolio"
      description="Manage your portfolio projects."
      apiPath="/api/portfolio"
      dataKey="projects"
      basePath="/admin/portfolio"
    />
  );
}
