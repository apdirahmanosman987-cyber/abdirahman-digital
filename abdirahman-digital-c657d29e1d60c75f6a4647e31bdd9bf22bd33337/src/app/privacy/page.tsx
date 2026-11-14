import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="container py-16 max-w-2xl prose prose-neutral dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p>
        This site collects only the information you voluntarily submit — such as through the
        contact form (name, email, subject, message) — and lightweight, privacy-conscious page-view
        analytics (page path and timestamp, with no personal identifiers or tracking cookies).
      </p>
      <h3>How information is used</h3>
      <p>
        Contact form submissions are used solely to respond to your message. They are never sold,
        shared with third parties, or used for marketing without your consent.
      </p>
      <h3>Data retention</h3>
      <p>Messages are retained only as long as needed to respond and for basic record-keeping.</p>
      <h3>Contact</h3>
      <p>Questions about this policy can be sent to oapdirahman466@gmail.com.</p>
    </div>
  );
}
