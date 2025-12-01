'use client';

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import SectionNav from "@/components/ui/SectionNav";
import Button from "@/components/ui/Button";
import NavBar from "@/components/ui/NavBar";
import Section from "@/components/ui/Section";
import ShowcaseSlider from "@/components/ui/ShowcaseSlider";
import GlassGrid from "@/components/ui/GlassGrid";
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
  const testimonials = content.testimonials;
  const faqs = content.faqs;
  const contact = content.contact;
  const logoCloud = content.logoCloud;
  const practices = content.practices;
  const systems = content.systems;
  const serviceStacks = content.serviceStacks;

    const gridImages = featured.map((f) => f.imageUrl);
    // Use the first featured image as hero background, or a fallback
    const heroBg = featured[0]?.imageUrl || "https://picsum.photos/seed/hero/1920/1080";

    const showcaseItems = featured.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.subtitle,
      image: item.imageUrl,
      year: "2024",
    }));

    const sections = [
      { id: "hero", label: "Overview" },
      { id: "practices", label: "Practices" },
      { id: "work", label: "Work" },
      { id: "systems", label: "Systems" },
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

    return (
      <div className="relative min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black">
        <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        <div className="relative z-10">
          <NavBar
            links={[
              { href: "/why", label: "Why" },
              { href: "/change-studios", label: "Studios" },
              { href: "/photography", label: "Photography" },
              { href: "/photography/portrait", label: "Executive" },
              { href: "/portraits", label: "Portraits" },
              { href: "/login", label: "Login" },
            ]}
            cta={{ href: "#contact", label: "Start a project" }}
            tone="dark"
          />

          <SectionNav sections={sections} variant="dark" />

          <main className="mx-auto max-w-[1400px] space-y-32 px-6 pb-32">
            <Section id="hero" padTop={false} className="relative min-h-screen flex flex-col justify-center !px-0 overflow-hidden -mx-6 w-[calc(100%+3rem)]">
              {/* Background */}
              <div className="absolute inset-0 z-0">
                 <Image
                    src={heroBg}
                    alt="Hero Background"
                    fill
                    className="object-cover blur-sm brightness-[0.6]"
                    priority
                 />
              </div>

              {/* Content */}
              <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center h-full py-32">
                  {/* Left: Glass Grid */}
                  <div className="flex justify-center lg:justify-start">
                     <GlassGrid images={gridImages} />
                  </div>

                  {/* Right: Text */}
                  <div className="text-center lg:text-right space-y-10">
                     <h1 className="text-5xl md:text-7xl lg:text-8xl text-white leading-[1.1] tracking-tight drop-shadow-lg" style={{ fontFamily: serifFont }}>
                        Cinematic creative<br/>
                        for movements<br/>
                        that matter.
                     </h1>
                     <div className="flex justify-center lg:justify-end">
                        <Button 
                          href="#contact" 
                          size="lg" 
                          className="!bg-[#d4a373] !text-black !border-none !rounded-full !px-10 !py-6 !text-lg font-medium hover:!bg-[#c39262] hover:scale-105 transition-all shadow-xl shadow-black/20"
                        >
                           Book a project
                        </Button>
                     </div>
                  </div>
              </div>
            </Section>

            <section id="practices" className="space-y-12">
              <div className="flex flex-col gap-6 text-center md:text-left">
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">The practice</p>
                <h2 className="text-5xl text-white md:text-7xl" style={{ fontFamily: serifFont }}>
                  One studio, different doors.
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-white/60 md:mx-0 leading-relaxed">
                  Change Studios handles the campaign fieldwork. The portrait atelier crafts the stills. Field Notes documents the care systems that hold it together.
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {practices.map((practice, index) => (
                  <motion.article
                    key={practice.id}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: index * 0.1 }}
                    className="group flex h-full flex-col rounded-[40px] border border-white/10 bg-white/5 p-8 transition-all duration-500 hover:bg-white/10 hover:shadow-xl hover:shadow-black/20 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.2em] text-white/40">
                      <span>{practice.label}</span>
                      <span className="h-2 w-2 rounded-full bg-white opacity-20 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="mt-8 text-3xl text-white" style={{ fontFamily: serifFont }}>
                      {practice.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-white/60">{practice.description}</p>
                    <div className="mt-8 flex flex-wrap gap-2 text-xs text-white/40">
                      {practice.focus.map((focus) => (
                        <span key={focus} className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                          {focus}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto pt-8">
                      <Link
                        href={practice.cta.href}
                        className="inline-flex items-center gap-2 text-sm font-medium text-neutral-900 transition-all group-hover:gap-4"
                      >
                        {practice.cta.label} <span>→</span>
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            </section>

            <section id="logos" className="space-y-8 border-y border-white/10 py-16">
              <p className="text-center text-[0.65rem] uppercase tracking-[0.2em] text-white/40">{logoCloud.heading}</p>
              <div className="grid grid-cols-2 gap-12 opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0 sm:grid-cols-3 md:grid-cols-6 invert">
                {logoCloud.logos.map((logo) => (
                  <div key={logo.alt} className="flex items-center justify-center">
                    <Image src={logo.src} alt={logo.alt} width={120} height={40} className="h-8 w-auto object-contain" />
                  </div>
                ))}
              </div>
            </section>

            <section id="work" className="space-y-16">
              <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <div className="space-y-4">
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Work</p>
                  <h2 className="text-5xl text-white md:text-7xl" style={{ fontFamily: serifFont }}>
                    Film + stills from the practice.
                  </h2>
                  <p className="max-w-2xl text-lg text-white/60">
                    Documentary retainers, portrait commissions, and campaign sprints all live in one archive.
                  </p>
                </div>
                <Link href="/clients" className="group flex items-center gap-2 text-sm font-medium text-white">
                  View client workspaces <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
              
              <ShowcaseSlider items={showcaseItems} />
              
              {/* Gallery Strip */}
              <div className="overflow-hidden rounded-[40px] border border-white/10 bg-white/5 p-8 backdrop-blur-md">
                <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
                  {gallery.map((item) => (
                    <div key={item.id} className="w-72 shrink-0 space-y-4">
                      <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-white/5">
                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover grayscale transition-all hover:grayscale-0 opacity-80 hover:opacity-100" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{item.title}</h4>
                        <p className="text-xs text-white/40 mt-1">{item.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="systems" className="space-y-12">
              <div className="rounded-[48px] bg-white/5 border border-white/10 p-8 md:p-16 text-white shadow-2xl backdrop-blur-md">
                <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-6 max-w-2xl">
                    <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">{systems.eyebrow}</p>
                    <h2 className="text-5xl md:text-7xl" style={{ fontFamily: serifFont }}>
                      {systems.title}
                    </h2>
                    <p className="text-lg text-white/40 leading-relaxed">{systems.description}</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3 w-full lg:w-auto">
                    {systems.outcomes.map((outcome) => (
                      <div key={outcome.label} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
                        <div className="text-3xl font-medium text-white" style={{ fontFamily: serifFont }}>{outcome.value}</div>
                        <div className="mt-2 text-[0.6rem] uppercase tracking-[0.2em] text-white/40">{outcome.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-16 grid gap-6 md:grid-cols-2">
                  {systems.steps.map((step, i) => (
                    <div key={step.title} className="group rounded-[32px] border border-white/10 bg-white/5 p-8 transition-colors hover:bg-white/10">
                      <div className="flex items-start justify-between">
                        <p className="text-[0.6rem] uppercase tracking-[0.2em] text-white/40">0{i + 1}</p>
                        <p className="text-[0.6rem] uppercase tracking-[0.2em] text-white/40">{step.title}</p>
                      </div>
                      <p className="mt-6 text-2xl font-medium text-white" style={{ fontFamily: serifFont }}>{step.description}</p>
                      <p className="mt-4 text-sm text-white/40 leading-relaxed">{step.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                <motion.div {...fadeUp} className="rounded-[40px] border border-white/10 bg-white/5 p-10 backdrop-blur-md">
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Practice ethos</p>
                  <h3 className="mt-6 text-4xl text-white md:text-5xl" style={{ fontFamily: serifFont }}>
                    {studio.ethos}
                  </h3>
                  <ul className="mt-8 space-y-4">
                    {studio.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-4 text-white/60">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white" />
                        <span className="text-lg">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10 grid gap-4 md:grid-cols-2">
                    {features.map((feature) => (
                      <div key={feature.title} className="rounded-3xl bg-white/5 border border-white/10 p-6">
                        <div className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">{feature.title}</div>
                        <p className="mt-3 text-sm text-white/60 leading-relaxed">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
                <motion.blockquote {...fadeUp} className="flex flex-col justify-between rounded-[40px] bg-white/10 p-10 text-white backdrop-blur-md border border-white/10">
                  <p className="text-2xl leading-relaxed md:text-3xl" style={{ fontFamily: serifFont }}>“{studio.quote}”</p>
                  <footer className="mt-8 flex items-center gap-4">
                    <div className="h-px w-8 bg-white" />
                    <span className="text-[0.65rem] uppercase tracking-[0.2em] text-white/60">{studio.attribution}</span>
                  </footer>
                </motion.blockquote>
              </div>
            </section>

            <section id="services" className="space-y-12">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="space-y-4">
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Services</p>
                  <h2 className="text-5xl text-white md:text-7xl" style={{ fontFamily: serifFont }}>
                    One practice, two stacks.
                  </h2>
                  <p className="max-w-2xl text-lg text-white/60">
                    Documentary crews and the portrait atelier share the same producers, care protocols, and asset systems.
                  </p>
                </div>
                <Link
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-medium text-black transition-transform hover:scale-105 hover:bg-neutral-200"
                >
                  Talk with the practice
                </Link>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {serviceStacks.map((stack, index) => (
                  <motion.div
                    key={stack.id}
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: index * 0.1 }}
                    className="flex h-full flex-col rounded-[40px] border border-white/10 bg-white/5 p-10 shadow-sm backdrop-blur-md"
                  >
                    <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.2em] text-white/40">
                      <span>{stack.label}</span>
                      <span className="rounded-full border border-white/10 px-3 py-1">{stack.price}</span>
                    </div>
                    <h3 className="mt-8 text-4xl text-white" style={{ fontFamily: serifFont }}>
                      {stack.title}
                    </h3>
                    <p className="mt-4 text-lg text-white/60">{stack.description}</p>
                    <div className="my-8 h-px w-full bg-white/10" />
                    <ul className="space-y-4 text-white/80">
                      {stack.includes.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/20" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-10">
                      <Link
                        href={stack.ctaHref}
                        className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 py-4 text-sm font-medium text-white transition-all hover:border-white hover:bg-white hover:text-black"
                      >
                        {stack.ctaLabel} <span className="transition-transform group-hover:translate-x-1">→</span>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="text-center text-sm text-white/40">{content.includedKit}</p>
            </section>

            <section id="testimonials" className="grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <motion.article key={t.id} {...fadeUp} className="rounded-[32px] bg-white/10 border border-white/10 p-8 backdrop-blur-md">
                  <div className="flex items-center gap-4">
                    <Image src={t.avatar} alt={t.name} width={48} height={48} className="h-12 w-12 rounded-full object-cover grayscale opacity-80" />
                    <div>
                      <p className="font-medium text-white">{t.name}</p>
                      <p className="text-[0.6rem] uppercase tracking-[0.2em] text-white/40">{t.role}</p>
                    </div>
                  </div>
                  <p className="mt-6 text-sm leading-relaxed text-white/60">“{t.quote}”</p>
                </motion.article>
              ))}
            </section>

            <section id="faq" className="rounded-[48px] border border-white/10 bg-white/5 p-8 md:p-16 backdrop-blur-md">
              <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                <div className="max-w-md space-y-4">
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">FAQ</p>
                  <h2 className="text-5xl text-white" style={{ fontFamily: serifFont }}>
                    Logistics, timelines, and care.
                  </h2>
                </div>
                <div className="w-full max-w-2xl space-y-4">
                  {faqs.map((faq) => (
                    <details key={faq.id} className="group rounded-3xl bg-white/5 border border-white/5 p-6 open:bg-white/10 open:shadow-lg transition-all">
                      <summary className="flex cursor-pointer items-center justify-between text-lg font-medium text-white list-none">
                        {faq.question}
                        <span className="ml-4 text-white/40 transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <p className="mt-4 text-white/60 leading-relaxed">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            </section>

            <section id="contact" className="grid gap-8 md:grid-cols-[1fr_0.8fr]">
              <motion.div {...fadeUp} className="rounded-[48px] bg-white/5 border border-white/10 p-10 text-white md:p-16 backdrop-blur-md">
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Contact</p>
                <h2 className="mt-6 text-5xl md:text-6xl" style={{ fontFamily: serifFont }}>
                  Share the story, we’ll build the reel.
                </h2>
                <form onSubmit={handleSubmit} className="mt-12 space-y-6">
                  <div className="hidden" aria-hidden>
                    <label className="text-sm text-neutral-500">Leave empty</label>
                    <input name="hp" autoComplete="off" tabIndex={-1} />
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs uppercase tracking-[0.2em] text-white/40">Full name</label>
                      <input
                        name="name"
                        required
                        autoComplete="name"
                        className="mt-2 w-full border-b border-white/20 bg-transparent py-3 text-xl text-white placeholder-white/20 focus:border-white focus:outline-none"
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className="text-xs uppercase tracking-[0.2em] text-white/40">Email</label>
                        <input
                          type="email"
                          name="email"
                          required
                          autoComplete="email"
                          className="mt-2 w-full border-b border-white/20 bg-transparent py-3 text-xl text-white placeholder-white/20 focus:border-white focus:outline-none"
                          placeholder="jane@example.com"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-[0.2em] text-white/40">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          autoComplete="tel"
                          className="mt-2 w-full border-b border-white/20 bg-transparent py-3 text-xl text-white placeholder-white/20 focus:border-white focus:outline-none"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-[0.2em] text-white/40">Organization</label>
                      <input
                        name="org"
                        autoComplete="organization"
                        className="mt-2 w-full border-b border-white/20 bg-transparent py-3 text-xl text-white placeholder-white/20 focus:border-white focus:outline-none"
                        placeholder="Company Inc."
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-[0.2em] text-white/40">Project details</label>
                      <textarea
                        name="details"
                        rows={4}
                        minLength={10}
                        required
                        className="mt-2 w-full border-b border-white/20 bg-transparent py-3 text-xl text-white placeholder-white/20 focus:border-white focus:outline-none resize-none"
                        placeholder="Tell us about your project..."
                      />
                    </div>
                  </div>
                  <div className="pt-8">
                    <button
                      disabled={submitting || submitted}
                      className="inline-flex w-full items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition-transform hover:scale-[1.02] disabled:opacity-60 hover:bg-neutral-200"
                    >
                      {submitted ? "Sent — talk soon" : submitting ? "Sending…" : "Send inquiry"}
                    </button>
                  </div>
                  {error && <p className="text-sm text-red-400">{error}</p>}
                </form>
              </motion.div>

              <motion.div {...fadeUp} className="flex flex-col gap-8">
                <div className="rounded-[40px] border border-white/10 bg-white/5 p-10 backdrop-blur-md">
                  <div className="space-y-8">
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Email</p>
                      <a href={`mailto:${contact.email}`} className="mt-2 block text-2xl font-medium text-white hover:text-white/60">
                        {contact.email}
                      </a>
                    </div>
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Studio</p>
                      <p className="mt-2 text-xl text-white">{contact.city}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                      <div>
                        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Instagram</p>
                        <a href={contact.instagram.url} target="_blank" rel="noreferrer" className="mt-1 block text-white hover:underline">
                          {contact.instagram.handle}
                        </a>
                      </div>
                      <div>
                        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">YouTube</p>
                        <a href={contact.youtube.url} target="_blank" rel="noreferrer" className="mt-1 block text-white hover:underline">
                          {contact.youtube.label}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-md">
                  <div className="calendly-inline-widget h-full w-full min-h-[600px]" data-url={contact.calendlyUrl} />
                  <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="afterInteractive" />
                </div>
              </motion.div>
            </section>

            <footer className="flex flex-col gap-6 border-t border-white/10 pt-12 text-xs uppercase tracking-[0.1em] text-white/40 md:flex-row md:items-center md:justify-between">
              <p>© {new Date().getFullYear()} CHANGE Media Studios</p>
              <div className="flex gap-8">
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms
                </Link>
              </div>
            </footer>
          </main>
        </div>
      </div>
  );
}
