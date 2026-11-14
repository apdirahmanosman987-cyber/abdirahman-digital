import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { ContactForm } from "@/components/contact-form";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="container py-16 max-w-4xl">
      <SectionHeading eyebrow="Get in touch" title="Contact Me" description="Have a question, opportunity, or idea? Send me a message." />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-6 sm:p-8">
            <ContactForm />
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-6 flex items-start gap-3">
            <Mail className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">oapdirahman466@gmail.com</p>
            </div>
          </Card>
          <Card className="p-6 flex items-start gap-3">
            <Phone className="h-5 w-5 text-accent mt-0.5" />
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">+252 63 635 6228</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
