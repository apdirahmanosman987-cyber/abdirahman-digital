import { PortfolioForm } from "@/components/admin/portfolio-form";

export default function EditPortfolioPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl font-semibold mb-1">Edit Project</h1>
      <p className="text-sm text-muted-foreground mb-8">Update this portfolio project.</p>
      <PortfolioForm id={params.id} />
    </div>
  );
}
