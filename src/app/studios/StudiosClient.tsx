"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { STUDIOS, HOME } from "@/lib/data";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function StudiosClient() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-white atmosphere">
      <Nav />

      {/* ═══════ HERO ═══════ */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <Image
          src={STUDIOS.hero.image}
          alt="Change Studios"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />
        <div className="absolute top-[20%] left-[15%] h-64 w-64 rounded-full bg-[var(--accent)]/10 blur-[160px] pointer-events-none" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative z-10 text-center container-wide"
        >
          <h1 className="text-[clamp(4rem,12vw,10rem)] font-serif leading-[0.85] tracking-tighter whitespace-pre-line text-shimmer">
            {STUDIOS.hero.headline}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-[var(--text-secondary)] max-w-lg mx-auto">
            {STUDIOS.hero.mission}
          </p>
          <div className="mt-8">
            <Button href="/contact" variant="primary" size="lg">
              Get a custom scope
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ═══════ MARQUEE ═══════ */}
      <div className="border-y border-[var(--border)] py-5 overflow-hidden bg-[var(--bg-elevated)]">
        <div className="flex whitespace-nowrap" style={{ animation: "marquee 20s linear infinite" }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="inline-flex items-center gap-3 mx-8 text-sm font-mono uppercase tracking-[0.2em] text-[var(--text-muted)]">
              <span className="dot-pulse" />
              Denver documentary filmmaker &nbsp;·&nbsp; Campaign films that build trust &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ═══════ CAPABILITIES ═══════ */}
      <section className="py-[var(--section-padding)]">
        <div className="container-wide">
          <span className="label-accent">Capabilities</span>
          <h2 className="mt-4 text-4xl md:text-6xl font-serif tracking-tighter mb-16">
            What we make for growing teams.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STUDIOS.capabilities.map((cap, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="editorial-card glow-border group p-8 md:p-10"
              >
                <span className="label-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-2xl font-serif tracking-tight group-hover:text-[var(--accent)] transition-colors duration-300">{cap.title}</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                  {cap.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {cap.services.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] font-mono uppercase tracking-wider border border-[var(--border)] rounded-full px-3 py-1 text-[var(--text-muted)] transition-colors duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[var(--section-padding)] border-y border-[var(--border)] bg-[var(--bg-elevated)]">
        <div className="container-wide">
          <div className="mb-10 grid gap-4 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)]">
            <div>
              <span className="label-accent">Retainers</span>
              <h2 className="mt-4 text-4xl md:text-6xl font-serif tracking-tighter">
                The highest-leverage offer for teams that need content every month.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] md:justify-self-end">
              Retainers usually create the strongest revenue and the strongest client outcomes because
              one relationship powers multiple deliverables over time instead of restarting from zero every project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STUDIOS.retainerTiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.08, duration: 0.55 }}
                className={`rounded-2xl border p-8 md:p-10 transition-colors ${
                  tier.featured
                    ? "border-[var(--accent)]/40 bg-[var(--accent-soft)]"
                    : "border-[var(--border)] bg-[var(--bg-card)]"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-2xl font-serif">{tier.name}</h3>
                  {tier.featured && (
                    <span className="rounded-full border border-[var(--accent)]/40 px-3 py-1 text-[10px] font-sans font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                      Best value
                    </span>
                  )}
                </div>
                <p className="mt-3 text-3xl font-serif text-[var(--accent)]">{tier.price}</p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{tier.summary}</p>
                <ul className="mt-6 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button href="/contact" variant={tier.featured ? "primary" : "outline"} className="w-full">
                    Ask about {tier.name.toLowerCase()}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SELECTED WORK ═══════ */}
      <section className="py-[var(--section-padding)] bg-[var(--bg-elevated)] border-y border-[var(--border)]">
        <div className="container-wide">
          <span className="label-accent">Selected work</span>
          <h2 className="mt-4 text-4xl md:text-6xl font-serif tracking-tighter mb-16">
            Work designed for launch, trust, and follow-through.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HOME.selectedWork.map((work, i) => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.08, duration: 0.55 }}
                className="editorial-card group relative aspect-[3/4] overflow-hidden"
              >
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  className="object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="label text-[var(--accent)]">{work.category} · {work.year}</span>
                  <h3 className="mt-1 text-lg font-serif text-white">{work.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PROCESS ═══════ */}
      <section className="py-[var(--section-padding)]">
        <div className="container-wide">
          <span className="label-accent">Process</span>
          <h2 className="mt-4 text-4xl md:text-6xl font-serif tracking-tighter mb-16">
            How a project moves from brief to delivery.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {STUDIOS.process.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="group relative"
              >
                <span className="text-5xl font-serif text-[var(--accent)] opacity-30 transition-opacity duration-300 group-hover:opacity-60">{step.step}</span>
                {i < STUDIOS.process.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-[calc(100%_-_1rem)] w-[calc(100%_-_2rem)] h-px bg-gradient-to-r from-[var(--border)] to-transparent" />
                )}
                <h3 className="mt-2 text-xl font-serif group-hover:text-[var(--accent)] transition-colors duration-300">{step.title}</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PACKAGES ═══════ */}
      <section className="py-[var(--section-padding)] bg-[var(--bg-elevated)] border-t border-[var(--border)]">
        <div className="container-wide">
          <span className="label-accent">Packages</span>
          <h2 className="mt-4 text-4xl md:text-6xl font-serif tracking-tighter mb-16">
            Common ways clients engage.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STUDIOS.packages.map((pkg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55 }}
                className="editorial-card glow-border group p-8 md:p-10"
              >
                <h3 className="text-xl font-serif">{pkg.title}</h3>
                <p className="mt-2 text-3xl font-serif text-[var(--accent)]">{pkg.price}</p>
                <div className="divider-glow my-6" />
                <ul className="space-y-3">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button href="/contact" variant="outline" className="w-full">
                    Ask about this package
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[var(--section-padding)] border-t border-[var(--border)]">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1fr)] gap-10">
          <div>
            <span className="label-accent">Extensions</span>
            <h2 className="mt-4 text-4xl md:text-6xl font-serif tracking-tighter">
              Add depth without rebuilding the whole production.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--text-secondary)]">
              These add-ons make the final body of work more flexible, whether that means extra
              cutdowns, portrait coverage, faster delivery, or web-ready exports after the main
              film is complete.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STUDIOS.upsells.map((item) => (
              <div key={item} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
                <p className="text-sm font-medium text-white">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-[var(--section-padding)] border-t border-[var(--border)]">
        <div className="container-narrow text-center">
          <h2 className="text-5xl md:text-7xl font-serif tracking-tighter leading-[0.9]">
            Let&apos;s shape<br />
            <span className="italic text-gradient">the right form for the story.</span>
          </h2>
          <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-md mx-auto">
            Tell us the timeline, what the work needs to hold, and how you want people to feel
            after they see it. We&apos;ll help shape the scope from there.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/contact" variant="primary" size="lg">
              Get a custom scope
            </Button>
            <Button href="/contact" variant="outline" size="lg">
              Request planning guide
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
