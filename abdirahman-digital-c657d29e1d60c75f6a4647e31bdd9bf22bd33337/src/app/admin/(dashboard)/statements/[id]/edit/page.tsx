import { StatementForm } from "@/components/admin/statement-form";

export default function EditStatementPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl font-semibold mb-1">Edit Statement</h1>
      <p className="text-sm text-muted-foreground mb-8">Update this statement's content and settings.</p>
      <StatementForm statementId={params.id} />
    </div>
  );
}
