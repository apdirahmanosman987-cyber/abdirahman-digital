import { ArticleForm } from "@/components/admin/article-form";

export default function NewArticlePage() {
  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl font-semibold mb-1">New Article</h1>
      <p className="text-sm text-muted-foreground mb-8">Write a new article.</p>
      <ArticleForm />
    </div>
  );
}
