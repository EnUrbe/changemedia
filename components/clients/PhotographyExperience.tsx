"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { PhotographyContent, PortfolioItem } from "@/lib/photographySchema";
import { buildCloudinaryUrl } from "@/lib/cloudinaryDelivery";

const serifFont = "var(--font-family-serif, 'Instrument Serif', Georgia, serif)";

export type PhotographyExperienceProps = {
  content: PhotographyContent;
};

type CursorVariant = "default" | "hover";

type PortfolioCardProps = {
  item: PortfolioItem;
  index: number;
  spanClass: string;
  imageSrc: string;
  onCursorChange?: (variant: CursorVariant) => void;
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

function PortfolioCard({ item, index, spanClass, imageSrc, onCursorChange }: PortfolioCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 10%"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ["5%", "-10%"]);
  const parallaxScale = useTransform(scrollYProgress, [0, 1], [0.98, 1.03]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.04 }}
      className={`${spanClass} group relative overflow-hidden rounded-[32px] cursor-pointer border border-neutral-200/60 bg-white shadow-[0_30px_60px_rgba(15,23,42,0.08)]`}
      onMouseEnter={() => onCursorChange?.("hover")}
      onMouseLeave={() => onCursorChange?.("default")}
    >
      <motion.div
        style={{ y: parallaxY, scale: parallaxScale }}
        className="relative w-full h-full"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
      >
        <Image src={imageSrc} alt={item.image.alt ?? item.title} fill className="object-cover" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 via-neutral-900/10 to-transparent flex flex-col justify-end p-10 text-white"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <span className="text-sm text-white/70 uppercase tracking-[0.4em] mb-2 block">
            {item.category}
          </span>
          <h3 className="text-3xl font-semibold mb-3" style={{ fontFamily: serifFont }}>
            {item.title}
          </h3>
          {(item.summary ?? item.image.alt) && (
            <p className="text-sm text-white/70 mb-3 max-w-sm">
              {item.summary ?? item.image.alt}
            </p>
          )}
          <div className="flex items-center gap-2 text-sm text-white/80">
            <span>View project</span>
            <motion.span initial={{ x: 0 }} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
              →
            </motion.span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}
    >
      <div
        className="max-w-[1200px] mx-auto px-8 py-4 flex items-center justify-between rounded-full border border-neutral-200/70 bg-white/80 backdrop-blur-3xl shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
        style={{ transform: scrolled ? "scale(0.98)" : "scale(1)" }}
      >
        <Link href="/" className="text-lg font-semibold tracking-[0.3em] text-neutral-900">
          CHANGE<span className="text-[#577ef3] font-normal">®</span>
        </Link>
        <div className="hidden md:flex items-center gap-10 text-sm font-medium text-neutral-500">
          <Link href="/change-studios" className="hover:text-neutral-900 transition-colors relative group">
            Studios
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-neutral-900 transition-all group-hover:w-full" />
          </Link>
          <Link href="/why" className="hover:text-neutral-900 transition-colors relative group">
            Why
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-neutral-900 transition-all group-hover:w-full" />
          </Link>
          <Link href="/#work" className="hover:text-neutral-900 transition-colors relative group">
            Work
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-neutral-900 transition-all group-hover:w-full" />
          </Link>
        </div>
        <Link href="/photography/portrait">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 rounded-full bg-neutral-900 text-white text-sm font-semibold shadow-[0_12px_30px_rgba(15,23,42,0.15)]"
          >
            Book portrait
          </motion.button>
        </Link>
      </div>
    </motion.nav>
  );
}

export function PhotographyExperience({ content }: PhotographyExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { hero, portfolio, services, cta, media } = content;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const heroY = useTransform(smoothProgress, [0, 0.5], [0, -300]);
  const heroScale = useTransform(smoothProgress, [0, 0.3], [1, 1.15]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.4], [1, 0]);
  const textY = useTransform(smoothProgress, [0, 0.3], [0, -100]);

  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState<CursorVariant>("default");

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  const cursorVariants = {
    default: { x: cursorPos.x - 16, y: cursorPos.y - 16, scale: 1 },
    hover: { x: cursorPos.x - 40, y: cursorPos.y - 40, scale: 2, mixBlendMode: "difference" as const },
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#f6f3ed] text-neutral-900 overflow-x-hidden">
      <motion.div
        variants={cursorVariants}
        animate={cursorVariant}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
        className="fixed w-8 h-8 border border-neutral-900/30 bg-white/40 rounded-full pointer-events-none z-[100] hidden md:block shadow-[0_10px_40px_rgba(15,23,42,0.12)]"
      />

      <FloatingNav />

      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY, scale: heroScale, opacity: heroOpacity }} className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1920&q=80"
            alt="Photography hero"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20" />
        </motion.div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ y: [0, -30, 0], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>

        <motion.div style={{ y: textY }} className="relative z-10 max-w-6xl mx-auto px-6 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mb-8">
            <span className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-purple-400/30 bg-purple-400/5 backdrop-blur-xl text-sm">
              <motion.span
                className="w-2 h-2 rounded-full bg-purple-400"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {hero.eyebrow} • {hero.availability}
            </span>
          </motion.div>

          <div className="mb-10 overflow-hidden">
            <motion.h1
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.33, 1, 0.68, 1], delay: 0.3 }}
              className="text-8xl md:text-[12rem] font-bold leading-[0.85] tracking-tighter"
            >
              <span className="block">{hero.title}</span>
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                {hero.highlight}
              </span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-xl md:text-3xl text-neutral-300 font-light max-w-3xl mx-auto mb-14 leading-relaxed"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex items-center justify-center gap-5"
          >
            <motion.a
              href={hero.primaryCta.href}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-10 py-5 rounded-full bg-white text-black font-medium text-lg overflow-hidden"
            >
              <span className="relative z-10">{hero.primaryCta.label}</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
            {hero.secondaryCta && (
              <motion.a
                href={hero.secondaryCta.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 rounded-full border border-white/30 hover:border-white/60 font-medium text-lg backdrop-blur-sm hover:bg-white/5 transition-all"
              >
                {hero.secondaryCta.label}
              </motion.a>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-24 grid grid-cols-3 gap-12 max-w-3xl mx-auto"
          >
            {hero.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <motion.div animate={{ y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="flex flex-col items-center">
            <span className="text-xs uppercase tracking-widest text-neutral-500 mb-3">Scroll to explore</span>
            <div className="w-px h-16 bg-gradient-to-b from-purple-400/50 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      <section id="portfolio" className="relative py-32 px-6 bg-white/80">
        <div className="max-w-[1800px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20 text-center"
          >
            <h2 className="text-5xl md:text-7xl font-semibold tracking-tight mb-4 text-neutral-900" style={{ fontFamily: serifFont }}>
              Selected works & trusted partners
            </h2>
            <p className="text-neutral-600 text-xl font-light max-w-3xl mx-auto">
              A considered curation of the campaigns, founders, and cultural moments we steward.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[400px]">
            {portfolio.map((item, index) => {
              const spanClass = buildSpanClass(item, index);
              const imageSrc = resolveImageSrc(item, media);
              return (
                <PortfolioCard
                  key={item.id}
                  item={item}
                  index={index}
                  spanClass={spanClass}
                  imageSrc={imageSrc}
                  onCursorChange={(variant) => setCursorVariant(variant)}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section id="services" className="relative py-32 border-y border-neutral-200 bg-[#f1ede4]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-24 max-w-4xl">
            <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">Offerings</p>
            <h2 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6" style={{ fontFamily: serifFont }}>
              Tailored commissions for discerning teams
            </h2>
            <p className="text-xl text-neutral-600 font-light leading-relaxed">
              Retainer-style partnerships, on-call editorials, and founder-forward portrait systems engineered for high-touch production schedules.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div key={service.id} initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.8 }} whileHover={{ y: -10 }} className="group relative">
                <div
                  className="relative p-12 rounded-[36px] border backdrop-blur-xl transition-all duration-500 h-full shadow-[0_25px_80px_rgba(15,23,42,0.06)] bg-white/60"
                  style={{ borderColor: service.border, backgroundImage: service.surface }}
                >
                  <div className="mb-8">
                    <div className="text-7xl font-semibold text-neutral-300 group-hover:text-neutral-500 transition-colors mb-6" style={{ fontFamily: serifFont }}>
                      {service.numeral}
                    </div>
                    <h3 className="text-3xl font-semibold mb-4">{service.title}</h3>
                    <p className="text-neutral-600 text-base font-light leading-relaxed">{service.description}</p>
                  </div>

                  <div className="mb-10">
                    <div className="text-xs text-neutral-500 uppercase tracking-[0.4em] mb-2">{service.periodLabel}</div>
                    <div className="text-4xl font-semibold text-neutral-900">{service.price}</div>
                  </div>

                  <ul className="space-y-3 mb-12">
                    {service.features.map((feature, j) => (
                      <motion.li
                        key={`${service.id}-${feature}`}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15 + j * 0.05 }}
                        className="flex items-center gap-3 text-neutral-600"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-full border border-neutral-900/10 font-medium text-sm tracking-[0.2em] uppercase text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300"
                  >
                    {service.buttonLabel}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-32">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-20 rounded-[48px] border border-neutral-200 bg-white shadow-[0_40px_120px_rgba(15,23,42,0.08)] overflow-hidden"
          >
            <div className="absolute inset-x-16 inset-y-12 rounded-[40px] bg-gradient-to-br from-[#f8f1df] via-transparent to-[#e0d6ff] opacity-70 blur-3xl" />
            <div className="relative z-10">
              <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-xs uppercase tracking-[0.6em] text-neutral-500 mb-6">
                {cta.eyebrow}
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-5xl md:text-7xl font-semibold tracking-tight mb-8 leading-tight"
                style={{ fontFamily: serifFont }}
              >
                {cta.headline}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-xl text-neutral-600 font-light mb-12 max-w-2xl mx-auto"
              >
                {cta.description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-col md:flex-row items-center justify-center gap-4"
              >
                <a href={cta.primaryCta.href} className="px-12 py-5 rounded-full bg-neutral-900 text-white text-base font-semibold tracking-[0.3em] uppercase">
                  {cta.primaryCta.label}
                </a>
                {cta.secondaryCta && (
                  <a
                    href={cta.secondaryCta.href}
                    className="px-12 py-5 rounded-full border border-neutral-300 text-base font-semibold tracking-[0.3em] uppercase text-neutral-700 hover:border-neutral-900 hover:text-neutral-900"
                  >
                    {cta.secondaryCta.label}
                  </a>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-neutral-200 bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-neutral-600">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-neutral-900">
                CHANGE<span className="text-[#577ef3]">®</span>
              </h3>
              <p className="text-sm">Photography & visual storytelling</p>
            </div>
            <div>
              <h4 className="text-sm font-medium uppercase tracking-wider mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/photography" className="hover:text-neutral-900 transition">
                    Brand Photography
                  </Link>
                </li>
                <li>
                  <Link href="/photography" className="hover:text-neutral-900 transition">
                    Editorial
                  </Link>
                </li>
                <li>
                  <Link href="/photography/portrait" className="hover:text-neutral-900 transition">
                    Portrait Experience
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/change-studios" className="hover:text-neutral-900 transition">
                    Studios
                  </Link>
                </li>
                <li>
                  <Link href="/why" className="hover:text-neutral-900 transition">
                    Why
                  </Link>
                </li>
                <li>
                  <Link href="/#work" className="hover:text-neutral-900 transition">
                    Work
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium uppercase tracking-wider mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-neutral-900 transition">
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-neutral-900 transition">
                    Email
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-neutral-900 transition">
                    LinkedIn
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div>© 2025 CHANGE Media • Photography by EnUrbe</div>
            <div className="flex items-center gap-8">
              <Link href="/privacy" className="hover:text-neutral-900 transition">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-neutral-900 transition">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-neutral-900 transition">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PhotographyExperience;
