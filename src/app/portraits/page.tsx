"use client";

import { Suspense, useRef, useState } from "react";
import Image from "next/image";
import NavBar from "@/components/ui/NavBar";
import Button from "@/components/ui/Button";

const PACKAGES = [
  {
    id: "solo",
    title: "The Solo",
    price: "$250",
    description: "For grads, creatives, and main characters.",
    features: ["45 minutes", "2 looks", "30+ high-res edits", "Film emulation included"],
  },
  {
    id: "duo",
    title: "The Duo",
    price: "$350",
    description: "Couples, best friends, or siblings.",
    features: ["60 minutes", "Combined + individual shots", "50+ high-res edits", "Polaroid scans"],
  },
  {
    id: "circle",
    title: "The Circle",
    price: "$450",
    description: "Small groups and families (up to 6).",
    features: ["90 minutes", "Group dynamics + solos", "75+ high-res edits", "Private online gallery"],
  },
];

const VIBES = [
  { title: "Editorial", desc: "Polished, magazine-style lighting." },
  { title: "Documentary", desc: "Candid, in-motion, unposed." },
  { title: "Film Noir", desc: "High contrast, moody, black & white." },
  { title: "Nostalgia", desc: "Warm tones, vintage feel, soft focus." },
];

export default function PortraitsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f2f0eb]" />}>
      <PortraitsPageContent />
    </Suspense>
  );
}

function PortraitsPageContent() {
  const formRef = useRef<HTMLDivElement>(null);
  const [selectedPackage, setSelectedPackage] = useState<string>("solo");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    // Simulate submission for now
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitting(false);
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <NavBar
        links={[
          { href: "/photography", label: "Photography" },
          { href: "/change-studios", label: "Studios" },
          { href: "/login", label: "Login" },
        ]}
        cta={{ href: "#form", label: "Book Session" }}
        tone="dark"
      />

      <main className="relative z-10 mx-auto max-w-[1400px] px-6 pb-32 space-y-32">
        
        {/* Hero */}
        <section className="pt-20 md:pt-32">
          <div className="rounded-[48px] border border-white/10 bg-white/5 p-8 md:p-20 shadow-2xl backdrop-blur-md">
            <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-8 max-w-3xl">
                <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
                  <span className="text-[0.65rem] uppercase tracking-[0.2em] text-white/60">Now Booking Spring &apos;25</span>
                </div>
                <h1 className="font-serif text-6xl leading-[0.9] text-white md:text-8xl lg:text-9xl">
                  Cinema for<br />your circle.
                </h1>
                <p className="text-xl text-white/60 md:text-2xl leading-relaxed max-w-xl">
                  Aesthetic portraits for graduates, couples, and friends. No stiff poses—just your vibe, captured on digital and film.
                </p>
              </div>
              <div className="flex flex-col gap-4 min-w-[200px]">
                <div className="text-right">
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Sessions start at</p>
                  <p className="font-serif text-4xl text-white">$250</p>
                </div>
                <Button href="#form" size="lg" variant="soft" onClick={scrollToForm}>
                  Reserve Date
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Vibes */}
        <section>
          <div className="flex flex-col gap-6 mb-12 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">The Aesthetic</p>
              <h2 className="font-serif text-5xl text-white md:text-6xl">Choose your look.</h2>
            </div>
            <p className="max-w-md text-white/60">We don&apos;t do &quot;standard&quot; headshots. Every session is color-graded to match your personal style.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            {VIBES.map((vibe) => (
              <div key={vibe.title} className="group rounded-[32px] border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/10 hover:shadow-xl hover:shadow-black/20 backdrop-blur-sm">
                <h3 className="font-serif text-3xl text-white">{vibe.title}</h3>
                <p className="mt-4 text-sm text-white/60 leading-relaxed">{vibe.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Selected Works */}
        <section>
          <div className="flex flex-col gap-6 mb-12 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Selected Works</p>
              <h2 className="font-serif text-5xl text-white md:text-6xl">Field notes.</h2>
            </div>
            <Button
              href="https://instagram.com"
              target="_blank"
              variant="ghost"
              size="lg"
              className="gap-2 text-sm font-medium normal-case tracking-[0.1em] text-white hover:bg-white/10"
            >
              See more on Instagram →
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 auto-rows-[400px]">
             {[
               "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
               "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80",
               "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
               "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
               "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80",
               "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
             ].map((src, i) => (
               <div key={i} className={`relative overflow-hidden rounded-[32px] group ${i === 0 || i === 3 ? "md:col-span-2" : ""}`}>
                 <Image src={src} alt="Portrait" fill className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                 <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
               </div>
             ))}
          </div>
        </section>

        {/* Packages */}
        <section>
          <div className="mb-12">
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Formats</p>
            <h2 className="font-serif text-5xl text-white md:text-6xl">Simple pricing.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {PACKAGES.map((pkg) => (
              <div 
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`cursor-pointer rounded-[40px] border p-10 transition-all duration-300 backdrop-blur-sm ${
                  selectedPackage === pkg.id 
                    ? "bg-white text-black border-white shadow-2xl scale-[1.02]" 
                    : "bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-serif text-4xl">{pkg.title}</h3>
                  {selectedPackage === pkg.id && <span className="text-[0.6rem] uppercase tracking-widest border border-black/10 rounded-full px-3 py-1">Selected</span>}
                </div>
                <p className={`mt-4 text-lg ${selectedPackage === pkg.id ? "text-neutral-600" : "text-white/60"}`}>{pkg.description}</p>
                <div className="my-8 h-px w-full bg-current opacity-10" />
                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-3 text-sm">
                      <span className={`h-1.5 w-1.5 rounded-full ${selectedPackage === pkg.id ? "bg-black" : "bg-white"}`} />
                      {feat}
                    </li>
                  ))}
                </ul>
                <div className="font-serif text-3xl">{pkg.price}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Booking Form */}
        <section id="form" ref={formRef} className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-[48px] bg-white/5 border border-white/10 p-8 md:p-12 shadow-2xl backdrop-blur-md">
            <div className="mb-10">
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Inquiry</p>
              <h2 className="font-serif text-4xl md:text-5xl text-white mt-2">Let&apos;s shoot.</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-white/40">Name</label>
                  <input required className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-white/30 focus:outline-none transition-colors placeholder:text-white/20" placeholder="Your name" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-white/40">Email</label>
                  <input required type="email" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-white/30 focus:outline-none transition-colors placeholder:text-white/20" placeholder="you@example.com" />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-white/40">Package</label>
                <div className="relative mt-2">
                  <select 
                    value={selectedPackage}
                    onChange={(e) => setSelectedPackage(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-white/30 focus:outline-none transition-colors"
                  >
                    {PACKAGES.map(p => <option key={p.id} value={p.id} className="bg-neutral-900 text-white">{p.title} — {p.price}</option>)}
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40">↓</div>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-white/40">Vibe / Ideas</label>
                <textarea className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-white/30 focus:outline-none transition-colors resize-none placeholder:text-white/20" rows={4} placeholder="Graduation photos, downtown vibe, sunset..." />
              </div>

              <button disabled={submitting || submitted} className="w-full rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-black transition-transform hover:scale-[1.02] disabled:opacity-70 hover:bg-neutral-200">
                {submitted ? "Request Sent" : submitting ? "Sending..." : "Send Request"}
              </button>
              {submitted && <p className="text-center text-xs text-emerald-400">We&apos;ll text you within 24 hours to lock in a date.</p>}
            </form>
          </div>

          <div className="rounded-[48px] bg-white/5 border border-white/10 p-8 md:p-12 text-white shadow-2xl flex flex-col justify-between backdrop-blur-md">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">What&apos;s included</p>
              <h3 className="font-serif text-3xl mt-4">Every session gets the full treatment.</h3>
              <ul className="mt-8 space-y-4 text-white/60 text-sm">
                <li className="flex gap-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-white mt-2 shrink-0" />
                  Creative direction & moodboarding
                </li>
                <li className="flex gap-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-white mt-2 shrink-0" />
                  Location scouting (Urban, Nature, or Studio)
                </li>
                <li className="flex gap-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-white mt-2 shrink-0" />
                  High-res gallery delivered in 5 days
                </li>
                <li className="flex gap-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-white mt-2 shrink-0" />
                  Print rights included
                </li>
              </ul>
            </div>
            <div className="mt-12 rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Deposit</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-serif text-4xl">$50</span>
                <span className="text-sm text-white/40">to book</span>
              </div>
              <p className="mt-2 text-xs text-white/40">Goes toward your total. Refundable up to 48h before.</p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
