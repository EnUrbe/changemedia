'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Airtable is used **ONLY** for the contact form (Inquiries table),
// **NOT** for the portfolio grid anymore. Portfolio is local/static below.
//
// Set env vars in Vercel: AIRTABLE_PAT, AIRTABLE_BASE_ID, AIRTABLE_TABLE_INQUIRIES

// --- Small helpers ---
const fade = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-neutral-300">
      {children}
    </span>
  );
}

function CaseCard({
  title,
  subtitle,
  img,
  video,
  tags = [],
}: {
  title: string;
  subtitle: string;
  img: string;
  video?: string;
  tags?: string[];
}) {
  return (
    <a
      href="#"
      className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-white/5"
    >
      <div className="relative aspect-[16/10] w-full">
        {video ? (
          <video
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            src={video}
            muted
            loop
            playsInline
            onMouseOver={(e) => (e.currentTarget as HTMLVideoElement).play()}
            onMouseOut={(e) => (e.currentTarget as HTMLVideoElement).pause()}
            poster={img}
          />
        ) : (
          <Image
            src={img}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute left-4 right-4 bottom-4 flex flex-wrap items-center gap-2">
          {tags.map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between p-4">
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-xs text-neutral-400">{subtitle}</div>
        </div>
        <div className="text-xs text-neutral-400 opacity-0 transition group-hover:opacity-100">
          View case →
        </div>
      </div>
    </a>
  );
}

export default function ChangeMediaLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [annual, setAnnual] = useState(true);
  const [showStickyCta, setShowStickyCta] = useState(false);

  // Subtle grain overlay
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .grain{position:fixed;inset:0;pointer-events:none;opacity:.06;background:url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"160\" height=\"160\" viewBox=\"0 0 160 160\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"2\" stitchTiles=\"stitch\"/></filter><rect width=\"100%\" height=\"100%\" filter=\"url(%23n)\" opacity=\"1\"/></svg>') repeat;mix-blend-mode:overlay;z-index:5}`;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  // Sticky CTA on scroll
  useEffect(() => {
    const onScroll = () => setShowStickyCta(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Static/local portfolio items (edit these to your own links/thumbnails)
  const featured = [
    {
      id: "1",
      title: "Health Fair for Unhoused Neighbors",
      subtitle: "60–90s recap • case study",
      imageUrl: "https://picsum.photos/seed/case1/1200/800",
      videoUrl: "https://cdn.coverr.co/videos/coverr-community-garden-4712/1080p.mp4",
      tags: ["event", "community care", "recap"],
    },
    {
      id: "2",
      title: "Community Testing Day",
      subtitle: "Micro‑doc • social cutdowns",
      imageUrl: "https://picsum.photos/seed/case2/1200/800",
      videoUrl: "https://cdn.coverr.co/videos/coverr-helping-hands-8022/1080p.mp4",
      tags: ["micro‑doc", "public health"],
    },
    {
      id: "3",
      title: "Policy Testimony Reel",
      subtitle: "Reels package",
      imageUrl: "https://picsum.photos/seed/case3/1200/800",
      videoUrl: "https://cdn.coverr.co/videos/coverr-voices-of-the-people-8478/1080p.mp4",
      tags: ["policy", "advocacy", "reels"],
    },
    {
      id: "4",
      title: "Neighborhood Leader Story",
      subtitle: "3–5 min docu‑short",
      imageUrl: "https://picsum.photos/seed/case4/1200/800",
      videoUrl: "https://cdn.coverr.co/videos/coverr-walking-through-the-city-1580/1080p.mp4",
      tags: ["portrait", "docu‑short"],
    },
  ];

  const moreCases = [1, 2, 3, 4, 5, 6].map((i) => ({
    id: `m-${i}`,
    title: `Case Study ${i}`,
    subtitle: "60–90s • Micro‑doc",
    imageUrl: `https://picsum.photos/seed/changemedia-${i}/900/700`,
    tags: ["community", "health", "policy"],
  }));

  // Testimonials (placeholder avatars)
  const testimonials = [
    {
      name: "M. Alvarez",
      role: "Coalition Lead",
      avatar: "https://picsum.photos/seed/ava1/128/128",
      quote:
        "We saw sign-ups triple after the story pack. It changed the temperature of the room at council.",
    },
    {
      name: "D. Chen",
      role: "Clinic Director",
      avatar: "https://picsum.photos/seed/ava2/128/128",
      quote:
        "They listen like researchers and shoot like filmmakers. The result moved our board to act.",
    },
    {
      name: "S. Patel",
      role: "Policy Organizer",
      avatar: "https://picsum.photos/seed/ava3/128/128",
      quote:
        "Fast, ethical, effective. The reels traveled further than any memo we’ve published this year.",
    },
  ];

  // Handle inquiry form POST → /api/inquiry (Airtable Inquiries table)
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to send inquiry");
      setSubmitted(true);
      form.reset();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-neutral-950 text-neutral-50 selection:bg-emerald-300/40 selection:text-emerald-900">
      <div className="grain" />

      {/* BACKDROP ART */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(16,185,129,0.12),transparent_60%)] blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(closest-side,rgba(56,189,248,0.12),transparent_60%)] blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgba(236,72,153,0.12),transparent_60%)] blur-3xl" />
      </div>

      {/* NAV */}
      <header className="sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mt-4 mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-sky-400" />
              <span className="font-semibold tracking-tight">CHANGE Media</span>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-300">
              <a href="#work" className="hover:text-white">Work</a>
              <a href="/why" className="hover:text-white">Why</a>
              <a href="#studio" className="hover:text-white">Studio</a>
              <a href="#services" className="hover:text-white">Services</a>
              <a href="#contact" className="hover:text-white">Contact</a>
            </nav>
            <div className="flex items-center gap-3">
              <a href="#contact" className="hidden md:inline-flex items-center rounded-xl bg-white text-neutral-900 px-3 py-2 text-sm font-medium hover:bg-neutral-200">Book a call</a>
              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden inline-flex items-center rounded-xl border border-white/15 px-3 py-2 text-sm">Menu</button>
            </div>
          </div>
        </div>
        {menuOpen && (
          <div className="mx-auto max-w-6xl px-4 pb-4 md:hidden">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-3 text-sm text-neutral-300">
              <a href="#work" className="block rounded-lg px-3 py-2 hover:bg-white/5">Work</a>
              <a href="/why" className="block rounded-lg px-3 py-2 hover:bg-white/5">Why</a>
              <a href="#studio" className="block rounded-lg px-3 py-2 hover:bg-white/5">Studio</a>
              <a href="#services" className="block rounded-lg px-3 py-2 hover:bg-white/5">Services</a>
              <a href="#contact" className="block rounded-lg px-3 py-2 hover:bg-white/5">Contact</a>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-20 md:pt-20 md:pb-28">
          <motion.div {...fade}>
            <div className="flex flex-wrap items-end gap-3">
              <p className="text-xs uppercase tracking-[0.28em] text-neutral-400">Cinematic • Documentary • Reels</p>
              <Pill>Denver & Beyond</Pill>
            </div>
            <h1 className="mt-5 text-5xl md:text-7xl font-semibold leading-[1.02]">
              <span className="bg-gradient-to-br from-emerald-300 via-sky-300 to-purple-300 bg-clip-text text-transparent">Story is policy</span>
              <br /> in a language everyone can read.
            </h1>
            <p className="mt-5 max-w-2xl text-neutral-300">Youth‑led studio making micro‑docs, reels, and campaign assets about health, community, and public imagination. Built like a studio, guided like a movement.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#work" className="rounded-xl bg-white text-neutral-900 px-4 py-2 text-sm font-medium hover:bg-neutral-200">See work</a>
              <a href="#contact" className="rounded-xl border border-white/20 px-4 py-2 text-sm hover:bg-white/5">Start a project</a>
              <a href="#reel" className="rounded-xl border border-white/0 bg-gradient-to-br from-emerald-400/20 to-sky-400/20 px-4 py-2 text-sm hover:from-emerald-400/30 hover:to-sky-400/30">Play showreel</a>
            </div>
          </motion.div>

          {/* Floating metrics */}
          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[{k:"200+", v:"neighbors reached via direct care"},{k:"10+", v:"policy efforts documented"},{k:"72 hr", v:"typical event‑to‑edit"},{k:"6 mo", v:"recommended retainer"}].map((s)=> (
              <motion.div key={s.k} {...fade} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="text-2xl font-semibold">{s.k}</div>
                <div className="text-xs text-neutral-400">{s.v}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SCROLLING MARQUEE */}
      <section className="border-y border-white/10 bg-white/5">
        <div className="mx-auto max-w-6xl px-4 py-6 overflow-hidden">
          <div className="animate-[marquee_30s_linear_infinite] whitespace-nowrap text-neutral-400">
            {[
              "micro‑docs",
              "reels",
              "community testing",
              "health fairs",
              "youth storytelling",
              "policy testimony",
              "coalition work",
              "editorial film",
            ].map((w) => (
              <span key={w} className="mx-6">• {w.toUpperCase()} •</span>
            ))}
          </div>
        </div>
      </section>

      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>

      {/* LOGO CLOUD (startup-style social proof) */}
      <section className="border-b border-white/10 bg-white/5">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="text-center text-xs uppercase tracking-[0.22em] text-neutral-400">Trusted by teams who build for people</div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 items-center gap-6 opacity-80">
            {[
              { src: "/vercel.svg", alt: "Vercel" },
              { src: "/next.svg", alt: "Next.js" },
              { src: "/globe.svg", alt: "Globe" },
              { src: "/window.svg", alt: "Window" },
              { src: "/file.svg", alt: "File" },
              { src: "/vercel.svg", alt: "Vercel 2" },
            ].map((l) => (
              <div key={l.alt} className="flex items-center justify-center py-2">
                <Image src={l.src} alt={l.alt} width={100} height={28} className="h-7 w-auto opacity-70" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOWREEL */}
      <section id="reel" className="border-b border-white/10 bg-white/5">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <motion.div {...fade} className="rounded-3xl overflow-hidden border border-white/10 bg-black/60">
            <div className="aspect-video w-full">
              {/* Replace with your real showreel URL */}
              <iframe className="h-full w-full" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Showreel" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED CASES (local/static) */}
      <section id="work">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <motion.h2 {...fade} className="text-2xl md:text-3xl font-semibold">Featured Work</motion.h2>
          <p className="mt-2 max-w-2xl text-neutral-400">Portfolio pieces with a documentary heart. Hover to preview motion.</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6">
            {featured.map((it, idx) => (
              <div key={it.id} className={idx === 0 || idx === 3 ? "md:col-span-7" : "md:col-span-5"}>
                <CaseCard
                  title={it.title}
                  subtitle={it.subtitle}
                  img={it.imageUrl}
                  video={it.videoUrl}
                  tags={it.tags}
                />
              </div>
            ))}
          </div>

          {/* Masonry: more cases */}
          <div className="mt-10 columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
            {moreCases.map((it) => (
              <a key={it.id} href="#" className="group mb-6 break-inside-avoid rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                <Image
                  src={it.imageUrl}
                  alt={it.title}
                  width={900}
                  height={700}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="w-full h-auto object-cover transition group-hover:scale-[1.02]"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{it.title}</div>
                    <div className="text-xs text-neutral-400">{it.subtitle}</div>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-neutral-400">{(it.tags || []).join(" • ")}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS */}
      <section id="features" className="border-y border-white/10 bg-white/5">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <motion.h2 {...fade} className="text-2xl md:text-3xl font-semibold">Why partners pick us</motion.h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { t: "Research-grade rigor", d: "Field reporting, public-health framing, and behavioral science inform every cut." },
              { t: "Community authorship", d: "Co-create with the people closest to the story, on and off camera." },
              { t: "From content to consequence", d: "Distribution aligned to services, hearings, and real local action." },
            ].map((f) => (
              <div key={f.t} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="text-lg font-medium">{f.t}</div>
                <p className="mt-2 text-sm text-neutral-300">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STUDIO */}
      <section id="studio" className="border-y border-white/10 bg-white/5">
        <div className="mx-auto max-w-6xl px-4 py-16 grid items-start gap-12 md:grid-cols-2">
          <motion.div {...fade}>
            <h3 className="text-2xl md:text-3xl font-semibold">Studio ethos</h3>
            <p className="mt-3 text-neutral-300">Editorial craft meets community practice. Fast field interviews, clean sound, mobile‑first edits that keep a cinematic core. Consent‑forward workflows and de‑identification options where needed.</p>
            <ul className="mt-6 space-y-3 text-sm text-neutral-300">
              <li className="flex gap-2"><span className="h-1.5 w-1.5 mt-2 rounded-full bg-emerald-400"/>Formats: reels, shorts, 3–5 min anchors</li>
              <li className="flex gap-2"><span className="h-1.5 w-1.5 mt-2 rounded-full bg-sky-400"/>Field kit: A7 IV, SM7 + lavs, dome light, gimbal</li>
              <li className="flex gap-2"><span className="h-1.5 w-1.5 mt-2 rounded-full bg-purple-400"/>Data care: consent logs, secure storage</li>
            </ul>
          </motion.div>
          <motion.blockquote {...fade} className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6">
            <p className="text-lg leading-relaxed">“The map should learn from the foot that walks it. Our job is to listen, film, and translate care into images that move people to act.”</p>
            <footer className="mt-3 text-sm text-neutral-400">— CHANGE Media Notes</footer>
          </motion.blockquote>
        </div>
      </section>

      {/* SERVICES with pricing toggle */}
      <section id="services">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <motion.h2 {...fade} className="text-2xl md:text-3xl font-semibold">Services</motion.h2>
          <p className="mt-2 max-w-2xl text-neutral-400">Simple packages to start; scale with add‑ons when you need them.</p>

          {/* Billing toggle */}
          <div className="mt-6 inline-flex items-center rounded-xl border border-white/10 bg-white/5 p-1">
            <button onClick={() => setAnnual(false)} className={`px-3 py-1 text-sm rounded-lg ${!annual ? "bg-white text-neutral-900" : "text-neutral-300"}`}>Monthly</button>
            <button onClick={() => setAnnual(true)} className={`px-3 py-1 text-sm rounded-lg ${annual ? "bg-white text-neutral-900" : "text-neutral-300"}`}>Annual</button>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              { id: "retainer", t: "Monthly Content Retainer", pMonthly: "from $2,750/mo", pAnnual: "from $2,500/mo (annual)", pts: ["4 reels (45–60s)", "20 edited photos", "Strategy + light analytics"]},
              { id: "doc", t: "Docu‑Short (3–5 min)", pOne: "$4,500 base", pts: ["1 shoot day", "Interview + b‑roll", "3 vertical cutdowns"]},
              { id: "event", t: "Event Story Pack", pOne: "$2,200", pts: ["Up to 5‑hr coverage", "60–90s recap", "3 reels + 20 photos"]},
            ].map((c) => {
              const price = c.id === "retainer" ? (annual ? c.pAnnual : c.pMonthly) : c.pOne;
              return (
                <motion.div {...fade} key={c.t} className="group rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-medium">{c.t}</div>
                    <div className="text-sm text-neutral-400">{price}</div>
                  </div>
                  <ul className="mt-4 text-sm text-neutral-300 space-y-2">
                    {c.pts.map((pt) => (
                      <li key={pt} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/60" />{pt}</li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <a href="#contact" className="inline-flex items-center rounded-xl border border-white/20 px-4 py-2 text-sm hover:bg-white/5">Book discovery</a>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Included kit */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-neutral-300">Included kit: Sony A7 IV cinema setup • SM7 broadcast mics + lavs • dome lighting • gimbal option • pro edit & captions. Travel billed at IRS standard rate outside Denver metro.</div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="border-t border-white/10 bg-white/5">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <motion.h2 {...fade} className="text-2xl md:text-3xl font-semibold">What partners say</motion.h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6">
                <div className="flex items-center gap-3">
                  <Image src={t.avatar} alt={t.name} width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
                  <div>
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-neutral-400">{t.role}</div>
                  </div>
                </div>
                <p className="mt-4 text-neutral-300">“{t.quote}”</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-white/10 bg-white/5">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <motion.h2 {...fade} className="text-2xl md:text-3xl font-semibold">FAQ</motion.h2>
          <div className="mt-6 grid gap-3">
            {[
              { q: "How fast can you turn around a project?", a: "Event-to-edit is typically 72 hours. For docu‑shorts, expect 2–4 weeks depending on scope." },
              { q: "Do you work outside Denver?", a: "Yes. Travel is billed at the IRS standard rate outside the Denver metro, with flexible remote pre‑pro." },
              { q: "How do you measure impact?", a: "We use resonance (recall/belief shift), behavior (sign‑ups, referrals), and systems (citations, adoption)." },
            ].map((f) => (
              <details key={f.q} className="group rounded-2xl border border-white/10 bg-white/5 p-4 open:bg-white/10">
                <summary className="cursor-pointer list-none font-medium">
                  <span className="mr-2">➤</span>{f.q}
                </summary>
                <p className="mt-2 text-sm text-neutral-300">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="border-t border-white/10 bg-white/5">
        <div className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-2 gap-10 items-start">
          <div>
            <motion.h2 {...fade} className="text-2xl md:text-3xl font-semibold">Start a Project</motion.h2>
            <p className="mt-2 max-w-prose text-neutral-300">Tell us about your story. We’ll reply within 1 business day with a quick scope and next steps.</p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-neutral-900 p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm">Name</label>
                  <input name="name" required className="mt-1 w-full rounded-xl border border-white/10 bg-neutral-950 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm">Email</label>
                  <input type="email" name="email" required className="mt-1 w-full rounded-xl border border-white/10 bg-neutral-950 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm">Organization</label>
                  <input name="org" className="mt-1 w-full rounded-xl border border-white/10 bg-neutral-950 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm">Project details</label>
                  <textarea name="details" rows={4} required className="mt-1 w-full rounded-xl border border-white/10 bg-neutral-950 px-3 py-2" placeholder="What do you want to make? Timeline? Budget range?" />
                </div>
                <button disabled={submitting || submitted} className="w-full md:w-auto rounded-xl bg-white text-neutral-900 px-4 py-2 text-sm font-medium hover:bg-neutral-200 disabled:opacity-60">
                  {submitted ? "Sent — thanks!" : submitting ? "Sending…" : "Send inquiry"}
                </button>
                {error && <p className="text-sm text-red-400">{error}</p>}
              </form>
            </div>
          </div>
          <div className="md:pt-10">
            <div className="rounded-2xl border border-white/10 bg-neutral-900 p-6">
              <h3 className="font-semibold">Book directly</h3>
              <p className="mt-2 text-sm text-neutral-400">Grab a slot that works and we’ll meet you there.</p>
              <a href="https://calendly.com/your-link" className="mt-4 inline-flex rounded-xl bg-white text-neutral-900 px-4 py-2 text-sm font-medium hover:bg-neutral-200">Open Calendly</a>
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-neutral-400">Email</div>
                  <div>hello@changemedia.org</div>
                </div>
                <div>
                  <div className="text-neutral-400">City</div>
                  <div>Denver, CO</div>
                </div>
                <div>
                  <div className="text-neutral-400">Instagram</div>
                  <a href="#" className="underline">@changemedia</a>
                </div>
                <div>
                  <div className="text-neutral-400">YouTube</div>
                  <a href="#" className="underline">CHANGE Media</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-400 flex flex-col md:flex-row items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} CHANGE Media</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
          </div>
        </div>
      </footer>

      {/* Sticky CTA */}
      {showStickyCta && (
        <div className="fixed inset-x-4 bottom-4 z-50">
          <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white text-neutral-900 shadow-xl">
            <div className="flex flex-col items-center justify-between gap-3 px-4 py-3 md:flex-row">
              <div className="text-center md:text-left">
                <div className="text-sm font-medium">Ready to move people to act?</div>
                <div className="text-xs text-neutral-600">Book a 15‑min discovery call. No pressure.</div>
              </div>
              <div className="flex gap-2">
                <a href="#contact" className="inline-flex items-center rounded-xl bg-neutral-900 text-white px-4 py-2 text-sm hover:bg-neutral-800">Book a call</a>
                <a href="/why" className="inline-flex items-center rounded-xl border border-neutral-900/10 px-4 py-2 text-sm">Why us</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
