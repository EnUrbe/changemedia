"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import type { 
  GradContent, 
  GradPackage, 
  GradAddon, 
  GradGalleryItem, 
  GradPortfolioGalleryItem 
} from "@/lib/gradSchema";

/* ─── Data ─── */

const DEFAULT_PACKAGES: GradPackage[] = [
  {
    name: "The Snap",
    price: 49,
    time: "10 minutes",
    locations: "1 campus location",
    images: "3 edited digital images",
    extras: [],
    best: "You just need a few solid shots for the gram and LinkedIn without overthinking it.",
  },
  {
    name: "The Portrait",
    price: 95,
    time: "20 minutes",
    locations: "1 location",
    images: "8 edited digital images",
    extras: [],
    best: "You want options. Multiple angles, multiple expressions, enough to actually choose a favorite.",
  },
  {
    name: "The Classic",
    price: 189,
    time: "35 minutes",
    locations: "1-2 locations",
    images: "15 edited digital images",
    extras: ["1 outfit change"],
    popular: true,
    best: "The full grad photo experience. Cap and gown plus your real fit. This is the one most people book.",
  },
  {
    name: "The Experience",
    price: 329,
    time: "60 minutes",
    locations: "2-3 locations",
    images: "30 edited digital images",
    extras: [
      "Multiple outfit changes",
      "Behind-the-scenes phone content for reels/stories",
    ],
    best: "You want the range. Multiple vibes, multiple locations, content you will actually use for months.",
  },
  {
    name: "The Legacy",
    price: 549,
    time: "90 minutes",
    locations: "Full location tour",
    images: "50+ edited digital images",
    extras: [
      "Outfit styling consultation beforehand",
      "Curated highlight reel (15-sec slideshow for socials)",
      "Print-ready high-resolution files included",
    ],
    best: "The definitive graduation shoot. For when this moment deserves the full treatment.",
  },
];

const DEFAULT_ADDONS: GradAddon[] = [
  { name: "Extra edited images (beyond package count)", price: "$12 / photo" },
  { name: "48-hour rush delivery", price: "+$50" },
  { name: "Print release + high-resolution files", price: "+$35" },
  { name: "Instagram Story mini reel (15-sec slideshow)", price: "+$40" },
  { name: "Second person in the shoot (couples, friends, siblings)", price: "+$60" },
  { name: "Social media resize pack (IG, LinkedIn, FB cover)", price: "+$35" },
  { name: "Phone wallpaper set (3 photos for your lock screen)", price: "+$15" },
];

const ANNOUNCEMENTS = [
  { qty: "25 cards", price: "$75" },
  { qty: "50 cards", price: "$120" },
  { qty: "75 cards", price: "$160" },
];

const PRINTS = {
  canvas: [
    { size: '11x14', price: "$95" },
    { size: '16x20', price: "$150" },
    { size: '24x36', price: "$225" },
  ],
  framed: [
    { size: '8x10', price: "$75" },
    { size: '11x14', price: "$110" },
    { size: '16x20', price: "$175" },
  ],
  loose: [
    { size: '5x7', price: "$15" },
    { size: '8x10', price: "$25" },
    { size: '11x14', price: "$40" },
  ],
};

const STEPS = [
  {
    num: "01",
    title: "Book",
    detail: "Pick your package and grab a time slot. Takes 2 minutes.",
  },
  {
    num: "02",
    title: "Show Up",
    detail:
      "Bring your cap, your gown, and whatever else you want to shoot in. I handle the rest -- posing direction, locations, lighting, all of it.",
  },
  {
    num: "03",
    title: "Preview",
    detail:
      "Your private gallery goes live within 5-7 days. Browse, favorite, share.",
  },
  {
    num: "04",
    title: "Download + Order",
    detail:
      "Your edited digitals are ready to post. Want prints or announcements? Order directly from your gallery.",
  },
];

const FAQS = [
  {
    q: "Where do we shoot?",
    a: "On campus at CU Denver (Auraria, Tivoli, Speer Bridge) or CU Boulder (Norlin, Old Main, Varsity Lake). We can also shoot downtown Denver, RiNo, or any spot that is meaningful to you -- just let me know when you book.",
  },
  {
    q: "What should I wear?",
    a: "Cap and gown for the classic shots. Bring a second outfit for something more you -- a favorite fit, something that reflects your style. If you booked The Experience or The Legacy, bring multiple outfits. When in doubt, solid colors photograph better than busy patterns.",
  },
  {
    q: "What if the weather is bad?",
    a: "We reschedule. No charge, no hassle. Colorado weather is unpredictable -- I always have backup dates available.",
  },
  {
    q: "How long until I get my photos?",
    a: "5-7 days for standard delivery. 48 hours if you add rush delivery.",
  },
  {
    q: "Can I bring a friend / partner / family member?",
    a: "Absolutely. Adding a second person to the shoot is +$60. Or book two separate sessions back-to-back and I will give you both $15 off.",
  },
  {
    q: "Do I get the full-resolution files?",
    a: "The Legacy tier includes print-ready high-res files. All other tiers deliver web-optimized digitals (still high quality, just optimized for screens). You can add the full print-resolution files to any package for $35.",
  },
  {
    q: "Can I order prints later?",
    a: "Yes. Your private gallery stays active for 60 days after delivery. You can order prints, canvases, framed pieces, and announcements anytime during that window.",
  },
  {
    q: "Do you offer group rates?",
    a: "Book with 2 or more friends and everyone gets $15 off their session. You all shoot back-to-back at the same location -- easy to coordinate, and you get candid group shots between sessions for free.",
  },
];

const DEFAULT_GALLERY_ITEMS: GradGalleryItem[] = [
  {
    title: "Cap, gown, and the cleanest first frame",
    caption:
      "Start with the classic portrait so the gallery opens strong and feels immediately premium.",
    location: "Campus architecture",
    image:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1600&q=80",
  },
  {
    title: "The in-between shot that still feels like you",
    caption:
      "A more relaxed frame for the part of the gallery that shows your personality, not just the ceremony.",
    location: "Walkway / courtyard",
    image:
      "https://images.unsplash.com/photo-1521334884684-d80222895322?w=1600&q=80",
  },
  {
    title: "Friends, family, and the loudest cheer moment",
    caption:
      "Add a frame like this when you want the scroll to feel more editorial and less repetitive.",
    location: "Support cast shot",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80",
  },
  {
    title: "The dramatic close-up",
    caption:
      "This is where the motion gallery slows down and gives a hero portrait enough room to breathe.",
    location: "Golden hour close-up",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1600&q=80",
  },
  {
    title: "The final frame with real portfolio energy",
    caption:
      "Use the last card as the strongest ending shot before the booking CTA kicks in.",
    location: "Final look / signature pose",
    image:
      "https://images.unsplash.com/photo-1511421133909-6fda7b6f1f79?w=1600&q=80",
  },
];

type QuizOption = {
  label: string;
  bias: number;
};

type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
};

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "coverage",
    prompt: "How much coverage do you want?",
    options: [
      { label: "Quick and efficient", bias: 0 },
      { label: "Balanced shoot", bias: 2 },
      { label: "Editorial variety", bias: 3 },
      { label: "Full signature experience", bias: 4 },
    ],
  },
  {
    id: "deliverables",
    prompt: "What are these photos mainly for?",
    options: [
      { label: "A few profile and social updates", bias: 1 },
      { label: "A complete personal set", bias: 2 },
      { label: "Portfolio-level storytelling", bias: 3 },
      { label: "Long-term archive + prints", bias: 4 },
    ],
  },
  {
    id: "extras",
    prompt: "How important are extras and add-on moments?",
    options: [
      { label: "Not important", bias: 0 },
      { label: "A little flexibility", bias: 2 },
      { label: "I want BTS and content support", bias: 3 },
      { label: "I want the premium treatment", bias: 4 },
    ],
  },
];

function mapBiasToPackageIndex(bias: number, packageCount: number): number {
  if (packageCount <= 1) return 0;
  const clamped = Math.max(0, Math.min(4, bias));
  return Math.round((clamped / 4) * (packageCount - 1));
}

function parseAddonPrice(price: string): number {
  const match = price.match(/\d+(?:\.\d+)?/);
  if (!match) return 0;
  const value = Number.parseFloat(match[0]);
  return Number.isFinite(value) ? value : 0;
}

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function PackageFitQuiz({
  packages,
  onUseRecommendation,
}: {
  packages: GradPackage[];
  onUseRecommendation: (packageName: string) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const recommendedPackage = useMemo(() => {
    if (packages.length === 0) return null;
    if (Object.keys(answers).length < QUIZ_QUESTIONS.length) return null;

    const scores = new Array(packages.length).fill(0);
    for (const question of QUIZ_QUESTIONS) {
      const bias = answers[question.id];
      const packageIndex = mapBiasToPackageIndex(bias, packages.length);
      scores[packageIndex] += 1;
    }

    let winningIndex = 0;
    let winningScore = scores[0];
    for (let i = 1; i < scores.length; i += 1) {
      if (scores[i] >= winningScore) {
        winningScore = scores[i];
        winningIndex = i;
      }
    }

    return packages[winningIndex] ?? null;
  }, [answers, packages]);

  return (
    <Section className="py-20 border-y border-[var(--border)] bg-[var(--bg-elevated)]">
      <div className="container-wide">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow mb-4">Package fit quiz</p>
          <h2 className="font-serif text-4xl md:text-5xl text-white tracking-[-0.06em]">
            Find your best-fit session in 20 seconds.
          </h2>
          <p className="mt-4 text-sm md:text-base text-[var(--text-secondary)] max-w-2xl">
            Answer three quick questions and we will point you to the package that matches your goals.
          </p>

          <div className="mt-10 grid gap-6">
            {QUIZ_QUESTIONS.map((question) => (
              <div key={question.id} className="section-panel p-5 md:p-6">
                <p className="text-sm text-white mb-4">{question.prompt}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {question.options.map((option) => {
                    const selected = answers[question.id] === option.bias;
                    return (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() =>
                          setAnswers((prev) => ({ ...prev, [question.id]: option.bias }))
                        }
                        className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                          selected
                            ? "border-[var(--accent)] bg-[var(--accent-soft)] text-white"
                            : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-white"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {recommendedPackage && (
            <div className="mt-8 editorial-card p-6 md:p-8">
              <p className="eyebrow mb-2">Recommended for you</p>
              <h3 className="font-serif text-3xl text-white">{recommendedPackage.name}</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                {recommendedPackage.best}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--text-secondary)]">
                  {formatUsd(recommendedPackage.price)}
                </span>
                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--text-secondary)]">
                  {recommendedPackage.time}
                </span>
                <Button
                  onClick={() => onUseRecommendation(recommendedPackage.name)}
                  size="md"
                >
                  Use this recommendation
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

/* ─── Helpers ─── */

function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`relative ${className}`}
    >
      {children}
    </motion.section>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--border)]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-[var(--text)] text-sm md:text-base font-medium pr-8 group-hover:text-[var(--accent)] transition-colors">
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-[var(--accent)] text-xl flex-shrink-0"
        >
          +
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-sm text-[var(--text-secondary)] leading-relaxed">
          {a}
        </p>
      </motion.div>
    </div>
  );
}

function GalleryFrame({
  item,
  index,
}: {
  item: GradGalleryItem;
  index: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);
  const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: smoothRotateX,
        rotateY: smoothRotateY,
        transformPerspective: 1000,
      }}
      className={`relative shrink-0 group overflow-hidden cursor-[url('/cursor-explore.png'),_zoom-in] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300
        ${index % 3 === 0 ? "w-[85vw] md:w-[45vw] h-[65vh] md:h-[70vh]" : index % 3 === 1 ? "w-[75vw] md:w-[35vw] h-[75vh] md:h-[80vh]" : "w-[90vw] md:w-[55vw] h-[55vh] md:h-[65vh]"}
        ${index % 2 === 0 ? "self-start mt-12 md:mt-24" : "self-end mb-12 md:mb-24"}
      `}
    >
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(100vw)"
          className="object-cover opacity-50 group-hover:opacity-100 transition-all duration-1000 ease-out-expo grayscale group-hover:grayscale-0 scale-105 group-hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 mix-blend-multiply pointer-events-none" />
        
        {/* Glow effect on hover */}
        <motion.div 
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none mix-blend-overlay"
          style={{
            background: `radial-gradient(circle at center, var(--accent) 0%, transparent 60%)`,
          }}
        />

        <div className="absolute inset-0 inset-x-8 bottom-12 md:bottom-20 z-20 flex flex-col justify-end gap-4 pointer-events-none">
          <div className="overflow-hidden">
            <span className="eyebrow ghost block text-[var(--accent)] translate-y-full group-hover:translate-y-0 transition-transform duration-500">
              SCENE 00{index + 1} &mdash; {item.location}
            </span>
          </div>
          <h3 className="font-serif text-3xl md:text-6xl text-white tracking-tighter w-full max-w-3xl translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-out-expo drop-shadow-lg">
            {item.title}
          </h3>
          <p className="text-white/60 max-w-xl text-sm md:text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-1000 delay-200">
            {item.caption}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function PortfolioScrollGallery({ items }: { items: GradGalleryItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["20%", "-60%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.15, 0.2], [1, 1, 0]);

  return (
    <Section id="gallery" className="relative h-[300vh] bg-[#010100] /* Aesthetic dark */">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 grain opacity-50 pointer-events-none z-50 mix-blend-overlay" />

        {/* Cinematic Title Marquee */}
        <motion.div
          ref={containerRef}
          style={{ opacity: titleOpacity }}
          className="absolute left-12 md:left-24 top-1/2 -translate-y-1/2 z-40 pointer-events-none"
        >
          <h2 className="font-serif text-6xl md:text-9xl text-white tracking-tighter leading-[0.9]">
            The<br/>
            Cinematic<br/>
            <span className="text-[var(--accent)] italic font-light">Archive</span>
          </h2>
          <p className="mt-20 text-white/50 uppercase tracking-widest text-[10px] font-mono animate-pulse">
            Scroll to explore &rarr;
          </p>
        </motion.div>

        {/* The Film Strip */}
        <motion.div
          style={{ x }}
          className="flex gap-8 md:gap-24 pl-[100vw] pr-[20vw] w-max items-center h-full"
        >
          {items.map((item, i) => (
            <GalleryFrame key={i.toString()} item={item} index={i} />
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

function StandardPortfolioGallery({ items }: { items: GradPortfolioGalleryItem[] }) {
  if (!items || items.length === 0) return null;
  return (
    <Section id="work" className="py-24 bg-[var(--bg)] relative overflow-hidden">
      <div className="absolute inset-0 grain opacity-30 pointer-events-none" />
      <div className="container-wide mb-16 relative z-10">
        <p className="eyebrow mb-4">Past Sessions</p>
        <h2 className="font-serif text-4xl md:text-6xl text-[var(--text)] tracking-tighter">
          Graduation Portfolio
        </h2>
      </div>
      <div className="container-wide relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {items.map((item, i) => (
            <div key={i} className="group relative aspect-[4/5] overflow-hidden rounded-[0.5rem] bg-[var(--surface-color)] editorial-card shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 ease-out-expo group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500 mix-blend-multiply pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <span className="eyebrow ghost block text-[var(--accent)] mb-2">Frame {String(i + 1).padStart(2, '0')}</span>
                <h3 className="text-2xl text-white font-serif tracking-tight drop-shadow-md">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── Main Component ─── */

export default function GradClient({ content }: { content: GradContent }) {
  const packages = content.packages?.length ? content.packages : DEFAULT_PACKAGES;
  const addons = content.addons?.length ? content.addons : DEFAULT_ADDONS;
  const galleryItems = content.gallery?.length ? content.gallery : DEFAULT_GALLERY_ITEMS;
  const portfolioGalleryItems = content.portfolioGallery || [];
  const [recommendedPackageName, setRecommendedPackageName] = useState<string | null>(null);
  const [selectedPackageName, setSelectedPackageName] = useState<string>(
    packages.find((pkg) => pkg.popular)?.name ?? packages[0]?.name ?? ""
  );
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    if (!packages.some((pkg) => pkg.name === selectedPackageName)) {
      setSelectedPackageName(packages.find((pkg) => pkg.popular)?.name ?? packages[0]?.name ?? "");
    }
  }, [packages, selectedPackageName]);

  const scrollToBook = () => {
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const useRecommendation = (packageName: string) => {
    setRecommendedPackageName(packageName);
    setSelectedPackageName(packageName);
    scrollToBook();
  };

  return (
    <>
      <Nav />

      <main className="relative overflow-hidden">
        {/* ─── HERO ─── */}
        <div ref={heroRef} className="relative h-[100svh] flex items-center justify-center overflow-hidden">
          {/* Parallax background */}
          <motion.div
            style={{ y: heroY }}
            className="absolute inset-0 bg-cover bg-center"
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1523050854058-8df90110c476?w=1920&q=80)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent" />
          </motion.div>

          <motion.div
            style={{ opacity: heroOpacity }}
            className="relative z-10 container-wide text-center max-w-4xl mx-auto px-6"
          >
            <p className="eyebrow mb-6">Change Media Studio / Class of 2026</p>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.88] tracking-[-0.06em] text-white mb-6">
              Four Years of<br />Locking In.<br />
              <span className="text-gradient">One Perfect Shot.</span>
            </h1>
            <p className="text-[var(--text-secondary)] text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Professional grad portraits that go just as hard on your mom&apos;s mantle as they do on the grid.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="#book" size="lg">
                Book Your Session
              </Button>
              <Button href="#packages" variant="outline" size="lg">
                View Packages
              </Button>
              <Button href="#gallery" variant="ghost" size="lg">
                Scroll the Gallery
              </Button>
            </div>
            <p className="mt-6 text-xs text-[var(--text-dim)]">
              Limited spring availability -- slots filling fast before commencement.
            </p>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          >
            <div className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center pt-1.5">
              <motion.div
                animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 h-1.5 rounded-full bg-[var(--accent)]"
              />
            </div>
          </motion.div>
        </div>

        {/* ─── GALLERY ─── */}
        <PortfolioScrollGallery items={galleryItems} />
        <StandardPortfolioGallery items={portfolioGalleryItems} />
        <PackageFitQuiz packages={packages} onUseRecommendation={useRecommendation} />

        {/* ─── PACKAGES ─── */}
        <Section id="packages" className="py-[var(--section-padding)]">
          <div className="container-wide">
            <div className="text-center mb-16">
              <p className="eyebrow mb-4">Session Packages</p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white tracking-[-0.06em]">
                Pick Your Level.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.name}
                  className={`editorial-card p-8 flex flex-col ${
                    pkg.popular
                      ? "lg:col-span-1 ring-1 ring-[var(--accent)]/30 relative"
                      : ""
                  } ${
                    pkg.name === recommendedPackageName
                      ? "ring-2 ring-[var(--accent)]/50"
                      : ""
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3 left-8 eyebrow-pill text-[10px]">
                      Most Popular
                    </span>
                  )}
                  {pkg.name === recommendedPackageName && (
                    <span className="absolute -top-3 right-8 eyebrow-pill text-[10px] bg-[var(--accent)] text-black">
                      Quiz Match
                    </span>
                  )}
                  <div className="mb-6">
                    <h3 className="font-serif text-2xl text-white mb-1">
                      {pkg.name}
                    </h3>
                    <p className="text-3xl font-serif text-gradient">
                      ${pkg.price}
                    </p>
                  </div>
                  <div className="space-y-3 text-sm text-[var(--text-secondary)] flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                      {pkg.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                      {pkg.locations}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                      {pkg.images}
                    </div>
                    {pkg.extras.map((e) => (
                      <div key={e} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                        {e}
                      </div>
                    ))}
                    <div className="h-px bg-[var(--border)] my-3" />
                    <div className="flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-[var(--accent)] mt-1.5 flex-shrink-0" />
                      <span>Delivered in 5-7 days</span>
                    </div>
                  </div>
                  <p className="mt-6 text-xs text-[var(--text-muted)] italic leading-relaxed">
                    {pkg.best}
                  </p>
                  <Button
                    onClick={() => {
                      setSelectedPackageName(pkg.name);
                      scrollToBook();
                    }}
                    className="mt-6 w-full"
                    variant={pkg.popular ? "primary" : "outline"}
                  >
                    Choose {pkg.name}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ─── ADD-ONS ─── */}
        <Section className="py-[var(--section-padding)] bg-[var(--bg-elevated)]">
          <div className="container-narrow">
            <div className="text-center mb-12">
              <p className="eyebrow mb-4">Add-Ons</p>
              <h2 className="font-serif text-3xl md:text-4xl text-white tracking-[-0.06em]">
                Make It Yours.
              </h2>
            </div>
            <div className="space-y-0">
              {addons.map((addon, i) => (
                <div
                  key={addon.name}
                  className={`flex items-center justify-between py-4 ${
                    i < addons.length - 1 ? "border-b border-[var(--border)]" : ""
                  }`}
                >
                  <span className="text-sm text-[var(--text-secondary)]">
                    {addon.name}
                  </span>
                  <span className="text-sm font-medium text-[var(--accent)] whitespace-nowrap ml-4">
                    {addon.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ─── ANNOUNCEMENTS ─── */}
        <Section className="py-[var(--section-padding)]">
          <div className="container-narrow">
            <div className="editorial-card p-8 md:p-12">
              <p className="eyebrow mb-4">Graduation Announcements</p>
              <h2 className="font-serif text-3xl md:text-4xl text-white tracking-[-0.06em] mb-4">
                You Are Gonna Send Announcements Anyway. Make Them Hit.
              </h2>
              <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed mb-8 max-w-2xl">
                Custom-designed graduation announcement cards featuring your session photos.
                Choose from three design templates -- clean minimal, editorial, or warm and organic.
                Printed on premium cardstock and shipped directly to you.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {ANNOUNCEMENTS.map((a) => (
                  <div
                    key={a.qty}
                    className="text-center p-4 md:p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]"
                  >
                    <p className="text-2xl md:text-3xl font-serif text-gradient mb-1">
                      {a.price}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">{a.qty}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                Available to anyone who books a session. Designs are customized with your name, degree, and university.
                Turnaround is 7-10 business days from design approval.
              </p>
            </div>
          </div>
        </Section>

        {/* ─── PRINT PRODUCTS ─── */}
        <Section className="py-[var(--section-padding)] bg-[var(--bg-elevated)]">
          <div className="container-narrow">
            <div className="text-center mb-4">
              <p className="eyebrow mb-4">Print Products</p>
              <h2 className="font-serif text-3xl md:text-4xl text-white tracking-[-0.06em] mb-4">
                Put It On the Wall.
              </h2>
              <p className="text-[var(--text-secondary)] text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-12">
                Every photo from your session is available as a gallery-quality print, canvas, or framed piece.
                Order directly from your private gallery after your session -- everything ships straight to your door (or your mom&apos;s door).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(
                [
                  { title: "Canvas Wraps", items: PRINTS.canvas },
                  { title: "Framed Prints", items: PRINTS.framed },
                  { title: "Loose Prints", items: PRINTS.loose },
                ] as const
              ).map((group) => (
                <div
                  key={group.title}
                  className="section-panel p-6"
                >
                  <h3 className="font-serif text-lg text-white mb-4">
                    {group.title}
                  </h3>
                  <div className="space-y-3">
                    {group.items.map((item) => (
                      <div
                        key={item.size}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-[var(--text-secondary)]">
                          {item.size}
                        </span>
                        <span className="text-[var(--accent)] font-medium">
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ─── HOW IT WORKS ─── */}
        <Section className="py-[var(--section-padding)]">
          <div className="container-narrow">
            <div className="text-center mb-16">
              <p className="eyebrow mb-4">How It Works</p>
              <h2 className="font-serif text-3xl md:text-4xl text-white tracking-[-0.06em]">
                Four Steps. That Is It.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STEPS.map((step) => (
                <div key={step.num} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] mb-4">
                    <span className="font-mono text-sm text-[var(--accent)]">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ─── FAQ ─── */}
        <Section className="py-[var(--section-padding)] bg-[var(--bg-elevated)]">
          <div className="container-narrow">
            <div className="text-center mb-12">
              <p className="eyebrow mb-4">FAQ</p>
              <h2 className="font-serif text-3xl md:text-4xl text-white tracking-[-0.06em]">
                Questions? Answers.
              </h2>
            </div>
            <div>
              {FAQS.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </Section>

        {/* ─── BOOKING CTA ─── */}
        <Section id="book" className="py-[var(--section-padding)] relative">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--accent)]/8 blur-[200px]" />
          </div>

          <div className="container-wide relative z-10">
            <div className="text-center mb-12">
              <p className="eyebrow mb-4">Book Now</p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white tracking-[-0.06em] mb-4">
                This Degree Hits<br />Different on Camera.
              </h2>
              <p className="text-[var(--text-secondary)] text-base md:text-lg max-w-lg mx-auto">
                Spring sessions are almost full. Do not be the one who waited too long.
              </p>
            </div>

            <BookingForm
              packages={packages}
              addons={addons}
              initialPackageName={selectedPackageName}
              recommendedPackageName={recommendedPackageName}
            />
          </div>
        </Section>
      </main>

      <Footer />
    </>
  );
}

/* ─── Booking Form ─── */

function BookingForm({
  packages,
  addons,
  initialPackageName,
  recommendedPackageName,
}: {
  packages: GradPackage[];
  addons: GradAddon[];
  initialPackageName: string;
  recommendedPackageName: string | null;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [selectedPackageName, setSelectedPackageName] = useState(initialPackageName);
  const [selectedAddonNames, setSelectedAddonNames] = useState<string[]>([]);

  useEffect(() => {
    if (initialPackageName) {
      setSelectedPackageName(initialPackageName);
    }
  }, [initialPackageName]);

  const selectedPackage = useMemo(
    () => packages.find((pkg) => pkg.name === selectedPackageName) ?? null,
    [packages, selectedPackageName]
  );

  const packagePrice = selectedPackage?.price ?? 0;
  const addonTotal = useMemo(
    () =>
      selectedAddonNames.reduce((sum, addonName) => {
        const addon = addons.find((item) => item.name === addonName);
        if (!addon) return sum;
        return sum + parseAddonPrice(addon.price);
      }, 0),
    [addons, selectedAddonNames]
  );
  const estimatedTotal = packagePrice + addonTotal;
  const hasRushAddon = selectedAddonNames.some((name) => /rush|48-hour|48 hour/i.test(name));
  const estimatedDelivery = hasRushAddon ? "48 hours" : "5-7 days";
  const prepProgress = [
    !!selectedPackageName,
    !!preferredDate,
    !!preferredTime,
    !!university,
    name.trim().length > 0,
    email.trim().length > 0,
  ].filter(Boolean).length;

  const toggleAddon = (addonName: string) => {
    setSelectedAddonNames((prev) =>
      prev.includes(addonName)
        ? prev.filter((name) => name !== addonName)
        : [...prev, addonName]
    );
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    // Simulate form submit -- replace with real endpoint
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="editorial-card p-8 md:p-12 text-center max-w-xl mx-auto"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] mb-6">
          <svg className="w-7 h-7 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-serif text-2xl text-white mb-2">You Are Locked In.</h3>
        <p className="text-sm text-[var(--text-secondary)]">
          Check your email -- you will hear from me within 24 hours to confirm details and finalize your session.
        </p>
      </motion.div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-dim)] transition-all focus:border-[var(--accent)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/10";

  return (
    <div className="mx-auto grid max-w-6xl items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <form onSubmit={handleSubmit} className="editorial-card p-8 md:p-12">
        <div className="space-y-5">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-dim)]">Booking prep</p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {prepProgress}/6 complete
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/30">
              <div
                className="h-full bg-[var(--accent)] transition-all duration-500"
                style={{ width: `${(prepProgress / 6) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label mb-1.5 block">Full Name</label>
              <input
                name="name"
                required
                placeholder="Your name"
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="label mb-1.5 block">Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@email.com"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label mb-1.5 block">Phone</label>
              <input name="phone" type="tel" placeholder="(303) 555-0100" className={inputClass} />
            </div>
            <div>
              <label className="label mb-1.5 block">University</label>
              <select
                name="university"
                required
                className={inputClass}
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
              >
                <option value="">Select campus</option>
                <option value="cu-denver">CU Denver</option>
                <option value="cu-boulder">CU Boulder</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label mb-1.5 block">Package</label>
            <select
              name="package"
              required
              className={inputClass}
              value={selectedPackageName}
              onChange={(e) => setSelectedPackageName(e.target.value)}
            >
              <option value="">Select a package</option>
              {packages.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name} -- {formatUsd(p.price)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label mb-1.5 block">Preferred Date</label>
              <input
                name="date"
                type="date"
                required
                className={inputClass}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
              />
            </div>
            <div>
              <label className="label mb-1.5 block">Preferred Time</label>
              <select
                name="time"
                className={inputClass}
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
              >
                <option value="">Flexible</option>
                <option value="morning">Morning (8am-11am)</option>
                <option value="midday">Midday (11am-2pm)</option>
                <option value="golden">Golden Hour (5pm-7pm)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label mb-1.5 block">Add-Ons (optional)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {addons.map((addon) => (
                <label
                  key={addon.name}
                  className="flex items-start gap-2 text-xs text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text)] transition-colors"
                >
                  <input
                    type="checkbox"
                    name="addons"
                    value={addon.name}
                    checked={selectedAddonNames.includes(addon.name)}
                    onChange={() => toggleAddon(addon.name)}
                    className="mt-0.5 accent-[var(--accent)]"
                  />
                  <span>
                    {addon.name} <span className="text-[var(--accent)]">{addon.price}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="label mb-1.5 block">Anything else I should know?</label>
            <textarea
              name="notes"
              rows={3}
              placeholder="Locations you love, outfit ideas, who is coming with you..."
              className={inputClass}
            />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full mt-8" disabled={sending}>
          {sending ? "Sending..." : `Reserve for ${formatUsd(estimatedTotal)}`}
        </Button>

        <p className="text-center text-xs text-[var(--text-dim)] mt-4">
          You will receive a confirmation email within 24 hours.
        </p>
      </form>

      <aside className="editorial-card p-6 md:p-8 lg:sticky lg:top-24">
        <p className="eyebrow mb-3">Live session summary</p>
        <h3 className="font-serif text-2xl text-white tracking-tight">
          {selectedPackage?.name ?? "Choose a package"}
        </h3>
        {recommendedPackageName && (
          <p className="mt-2 text-xs text-[var(--accent)] uppercase tracking-[0.14em]">
            Quiz recommendation: {recommendedPackageName}
          </p>
        )}
        <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
          {selectedPackage?.best ?? "Pick a package to see your tailored booking summary."}
        </p>

        <div className="mt-6 space-y-3 text-sm">
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span>Package subtotal</span>
            <span className="text-white">{formatUsd(packagePrice)}</span>
          </div>
          <div className="flex items-center justify-between text-[var(--text-secondary)]">
            <span>Add-ons subtotal</span>
            <span className="text-white">{formatUsd(addonTotal)}</span>
          </div>
          <div className="h-px bg-[var(--border)]" />
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">Estimated total</span>
            <span className="text-xl font-serif text-[var(--accent)]">{formatUsd(estimatedTotal)}</span>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-dim)]">Estimated delivery</p>
          <p className="mt-1 text-sm text-white">{estimatedDelivery}</p>
        </div>

        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-dim)]">Next steps</p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
            <li className={name ? "text-white" : ""}>1. Share your name and email.</li>
            <li className={selectedPackageName ? "text-white" : ""}>2. Confirm your package.</li>
            <li className={preferredDate && preferredTime ? "text-white" : ""}>3. Pick your date and time window.</li>
            <li className={university ? "text-white" : ""}>4. Select your campus.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
