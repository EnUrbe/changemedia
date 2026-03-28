"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { PORTRAITS } from "@/lib/data";

export default function PortraitsClient() {
  const [selectedPkg, setSelectedPkg] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const selectedPackage = PORTRAITS.packages[selectedPkg];

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.get("full_name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          organization: formData.get("organization"),
          service_type: selectedPkg === 0 ? "branding" : "org",
          timeline: formData.get("timeline"),
          budget_range: selectedPackage.price,
          preferred_dates: formData.get("preferred_dates"),
          message: formData.get("notes"),
          how_heard: formData.get("how_heard"),
          source: "website_portraits",
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        form.reset();
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-white atmosphere">
      <Nav />

      {/* ═══════ HERO ═══════ */}
      <section className="relative h-screen w-full overflow-hidden flex items-end">
        <Image
          src={PORTRAITS.hero.image}
          alt="Portrait Atelier"
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute top-[30%] right-[10%] h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-[180px] pointer-events-none" />

        <div className="relative z-10 container-wide pb-16 md:pb-24">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(4rem,10vw,8rem)] font-serif leading-[0.85] tracking-tighter whitespace-pre-line text-shimmer"
          >
            {PORTRAITS.hero.headline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-6 text-lg md:text-xl text-[var(--text-secondary)] max-w-lg leading-relaxed"
          >
            {PORTRAITS.hero.subheadline}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8 flex gap-4"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
            >
              Get portrait pricing
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ═══════ GALLERY GRID ═══════ */}
      <section className="py-[var(--section-padding)]">
        <div className="container-wide">
          <span className="label-accent">Selected portraits</span>
          <h2 className="mt-4 text-4xl md:text-6xl font-serif tracking-tighter mb-12">
            Recent work.
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {PORTRAITS.gallery.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className={`editorial-card group relative overflow-hidden aspect-[3/4] ${
                  i === 0 || i === 3 ? "md:row-span-2 md:aspect-auto" : ""
                }`}
              >
                <Image
                  src={src}
                  alt={`Portrait ${i + 1}`}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ EXPERIENCE ═══════ */}
      <section className="py-[var(--section-padding)] bg-[var(--bg-elevated)] border-y border-[var(--border)]">
        <div className="container-wide">
          <span className="label-accent">The experience</span>
          <h2 className="mt-4 text-4xl md:text-6xl font-serif tracking-tighter mb-16">
            Built for busy teams and high-visibility people.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PORTRAITS.experience.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.55 }}
                className="relative group"
              >
                <span className="text-6xl font-serif text-[var(--accent)] opacity-20 transition-opacity duration-300 group-hover:opacity-50">{s.step}</span>
                {i < PORTRAITS.experience.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(100%_-_1rem)] w-[calc(100%_-_2rem)] h-px bg-gradient-to-r from-[var(--border)] to-transparent" />
                )}
                <h3 className="mt-2 text-xl font-serif group-hover:text-[var(--accent)] transition-colors duration-300">{s.title}</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">{s.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PACKAGES ═══════ */}
      <section className="py-[var(--section-padding)]">
        <div className="container-wide">
          <span className="label-accent">Packages</span>
          <h2 className="mt-4 text-4xl md:text-6xl font-serif tracking-tighter mb-16">
            The portrait offers that generate the most value.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PORTRAITS.packages.map((pkg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                onClick={() => setSelectedPkg(i)}
                className={`cursor-pointer rounded-2xl border p-8 md:p-10 transition-all duration-500 ${
                  selectedPkg === i
                    ? "bg-white text-black border-white scale-[1.02] shadow-[0_24px_80px_rgba(215,185,138,0.15)]"
                    : "editorial-card glow-border"
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-serif">{pkg.title}</h3>
                  <span className="text-3xl font-serif">{pkg.price}</span>
                </div>
                <p
                  className={`mt-1 text-sm ${
                    selectedPkg === i ? "text-neutral-500" : "text-[var(--text-muted)]"
                  }`}
                >
                  {pkg.duration} · {pkg.description}
                </p>

                <div
                  className={`my-6 h-px ${
                    selectedPkg === i ? "bg-neutral-200" : "divider-glow"
                  }`}
                />

                <ul className="space-y-3">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <span
                        className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          selectedPkg === i ? "bg-black" : "bg-[var(--accent)]"
                        }`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                {pkg.featured && (
                  <div
                    className={`mt-6 inline-block text-[10px] font-sans font-semibold uppercase tracking-wider rounded-full px-3 py-1 ${
                      selectedPkg === i
                        ? "bg-black text-white"
                        : "bg-[var(--accent-soft)] text-[var(--accent)]"
                    }`}
                  >
                    Most popular
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[var(--section-padding)] bg-[var(--bg-elevated)] border-y border-[var(--border)]">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1fr)] gap-10">
          <div>
            <span className="label-accent">Add-ons</span>
            <h2 className="mt-4 text-4xl md:text-6xl font-serif tracking-tighter">
              The extras that make portraits more usable.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--text-secondary)]">
              Most portrait projects become more valuable when they include the crops, retouching,
              and team coverage people realize they need after the shoot.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PORTRAITS.upsells.map((item) => (
              <div key={item} className="editorial-card p-6">
                <p className="text-sm font-medium text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ BOOKING FORM ═══════ */}
      <section
        ref={formRef}
        id="book"
        className="py-[var(--section-padding)] bg-[var(--bg-elevated)] border-t border-[var(--border)]"
      >
        <div className="container-narrow">
          <div className="text-center mb-12">
            <span className="label-accent">Book a session</span>
            <h2 className="mt-4 text-4xl md:text-6xl font-serif tracking-tighter">
              Get a custom portrait scope.
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="editorial-card glow-border max-w-lg mx-auto p-8 md:p-10 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-sans font-semibold uppercase tracking-wider text-[var(--text-muted)]">
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
                <label className="text-xs font-sans font-semibold uppercase tracking-wider text-[var(--text-muted)]">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-sans font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Phone
                </label>
                <input
                  required
                  name="phone"
                  className="mt-2 w-full bg-transparent border-b border-[var(--border)] py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors duration-300 placeholder:text-[var(--text-dim)]"
                  placeholder="Best number"
                />
              </div>
              <div>
                <label className="text-xs font-sans font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Organization
                </label>
                <input
                  name="organization"
                  className="mt-2 w-full bg-transparent border-b border-[var(--border)] py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors duration-300 placeholder:text-[var(--text-dim)]"
                  placeholder="Team / school / company"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-sans font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Package
              </label>
              <select
                value={selectedPkg}
                onChange={(e) => setSelectedPkg(Number(e.target.value))}
                className="mt-2 w-full bg-transparent border-b border-[var(--border)] py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors duration-300"
              >
                {PORTRAITS.packages.map((p, i) => (
                  <option key={i} value={i} className="bg-black text-white">
                    {p.title} — {p.price}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-sans font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Timeline
                </label>
                <select
                  name="timeline"
                  className="mt-2 w-full bg-transparent border-b border-[var(--border)] py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors duration-300"
                >
                  <option value="" className="bg-black text-white">Select timeline</option>
                  <option value="asap" className="bg-black text-white">ASAP</option>
                  <option value="2_4_weeks" className="bg-black text-white">2-4 weeks</option>
                  <option value="1_2_months" className="bg-black text-white">1-2 months</option>
                  <option value="planning_ahead" className="bg-black text-white">Planning ahead</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-sans font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Preferred date
                </label>
                <input
                  name="preferred_dates"
                  className="mt-2 w-full bg-transparent border-b border-[var(--border)] py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors duration-300 placeholder:text-[var(--text-dim)]"
                  placeholder="Week of May 10, etc."
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-sans font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Vision / Notes
              </label>
              <textarea
                name="notes"
                rows={3}
                className="mt-2 w-full bg-transparent border-b border-[var(--border)] py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors duration-300 resize-none placeholder:text-[var(--text-dim)]"
                placeholder="Your vibe, inspiration, or any details..."
              />
            </div>

            <div>
              <label className="text-xs font-sans font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                How did you hear about us?
              </label>
              <input
                name="how_heard"
                className="mt-2 w-full bg-transparent border-b border-[var(--border)] py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors duration-300 placeholder:text-[var(--text-dim)]"
                placeholder="Referral, Instagram, event, Google, etc."
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={submitting || submitted}
              className="w-full"
            >
              {submitted ? "Request sent" : submitting ? "Sending..." : "Request pricing"}
            </Button>

            {submitted && (
              <p className="text-center text-sm text-[var(--accent)]">
                We&apos;ll reach out within one business day with next steps and availability.
              </p>
            )}
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
