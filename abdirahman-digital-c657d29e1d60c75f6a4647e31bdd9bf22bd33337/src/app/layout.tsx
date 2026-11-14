import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-serif", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Abdirahman Digital — Personal Platform & Portfolio",
    template: "%s | Abdirahman Digital",
  },
  description:
    "Abdirahman's personal digital space: statements, announcements, articles, notes, thoughts and portfolio.",
  openGraph: {
    type: "website",
    siteName: "Abdirahman Digital",
    title: "Abdirahman Digital",
    description: "Abdirahman's personal digital space, publishing platform and knowledge archive.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdirahman Digital",
    description: "Abdirahman's personal digital space, publishing platform and knowledge archive.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${fraunces.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <Navbar />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
