'use client';

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";

type CursorVariant = "default" | "hover";

type PhotoItem = {
  src: string;
  title: string;
  cat: string;
};

type PortfolioCardProps = {
  photo: PhotoItem;
  index: number;
  spanClass: string;
  onCursorChange?: (variant: CursorVariant) => void;
};

function PortfolioCard({ photo, index, spanClass, onCursorChange }: PortfolioCardProps) {
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
      className={`${spanClass} group relative overflow-hidden rounded-3xl cursor-pointer`}
      onMouseEnter={() => onCursorChange?.("hover")}
      onMouseLeave={() => onCursorChange?.("default")}
    >
      <motion.div
        style={{ y: parallaxY, scale: parallaxScale }}
        className="relative w-full h-full"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
      >
        <Image src={photo.src} alt={photo.title} fill className="object-cover" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-10"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <span className="text-sm text-purple-400 uppercase tracking-wider mb-2 block">
            {photo.cat}
          </span>
          <h3 className="text-3xl font-bold mb-3">{photo.title}</h3>
          <div className="flex items-center gap-2 text-sm text-neutral-300">
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
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-4' : 'py-6'
      }`}
    >
      <div className="max-w-[95%] mx-auto px-8 py-4 flex items-center justify-between rounded-full border border-white/10 backdrop-blur-2xl"
        style={{
          background: scrolled 
            ? 'rgba(10, 10, 10, 0.8)' 
            : 'rgba(10, 10, 10, 0.3)'
        }}
      >
        <Link href="/" className="text-lg font-light tracking-widest hover:text-purple-400 transition-colors">
          CHANGE<span className="text-purple-400 font-normal">®</span>
        </Link>
        <div className="hidden md:flex items-center gap-12 text-sm font-light">
          <Link href="/change-studios" className="hover:text-purple-400 transition-colors relative group">
            Studios
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-purple-400 transition-all group-hover:w-full" />
          </Link>
          <Link href="/why" className="hover:text-purple-400 transition-colors relative group">
            Why
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-purple-400 transition-all group-hover:w-full" />
          </Link>
          <Link href="/#work" className="hover:text-purple-400 transition-colors relative group">
            Work
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-purple-400 transition-all group-hover:w-full" />
          </Link>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-sm font-medium relative overflow-hidden group"
        >
          <span className="relative z-10">Book shoot</span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500"
            initial={{ x: "100%" }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </div>
    </motion.nav>
  );
}

export default function PhotographyPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const heroY = useTransform(smoothProgress, [0, 0.5], [0, -300]);
  const heroScale = useTransform(smoothProgress, [0, 0.3], [1, 1.15]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.4], [1, 0]);
  const textY = useTransform(smoothProgress, [0, 0.3], [0, -100]);

  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  const photos: PhotoItem[] = [
    { src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80", title: "Brand Campaign 2024", cat: "Commercial" },
    { src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80", title: "Portrait Series", cat: "Editorial" },
    { src: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80", title: "Product Launch", cat: "Commercial" },
    { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", title: "Lifestyle Campaign", cat: "Editorial" },
    { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80", title: "Fashion Editorial", cat: "Fashion" },
    { src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80", title: "Corporate Portraits", cat: "Corporate" },
    { src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80", title: "Creative Campaign", cat: "Commercial" },
    { src: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80", title: "Environmental", cat: "Editorial" },
    { src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80", title: "Studio Session", cat: "Fashion" },
    { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", title: "Executive Portraits", cat: "Corporate" },
    { src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80", title: "Beauty Campaign", cat: "Fashion" },
    { src: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80", title: "Tech Startup", cat: "Corporate" },
  ];

  const cursorVariants = {
    default: {
      x: cursorPos.x - 16,
      y: cursorPos.y - 16,
      scale: 1,
    },
    hover: {
      x: cursorPos.x - 40,
      y: cursorPos.y - 40,
      scale: 2,
      mixBlendMode: "difference" as const,
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Custom cursor */}
      <motion.div
        variants={cursorVariants}
        animate={cursorVariant}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
        className="fixed w-8 h-8 border border-purple-400/50 rounded-full pointer-events-none z-[100] hidden md:block"
      />

      <FloatingNav />

      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background image with parallax */}
        <motion.div 
          style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1920&q=80"
            alt="Photography hero"
            fill
            priority
            className="object-cover"
          />
          {/* Multiple gradient overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20" />
        </motion.div>

        {/* Floating elements in background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Hero content */}
        <motion.div 
          style={{ y: textY }}
          className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-purple-400/30 bg-purple-400/5 backdrop-blur-xl text-sm">
              <motion.span 
                className="w-2 h-2 rounded-full bg-purple-400"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              Available for commissions • Denver & Worldwide
            </span>
          </motion.div>

          {/* Main title with staggered animation */}
          <div className="mb-10 overflow-hidden">
            <motion.h1
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.33, 1, 0.68, 1], delay: 0.3 }}
              className="text-8xl md:text-[12rem] font-bold leading-[0.85] tracking-tighter"
            >
              <span className="block">Photography</span>
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                That Moves
              </span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-xl md:text-3xl text-neutral-300 font-light max-w-3xl mx-auto mb-14 leading-relaxed"
          >
            Crafting visual narratives for brands, campaigns, and stories that refuse to be ignored
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex items-center justify-center gap-5"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-10 py-5 rounded-full bg-white text-black font-medium text-lg overflow-hidden"
            >
              <span className="relative z-10">Explore work</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 rounded-full border border-white/30 hover:border-white/60 font-medium text-lg backdrop-blur-sm hover:bg-white/5 transition-all"
            >
              Let&apos;s talk
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-24 grid grid-cols-3 gap-12 max-w-3xl mx-auto"
          >
            {[
              { num: "500+", label: "Projects" },
              { num: "100+", label: "Clients" },
              { num: "15", label: "Awards" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.num}
                </div>
                <div className="text-sm text-neutral-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="flex flex-col items-center"
          >
            <span className="text-xs uppercase tracking-widest text-neutral-500 mb-3">Scroll to explore</span>
            <div className="w-px h-16 bg-gradient-to-b from-purple-400/50 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* Portfolio Grid with Bento Layout */}
      <section className="relative py-32 px-6">
        <div className="max-w-[1800px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20 text-center"
          >
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6">
              Selected{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-neutral-400 text-xl font-light">
              A curated collection of recent projects and collaborations
            </p>
          </motion.div>

          {/* Bento grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[400px]">
            {photos.map((photo, i) => {
              const spans = [
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

              const span = spans[i % spans.length];
              const spanClass = `${span.col} ${span.row}`;

              return (
                <PortfolioCard
                  key={`${photo.src}-${i}`}
                  photo={photo}
                  index={i}
                  spanClass={spanClass}
                  onCursorChange={(variant) => setCursorVariant(variant)}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-32 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24 max-w-4xl"
          >
            <h2 className="text-7xl md:text-9xl font-bold tracking-tighter mb-8 leading-[0.9]">
              Services &{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Pricing
              </span>
            </h2>
            <p className="text-2xl text-neutral-400 font-light leading-relaxed">
              Premium photography services for brands that demand excellence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Brand & Product",
                desc: "High-impact visual campaigns that sell",
                price: "$3,500",
                period: "starting from",
                features: [
                  "Full-day or half-day shoots",
                  "Studio & on-location",
                  "Professional retouching",
                  "Full commercial usage rights",
                  "Art direction included"
                ],
                gradient: "from-purple-500/10 to-pink-500/10",
                border: "purple-400/30"
              },
              {
                title: "Editorial & Portraits",
                desc: "Authentic stories, compelling moments",
                price: "$2,200",
                period: "starting from",
                features: [
                  "2-4 hour creative sessions",
                  "Mood board development",
                  "Creative direction",
                  "High-res deliverables",
                  "Social media assets"
                ],
                gradient: "from-pink-500/10 to-orange-500/10",
                border: "pink-400/30"
              },
              {
                title: "Events & Coverage",
                desc: "Capture every moment that matters",
                price: "$1,800",
                period: "starting from",
                features: [
                  "Full event coverage",
                  "2 photographers available",
                  "Same-day highlights",
                  "Curated online gallery",
                  "Fast turnaround"
                ],
                gradient: "from-orange-500/10 to-purple-500/10",
                border: "orange-400/30"
              }
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.8 }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className={`relative p-12 rounded-3xl border border-${service.border} bg-gradient-to-br ${service.gradient} backdrop-blur-xl hover:border-white/40 transition-all duration-500 h-full`}>
                  <div className="mb-8">
                    <div className="text-8xl font-bold text-white/5 group-hover:text-white/10 transition-colors mb-6">
                      0{i + 1}
                    </div>
                    <h3 className="text-4xl font-bold mb-4">{service.title}</h3>
                    <p className="text-neutral-400 text-lg font-light leading-relaxed">
                      {service.desc}
                    </p>
                  </div>

                  <div className="mb-10">
                    <div className="text-sm text-neutral-500 uppercase tracking-wider mb-2">
                      {service.period}
                    </div>
                    <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {service.price}
                    </div>
                  </div>

                  <ul className="space-y-4 mb-12">
                    {service.features.map((feature, j) => (
                      <motion.li
                        key={j}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15 + j * 0.05 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />
                        <span className="text-neutral-300">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-full border border-white/20 group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500 group-hover:border-transparent font-medium transition-all duration-300"
                  >
                    Book this package
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-40">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-20 rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 backdrop-blur-2xl overflow-hidden"
          >
            {/* Animated background gradient orbs */}
            <div className="absolute inset-0">
              <motion.div
                animate={{
                  x: [0, 100, 0],
                  y: [0, 50, 0],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
              />
              <motion.div
                animate={{
                  x: [0, -100, 0],
                  y: [0, -50, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
              />
            </div>

            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]"
              >
                Let&apos;s create
                <br />
                something
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                  unforgettable
                </span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-2xl text-neutral-300 font-light mb-12 max-w-2xl mx-auto"
              >
                Whether it&apos;s a brand campaign, editorial project, or something entirely new—let&apos;s bring your vision to life
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-14 py-6 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-xl font-medium hover:shadow-2xl hover:shadow-purple-500/50 transition-shadow"
              >
                Start your project →
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div>
              <h3 className="text-2xl font-bold mb-4">CHANGE<span className="text-purple-400">®</span></h3>
              <p className="text-neutral-500 text-sm">Photography & visual storytelling</p>
            </div>
            <div>
              <h4 className="text-sm font-medium uppercase tracking-wider mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li><Link href="#" className="hover:text-white transition">Brand Photography</Link></li>
                <li><Link href="#" className="hover:text-white transition">Editorial</Link></li>
                <li><Link href="#" className="hover:text-white transition">Events</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li><Link href="/change-studios" className="hover:text-white transition">Studios</Link></li>
                <li><Link href="/why" className="hover:text-white transition">Why</Link></li>
                <li><Link href="/#work" className="hover:text-white transition">Work</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium uppercase tracking-wider mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li><Link href="#" className="hover:text-white transition">Instagram</Link></li>
                <li><Link href="#" className="hover:text-white transition">Email</Link></li>
                <li><Link href="#" className="hover:text-white transition">LinkedIn</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
            <div>© 2025 CHANGE Media • Photography by EnUrbe</div>
            <div className="flex items-center gap-8">
              <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition">Terms</Link>
              <Link href="/contact" className="hover:text-white transition">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
