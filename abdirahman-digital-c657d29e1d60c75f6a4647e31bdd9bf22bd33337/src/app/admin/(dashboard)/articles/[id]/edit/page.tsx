import { ArticleForm } from "@/components/admin/article-form";

export default function EditArticlePage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl font-semibold mb-1">Edit Article</h1>
      <p className="text-sm text-muted-foreground mb-8">Update this article's content and settings.</p>
      <ArticleForm articleId={params.id} />
    </div>
  );
}
