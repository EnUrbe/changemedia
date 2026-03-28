import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { FIELD_NOTES, SITE } from "@/lib/data";

export const metadata: Metadata = {
  title: "Field Notes — Research & Process",
  description:
    "Essays, process notes, and editorial thinking from CHANGE Media on documentary storytelling, portraits, and brand trust.",
  alternates: { canonical: "/field-notes" },
  openGraph: {
    title: "Field Notes — Research & Process",
    description:
      "Essays, process notes, and editorial thinking from CHANGE Media on documentary storytelling, portraits, and brand trust.",
    url: `${SITE.url}/field-notes`,
    siteName: SITE.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Field Notes — Research & Process",
    description:
      "Essays, process notes, and editorial thinking from CHANGE Media on documentary storytelling, portraits, and brand trust.",
  },
};

export default function FieldNotesPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-white atmosphere">
      <Nav />

      <section className="pt-32 md:pt-40 pb-[var(--section-padding)] relative">
        <div className="absolute top-[15%] right-[10%] h-64 w-64 rounded-full bg-[var(--accent)]/8 blur-[180px] pointer-events-none" />
        <div className="container-wide relative z-10">
          <span className="label-accent">Field Notes</span>
          <h1 className="mt-4 text-5xl md:text-7xl font-serif tracking-tighter leading-[0.9]">
            Working notes<br />
            <span className="text-gradient">&amp; research.</span>
          </h1>
          <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-lg">
            Essays, process experiments, and story frameworks from the practice. The goal is simple:
            make the thinking behind the work visible and useful.
          </p>
        </div>
      </section>

      <section className="pb-[var(--section-padding)]">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FIELD_NOTES.map((post) => (
              <Link
                key={post.slug}
                href={`/field-notes/${post.slug}`}
                className="editorial-card glow-border group p-8 block"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-sans font-semibold uppercase tracking-wider border border-[var(--border)] rounded-full px-3 py-1 text-[var(--accent)] transition-colors duration-300 group-hover:border-[var(--accent)]/40">
                    {post.tag}
                  </span>
                  <span className="text-xs text-[var(--text-dim)]">{post.date}</span>
                  <span className="text-xs text-[var(--text-dim)]">{post.readTime}</span>
                </div>
                <h3 className="text-xl font-serif tracking-tight mb-3 group-hover:text-[var(--accent)] transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-[var(--section-padding)] bg-[var(--bg-elevated)] border-t border-[var(--border)]">
        <div className="container-narrow text-center">
          <h2 className="text-4xl md:text-5xl font-serif tracking-tighter">Want to build something thoughtful?</h2>
          <p className="mt-4 text-[var(--text-secondary)] max-w-md mx-auto">
            If one of these essays feels close to the way you want your own work to feel, let&apos;s talk.
          </p>
          <div className="mt-8">
            <Button href="/contact" variant="primary" size="lg">
              Get in touch
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
