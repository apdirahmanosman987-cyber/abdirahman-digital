import { AnnouncementForm } from "@/components/admin/announcement-form";

export default function EditAnnouncementPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl font-semibold mb-1">Edit Announcement</h1>
      <p className="text-sm text-muted-foreground mb-8">Update this announcement.</p>
      <AnnouncementForm id={params.id} />
    </div>
  );
}
