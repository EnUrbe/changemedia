"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { SITE, FAQS } from "@/lib/data";

export default function ContactClient() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const formTsRef = useRef(Date.now());

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      if (res.ok) {
        setSubmitted(true);
        form.reset();
      }
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-white atmosphere">
      <Nav />

      {/* ═══════ HERO ═══════ */}
      <section className="pt-32 md:pt-40 pb-16 relative">
        <div className="absolute top-[10%] right-[10%] h-72 w-72 rounded-full bg-[var(--accent)]/8 blur-[180px] pointer-events-none" />
        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="label-accent">Contact</span>
            <h1 className="mt-4 text-5xl md:text-7xl font-serif tracking-tighter leading-[0.9]">
              Tell us what you need to launch, explain, or document.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)]">
              Use this form if you need a documentary film, event recap, executive portraits, or a
              repeatable content system. The more context you share, the more useful our first reply
              will be.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════ CONTACT GRID ═══════ */}
      <section className="pb-[var(--section-padding)]">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className="text-2xl font-serif mb-3">Start with a few details</h2>
            <p className="mb-8 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
              We usually reply within one business day with next steps, availability, or a short set
              of follow-up questions. Projects with clear budgets and timelines move fastest.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="hidden" name="hp" tabIndex={-1} autoComplete="off" />
              <input type="hidden" name="ts" value={formTsRef.current} />
              <input type="hidden" name="source" value="website_contact" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Name
                  </label>
                  <input
                    required
                    name="full_name"
                    className="mt-2 w-full bg-transparent border-b border-[var(--border)] py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors duration-300 placeholder:text-[var(--text-dim)]"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    className="mt-2 w-full bg-transparent border-b border-[var(--border)] py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors duration-300 placeholder:text-[var(--text-dim)]"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Phone
                  </label>
                  <input
                    name="phone"
                    className="mt-2 w-full bg-transparent border-b border-[var(--border)] py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors duration-300 placeholder:text-[var(--text-dim)]"
                    placeholder="Best number"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Location
                  </label>
                  <input
                    name="location"
                    className="mt-2 w-full bg-transparent border-b border-[var(--border)] py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors duration-300 placeholder:text-[var(--text-dim)]"
                    placeholder="City / state"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  Organization
                </label>
                <input
                  name="organization"
                  className="mt-2 w-full bg-transparent border-b border-[var(--border)] py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors duration-300 placeholder:text-[var(--text-dim)]"
                  placeholder="Your org or company (optional)"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  What do you need?
                </label>
                <select
                  name="service_type"
                  className="mt-2 w-full bg-transparent border-b border-[var(--border)] py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors duration-300"
                >
                  <option value="" className="bg-black">Select a service...</option>
                  <option value="documentary" className="bg-black">Documentary / Campaign Film</option>
                  <option value="retainer" className="bg-black">Ongoing Content Retainer</option>
                  <option value="event" className="bg-black">Event Coverage / Recap</option>
                  <option value="branding" className="bg-black">Executive / Brand Portraits</option>
                  <option value="org" className="bg-black">Team Headshots / Organization Portraits</option>
                  <option value="general_inquiry" className="bg-black">Not sure yet</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Budget range
                  </label>
                  <select
                    name="budget_range"
                    className="mt-2 w-full bg-transparent border-b border-[var(--border)] py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors duration-300"
                  >
                    <option value="" className="bg-black">Select a range...</option>
                    <option value="under_2500" className="bg-black">Under $2.5k</option>
                    <option value="2500_5000" className="bg-black">$2.5k - $5k</option>
                    <option value="5000_10000" className="bg-black">$5k - $10k</option>
                    <option value="10000_plus" className="bg-black">$10k+</option>
                    <option value="not_sure" className="bg-black">Not sure yet</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Timeline
                  </label>
                  <select
                    name="timeline"
                    className="mt-2 w-full bg-transparent border-b border-[var(--border)] py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors duration-300"
                  >
                    <option value="" className="bg-black">Select a timeline...</option>
                    <option value="asap" className="bg-black">ASAP</option>
                    <option value="2_4_weeks" className="bg-black">2-4 weeks</option>
                    <option value="1_2_months" className="bg-black">1-2 months</option>
                    <option value="planning_ahead" className="bg-black">Planning ahead</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  Tell us about your project
                </label>
                <textarea
                  name="message"
                  rows={5}
                  className="mt-2 w-full bg-transparent border-b border-[var(--border)] py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors duration-300 resize-none placeholder:text-[var(--text-dim)]"
                  placeholder="What are you launching, documenting, or trying to communicate? Include deliverables, audience, and anything that matters."
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  How did you hear about us?
                </label>
                <input
                  name="how_heard"
                  className="mt-2 w-full bg-transparent border-b border-[var(--border)] py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors duration-300 placeholder:text-[var(--text-dim)]"
                  placeholder="Referral, Instagram, Google, event, etc."
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={submitting || submitted}
                className="w-full sm:w-auto"
              >
                {submitted ? "Inquiry sent" : submitting ? "Sending..." : "Get a custom scope"}
              </Button>

              {submitted && (
                <p className="text-sm text-[var(--accent)]">
                  Thank you. We&apos;ll review the brief and reply with next steps within one business day.
                </p>
              )}
            </form>
          </motion.div>

          {/* Sidebar info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-6 lg:pl-8"
          >
            <div className="editorial-card glow-border p-8">
              <h3 className="text-lg font-serif mb-4">Good fit projects</h3>
              <ul className="space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
                  Campaign films for nonprofits, schools, and mission-driven organizations
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
                  Executive portraits, team headshots, and founder brand sessions
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
                  Event recaps, speaker clips, and launch-ready social cutdowns
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
                  Retainers for teams that need recurring visuals without hiring in-house
                </li>
              </ul>
            </div>

            <div className="editorial-card glow-border relative overflow-hidden p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-transparent pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-lg font-serif mb-3">Prefer to talk live?</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
                  Book a free 30-minute call if the project is already active and you want to talk through scope, deliverables, or timing.
                </p>
                <Button href={SITE.calendlyUrl} variant="primary">
                  Schedule a call
                </Button>
              </div>
            </div>

            <div className="editorial-card glow-border p-8">
              <h3 className="text-lg font-serif mb-3">Need a planning guide first?</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
                Use the form and write &ldquo;planning guide&rdquo; in the message. We&apos;ll send
                a simple overview of timelines, starting ranges, and what usually changes scope for
                films, recurring content, and portrait sessions.
              </p>
              <Button href="/contact" variant="outline">
                Request planning guide
              </Button>
            </div>

            <div className="editorial-card glow-border p-8">
              <h3 className="text-lg font-serif mb-6">Direct contact</h3>
              <div className="space-y-4">
                <div>
                  <span className="label">Email</span>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="block mt-1 text-[var(--accent)] link-underline w-fit"
                  >
                    {SITE.email}
                  </a>
                </div>
                <div>
                  <span className="label">Location</span>
                  <p className="mt-1 text-[var(--text-secondary)]">{SITE.city}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section className="py-[var(--section-padding)] bg-[var(--bg-elevated)] border-t border-[var(--border)]">
        <div className="container-narrow">
          <span className="label-accent text-center block">FAQ</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-serif tracking-tighter text-center mb-12">
            Common questions.
          </h2>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="editorial-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors duration-300 hover:bg-white/[0.02]"
                >
                  <span className="text-sm font-medium pr-4">{faq.question}</span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="text-[var(--accent)] text-lg flex-shrink-0"
                  >
                    +
                  </motion.span>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaq === i ? "auto" : 0,
                    opacity: openFaq === i ? 1 : 0,
                  }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm text-[var(--text-secondary)] leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
