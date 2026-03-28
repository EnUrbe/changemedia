import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import JsonLd from "@/components/seo/JsonLd";
import { FIELD_NOTES, SITE } from "@/lib/data";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return FIELD_NOTES.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = FIELD_NOTES.find((item) => item.slug === slug);

  if (!post) {
    return {
      title: "Field Notes",
      description: SITE.description,
    };
  }

  return {
    title: `${post.title} | Field Notes`,
    description: post.description,
    alternates: { canonical: `/field-notes/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `${SITE.url}/field-notes/${post.slug}`,
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = FIELD_NOTES.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: `${SITE.url}/field-notes/${post.slug}`,
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    author: {
      "@type": "Organization",
      name: SITE.name,
    },
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-white atmosphere">
      <JsonLd data={jsonLd} />
      <Nav />

      <article className="pt-32 md:pt-40 pb-[var(--section-padding)]">
        <div className="container-narrow">
          <Link href="/field-notes" className="label-accent">
            Back to Field Notes
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="eyebrow-pill">{post.tag}</span>
            <span className="label">{post.date}</span>
            <span className="label">{post.readTime}</span>
          </div>

          <h1 className="mt-6 text-5xl md:text-7xl leading-[0.9]">{post.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl">
            {post.excerpt}
          </p>

          <div className="divider-glow my-12" />

          <div className="space-y-7">
            {post.content.map((paragraph) => (
              <p
                key={paragraph}
                className="max-w-3xl text-base leading-relaxed text-[var(--text-secondary)] md:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>

      <section className="border-y border-[var(--border)] bg-[var(--bg-elevated)] py-[var(--section-padding)]">
        <div className="container-narrow text-center">
          <p className="eyebrow">Next Step</p>
          <h2 className="mt-4 text-4xl md:text-5xl">Want this level of thought in the work itself?</h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
            If the way this piece thinks about story, trust, or portraiture feels aligned with what
            you need, start a conversation and we can shape it into a real project.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/contact" variant="primary" size="lg">
              Start a project
            </Button>
            <Button href="/field-notes" variant="outline" size="lg">
              Read more notes
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
