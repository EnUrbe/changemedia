'use client';

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import SectionNav from "@/components/ui/SectionNav";
import type { SiteContent } from "@/lib/contentSchema";

const serifFont = "var(--font-family-serif, 'Instrument Serif', Georgia, serif)";

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] as const },
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

    const sections = [
      { id: "hero", label: "Overview" },
      { id: "work", label: "Work" },
      { id: "studio", label: "Studio" },
      { id: "services", label: "Services" },
      { id: "contact", label: "Contact" },
    ];

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
      <div className="relative min-h-screen bg-[#f6f3ee] text-neutral-900">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 right-[5%] h-[28rem] w-[28rem] rounded-[999px] bg-gradient-to-br from-[#ffeecf] to-[#d6e7ff] blur-[120px]" />
          <div className="absolute top-[40%] left-[-10%] h-[30rem] w-[30rem] rounded-[999px] bg-gradient-to-br from-[#f5d7ff] to-[#d2f5e9] blur-[150px]" />
        </div>

        <div className="relative z-10">
          <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-[0.65rem] uppercase tracking-[0.3em] text-neutral-500">
            <Link href="/" className="text-sm font-semibold text-neutral-900">
              CHANGE<span className="text-[#577ef3]">®</span>
            </Link>
            <div className="hidden items-center gap-6 md:flex">
              <Link href="/why" className="hover:text-neutral-900">
                Why
              </Link>
              <Link href="/change-studios" className="hover:text-neutral-900">
                Studios
              </Link>
              <Link href="/photography" className="hover:text-neutral-900">
                Photography
              </Link>
              <Link href="/photography/portrait" className="hover:text-neutral-900">
                Portraits
              </Link>
            </div>
            <Link
              href="#contact"
              className="rounded-full border border-neutral-300 px-4 py-2 text-[0.65rem] text-neutral-700 hover:border-neutral-900 hover:text-neutral-900"
            >
              Start a project
            </Link>
          </header>

          <SectionNav sections={sections} variant="light" />

          <main className="mx-auto max-w-6xl space-y-24 px-6 pb-24">
            <section id="hero" className="pt-20">
              <div className="rounded-[40px] border border-neutral-200/70 bg-white/90 p-8 md:p-12 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
                <div className="flex flex-wrap items-center gap-4 text-[0.65rem] uppercase tracking-[0.3em] text-neutral-500">
                  <span>{hero.eyebrow}</span>
                  <span className="rounded-full border border-neutral-200 px-3 py-1 text-neutral-600">{hero.locationPill}</span>
                </div>
                <div className="mt-8 space-y-5">
                  <h1 className="text-4xl leading-tight text-neutral-900 md:text-6xl" style={{ fontFamily: serifFont }}>
                    <span className="bg-gradient-to-r from-[#5ba5ff] via-[#8f60ff] to-[#ff909b] bg-clip-text text-transparent">
                      {hero.titleGradient}
                    </span>
                    <br />
                    {heroSecondaryLine}
                  </h1>
                  <p className="max-w-3xl text-lg text-neutral-600 md:text-xl">{hero.subtitle}</p>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  {hero.ctas.map((cta) => (
                    <a
                      key={cta.label}
                      href={cta.href}
                      className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                        cta.variant === "primary"
                          ? "bg-neutral-900 text-white hover:bg-neutral-700"
                          : cta.variant === "secondary"
                            ? "border border-neutral-300 text-neutral-700 hover:border-neutral-900 hover:text-neutral-900"
                            : "bg-gradient-to-r from-[#ffe6d5] to-[#d3f4e6] text-neutral-900"
                      }`}
                    >
                      {cta.label}
                    </a>
                  ))}
                </div>
                <div className="mt-10 grid gap-4 md:grid-cols-4">
                  {hero.metrics.map((metric) => (
                    <div key={metric.value} className="rounded-3xl border border-neutral-200 bg-neutral-50/80 p-5 text-center">
                      <div className="text-3xl font-semibold text-neutral-900">{metric.value}</div>
                      <div className="text-[0.65rem] uppercase tracking-[0.3em] text-neutral-500">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-3 text-[0.65rem] uppercase tracking-[0.3em] text-neutral-500">
                {content.marquee.phrases.map((phrase) => (
                  <span key={phrase} className="rounded-full border border-neutral-200 px-3 py-1">
                    {phrase}
                  </span>
                ))}
              </div>
            </section>

            <section id="logos" className="space-y-6">
              <p className="text-center text-[0.65rem] uppercase tracking-[0.3em] text-neutral-500">{logoCloud.heading}</p>
              <div className="grid grid-cols-2 gap-6 rounded-[32px] border border-neutral-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)] sm:grid-cols-3 md:grid-cols-6">
                {logoCloud.logos.map((logo) => (
                  <div key={logo.alt} className="flex items-center justify-center opacity-70">
                    <Image src={logo.src} alt={logo.alt} width={100} height={30} className="h-7 w-auto" />
                  </div>
                ))}
              </div>
            </section>

            <section id="work" className="space-y-10">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.3em] text-neutral-500">Work</p>
                  <h2 className="text-4xl text-neutral-900 md:text-5xl" style={{ fontFamily: serifFont }}>
                    Field-built stories, new muscle.
                  </h2>
                </div>
                <Link href="/clients" className="text-sm text-neutral-600 hover:text-neutral-900">
                  View client workspaces →
                </Link>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {featured.map((item) => (
                  <motion.article key={item.id} {...fadeUp} className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                    <div className="relative aspect-[4/3]">
                      <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="space-y-2 p-5">
                      <p className="text-[0.65rem] uppercase tracking-[0.3em] text-neutral-500">{item.subtitle}</p>
                      <h3 className="text-2xl font-semibold">{item.title}</h3>
                      <div className="flex flex-wrap gap-2 text-xs text-neutral-500">
                        {(item.tags ?? []).map((tag) => (
                          <span key={tag} className="rounded-full border border-neutral-200 px-2 py-1">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
              <div className="overflow-x-auto rounded-[32px] border border-neutral-200 bg-white/80 p-6">
                <div className="flex min-w-[640px] gap-4">
                  {gallery.map((item) => (
                    <div key={item.id} className="w-56 shrink-0">
                      <div className="relative h-40 w-full overflow-hidden rounded-2xl">
                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-neutral-500">{item.subtitle}</p>
                        <h4 className="text-lg font-semibold">{item.title}</h4>
                        <p className="text-xs text-neutral-400">{(item.tags ?? []).join(" • ")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="studio" className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
              <motion.div {...fadeUp} className="rounded-[36px] border border-neutral-200 bg-white/90 p-8 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-neutral-500">Studio</p>
                <h2 className="mt-4 text-4xl text-neutral-900 md:text-5xl" style={{ fontFamily: serifFont }}>
                  {studio.ethos}
                </h2>
                <ul className="mt-8 space-y-4 text-sm text-neutral-600">
                  {studio.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-[#5ba5ff] to-[#ffa7c4]" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div className="mt-10 grid gap-4 md:grid-cols-3">
                  {features.map((feature) => (
                    <div key={feature.title} className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4">
                      <div className="text-[0.65rem] uppercase tracking-[0.3em] text-neutral-500">{feature.title}</div>
                      <p className="mt-2 text-sm text-neutral-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.blockquote {...fadeUp} className="rounded-[36px] border border-neutral-200 bg-gradient-to-br from-white to-[#f7f3ff] p-8 text-neutral-700 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
                <p className="text-xl leading-relaxed">“{studio.quote}”</p>
                <footer className="mt-4 text-[0.65rem] uppercase tracking-[0.3em] text-neutral-500">{studio.attribution}</footer>
              </motion.blockquote>
            </section>

            <section id="services" className="space-y-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.3em] text-neutral-500">Services</p>
                  <h2 className="text-4xl text-neutral-900 md:text-5xl" style={{ fontFamily: serifFont }}>
                    Modular packages, documentary rigor.
                  </h2>
                </div>
                <div className="inline-flex items-center rounded-full border border-neutral-300 bg-white/80 p-1 text-xs">
                  <button
                    onClick={() => setAnnual(false)}
                    className={`rounded-full px-3 py-1 font-semibold transition ${!annual ? "bg-neutral-900 text-white" : "text-neutral-500"}`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setAnnual(true)}
                    className={`rounded-full px-3 py-1 font-semibold transition ${annual ? "bg-neutral-900 text-white" : "text-neutral-500"}`}
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
                    className="flex h-full flex-col rounded-[32px] border border-neutral-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
                  >
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.3em] text-neutral-500">{service.title}</p>
                      <div className="mt-6 text-4xl font-semibold text-neutral-900">{servicePrice(service)}</div>
                      <p className="mt-2 text-xs text-neutral-500">{content.includedKit}</p>
                    </div>
                    <ul className="mt-6 space-y-3 text-sm text-neutral-600">
                      {service.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neutral-900" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-6">
                      <a
                        href={service.ctaHref}
                        className="inline-flex w-full items-center justify-center rounded-full border border-neutral-300 px-4 py-3 text-sm font-semibold text-neutral-700 hover:border-neutral-900 hover:text-neutral-900"
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
                <motion.article key={t.id} {...fadeUp} className="rounded-[32px] border border-neutral-200 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                  <div className="flex items-center gap-3">
                    <Image src={t.avatar} alt={t.name} width={56} height={56} className="h-14 w-14 rounded-full object-cover" />
                    <div>
                      <p className="text-lg font-semibold">{t.name}</p>
                      <p className="text-[0.65rem] uppercase tracking-[0.3em] text-neutral-500">{t.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-neutral-600">“{t.quote}”</p>
                </motion.article>
              ))}
            </section>

            <section id="faq" className="rounded-[32px] border border-neutral-200 bg-white/90 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.3em] text-neutral-500">FAQ</p>
                  <h2 className="text-4xl text-neutral-900 md:text-5xl" style={{ fontFamily: serifFont }}>
                    Logistics, timelines, and care.
                  </h2>
                </div>
              </div>
              <div className="mt-8 space-y-4">
                {faqs.map((faq) => (
                  <details key={faq.id} className="rounded-2xl border border-neutral-200 bg-white p-4">
                    <summary className="cursor-pointer text-lg font-semibold text-neutral-900">{faq.question}</summary>
                    <p className="mt-3 text-sm text-neutral-600">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>

            <section id="contact" className="grid gap-8 md:grid-cols-[1fr_0.9fr]">
              <motion.div {...fadeUp} className="rounded-[36px] border border-neutral-200 bg-white/90 p-8 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-neutral-500">Contact</p>
                <h2 className="mt-4 text-4xl text-neutral-900 md:text-5xl" style={{ fontFamily: serifFont }}>
                  Share the story, we’ll build the reel.
                </h2>
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="hidden" aria-hidden>
                    <label className="text-sm text-neutral-500">Leave empty</label>
                    <input name="hp" autoComplete="off" tabIndex={-1} />
                  </div>
                  <div>
                    <label className="text-sm text-neutral-600">Full name</label>
                    <input
                      name="name"
                      required
                      autoComplete="name"
                      className="mt-2 w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm text-neutral-600">Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        autoComplete="email"
                        className="mt-2 w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-neutral-600">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        className="mt-2 w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-neutral-600">Organization</label>
                    <input
                      name="org"
                      autoComplete="organization"
                      className="mt-2 w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-neutral-600">Project details</label>
                    <textarea
                      name="details"
                      rows={4}
                      minLength={10}
                      required
                      className="mt-2 w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900"
                      placeholder="What are we documenting? Timeline, partners, goals?"
                    />
                  </div>
                  <button
                    disabled={submitting || submitted}
                    className="inline-flex w-full items-center justify-center rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition disabled:opacity-60"
                  >
                    {submitted ? "Sent — talk soon" : submitting ? "Sending…" : "Send inquiry"}
                  </button>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <p aria-live="polite" role="status" className="sr-only">
                    {submitted ? "Inquiry sent successfully." : submitting ? "Sending your inquiry." : error ? `Error: ${error}` : ""}
                  </p>
                </form>
              </motion.div>

              <motion.div {...fadeUp} className="rounded-[36px] border border-neutral-200 bg-white/90 p-8 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
                <div className="space-y-4 text-sm text-neutral-600">
                  <div>
                    <p className="uppercase tracking-[0.3em] text-neutral-400">Email</p>
                    <a href={`mailto:${contact.email}`} className="text-lg font-semibold text-neutral-900">
                      {contact.email}
                    </a>
                  </div>
                  <div>
                    <p className="uppercase tracking-[0.3em] text-neutral-400">City</p>
                    <p className="text-lg text-neutral-900">{contact.city}</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="uppercase tracking-[0.3em] text-neutral-400">Instagram</p>
                      <a href={contact.instagram.url} target="_blank" rel="noreferrer" className="text-neutral-900 hover:underline">
                        {contact.instagram.handle}
                      </a>
                    </div>
                    <div>
                      <p className="uppercase tracking-[0.3em] text-neutral-400">YouTube</p>
                      <a href={contact.youtube.url} target="_blank" rel="noreferrer" className="text-neutral-900 hover:underline">
                        {contact.youtube.label}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-8 rounded-2xl border border-neutral-200 bg-white">
                  <div className="calendly-inline-widget h-[640px] w-full rounded-2xl" data-url={contact.calendlyUrl} />
                  <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="afterInteractive" />
                </div>
              </motion.div>
            </section>

            <footer className="flex flex-col gap-4 border-t border-neutral-200 pt-10 text-sm text-neutral-500 md:flex-row md:items-center md:justify-between">
              <p>© {new Date().getFullYear()} CHANGE Media Studios</p>
              <div className="flex gap-4">
                <Link href="/privacy" className="hover:text-neutral-900">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:text-neutral-900">
                  Terms
                </Link>
              </div>
            </footer>
          </main>
        </div>
      </div>
  );
}
