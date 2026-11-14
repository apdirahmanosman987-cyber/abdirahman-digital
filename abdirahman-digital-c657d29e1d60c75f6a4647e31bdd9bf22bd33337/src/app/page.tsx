import Link from "next/link";
import { Hero } from "@/components/hero";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getHomeFeatured, getLatestPosts } from "@/lib/data";
import { formatDate, excerptFromHtml } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const { statements, articles, portfolios, services, skills } = await getHomeFeatured();
  const { articles: latestArticles } = await getLatestPosts(3);

  return (
    <>
      <Hero />

      {/* Featured Statements */}
      {statements.length > 0 && (
        <section className="container py-16">
          <SectionHeading eyebrow="In my words" title="Featured Statements" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {statements.map((s) => (
              <Link key={s.id} href={`/statements/${s.slug}`}>
                <Card className="h-full card-hover">
                  <CardHeader>
                    <CardTitle>{s.title}</CardTitle>
                    {s.subtitle && <CardDescription>{s.subtitle}</CardDescription>}
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {excerptFromHtml(s.content, 120)}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Articles */}
      {articles.length > 0 && (
        <section className="container py-16">
          <SectionHeading eyebrow="Latest thinking" title="Featured Articles" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <Link key={a.id} href={`/articles/${a.slug}`}>
                <Card className="h-full card-hover overflow-hidden">
                  {a.coverImage && (
                    <div className="aspect-video bg-muted bg-cover bg-center" style={{ backgroundImage: `url(${a.coverImage})` }} />
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{a.title}</CardTitle>
                    <CardDescription>{formatDate(a.publishedAt)} · {a.readingTimeMins} min read</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground line-clamp-3">
                    {a.excerpt || excerptFromHtml(a.content, 140)}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="container py-16">
          <SectionHeading eyebrow="What I know" title="Skills" />
          <div className="flex flex-wrap gap-3">
            {skills.map((sk) => (
              <span key={sk.id} className="glass rounded-full px-4 py-2 text-sm font-medium">
                {sk.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Services */}
      {services.length > 0 && (
        <section className="container py-16">
          <SectionHeading eyebrow="How I can help" title="Services" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((sv) => (
              <Card key={sv.id} className="card-hover">
                <CardHeader>
                  <CardTitle>{sv.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{sv.description}</CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Featured Portfolio */}
      {portfolios.length > 0 && (
        <section className="container py-16">
          <SectionHeading eyebrow="Selected work" title="Portfolio" />
          <div className="grid gap-6 sm:grid-cols-2">
            {portfolios.map((p) => (
              <Link key={p.id} href={`/portfolio/${p.slug}`}>
                <Card className="h-full card-hover overflow-hidden">
                  {p.image && (
                    <div className="aspect-video bg-muted bg-cover bg-center" style={{ backgroundImage: `url(${p.image})` }} />
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {p.title} <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </CardTitle>
                    <CardDescription className="line-clamp-2">{p.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Latest posts */}
      {latestArticles.length > 0 && (
        <section className="container py-16">
          <SectionHeading eyebrow="Fresh" title="Latest Posts" />
          <div className="grid gap-4">
            {latestArticles.map((a) => (
              <Link key={a.id} href={`/articles/${a.slug}`} className="flex items-center justify-between border-b border-border py-4 hover:text-primary transition-colors">
                <span className="font-medium">{a.title}</span>
                <span className="text-sm text-muted-foreground">{formatDate(a.publishedAt)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* About teaser */}
      <section className="container py-16">
        <Card className="glass p-10 text-center">
          <h3 className="font-serif text-2xl font-semibold">A bit about me</h3>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            I'm Abdirahman — this platform is where I document my journey, share what I learn, and
            showcase the things I build.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link href="/about">Read my full story</Link>
          </Button>
        </Card>
      </section>

      {/* Contact teaser */}
      <section className="container pb-24">
        <Card className="bg-gradient-brand text-white p-10 text-center border-none">
          <h3 className="font-serif text-2xl font-semibold">Let's connect</h3>
          <p className="mt-3 text-white/90 max-w-xl mx-auto">
            Have a question, opportunity, or just want to say hello? I'd love to hear from you.
          </p>
          <Button asChild variant="secondary" className="mt-6">
            <Link href="/contact">Get in touch</Link>
          </Button>
        </Card>
      </section>
    </>
  );
}
