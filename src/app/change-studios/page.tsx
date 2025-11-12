'use client';

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ChangeStudiosPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Fixed nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-medium tracking-tight">CHANGE®</Link>
          <div className="flex items-center gap-8 text-sm">
            <Link href="/" className="hover:text-neutral-400 transition">Home</Link>
            <Link href="/apothecary" className="hover:text-neutral-400 transition">Apothecary</Link>
            <Link href="/why" className="hover:text-neutral-400 transition">Why</Link>
            <a href="#contact" className="rounded-full bg-white text-neutral-950 px-5 py-2 text-sm font-medium hover:bg-neutral-200 transition">Get in touch</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=80"
          alt="Studio workspace"
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-950/50 to-neutral-950" />
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-400 mb-6">Change Studios®</p>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.9] mb-8">
              Design studio based in<br />Denver, built for brands<br />driven by <span className="italic">impact</span>.
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto mb-10">
              Through cutting-edge visuals, strategic storytelling, and innovative design,<br />we transform ideas into unforgettable digital identities.
            </p>
            <div className="flex items-center justify-center gap-4">
              <a href="#work" className="rounded-full bg-white text-neutral-950 px-8 py-3 font-medium hover:bg-neutral-200 transition">View work</a>
              <a href="#contact" className="rounded-full border border-white/20 px-8 py-3 hover:bg-white/10 transition">Start a project</a>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Why Choose */}
      <section id="why" className="py-32 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-16">Why Choose <span className="text-neutral-500">Change Studios?</span></h2>
            <div className="grid md:grid-cols-3 gap-16">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Cutting-Edge Creativity</h3>
                <p className="text-neutral-400 leading-relaxed">Field reporting, public-health framing, and behavioral science inform every cut. We shoot like filmmakers and think like researchers.</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">24/7 Email Support</h3>
                <p className="text-neutral-400 leading-relaxed">Co-create with the people closest to the story, on and off camera. Community authorship meets editorial craft.</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Fast & Efficient Turnarounds</h3>
                <p className="text-neutral-400 leading-relaxed">Event-to-edit in 72 hours. Distribution aligned to services, hearings, and real local action.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Work Grid */}
      <section id="work" className="py-32 px-6 border-t border-white/10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-5xl font-bold mb-16">Featured <span className="text-neutral-500">Projects.</span></h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", title: "LuxeWear", cat: "Brand Identity" },
              { img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80", title: "Community Health Fair", cat: "Documentary" },
              { img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80", title: "Policy Testimony Reel", cat: "Advocacy Campaign" },
              { img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80", title: "Neighborhood Leader", cat: "Portrait Series" },
            ].map((project, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer"
              >
                <Image src={project.img} alt={project.title} fill className="object-cover group-hover:scale-105 transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-sm text-neutral-400 mb-2">{project.cat}</p>
                  <h3 className="text-3xl font-semibold">{project.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Pricing */}
      <section className="py-32 px-6 border-t border-white/10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-5xl font-bold mb-16">Services.</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Monthly Content Retainer", price: "from $2,750/mo", features: ["4 reels (45–60s)", "20 edited photos", "Strategy + light analytics"] },
              { name: "Docu-Short (3–5 min)", price: "$4,500 base", features: ["1 shoot day", "Interview + b-roll", "3 vertical cutdowns"] },
              { name: "Event Story Pack", price: "$2,200", features: ["Up to 5-hr coverage", "60–90s recap", "3 reels + 20 photos"] },
            ].map((service, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-8 hover:bg-white/10 transition">
                <h3 className="text-2xl font-semibold mb-2">{service.name}</h3>
                <p className="text-3xl font-bold text-neutral-400 mb-6">{service.price}</p>
                <ul className="space-y-3 text-neutral-300 mb-8">
                  {service.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="block text-center rounded-full border border-white/20 px-6 py-3 hover:bg-white/10 transition">Book discovery</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-32 px-6 border-t border-white/10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Let's create something<br /><span className="italic text-neutral-500">unforgettable</span> together.</h2>
          <p className="text-xl text-neutral-400 mb-12">Email us at <a href="mailto:hello@changemedia.org" className="underline hover:text-white transition">hello@changemedia.org</a> to start.</p>
          <a href="mailto:hello@changemedia.org" className="inline-block rounded-full bg-white text-neutral-950 px-10 py-4 text-lg font-medium hover:bg-neutral-200 transition">Get in touch</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
          <p>© {new Date().getFullYear()} CHANGE Media Studios. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
