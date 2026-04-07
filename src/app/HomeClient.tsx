"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
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

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

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

  const primaryHeroCta =
    content.hero.ctas[0] ?? { label: HOME.hero.ctas[0].label, href: HOME.hero.ctas[0].href, variant: "primary" as const };
  const secondaryHeroCta =
    content.hero.ctas[1] ?? { label: "Book discovery call", href: SITE.calendlyUrl, variant: "secondary" as const };

  const heroMetrics =
    content.hero.metrics.length > 0
      ? content.hero.metrics
      : HOME.metrics.map((metric) => ({ value: metric.value, label: metric.label }));

  const faqItems =
    content.faqs.length > 0
      ? content.faqs
      : FAQS.map((faq, index) => ({ id: `faq-${index + 1}`, question: faq.question, answer: faq.answer }));

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
                {content.hero.title}
              </motion.h1>

              <motion.p
                initial="hidden"
                animate="visible"
                custom={3}
                variants={fadeUp}
                className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] md:text-xl"
              >
                {content.hero.subtitle}
              </motion.p>

              <motion.div
                initial="hidden"
                animate="visible"
                custom={4}
                variants={fadeUp}
                className="mt-9 flex flex-wrap gap-4"
              >
                <Button href={primaryHeroCta.href} variant="primary" size="lg">
                  {primaryHeroCta.label}
                </Button>
                <Button href={secondaryHeroCta.href} variant="outline" size="lg">
                  {secondaryHeroCta.label}
                </Button>
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
                    <p className="label-accent">{content.hero.eyebrow}</p>
                    <p className="mt-3 text-2xl font-serif tracking-tight">{content.hero.titleGradient}</p>
                  </div>
                  <span className="eyebrow-pill">Booking</span>
                </div>
                <div className="divider-glow mt-6 mb-6" />
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  {content.hero.locationPill}
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
            {[...heroMetrics, ...heroMetrics, ...heroMetrics].map((metric, index) => (
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
                    <Button href="/change-studios" variant="outline">
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
                        href="/change-studios"
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

      {/* ═══════ WHAT WE DO ═══════ */}
      <section className="py-[var(--section-padding)]">
        <div className="container-wide">
          <div className="mb-16 grid gap-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]">
            <div>
              <p className="eyebrow tracking-widest uppercase">What we do</p>
              <h2 className="mt-6 text-5xl md:text-7xl font-light tracking-tight">
                Strategy, production, and delivery <br className="hidden lg:block"/> aligned from the start.
              </h2>
            </div>
            <div className="max-w-xl md:justify-self-end md:mt-16">
              <p className="text-lg md:text-xl leading-relaxed text-[var(--text-secondary)]">
                We are most useful when a client needs help thinking through the message, directing
                the people on camera, and leaving the project with assets that can do more than one
                job.
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:gap-12 xl:grid-cols-3">
            {EXPERTISE.map((entry, index) => (
              <motion.article
                key={entry.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ delay: index * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="editorial-card glow-border group flex h-full flex-col p-8 md:p-12 transition-all duration-500 hover:border-white/20"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="label-accent transition-transform duration-500 group-hover:-translate-y-1">{entry.id}</span>
                  <span className="label text-[var(--text-dim)] uppercase tracking-wider text-xs">Core service</span>
                </div>
                <h3 className="mt-12 text-3xl font-light tracking-tight">{entry.title}</h3>
                
                <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-500 ease-in-out group-hover:grid-rows-[1fr] group-hover:opacity-100 group-hover:mt-6">
                  <div className="overflow-hidden">
                    <p className="text-sm md:text-base leading-relaxed text-[var(--text-secondary)]">
                      {entry.description}
                    </p>
                  </div>
                </div>

                <div className="divider-glow my-8 transition-opacity duration-500 opacity-30 group-hover:opacity-100" />
                <ul className="space-y-4 flex-1">
                  {entry.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center justify-between gap-4 text-sm tracking-wide text-[var(--text-secondary)] transition-colors duration-300 group-hover:text-white"
                    >
                      <span>{item}</span>
                      <span className="text-[var(--accent)] opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:rotate-90">
                        +
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.article>
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
            {faqItems.map((faq) => (
              <details
                key={faq.id}
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
