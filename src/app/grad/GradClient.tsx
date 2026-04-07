"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useSpring,
  useVelocity,
  useAnimationFrame,
  useMotionValue,
} from "framer-motion";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import type { 
  GradContent, 
  GradPackage, 
  GradAddon, 
  GradGalleryItem 
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
                  {recommendedPackage.time}
                </span>
                <Button
                  onClick={() => onUseRecommendation(recommendedPackage.name)}
                  size="md"
                >
                  Explore this Experience
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
function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}
function ParallaxText({ children, baseVelocity = -20 }: { children: string; baseVelocity?: number }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });
  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });
  const x = useTransform(baseX, (v) => `${wrap(-45, -20, v)}%`);
  return (
    <div className="overflow-hidden m-0 flex flex-nowrap w-full pointer-events-none opacity-20 -my-20">
      <motion.div className="flex whitespace-nowrap uppercase text-[8rem] sm:text-[10rem] md:text-[15rem] leading-none font-serif tracking-tight text-white/50" style={{ x }}>
        <span className="block pr-12">{children}</span>
        <span className="block pr-12">{children}</span>
        <span className="block pr-12">{children}</span>
        <span className="block pr-12">{children}</span>
        <span className="block pr-12">{children}</span>
        <span className="block pr-12">{children}</span>
      </motion.div>
    </div>
  );
}
function InteractivePortfolioGallery({
  items,
}: {
  items: { title: string; image: string }[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["15%", "-15%"]);
  if (items.length === 0) return null;
  const col1 = items.filter((_, i) => i % 2 === 0);
  const col2 = items.filter((_, i) => i % 2 !== 0);
  return (
    <Section id="gallery" className="py-24 md:py-32 bg-[var(--bg)] border-y border-[var(--border)] overflow-hidden">
      <div className="container-wide mb-16 md:mb-24 text-center">
        <p className="eyebrow mb-4">Portfolio</p>
        <h2 className="font-serif text-4xl md:text-7xl text-white tracking-tighter">
          The Archive
        </h2>
        <p className="mt-4 text-sm md:text-base text-[var(--text-secondary)] uppercase tracking-widest">
          Scroll to explore &darr;
        </p>
      </div>
      <div ref={containerRef} className="container-wide max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start">
          <motion.div style={{ y: y1 }} className="flex flex-col gap-6 md:gap-12">
            {col1.map((item, i) => (
              <ParallaxImage key={`col1-${i}`} item={item} />
            ))}
          </motion.div>
          <motion.div style={{ y: y2 }} className="flex flex-col gap-6 md:gap-12 pt-0 md:pt-32">
            {col2.map((item, i) => (
              <ParallaxImage key={`col2-${i}`} item={item} />
            ))}
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
function ParallaxImage({ item }: { item: { title: string; image: string } }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
  return (
    <div ref={ref} className="relative aspect-[3/4] md:aspect-[4/5] w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] group shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
      <motion.div style={{ scale }} className="absolute inset-0 origin-center w-full h-full">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          quality={90}
          className="object-cover opacity-80 transition-opacity duration-700 group-hover:opacity-100"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none mix-blend-multiply opacity-50 transition-opacity duration-700 group-hover:opacity-20" />
    </div>
  );
}
/* ─── Main Component ─── */
export default function GradClient({ content }: { content: GradContent }) {
  const packages = content.packages?.length ? content.packages : DEFAULT_PACKAGES;
  const addons = content.addons?.length ? content.addons : DEFAULT_ADDONS;
  const galleryItems = content.gallery?.length ? content.gallery : DEFAULT_GALLERY_ITEMS;
  const portfolioGalleryItems = content.portfolioGallery || [];
  const interactivePortfolioItems = useMemo(
    () =>
      portfolioGalleryItems.length > 0
        ? portfolioGalleryItems.map((item) => ({ title: item.title, image: item.image }))
        : galleryItems.map((item) => ({ title: item.title, image: item.image })),
    [galleryItems, portfolioGalleryItems]
  );
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
  const scrollToInquire = () => {
    document.getElementById("inquire")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const useRecommendation = (packageName: string) => {
    setRecommendedPackageName(packageName);
    setSelectedPackageName(packageName);
    scrollToInquire();
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
              <Button href="#inquire" size="lg">
                Request Pricing & Details
              </Button>
              <Button href="#packages" variant="outline" size="lg">
                View Sessions
              </Button>
              <Button href="#gallery" variant="ghost" size="lg">
                View the Archive
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
        <InteractivePortfolioGallery items={interactivePortfolioItems} />
        <ParallaxText baseVelocity={5}>Class of 2026</ParallaxText>
        <ParallaxText baseVelocity={-5}>Change Media Studio</ParallaxText>
        {/* ─── PACKAGES ─── */}
        <Section id="packages" className="py-[var(--section-padding)]">
          <div className="container-wide">
            <div className="text-center mb-16">
              <p className="eyebrow mb-4">Session Experiences</p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white tracking-[-0.06em]">
                The Portfolio.
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
                    <h3 className="font-serif text-2xl text-white mb-2">
                      {pkg.name}
                    </h3>
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
                      <div key={e} className="flex items-start gap-2 text-left">
                        <span className="w-1 h-1 rounded-full bg-[var(--accent)] mt-1.5 flex-shrink-0" />
                        <span>{e}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-6 text-xs text-[var(--text-muted)] italic leading-relaxed">
                    {pkg.best}
                  </p>
                  <Button
                    onClick={() => {
                      setSelectedPackageName(pkg.name);
                      scrollToInquire();
                    }}
                    className="mt-6 w-full"
                    variant={pkg.popular ? "primary" : "outline"}
                  >
                    Inquire about {pkg.name}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Section>
        <PackageFitQuiz packages={packages} onUseRecommendation={useRecommendation} />
        {/* ─── ADD-ONS, ANNOUNCEMENTS & PRINTS ─── */}
        <Section className="py-[var(--section-padding)] bg-[var(--bg-elevated)]">
          <div className="container-narrow">
            <div className="text-center mb-12">
              <p className="eyebrow mb-4">Everything Else</p>
              <h2 className="font-serif text-3xl md:text-4xl text-white tracking-[-0.06em]">
                Add-Ons, Announcements & Prints
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--text-secondary)]">
                One place for all optional upgrades and keepsakes after your session.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <article className="editorial-card p-6 md:p-8">
                <h3 className="font-serif text-xl text-white mb-4">Session Add-Ons</h3>
                <div className="space-y-0">
                  {addons.map((addon, i) => (
                    <div
                      key={addon.name}
                      className={`flex items-center justify-between py-3 ${
                        i < addons.length - 1 ? "border-b border-[var(--border)]" : ""
                      }`}
                    >
                      <span className="text-sm text-[var(--text-secondary)]">{addon.name}</span>
                      <span className="ml-4 whitespace-nowrap text-sm font-medium text-[var(--accent)]">{addon.price}</span>
                    </div>
                  ))}
                </div>
              </article>
              <article className="editorial-card p-6 md:p-8">
                <h3 className="font-serif text-xl text-white mb-4">Graduation Announcements</h3>
                <p className="mb-5 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Custom-designed cards featuring your session photos on premium cardstock.
                </p>
                <div className="space-y-3">
                  {ANNOUNCEMENTS.map((a) => (
                    <div key={a.qty} className="flex items-center justify-between text-sm">
                      <span className="text-[var(--text-secondary)]">{a.qty}</span>
                      <span className="font-medium text-[var(--accent)]">{a.price}</span>
                    </div>
                  ))}
                </div>
              </article>
              <article className="editorial-card p-6 md:p-8">
                <h3 className="font-serif text-xl text-white mb-4">Prints</h3>
                <div className="space-y-4">
                  {(
                    [
                      { title: "Canvas Wraps", items: PRINTS.canvas },
                      { title: "Framed Prints", items: PRINTS.framed },
                      { title: "Loose Prints", items: PRINTS.loose },
                    ] as const
                  ).map((group) => (
                    <div key={group.title}>
                      <p className="label mb-2">{group.title}</p>
                      {group.items.map((item) => (
                        <div key={item.size} className="flex items-center justify-between py-1 text-sm">
                          <span className="text-[var(--text-secondary)]">{item.size}</span>
                          <span className="font-medium text-[var(--accent)]">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </article>
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
            <div className="mx-auto max-w-2xl relative pb-20">
              {STEPS.map((step, index) => (
                <div
                  key={step.num}
                  className="sticky z-10 w-full mb-4 md:mb-6"
                  style={{ top: `calc(120px + ${index * 24}px)` }}
                >
                  <div className="editorial-card p-6 py-12 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.8)] border-t border-[var(--accent)]/10 text-center flex flex-col items-center justify-center min-h-[300px] bg-[var(--bg-card)]/90 backdrop-blur-xl origin-bottom transition-all">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] mb-6">
                      <span className="font-mono text-sm text-[var(--accent)]">
                        {step.num}
                      </span>
                    </div>
                    <h3 className="font-serif text-3xl md:text-4xl text-white mb-4 tracking-tighter">
                      {step.title}
                    </h3>
                    <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed max-w-md mx-auto">
                      {step.detail}
                    </p>
                  </div>
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
        {/* ─── INQUIRY CTA ─── */}
        <Section id="inquire" className="py-[var(--section-padding)] relative">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--accent)]/8 blur-[200px]" />
          </div>
          <div className="container-wide relative z-10">
            <div className="text-center mb-12">
              <p className="eyebrow mb-4">Inquire</p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white tracking-[-0.06em] mb-4">
                Request Pricing & Details.
              </h2>
              <p className="text-[var(--text-secondary)] text-base md:text-lg max-w-lg mx-auto">
                Fill out the form below to receive full pricing, available dates, and detailed package options.
              </p>
            </div>
            <InquiryForm
              packages={packages}
              initialPackageName={selectedPackageName}
            />
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
/* ─── Inquiry Form ─── */
function InquiryForm({
  packages,
  initialPackageName,
}: {
  packages: GradPackage[];
  initialPackageName: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [university, setUniversity] = useState("");
  const [expectedGraduation, setExpectedGraduation] = useState("");
  const [selectedPackageName, setSelectedPackageName] = useState(initialPackageName);
  const [vibe, setVibe] = useState("");
  const [notes, setNotes] = useState("");
  useEffect(() => {
    if (initialPackageName) {
      setSelectedPackageName(initialPackageName);
    }
  }, [initialPackageName]);
  const selectedPackage = useMemo(
    () => packages.find((pkg) => pkg.name === selectedPackageName) ?? null,
    [packages, selectedPackageName]
  );
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: name,
          email,
          phone,
          organization: university,
          session_type: selectedPackageName || null,
          timeline: expectedGraduation || null,
          message: [vibe ? `Vibe: ${vibe}` : null, notes || null].filter(Boolean).join("\n") || null,
          service_type: "grad_portraits",
          source: "grad_page",
          ts: Date.now(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Submission failed");
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
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
        <h3 className="font-serif text-2xl text-white mb-2">Request Sent.</h3>
        <p className="text-sm text-[var(--text-secondary)]">
          Thank you! Check your email—your custom pricing guide will be arriving shortly.
        </p>
      </motion.div>
    );
  }
  const inputClass =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-dim)] transition-all focus:border-[var(--accent)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/10";
  return (
    <div className="mx-auto grid max-w-6xl items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <form onSubmit={handleSubmit} className="editorial-card p-8 md:p-12">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label mb-1.5 block">Full Name</label>
              <input
                name="name"
                required
                placeholder="First & Last Name"
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
              <label className="label mb-1.5 block">Phone Number</label>
              <input 
                name="phone" 
                type="tel" 
                placeholder="(303) 555-0100" 
                className={inputClass}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="label mb-1.5 block">University / School</label>
              <input
                name="university"
                required
                placeholder="i.e. CU Boulder, MSU Denver"
                className={inputClass}
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="label mb-1.5 block">Expected Graduation Month/Year</label>
              <input
                name="expectedGraduation"
                placeholder="i.e. May 2024"
                className={inputClass}
                value={expectedGraduation}
                onChange={(e) => setExpectedGraduation(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="label mb-1.5 block">Which Experience Fits Best?</label>
            <select
              name="package"
              className={inputClass}
              value={selectedPackageName}
              onChange={(e) => setSelectedPackageName(e.target.value)}
            >
              <option value="">I&apos;m not sure yet</option>
              {packages.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label mb-1.5 block">What is the vibe?</label>
            <input
              name="vibe"
              placeholder="Cinematic, editorial, casual, popping champagne..."
              className={inputClass}
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
            />
          </div>
          <div>
            <label className="label mb-1.5 block">Any specific locations or concepts?</label>
            <textarea
              name="notes"
              rows={4}
              placeholder="Tell me about your dream locations, outfits, or who's joining you..."
              className={inputClass}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <Button type="submit" size="lg" className="w-full mt-8" disabled={sending}>
          {sending ? "Sending..." : "Request Pricing & Details"}
        </Button>
      </form>
      <aside className="editorial-card p-6 md:p-8 lg:sticky lg:top-24">
        <p className="eyebrow mb-3">What happens next?</p>
        <h3 className="font-serif text-2xl text-white tracking-tight mb-4">
          The Process
        </h3>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] font-serif text-sm">
                1
              </div>
              <div className="w-px h-full bg-[var(--border)] mt-2" />
            </div>
            <div className="pb-2">
              <h4 className="text-white text-sm font-medium mb-1">Get the Guide</h4>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Check your inbox for my full pricing guide with pricing, package details, and available dates.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] font-serif text-sm">
                2
              </div>
              <div className="w-px h-full bg-[var(--border)] mt-2" />
            </div>
            <div className="pb-2">
              <h4 className="text-white text-sm font-medium mb-1">Lock in your Date</h4>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Choose your ideal date and time directly from the guide. A signed contract and retainer secure your spot on my calendar.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] font-serif text-sm">
                3
              </div>
            </div>
            <div>
              <h4 className="text-white text-sm font-medium mb-1">Plan the Shoot</h4>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                We&apos;ll collaborate on locations, outfits, and the overall vibe so you can show up feeling confident and ready.
              </p>
            </div>
          </div>
        </div>
        {selectedPackageName && selectedPackage && (
          <div className="mt-8 pt-6 border-t border-[var(--border)]">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-dim)]">Interested in</p>
            <p className="mt-2 font-serif text-lg text-white">{selectedPackage.name}</p>
            <p className="mt-1 text-xs text-[var(--text-secondary)] italic">
              {selectedPackage.best}
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
