'use client';

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function PhotographyPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Fixed nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-medium tracking-tight">CHANGE®</Link>
          <div className="flex items-center gap-8 text-sm">
            <Link href="/" className="hover:text-neutral-400 transition">Home</Link>
            <Link href="/change-studios" className="hover:text-neutral-400 transition">Studios</Link>
            <Link href="/why" className="hover:text-neutral-400 transition">Why</Link>
            <a href="#contact" className="rounded-full bg-white text-neutral-950 px-5 py-2 text-sm font-medium hover:bg-neutral-200 transition">Get in touch</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1920&q=80"
          alt="Photography"
          fill
          priority
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/60 to-neutral-950" />
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-400 mb-6">Photography</p>
            <h1 className="text-7xl md:text-9xl font-bold tracking-tight leading-[0.85] mb-8">
              Visual<br />storytelling<br />that <span className="italic text-neutral-500">moves</span>.
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto mb-10">
              Editorial-grade photography for campaigns, events, and portraits<br />that center community and amplify impact.
            </p>
            <div className="flex items-center justify-center gap-4">
              <a href="#portfolio" className="rounded-full bg-white text-neutral-950 px-8 py-3 font-medium hover:bg-neutral-200 transition">View portfolio</a>
              <a href="#contact" className="rounded-full border border-white/20 px-8 py-3 hover:bg-white/10 transition">Book a shoot</a>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Full-width masonry grid */}
      <section id="portfolio" className="py-20">
        <div className="px-6 mb-12">
          <h2 className="text-5xl md:text-6xl font-bold text-center">Recent <span className="text-neutral-500">Work.</span></h2>
        </div>
        
        {/* Masonry grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 px-4">
          {[
            { img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80", tall: false },
            { img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80", tall: true },
            { img: "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?w=800&q=80", tall: false },
            { img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80", tall: true },
            { img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80", tall: false },
            { img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80", tall: false },
            { img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", tall: true },
            { img: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80", tall: false },
            { img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80", tall: true },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="mb-4 break-inside-avoid group relative overflow-hidden rounded-lg cursor-pointer"
            >
              <Image
                src={item.img}
                alt={`Photo ${i + 1}`}
                width={800}
                height={item.tall ? 1000 : 600}
                className="w-full h-auto object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-32 px-6 border-t border-white/10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-5xl font-bold mb-16">Photography <span className="text-neutral-500">Services.</span></h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                name: "Event Coverage", 
                price: "$1,800", 
                desc: "Up to 6 hours",
                features: ["200+ edited photos", "Same-day selects", "Full gallery in 72hr", "Usage rights included"] 
              },
              { 
                name: "Portrait Session", 
                price: "$850", 
                desc: "2 hour session",
                features: ["1-3 subjects", "50 edited photos", "Creative direction", "Location scouting"] 
              },
              { 
                name: "Campaign Package", 
                price: "from $3,500", 
                desc: "Multi-day shoot",
                features: ["Creative concepting", "Location + talent", "300+ edited photos", "Licensing options"] 
              },
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 hover:bg-white/10 transition"
              >
                <h3 className="text-2xl font-semibold mb-2">{service.name}</h3>
                <p className="text-sm text-neutral-500 mb-4">{service.desc}</p>
                <p className="text-4xl font-bold text-white mb-6">{service.price}</p>
                <ul className="space-y-3 text-neutral-300 mb-8">
                  {service.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="block text-center rounded-full border border-white/20 px-6 py-3 hover:bg-white/10 transition text-sm">Book this package</a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="py-32 px-6 border-t border-white/10">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8">Our <span className="italic text-neutral-500">Approach</span></h2>
            <p className="text-xl text-neutral-300 leading-relaxed max-w-3xl mx-auto mb-16">
              We believe photography should honor the people in frame. Every shoot prioritizes consent, 
              co-creation, and cultural humility. The result: images that feel authentic, dignified, and ready to move audiences.
            </p>
            <div className="grid md:grid-cols-3 gap-12 text-left">
              <div>
                <div className="text-6xl font-bold text-neutral-800 mb-4">01</div>
                <h3 className="text-xl font-semibold mb-3">Consent-first</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">Clear releases, de-identification options, and collaborative review before any image goes public.</p>
              </div>
              <div>
                <div className="text-6xl font-bold text-neutral-800 mb-4">02</div>
                <h3 className="text-xl font-semibold mb-3">Community-led</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">Subject input on framing, posing, and final selects. Your story, your terms.</p>
              </div>
              <div>
                <div className="text-6xl font-bold text-neutral-800 mb-4">03</div>
                <h3 className="text-xl font-semibold mb-3">Editorial quality</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">Professional lighting, composition, and post-production that rivals top-tier publications.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-32 px-6 border-t border-white/10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Let's create<br /><span className="italic text-neutral-500">something powerful</span> together.</h2>
          <p className="text-xl text-neutral-400 mb-12">Email us at <a href="mailto:hello@changemedia.org" className="underline hover:text-white transition">hello@changemedia.org</a> to discuss your project.</p>
          <a href="mailto:hello@changemedia.org" className="inline-block rounded-full bg-white text-neutral-950 px-10 py-4 text-lg font-medium hover:bg-neutral-200 transition">Get in touch</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
          <p>© {new Date().getFullYear()} CHANGE Media. All rights reserved.</p>
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
