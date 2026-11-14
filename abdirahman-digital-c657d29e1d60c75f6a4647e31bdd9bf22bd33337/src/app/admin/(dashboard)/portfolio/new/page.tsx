import { PortfolioForm } from "@/components/admin/portfolio-form";

export default function NewPortfolioPage() {
  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl font-semibold mb-1">New Project</h1>
      <p className="text-sm text-muted-foreground mb-8">Add a new portfolio project.</p>
      <PortfolioForm />
    </div>
  );
}
