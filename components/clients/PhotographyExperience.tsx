"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import SectionNav from "@/components/ui/SectionNav";
import Button from "@/components/ui/Button";
import NavBar from "@/components/ui/NavBar";
import type { PhotographyContent, PortfolioItem } from "@/lib/photographySchema";
import { buildCloudinaryUrl } from "@/lib/cloudinaryDelivery";

const serifFont = "var(--font-family-serif, 'Instrument Serif', Georgia, serif)";

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] as const },
  viewport: { once: true, amount: 0.3 },
};

const practiceNotes = [
  {
    id: "field-crews",
    label: "Field crews",
    title: "Campaign fieldwork",
    description: "Documentary stills units embed with our film team so lighting, pacing, and shot math stay in sync.",
    focus: ["Producer-led run of show", "Shot math parity", "On-set DAM ingest"],
    accent: "#577ef3",
  },
  {
    id: "portrait-atelier",
    label: "Portrait atelier",
    title: "Executive sessions",
    description: "Founder-forward portrait programming that runs out of the Denver atelier with a travel-ready kit.",
    focus: ["Wardrobe & grooming", "Same-day selects", "Retouch rituals"],
    accent: "#f7a36c",
  },
  {
    id: "care-systems",
    label: "Care systems",
    title: "Shared protocols",
    description: "Four rituals hold every engagement so leadership teams always know what happens next.",
    focus: ["Briefing calls", "Usage mapping", "Asset delivery windows"],
    accent: "#9b7bff",
  },
];

const deliveryMoments = [
  {
    id: "atelier-days",
    title: "Portrait atelier days",
    detail: "Wed–Fri holds",
    description: "Executive portrait intensives with grooming, wardrobe pulls, and tethered review.",
  },
  {
    id: "fly-kit",
    title: "Executive fly-kit",
    detail: "48-hour turnaround",
    description: "Travel-ready lighting kit ships with your team and checks in with our producer daily.",
  },
  {
    id: "retainer",
    title: "Retainer runway",
    detail: "90-day sprints",
    description: "Keeps crews aligned with product launches and leadership comms without re-onboarding.",
  },
];

export type PhotographyExperienceProps = {
  content: PhotographyContent;
};

type PortfolioCardProps = {
  item: PortfolioItem;
  index: number;
  spanClass: string;
  imageSrc: string;
};

function resolveImageSrc(item: PortfolioItem, media: PhotographyContent["media"]) {
  if (item.image.src) return item.image.src;
  if (item.image.publicId && media?.cloudinary) {
    const folder = media.cloudinary.folder ? `${media.cloudinary.folder.replace(/\/$/, "")}/` : "";
    return buildCloudinaryUrl({
      cloudName: media.cloudinary.cloudName,
      publicId: `${folder}${item.image.publicId}`,
      transformation: item.image.transformation ?? "c_fill,q_auto,f_auto",
      deliveryType: media.cloudinary.deliveryType ?? "image",
    });
  }
  return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80";
}

function buildSpanClass(item: PortfolioItem, index: number) {
  if (item.layout?.colSpan || item.layout?.rowSpan) {
    const col = item.layout?.colSpan ? `md:col-span-${item.layout.colSpan}` : "md:col-span-4";
    const row = item.layout?.rowSpan ? `row-span-${item.layout.rowSpan}` : "row-span-1";
    return `${col} ${row}`;
  }
  const defaults = [
    { col: "md:col-span-8", row: "row-span-2" },
    { col: "md:col-span-4", row: "row-span-1" },
    { col: "md:col-span-4", row: "row-span-1" },
    { col: "md:col-span-5", row: "row-span-1" },
    { col: "md:col-span-7", row: "row-span-2" },
    { col: "md:col-span-5", row: "row-span-1" },
    { col: "md:col-span-6", row: "row-span-1" },
    { col: "md:col-span-6", row: "row-span-2" },
    { col: "md:col-span-4", row: "row-span-1" },
    { col: "md:col-span-4", row: "row-span-1" },
    { col: "md:col-span-4", row: "row-span-1" },
    { col: "md:col-span-12", row: "row-span-1" },
  ];
  const fallback = defaults[index % defaults.length];
  return `${fallback.col} ${fallback.row}`;
}

function PortfolioCard({ item, index, spanClass, imageSrc }: PortfolioCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.04 }}
      className={`${spanClass} relative overflow-hidden rounded-[32px] border border-white/10 bg-neutral-900 shadow-2xl`}
    >
      <div className="relative h-full w-full">
        <Image src={imageSrc} alt={item.image.alt ?? item.title} fill className="object-cover opacity-80 transition-opacity hover:opacity-100" sizes="(min-width: 768px) 33vw, 100vw" />
        <div className="absolute inset-x-6 bottom-6 rounded-3xl border border-white/10 bg-black/60 p-4 backdrop-blur-md">
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-white/40">{item.category}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white" style={{ fontFamily: serifFont }}>
            {item.title}
          </h3>
          {(item.summary ?? item.image.alt) && <p className="mt-2 text-sm text-white/60">{item.summary ?? item.image.alt}</p>}
        </div>
      </div>
    </motion.article>
  );
}

export function PhotographyExperience({ content }: PhotographyExperienceProps) {
  const { hero, portfolio, services, cta, media } = content;
  const sections = [
    { id: "overview", label: "Overview" },
    { id: "practice", label: "Practice" },
    { id: "portfolio", label: "Work" },
    { id: "services", label: "Stacks" },
    { id: "cta", label: "Contact" },
  ];

  const heroMosaic = portfolio.slice(0, 3);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <div className="relative z-10">
        <NavBar
          links={[
            { href: "/change-studios", label: "Studios" },
            { href: "/why", label: "Why" },
            { href: "/#work", label: "Work" },
            { href: "/photography/portrait", label: "Executive" },
            { href: "/portraits", label: "Portraits" },
          ]}
          cta={{ href: "#cta", label: "Schedule time" }}
          tone="dark"
        />

        <SectionNav sections={sections} variant="dark" />

        <main className="mx-auto max-w-[1400px] space-y-32 px-6 pb-32">
          <section id="overview" className="relative min-h-[90vh] flex flex-col justify-center -mt-24 pt-32 pb-20">
             {/* Hero Background */}
            <div className="absolute inset-0 z-0 -mx-6 w-[calc(100%+3rem)]">
               <Image
                  src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2942&auto=format&fit=crop"
                  alt="Photography Background"
                  fill
                  className="object-cover brightness-[0.4]"
                  priority
               />
               <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#050505]" />
            </div>

            <div className="relative z-10 rounded-[48px] border border-white/10 bg-black/20 p-8 md:p-16 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-wrap items-center gap-4 text-[0.65rem] uppercase tracking-[0.2em] text-white/60">
                <span>{hero.eyebrow}</span>
                <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-white/80">{hero.availability}</span>
              </div>
              <div className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-8">
                  <h1 className="text-5xl leading-[1.1] text-white md:text-7xl lg:text-8xl drop-shadow-lg" style={{ fontFamily: serifFont }}>
                    {hero.title}
                    <br />
                    <span className="text-white/50 italic">
                      {hero.highlight}
                    </span>
                  </h1>
                  <p className="max-w-2xl text-lg text-white/80 md:text-xl leading-relaxed drop-shadow-md">{hero.subtitle}</p>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href={hero.primaryCta.href}
                      className="rounded-full bg-white px-8 py-4 text-sm font-medium text-black transition-all hover:bg-neutral-200 hover:scale-[1.02]"
                    >
                      {hero.primaryCta.label}
                    </a>
                    {hero.secondaryCta && (
                      <a
                        href={hero.secondaryCta.href}
                        className="rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-medium text-white transition-all hover:border-white hover:bg-white/10"
                      >
                        {hero.secondaryCta.label}
                      </a>
                    )}
                  </div>
                </div>
                <div className="rounded-[40px] border border-white/10 bg-black/40 p-8 shadow-inner">
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Field preview</p>
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    {heroMosaic.map((item, mosaicIndex) => {
                      const src = resolveImageSrc(item, media);
                      return (
                        <div
                          key={item.id}
                          className={`relative overflow-hidden rounded-2xl bg-neutral-900 ${mosaicIndex === 0 ? "row-span-2 col-span-2 h-64" : "h-32"}`}
                        >
                          <Image src={src} alt={item.image.alt ?? item.title} fill className="object-cover opacity-80 transition-all hover:opacity-100 hover:scale-105 duration-700" sizes="400px" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <div className="absolute bottom-4 left-4 text-white">
                            <p className="text-[0.6rem] uppercase tracking-[0.2em] text-white/80">{item.category}</p>
                            <p className="text-lg font-medium">{item.title}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="mt-16 grid gap-6 sm:grid-cols-3 border-t border-white/10 pt-12">
                {hero.stats.map((stat) => (
                  <div key={stat.label} className="space-y-2">
                    <div className="text-4xl font-medium text-white" style={{ fontFamily: serifFont }}>{stat.value}</div>
                    <div className="text-[0.6rem] uppercase tracking-[0.2em] text-white/40">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="practice" className="space-y-12">
            <div className="flex flex-col gap-6 text-center md:text-left">
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/50">Practice</p>
              <h2 className="text-5xl text-white md:text-7xl" style={{ fontFamily: serifFont }}>
                Still systems that sit inside Change Studios.
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-white/60 md:mx-0 leading-relaxed">
                Portrait retainers, editorial crews, and field documentation share the same producers, care protocols, and delivery stack. Choose the door, keep the team.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {practiceNotes.map((note, index) => (
                <motion.article
                  key={note.id}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: index * 0.1 }}
                  className="group flex h-full flex-col rounded-[40px] border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/10 hover:shadow-xl hover:shadow-black/20 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.2em] text-white/40">
                    <span>{note.label}</span>
                    <span className="h-2 w-2 rounded-full bg-white opacity-20 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="mt-8 text-3xl text-white" style={{ fontFamily: serifFont }}>
                    {note.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/60">{note.description}</p>
                  <div className="mt-8 flex flex-wrap gap-2 text-xs text-white/40">
                    {note.focus.map((focus) => (
                      <span key={focus} className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                        {focus}
                      </span>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>
            <div className="rounded-[48px] bg-white/5 border border-white/10 p-8 md:p-16 text-white shadow-2xl backdrop-blur-md">
              <div className="grid gap-8 md:grid-cols-3">
                {deliveryMoments.map((moment) => (
                  <div key={moment.id} className="rounded-3xl border border-white/10 bg-black/20 p-8 backdrop-blur-sm">
                    <p className="text-[0.6rem] uppercase tracking-[0.2em] text-white/40">{moment.detail}</p>
                    <h4 className="mt-4 text-3xl font-medium" style={{ fontFamily: serifFont }}>
                      {moment.title}
                    </h4>
                    <p className="mt-4 text-sm text-white/60 leading-relaxed">{moment.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="portfolio" className="space-y-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="space-y-4">
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/50">Work</p>
                <h2 className="text-5xl text-white md:text-7xl" style={{ fontFamily: serifFont }}>
                  Selected field notes & commissions.
                </h2>
                <p className="max-w-2xl text-lg text-white/60">
                  Documentary retainers, portrait commissions, and campaign sprints share the same archive.
                </p>
              </div>
              <Link href="/clients" className="group flex items-center gap-2 text-sm font-medium text-white">
                View client workspaces <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12 auto-rows-[400px]">
              {portfolio.map((item, index) => {
                const spanClass = buildSpanClass(item, index);
                const imageSrc = resolveImageSrc(item, media);
                return <PortfolioCard key={item.id} item={item} index={index} spanClass={spanClass} imageSrc={imageSrc} />;
              })}
            </div>
          </section>

          <section id="services" className="space-y-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="space-y-4">
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/50">Stacks</p>
                <h2 className="text-5xl text-white md:text-7xl" style={{ fontFamily: serifFont }}>
                  Pick the door. Keep the team.
                </h2>
                <p className="max-w-2xl text-lg text-white/60">
                  Documentary crews and the portrait atelier share the same producers, care protocols, and asset systems.
                </p>
              </div>
              <Button href="#cta" size="lg" variant="soft">
                Hold dates with the studio
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: index * 0.1 }}
                  className="flex h-full flex-col rounded-[40px] border border-white/10 bg-white/5 p-10 shadow-sm backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.2em] text-white/40">
                    <span>{service.numeral}</span>
                    <span className="rounded-full border border-white/10 px-3 py-1">{service.price}</span>
                  </div>
                  <h3 className="mt-8 text-4xl text-white" style={{ fontFamily: serifFont }}>
                    {service.title}
                  </h3>
                  <p className="mt-4 text-lg text-white/60">{service.description}</p>
                  <div className="mt-8 text-[0.6rem] uppercase tracking-[0.2em] text-white/40">{service.periodLabel}</div>
                  <div className="my-6 h-px w-full bg-white/10" />
                  <ul className="space-y-4 text-white/80">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/20" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-10">
                    <Button href="#cta" fullWidth variant="ghost" size="lg" className="text-white hover:bg-white/10">
                      {service.buttonLabel}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section id="cta">
            <motion.div
              {...fadeUp}
              className="relative overflow-hidden rounded-[48px] bg-white/5 border border-white/10 p-12 text-center text-white shadow-2xl backdrop-blur-md md:p-24"
            >
              <div className="mx-auto max-w-3xl space-y-8">
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">{cta.eyebrow}</p>
                <h2 className="text-5xl md:text-7xl" style={{ fontFamily: serifFont }}>
                  {cta.headline}
                </h2>
                <p className="text-xl text-white/40 leading-relaxed">{cta.description}</p>
                <div className="flex flex-col gap-4 pt-8 md:flex-row md:justify-center">
                  <Button
                    href={cta.primaryCta.href}
                    size="lg"
                    variant="primary"
                    className="bg-white text-black hover:bg-neutral-200"
                  >
                    {cta.primaryCta.label}
                  </Button>
                  {cta.secondaryCta && (
                    <Button
                      href={cta.secondaryCta.href}
                      size="lg"
                      variant="ghost"
                      className="border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                    >
                      {cta.secondaryCta.label}
                    </Button>
                  )}
                </div>
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
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default PhotographyExperience;
