import { StatementForm } from "@/components/admin/statement-form";

export default function NewStatementPage() {
  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl font-semibold mb-1">New Statement</h1>
      <p className="text-sm text-muted-foreground mb-8">Create a new statement.</p>
      <StatementForm />
    </div>
  );
}
