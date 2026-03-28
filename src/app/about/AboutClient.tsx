"use client";

import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AnimatedCounter from "@/components/AnimatedCounter";
import Button from "@/components/Button";
import { ABOUT, STUDIOS } from "@/lib/data";

const BEST_FIT = [
  {
    title: "Nonprofits and advocacy teams",
    description: "You need donor, community, board, and campaign-facing assets that feel human and credible.",
  },
  {
    title: "Founders and small teams",
    description: "You need launch visuals, speaking clips, or portraits that raise the level of your public presence quickly.",
  },
  {
    title: "Schools, agencies, and partner orgs",
    description: "You need a calm production partner who can work with real people, real schedules, and multiple stakeholders.",
  },
] as const;

export default function AboutClient() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-white atmosphere">
      <Nav />

      {/* ═══════ HERO ═══════ */}
      <section className="min-h-screen flex items-center pt-20 relative">
        <div className="absolute top-[15%] right-[5%] h-80 w-80 rounded-full bg-[var(--accent)]/8 blur-[200px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[-5%] h-60 w-60 rounded-full bg-white/4 blur-[160px] pointer-events-none" />

        <div className="container-wide relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="label-accent">About the practice</span>
            <h1 className="mt-6 text-[clamp(2.5rem,6vw,5rem)] font-serif leading-[0.9] tracking-tighter whitespace-pre-line max-w-4xl text-shimmer">
              {ABOUT.headline}
            </h1>
            <p className="mt-8 text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              {ABOUT.intro}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════ STATS ═══════ */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-elevated)]">
        <div className="container-wide py-12 md:py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {ABOUT.stats.map((s) => (
            <AnimatedCounter key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </section>

      {/* ═══════ BEST FIT ═══════ */}
      <section className="py-[var(--section-padding)] border-b border-[var(--border)]">
        <div className="container-wide">
          <span className="label-accent">Best fit</span>
          <h2 className="mt-4 text-4xl md:text-6xl font-serif tracking-tighter mb-12">
            We do our best work with teams that need clarity, not content for content&apos;s sake.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BEST_FIT.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="editorial-card glow-border group p-8"
              >
                <span className="label-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-2xl font-serif tracking-tight group-hover:text-[var(--accent)] transition-colors duration-300">{item.title}</h3>
                <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ VALUES ═══════ */}
      <section className="py-[var(--section-padding)]">
        <div className="container-wide">
          <span className="label-accent">Values</span>
          <h2 className="mt-4 text-4xl md:text-6xl font-serif tracking-tighter mb-16">
            Why clients trust the process.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ABOUT.values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="editorial-card glow-border group p-8 md:p-10"
              >
                <span className="label-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-2xl font-serif tracking-tight group-hover:text-[var(--accent)] transition-colors duration-300">{v.title}</h3>
                <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">
                  {v.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PROCESS ═══════ */}
      <section className="py-[var(--section-padding)] bg-[var(--bg-elevated)] border-y border-[var(--border)]">
        <div className="container-wide">
          <span className="label-accent">Methodology</span>
          <h2 className="mt-4 text-4xl md:text-6xl font-serif tracking-tighter mb-16">
            How we keep projects focused.
          </h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--accent)]/40 via-[var(--border)] to-transparent" />

            <div className="space-y-12">
              {STUDIOS.process.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="md:pl-20 relative group"
                >
                  {/* Timeline dot */}
                  <div className="hidden md:flex absolute left-[18px] top-2 w-5 h-5 rounded-full border-2 border-[var(--accent)] bg-[var(--bg)] items-center justify-center transition-all duration-300 group-hover:bg-[var(--accent)]/20 group-hover:shadow-[0_0_12px_rgba(215,185,138,0.3)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <span className="text-4xl font-serif text-[var(--accent)] opacity-40 group-hover:opacity-70 transition-opacity duration-300">{step.step}</span>
                  <h3 className="mt-1 text-2xl font-serif group-hover:text-[var(--accent)] transition-colors duration-300">{step.title}</h3>
                  <p className="mt-2 text-[var(--text-secondary)] max-w-lg leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ EQUIPMENT ═══════ */}
      <section className="py-[var(--section-padding)] border-b border-[var(--border)]">
        <div className="container-narrow text-center">
          <span className="label-accent">Our kit</span>
          <p className="mt-6 text-lg text-[var(--text-secondary)] leading-relaxed">
            {ABOUT.equipment}
          </p>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-[var(--section-padding)] bg-[var(--bg-elevated)]">
        <div className="container-narrow text-center relative">
          <div className="absolute top-[-4rem] left-1/2 -translate-x-1/2 h-40 w-80 rounded-full bg-[var(--accent)]/8 blur-[100px] pointer-events-none" />
          <h2 className="relative text-5xl md:text-7xl font-serif tracking-tighter leading-[0.9]">
            Let&apos;s make<br />
            <span className="italic text-gradient">something people can believe.</span>
          </h2>
          <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-md mx-auto">
            If your team needs a stronger visual presence, a clearer story, or assets that can support a real launch, let&apos;s talk through the brief.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/contact" variant="primary" size="lg">
              Start a project
            </Button>
            <Button href="/studios" variant="outline" size="lg">
              See our work
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
