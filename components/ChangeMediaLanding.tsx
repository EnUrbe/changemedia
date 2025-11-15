'use client';

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import SectionNav from "@/components/ui/SectionNav";
import type { SiteContent } from "@/lib/contentSchema";

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.33, 1, 0.68, 1] as const },
  viewport: { once: true, amount: 0.3 },
};

type LandingProps = {
  content: SiteContent;
};

export default function ChangeMediaLanding({ content }: LandingProps) {
  const [annual, setAnnual] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formTsRef = useRef<number>(Date.now());

  const sections = [
    { id: "hero", label: "Overview" },
    { id: "work", label: "Work" },
    { id: "studio", label: "About" },
    { id: "services", label: "Services" },
    { id: "contact", label: "Contact" },
  ];

  const hero = content.hero;
  const heroSecondaryLine = hero.title.replace(hero.titleGradient, "").trim() || hero.title;
  const featured = content.featuredCases;
  const gallery = content.galleryCases;
  const studio = content.studio;
  const features = content.features;
  const services = content.services;
  const testimonials = content.testimonials;
  const faqs = content.faqs;
  const contact = content.contact;
  const logoCloud = content.logoCloud;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries()) as Record<string, FormDataEntryValue>;
    payload.ts = formTsRef.current as unknown as FormDataEntryValue;

    const details = String(payload.details || "").trim();
    if (details.length < 10) {
      setSubmitting(false);
      setError("Please share a bit more detail (10+ characters).");
      return;
    }

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let msg = "Failed to send inquiry";
        try {
          const data = await res.json();
          if (data?.error) msg = data.error;
        } catch {
          /* ignore */
        }
        throw new Error(msg);
      }
      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const servicePrice = (svc: (typeof services)[number]) => {
    if (svc.price.onetime && !svc.price.monthly && !svc.price.annual) return svc.price.onetime;
    if (annual) return svc.price.annual ?? svc.price.monthly ?? svc.price.onetime ?? "Contact for quote";
    return svc.price.monthly ?? svc.price.annual ?? svc.price.onetime ?? "Contact for quote";
  };

  return (
    <div className="relative min-h-screen bg-[#020203] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-[-10%] h-[32rem] w-[32rem] rounded-full bg-[#7cf2cf]/10 blur-[120px]" />
        <div className="absolute top-16 right-[-15%] h-[36rem] w-[36rem] rounded-full bg-[#c7a8ff]/20 blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 h-[28rem] w-[28rem] rounded-full bg-[#59b0ff]/10 blur-[120px]" />
      </div>

      <div className="relative z-10">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-xs uppercase tracking-[0.25em] text-white/70">
          <Link href="/" className="text-sm font-semibold text-white">
            CHANGE<span className="text-[#8bf0d6]">®</span>
          </Link>
          <div className="hidden items-center gap-6 text-[0.65rem] md:flex">
            <Link href="/why" className="hover:text-white">
              Why
            </Link>
            <Link href="/change-studios" className="hover:text-white">
              Studios
            </Link>
            <Link href="/photography" className="hover:text-white">
              Photography
            </Link>
          </div>
          <Link href="#contact" className="rounded-full border border-white/20 px-4 py-2 text-[0.65rem]">
            Start a project
          </Link>
        </header>

        <SectionNav sections={sections} />

        <main className="mx-auto max-w-6xl space-y-28 px-6 pb-24">
          <section id="hero" className="pt-24">
            <div className="rounded-[36px] border border-white/10 bg-white/5 p-8 md:p-12 backdrop-blur-2xl">
              <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.35em] text-white/50">
                <span>{hero.eyebrow}</span>
                <span className="rounded-full border border-white/20 px-3 py-1 text-[0.65rem] text-white/80">
                  {hero.locationPill}
                </span>
              </div>
              <div className="mt-8 space-y-5">
                <h1
                  className="text-5xl leading-tight text-white md:text-7xl"
                  style={{ fontFamily: "var(--font-family-serif)" }}
                >
                  <span className="bg-gradient-to-r from-[#8cf0d6] via-[#8da6ff] to-[#d6a4ff] bg-clip-text text-transparent">
                    {hero.titleGradient}
                  </span>
                  <br />
                  {heroSecondaryLine}
                </h1>
                <p className="max-w-3xl text-lg text-white/70 md:text-xl">{hero.subtitle}</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {hero.ctas.map((cta) => (
                  <a
                    key={cta.label}
                    href={cta.href}
                    className={`rounded-full px-5 py-3 text-sm font-medium transition ${
                      cta.variant === "primary"
                        ? "bg-white text-black hover:bg-white/80"
                        : cta.variant === "secondary"
                          ? "border border-white/20 text-white hover:border-white/60"
                          : "bg-gradient-to-r from-[#7cf2cf]/30 to-[#bea7ff]/30 text-white"
                    }`}
                  >
                    {cta.label}
                  </a>
                ))}
              </div>
              <div className="mt-10 grid gap-4 md:grid-cols-4">
                {hero.metrics.map((metric) => (
                  <div key={metric.value} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                    <div className="text-3xl font-semibold text-white">{metric.value}</div>
                    <div className="text-[0.65rem] uppercase tracking-[0.3em] text-white/50">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-white/50">
              {content.marquee.phrases.map((phrase) => (
                <span key={phrase} className="rounded-full border border-white/10 px-3 py-1">
                  {phrase}
                </span>
              ))}
            </div>
          </section>

          <section className="space-y-6" id="logos">
            <p className="text-xs uppercase tracking-[0.35em] text-white/50 text-center">{logoCloud.heading}</p>
            <div className="grid grid-cols-2 gap-6 rounded-[32px] border border-white/10 bg-white/5 p-6 sm:grid-cols-3 md:grid-cols-6">
              {logoCloud.logos.map((logo) => (
                <div key={logo.alt} className="flex items-center justify-center opacity-70">
                  <Image src={logo.src} alt={logo.alt} width={100} height={30} className="h-7 w-auto" />
                </div>
              ))}
            </div>
          </section>

          <section id="work" className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">Work</p>
                <h2 className="text-4xl text-white md:text-5xl" style={{ fontFamily: "var(--font-family-serif)" }}>
                  Field-built stories, new muscle.
                </h2>
              </div>
              <Link href="/clients" className="text-sm text-white/70 hover:text-white">
                View client workspaces →
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {featured.map((item) => (
                <motion.article key={item.id} {...fadeUp} className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                  <div className="relative aspect-[4/3]">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  </div>
                  <div className="space-y-2 p-5">
                    <p className="text-xs uppercase tracking-[0.35em] text-white/50">{item.subtitle}</p>
                    <h3 className="text-2xl font-semibold">{item.title}</h3>
                    <div className="flex flex-wrap gap-2 text-xs text-white/60">
                      {(item.tags ?? []).map((tag) => (
                        <span key={tag} className="rounded-full border border-white/15 px-2 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
            <div className="overflow-x-auto rounded-[32px] border border-white/5 bg-white/5 p-6">
              <div className="flex min-w-[640px] gap-4">
                {gallery.map((item) => (
                  <div key={item.id} className="w-56 shrink-0">
                    <div className="relative h-40 w-full overflow-hidden rounded-2xl">
                      <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-white/60">{item.subtitle}</p>
                      <h4 className="text-lg font-semibold">{item.title}</h4>
                      <p className="text-xs text-white/40">{(item.tags ?? []).join(" • ")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="studio" className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
            <motion.div {...fadeUp} className="rounded-[32px] border border-white/10 bg-white/5 p-8">
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">Studio</p>
              <h2 className="mt-4 text-4xl text-white md:text-5xl" style={{ fontFamily: "var(--font-family-serif)" }}>
                {studio.ethos}
              </h2>
              <ul className="mt-8 space-y-4 text-sm text-white/70">
                {studio.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-[#8bf0d6] to-[#c0a7ff]" />
                    {bullet}
                  </li>
                ))}
              </ul>
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {features.map((feature) => (
                  <div key={feature.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-[0.35em] text-white/40">{feature.title}</div>
                    <p className="mt-2 text-sm text-white/70">{feature.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.blockquote {...fadeUp} className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 text-white/80">
              <p className="text-xl leading-relaxed">“{studio.quote}”</p>
              <footer className="mt-4 text-xs uppercase tracking-[0.35em] text-white/50">{studio.attribution}</footer>
            </motion.blockquote>
          </section>

          <section id="services" className="space-y-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/50">Services</p>
                <h2 className="text-4xl text-white md:text-5xl" style={{ fontFamily: "var(--font-family-serif)" }}>
                  Modular packages, documentary rigor.
                </h2>
              </div>
              <div className="inline-flex items-center rounded-full border border-white/15 p-1 text-xs">
                <button
                  onClick={() => setAnnual(false)}
                  className={`rounded-full px-3 py-1 ${!annual ? "bg-white text-black" : "text-white/60"}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setAnnual(true)}
                  className={`rounded-full px-3 py-1 ${annual ? "bg-white text-black" : "text-white/60"}`}
                >
                  Annual
                </button>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: index * 0.08 }}
                  className="flex h-full flex-col rounded-[28px] border border-white/10 bg-white/5 p-6"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/50">{service.title}</p>
                    <div className="mt-6 text-4xl font-semibold text-white">{servicePrice(service)}</div>
                    <p className="mt-2 text-xs text-white/50">{content.includedKit}</p>
                  </div>
                  <ul className="mt-6 space-y-3 text-sm text-white/70">
                    {service.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/60" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-6">
                    <a
                      href={service.ctaHref}
                      className="inline-flex w-full items-center justify-center rounded-full border border-white/20 px-4 py-3 text-sm text-white hover:border-white/60"
                    >
                      {service.ctaLabel}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section id="testimonials" className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <motion.article key={t.id} {...fadeUp} className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6">
                <div className="flex items-center gap-3">
                  <Image src={t.avatar} alt={t.name} width={56} height={56} className="h-14 w-14 rounded-full object-cover" />
                  <div>
                    <p className="text-lg font-semibold">{t.name}</p>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/50">{t.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-white/80">“{t.quote}”</p>
              </motion.article>
            ))}
          </section>

          <section id="faq" className="rounded-[28px] border border-white/10 bg-white/5 p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/50">FAQ</p>
                <h2 className="text-4xl text-white md:text-5xl" style={{ fontFamily: "var(--font-family-serif)" }}>
                  Logistics, timelines, and care.
                </h2>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              {faqs.map((faq) => (
                <details key={faq.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <summary className="cursor-pointer text-lg font-semibold text-white">{faq.question}</summary>
                  <p className="mt-3 text-sm text-white/70">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section id="contact" className="grid gap-8 md:grid-cols-[1fr_0.9fr]">
            <motion.div {...fadeUp} className="rounded-[32px] border border-white/10 bg-white/5 p-8">
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">Contact</p>
              <h2 className="mt-4 text-4xl text-white md:text-5xl" style={{ fontFamily: "var(--font-family-serif)" }}>
                Share the story, we’ll build the reel.
              </h2>
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="hidden" aria-hidden>
                  <label>Leave empty</label>
                  <input name="hp" autoComplete="off" tabIndex={-1} />
                </div>
                <div>
                  <label className="text-sm text-white/60">Full name</label>
                  <input name="name" required autoComplete="name" className="mt-2 w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-white" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm text-white/60">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      className="mt-2 w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/60">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      className="mt-2 w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-white/60">Organization</label>
                  <input name="org" autoComplete="organization" className="mt-2 w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-white" />
                </div>
                <div>
                  <label className="text-sm text-white/60">Project details</label>
                  <textarea
                    name="details"
                    rows={4}
                    minLength={10}
                    required
                    className="mt-2 w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-white"
                    placeholder="What are we documenting? Timeline, partners, goals?"
                  />
                </div>
                <button
                  disabled={submitting || submitted}
                  className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition disabled:opacity-60"
                >
                  {submitted ? "Sent — talk soon" : submitting ? "Sending…" : "Send inquiry"}
                </button>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <p aria-live="polite" role="status" className="sr-only">
                  {submitted ? "Inquiry sent successfully." : submitting ? "Sending your inquiry." : error ? `Error: ${error}` : ""}
                </p>
              </form>
            </motion.div>

            <motion.div {...fadeUp} className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8">
              <div className="space-y-4 text-sm text-white/70">
                <div>
                  <p className="uppercase tracking-[0.35em] text-white/40">Email</p>
                  <a href={`mailto:${contact.email}`} className="text-lg font-semibold text-white">
                    {contact.email}
                  </a>
                </div>
                <div>
                  <p className="uppercase tracking-[0.35em] text-white/40">City</p>
                  <p className="text-lg text-white">{contact.city}</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="uppercase tracking-[0.35em] text-white/40">Instagram</p>
                    <a href={contact.instagram.url} target="_blank" rel="noreferrer" className="text-white hover:underline">
                      {contact.instagram.handle}
                    </a>
                  </div>
                  <div>
                    <p className="uppercase tracking-[0.35em] text-white/40">YouTube</p>
                    <a href={contact.youtube.url} target="_blank" rel="noreferrer" className="text-white hover:underline">
                      {contact.youtube.label}
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-8 rounded-2xl border border-white/15">
                <div className="calendly-inline-widget h-[640px] w-full rounded-2xl" data-url={contact.calendlyUrl} />
                <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="afterInteractive" />
              </div>
            </motion.div>
          </section>

          <footer className="flex flex-col gap-4 border-t border-white/10 py-10 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} CHANGE Media Studios</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white">
                Terms
              </Link>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
