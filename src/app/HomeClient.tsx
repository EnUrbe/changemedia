"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AnimatedCounter from "@/components/AnimatedCounter";
import Button from "@/components/Button";
import type { SiteContent } from "@/lib/contentSchema";
import { FAQS, FIELD_NOTES, HOME, SITE } from "@/lib/data";

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.08, duration: 0.72, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const EXPERTISE = [
  {
    id: "01",
    title: "Message and narrative",
    description:
      "We help define what the audience needs to understand, what they need to feel, and which assets will actually move the project forward.",
    items: ["Creative direction", "Messaging support", "Shot planning"],
  },
  {
    id: "02",
    title: "Production and direction",
    description:
      "Lean crews, calm direction, lighting, audio, and a production rhythm designed for busy teams, real locations, and non-professional talent.",
    items: ["Field production", "Portrait direction", "Event capture"],
  },
  {
    id: "03",
    title: "Edits that stay useful",
    description:
      "Hero films, social cutdowns, selects, and usage-ready exports delivered for launch week, donor decks, websites, and everything after.",
    items: ["Post-production", "Color + sound", "Campaign assets"],
  },
] as const;

const PRINCIPLES = [
  "Built for nonprofits, founders, schools, and mission-driven brands.",
  "One shoot can support your website, campaign, deck, social, and press assets.",
  "Fast turnarounds without losing taste, rigor, or human presence.",
] as const;

const HERO_FRAMES = [
  {
    title: HOME.selectedWork[0].title,
    label: HOME.selectedWork[0].category,
    image: HOME.selectedWork[0].image,
    className: "row-span-2 min-h-[340px]",
  },
  {
    title: HOME.practices[0].title,
    label: "Studio",
    image: HOME.practices[0].image,
    className: "min-h-[160px]",
  },
  {
    title: HOME.practices[1].title,
    label: "Portraits",
    image: HOME.practices[1].image,
    className: "min-h-[160px]",
  },
];

type HomeClientProps = {
  content: SiteContent;
};

export default function HomeClient({ content }: HomeClientProps) {
  const heroRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const [denverTime, setDenverTime] = useState("--:--");
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const { scrollYProgress: storyProgress } = useScroll({
    target: storyRef,
    offset: ["start start", "end end"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

  const featuredCases =
    content.featuredCases.length > 0
      ? content.featuredCases
      : HOME.selectedWork.map((work) => ({
          id: work.id,
          title: work.title,
          subtitle: `${work.category} / ${work.year}`,
          imageUrl: work.image,
          tags: [work.category, work.year],
        }));

  const galleryCases =
    content.galleryCases.length > 0
      ? content.galleryCases
      : HOME.selectedWork.map((work) => ({
          id: work.id,
          title: work.title,
          subtitle: `${work.category} / ${work.year}`,
          imageUrl: work.image,
          tags: [work.category, work.year],
        }));

  const testimonialCards =
    content.testimonials.length > 0
      ? content.testimonials
      : HOME.testimonials.map((item, index) => ({
          id: String(index),
          name: item.name,
          role: item.role,
          quote: item.quote,
          avatar: "",
        }));

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Denver",
    });

    const updateTime = () => setDenverTime(formatter.format(new Date()));
    updateTime();

    const interval = window.setInterval(updateTime, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  useMotionValueEvent(storyProgress, "change", (latest) => {
    const nextIndex = Math.min(
      featuredCases.length - 1,
      Math.max(0, Math.floor(latest * featuredCases.length))
    );
    setActiveStoryIndex(nextIndex);
  });

  return (
    <div className="min-h-screen bg-[var(--bg)] text-white atmosphere editorial-shell">
      <Nav />

      {/* ═══════ HERO ═══════ */}
      <section
        ref={heroRef}
        className="relative overflow-hidden border-b border-[var(--border)]"
      >
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 editorial-grid opacity-60"
          style={{ y: heroY, opacity: heroOpacity }}
        />
        <div className="absolute right-[8%] top-28 h-64 w-64 rounded-full bg-[var(--accent)]/14 blur-[140px] float" />
        <div className="absolute left-[-4rem] top-1/3 h-52 w-52 rounded-full bg-white/5 blur-[160px]" />

        <motion.div style={{ scale: heroScale }} className="container-wide relative z-10 pt-28 pb-14 md:pt-36 md:pb-24">
          <div className="grid gap-12 xl:grid-cols-[minmax(0,1.2fr)_420px] xl:items-end">
            <div className="max-w-5xl">
              <motion.h1
                initial="hidden"
                animate="visible"
                custom={2}
                variants={fadeUp}
                className="mt-8 max-w-5xl text-[clamp(4rem,11vw,8.8rem)] leading-[0.84] headline-kern text-balance text-shimmer"
              >
                Story-led films and portraits that make people stop, feel, and remember.
              </motion.h1>

              <motion.p
                initial="hidden"
                animate="visible"
                custom={3}
                variants={fadeUp}
                className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] md:text-xl"
              >
                CHANGE Media helps nonprofits, founders, schools, and mission-driven teams show
                up clearly with documentary storytelling, executive portraits, event coverage, and
                launch-ready visual assets shaped with an editorial eye and a documentary spine.
              </motion.p>

              <motion.div
                initial="hidden"
                animate="visible"
                custom={4}
                variants={fadeUp}
                className="mt-9 flex flex-wrap gap-4"
              >
                <Button href={HOME.hero.ctas[0].href} variant="primary" size="lg">
                  {HOME.hero.ctas[0].label}
                </Button>
                <Button href={SITE.calendlyUrl} variant="outline" size="lg">
                  Talk through a project
                </Button>
              </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                custom={5}
                variants={fadeUp}
                className="mt-12 grid gap-4 md:grid-cols-3"
              >
                {PRINCIPLES.map((principle) => (
                  <div key={principle} className="editorial-card glow-border p-5 md:p-6">
                    <span className="label-accent">Approach</span>
                    <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] md:text-[0.95rem]">
                      {principle}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.aside
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-4 xl:pb-2"
            >
              <div className="editorial-card glow-border p-6 md:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="label-accent">Current timezone</p>
                    <p className="mt-3 text-4xl font-serif tracking-tight tabular-nums">{denverTime}</p>
                  </div>
                  <span className="eyebrow-pill">GMT-6 / Denver</span>
                </div>
                <div className="divider-glow mt-6 mb-6" />
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  Based in {SITE.city}. Available for campaign films, team portraits, event
                  coverage, and ongoing content partnerships across Colorado and beyond.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {(content.featuredCases.length > 0
                  ? content.featuredCases.slice(0, 3).map((item, index) => ({
                      title: item.title,
                      label: item.subtitle,
                      image: item.imageUrl,
                      className: index === 0 ? "row-span-2 min-h-[340px]" : "min-h-[160px]",
                    }))
                  : HERO_FRAMES
                ).map((frame, index) => (
                  <motion.div
                    key={frame.title}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                    className={`editorial-card group relative overflow-hidden ${frame.className}`}
                  >
                    <Image
                      src={frame.image}
                      alt={frame.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 420px"
                      className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="label-accent">{frame.label}</p>
                      <p className="mt-2 text-lg leading-tight text-white">{frame.title}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.aside>
          </div>
        </motion.div>
      </section>

      {/* ═══════ METRICS MARQUEE ═══════ */}
      <section className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
        <div className="container-wide overflow-hidden py-5">
          <div className="inline-flex animate-[marquee_24s_linear_infinite] gap-12 whitespace-nowrap pr-12">
            {[...HOME.metrics, ...HOME.metrics, ...HOME.metrics].map((metric, index) => (
              <span
                key={`${metric.label}-${index}`}
                className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)]"
              >
                <span className="dot-pulse" />
                {metric.value} {metric.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={storyRef}
        className="relative border-b border-[var(--border)] bg-[var(--bg)]"
        style={{ minHeight: `${Math.max(featuredCases.length, 3) * 75}vh` }}
      >
        <div className="sticky top-20 min-h-[calc(100vh-5rem)]">
          <div className="container-wide grid min-h-[calc(100vh-5rem)] gap-10 py-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center">
            <div className="max-w-xl">
              <p className="eyebrow">Interactive story deck</p>
              <h2 className="mt-4 text-4xl md:text-6xl">
                The hero can now become a scroll-led story about the work itself.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
                As visitors scroll, the featured projects shift in focus. These cards now pull from
                editable homepage case studies, so you can update the imagery and story direction
                from the admin without touching code.
              </p>

              <div className="mt-10 space-y-4">
                {featuredCases.map((item, index) => {
                  const isActive = index === activeStoryIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveStoryIndex(index)}
                      className={`w-full rounded-[1.5rem] border p-5 text-left transition-all duration-300 ${
                        isActive
                          ? "border-[var(--accent)]/40 bg-[var(--accent-soft)]"
                          : "border-[var(--border)] bg-[var(--bg-card)]/70 hover:border-[var(--border-hover)]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="label-accent">0{index + 1}</p>
                          <h3 className="mt-2 text-2xl">{item.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                            {item.subtitle}
                          </p>
                        </div>
                        <span
                          className={`mt-2 h-2.5 w-2.5 rounded-full ${
                            isActive ? "bg-[var(--accent)]" : "bg-white/15"
                          }`}
                        />
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-sans font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="editorial-card glow-border relative min-h-[520px] overflow-hidden">
                {featuredCases.map((item, index) => (
                  <motion.div
                    key={item.id}
                    animate={{
                      opacity: index === activeStoryIndex ? 1 : 0,
                      scale: index === activeStoryIndex ? 1 : 1.04,
                    }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                    style={{ pointerEvents: index === activeStoryIndex ? "auto" : "none" }}
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/22 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                      <p className="label-accent">{item.subtitle}</p>
                      <h3 className="mt-3 max-w-2xl text-3xl md:text-5xl">{item.title}</h3>
                      {item.tags.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-white/15 px-3 py-1 text-[10px] font-sans font-semibold uppercase tracking-[0.14em] text-white/85"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-3">
                {featuredCases.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`View ${item.title}`}
                    onClick={() => setActiveStoryIndex(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === activeStoryIndex ? "w-14 bg-[var(--accent)]" : "w-8 bg-white/12"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ SELECTED WORK ═══════ */}
      <section className="py-[var(--section-padding)]">
        <div className="container-wide">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">Selected work</p>
              <h2 className="mt-4 text-4xl md:text-6xl">
                Work built to clarify the message and raise the standard.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
              Every project is scoped around what the client needs to explain, launch, or earn,
              then delivered as a set of assets their team can keep using.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
            <motion.article
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="editorial-card group relative min-h-[540px] overflow-hidden"
            >
              <Image
                src={galleryCases[0].imageUrl}
                alt={galleryCases[0].title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/28 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="eyebrow-pill">Featured case study</span>
                  <span className="label text-white/75">{galleryCases[0].subtitle}</span>
                </div>
                <div className="max-w-xl">
                  <p className="label-accent">{galleryCases[0].tags?.[0] ?? "Case study"}</p>
                  <h3 className="mt-3 text-3xl md:text-5xl">{galleryCases[0].title}</h3>
                  <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/74 md:text-base">
                    Interview-led storytelling, clean campaign visuals, and rollout-ready cutdowns
                    shaped from one organized production.
                  </p>
                  <div className="mt-6">
                    <Button href="/studios" variant="outline">
                      Explore case studies
                    </Button>
                  </div>
                </div>
              </div>
            </motion.article>

            <div className="grid gap-5">
              {galleryCases.slice(1, 4).map((work, index) => (
                <motion.article
                  key={work.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: index * 0.1, duration: 0.55 }}
                  className="editorial-card group relative min-h-[170px] overflow-hidden"
                >
                  <Image
                    src={work.imageUrl}
                    alt={work.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/15" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="label-accent">
                          {work.subtitle}
                        </p>
                        <h3 className="mt-2 text-xl md:text-2xl">{work.title}</h3>
                      </div>
                      <Link
                        href="/studios"
                        className="label link-underline rounded-full border border-white/15 px-4 py-2 text-white/85 transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ STORY FORMS ═══════ */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-elevated)] py-[var(--section-padding)]">
        <div className="container-wide">
          <div className="mb-10 grid gap-4 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]">
            <div>
              <p className="eyebrow">Ways we work</p>
              <h2 className="mt-4 text-4xl md:text-6xl">
                Different story shapes, one consistent visual language.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] md:justify-self-end">
              Some projects need a campaign film, some need a steady publishing rhythm, and some
              need portraits that carry the same emotional weight as the rest of the brand. These
              are the main ways the practice tends to take shape.
            </p>
          </div>

          <div className="grid gap-5 xl:grid-cols-3">
            {HOME.offers.map((offer, index) => (
              <motion.article
                key={offer.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.08, duration: 0.55 }}
                className="editorial-card glow-border flex h-full flex-col p-6 md:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="label-accent">Story form 0{index + 1}</span>
                  <span className="eyebrow-pill">{offer.price}</span>
                </div>
                <h3 className="mt-8 text-3xl">{offer.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
                  {offer.description}
                </p>
                <div className="divider-glow my-6" />
                <ul className="space-y-3">
                  {offer.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button href={offer.href} variant="outline">
                    Learn more
                  </Button>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-8 editorial-card glow-border flex flex-col gap-6 p-6 md:flex-row md:items-end md:justify-between md:p-8">
            <div className="max-w-2xl">
              <p className="label-accent">Field guide</p>
              <h3 className="mt-3 text-2xl md:text-3xl">Not sure what shape the project should take yet?</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
                Start with the story, the audience, and the moment you are trying to create. We can
                help decide whether that becomes a film, a retainer, a portrait day, or a mix.
              </p>
            </div>
            <Button href="/contact" variant="primary">
              Start the conversation
            </Button>
          </div>
        </div>
      </section>

      {/* ═══════ METRICS + EXPERTISE ═══════ */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-elevated)] py-[var(--section-padding)]">
        <div className="container-wide grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)]">
          <div className="editorial-card glow-border p-7 md:p-9">
            <p className="eyebrow">Metrics & milestones</p>
            <h2 className="mt-4 text-4xl md:text-6xl">
              Creative work is more valuable when the system is reliable.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--text-secondary)]">
              Clients hire us when they need more than a nice-looking final piece. They need a
              process that creates strong visuals, keeps production calm, and delivers assets their
              team can immediately put to work.
            </p>
            <div className="mt-10 space-y-4">
              {EXPERTISE.map((entry) => (
                <div key={entry.id} className="border-t border-[var(--border)] pt-4 group/item">
                  <div className="flex items-start gap-4">
                    <span className="label-accent transition-transform duration-300 group-hover/item:translate-x-1">{entry.id}</span>
                    <div>
                      <p className="text-lg text-white transition-colors duration-300 group-hover/item:text-[var(--accent)]">{entry.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                        {entry.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {HOME.metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="editorial-card glow-border p-6 md:p-7"
              >
                <AnimatedCounter value={metric.value} label={metric.label} />
              </motion.div>
            ))}

            <div className="editorial-card glow-border p-6 md:col-span-2 md:p-7">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="max-w-xl">
                  <p className="label-accent">Performance snapshot</p>
                  <h3 className="mt-3 text-2xl md:text-3xl">
                    One studio, multiple deliverables, no drop in quality.
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
                    Campaign films, portraits, and event coverage all run through the same visual
                    standard, so your website, launch, and team photos feel like they belong to the
                    same brand.
                  </p>
                </div>
                <Button href="/portraits" variant="ghost">
                  See portraits
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ WHAT WE DO ═══════ */}
      <section className="py-[var(--section-padding)]">
        <div className="container-wide">
          <div className="mb-10 grid gap-4 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]">
            <div>
              <p className="eyebrow">What we do</p>
              <h2 className="mt-4 text-4xl md:text-6xl">
                Strategy, production, and delivery aligned from the start.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] md:justify-self-end">
              We are most useful when a client needs help thinking through the message, directing
              the people on camera, and leaving the project with assets that can do more than one
              job.
            </p>
          </div>

          <div className="grid gap-5 xl:grid-cols-3">
            {EXPERTISE.map((entry, index) => (
              <motion.article
                key={entry.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.08, duration: 0.55 }}
                className="editorial-card glow-border flex h-full flex-col p-6 md:p-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="label-accent">{entry.id}</span>
                  <span className="label text-[var(--text-secondary)]">Core service</span>
                </div>
                <h3 className="mt-8 text-3xl">{entry.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
                  {entry.description}
                </p>
                <div className="divider-glow my-6" />
                <ul className="space-y-3">
                  {entry.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center justify-between gap-4 text-sm text-[var(--text-secondary)]"
                    >
                      <span>{item}</span>
                      <span className="text-[var(--accent)] transition-transform duration-300 hover:rotate-90">+</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            {HOME.practices.map((practice, index) => (
              <motion.div
                key={practice.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Link href={practice.href} className="editorial-card group relative block min-h-[420px] overflow-hidden">
                  <Image
                    src={practice.image}
                    alt={practice.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/24 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                    <div className="flex items-center justify-between gap-4">
                      <span className="eyebrow-pill">{practice.label}</span>
                      <span className="label text-white/72">Practice</span>
                    </div>
                    <div className="max-w-lg">
                      <h3 className="text-3xl md:text-5xl">{practice.title}</h3>
                      <p className="mt-4 text-sm leading-relaxed text-white/75 md:text-base">
                        {practice.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[var(--section-padding)] border-y border-[var(--border)] bg-[var(--bg-elevated)]">
        <div className="container-wide">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">Field Notes</p>
              <h2 className="mt-4 text-4xl md:text-6xl">
                Essays, process notes, and ideas behind the work.
              </h2>
            </div>
            <Button href="/field-notes" variant="ghost">
              View all articles
            </Button>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {FIELD_NOTES.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
              >
                <Link href={`/field-notes/${post.slug}`} className="editorial-card glow-border block h-full p-6 md:p-7">
                  <div className="flex items-center gap-3">
                    <span className="label-accent">{post.tag}</span>
                    <span className="label">{post.readTime}</span>
                  </div>
                  <h3 className="mt-6 text-2xl md:text-3xl">{post.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
                    {post.excerpt}
                  </p>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS + FAQ ═══════ */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-elevated)] py-[var(--section-padding)]">
        <div className="container-wide grid gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
          <div>
            <p className="eyebrow">Proof</p>
            <h2 className="mt-4 text-4xl md:text-6xl">Clients come back when the work feels clear and usable.</h2>
            <div className="mt-8 overflow-x-auto hide-scrollbar">
              <div className="flex w-max gap-5 pb-2">
                {testimonialCards.map((testimonial, index) => (
                  <motion.article
                    key={testimonial.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: index * 0.08, duration: 0.45 }}
                    className="editorial-card glow-border w-[320px] p-6 md:w-[360px] md:p-7"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-accent)] bg-[var(--accent-soft)] font-serif text-lg text-[var(--accent)]">
                        {testimonial.name.slice(0, 1)}
                      </div>
                      <div>
                        <p className="text-sm text-white">{testimonial.name}</p>
                        <p className="label">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="mt-6 text-sm leading-relaxed text-[var(--text-secondary)] md:text-base italic">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {FAQS.map((faq) => (
              <details
                key={faq.question}
                className="editorial-card group p-5 md:p-6 open:border-[var(--border-accent)]"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base md:text-lg">
                  <span>{faq.question}</span>
                  <span className="text-[var(--accent)] transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-[var(--section-padding)]">
        <div className="container-wide">
          <div className="editorial-card glow-border relative overflow-hidden p-8 md:p-14">
            <div className="absolute right-[-3rem] top-[-3rem] h-48 w-48 rounded-full border border-white/10 bg-[var(--accent)]/12 blur-[60px] float" />
            <div className="absolute bottom-[-5rem] left-[10%] h-52 w-52 rounded-full bg-white/5 blur-[80px]" />

            <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-end">
              <div>
                <p className="eyebrow">Start a project</p>
                <h2 className="mt-4 max-w-3xl text-5xl md:text-7xl">
                  Build something with the tension and clarity of a real campaign.
                </h2>
              </div>

              <div className="lg:justify-self-end">
                <p className="max-w-xl text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
                  If you have a story to shape, a launch to support, or a body of work that needs a
                  clearer visual language, start with a conversation and we&apos;ll find the right form
                  for it together.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button href={SITE.calendlyUrl} variant="primary" size="lg">
                    Book a discovery call
                  </Button>
                  <Button href="/contact" variant="outline" size="lg">
                    Start a project
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
