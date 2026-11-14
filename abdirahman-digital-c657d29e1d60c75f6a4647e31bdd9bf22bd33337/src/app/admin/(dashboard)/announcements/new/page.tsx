import { AnnouncementForm } from "@/components/admin/announcement-form";

export default function NewAnnouncementPage() {
  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl font-semibold mb-1">New Announcement</h1>
      <p className="text-sm text-muted-foreground mb-8">Publish a new announcement.</p>
      <AnnouncementForm />
    </div>
  );
}
