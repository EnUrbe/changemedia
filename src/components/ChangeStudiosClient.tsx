"use client";

import { motion, useScroll, useTransform, useReducedMotion, useSpring } from "framer-motion";
import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { Instrument_Serif } from "next/font/google";
import Button from "@/components/ui/Button";
import NavBar from "@/components/ui/NavBar";
import GradientShaderCard from "@/components/ui/GradientShaderCard";
import ShowcaseSlider from "@/components/ui/ShowcaseSlider";
import type { SiteContent } from "@/lib/contentSchema";
import Image from "next/image";

const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-serif" });

function FadeIn({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Marquee({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex overflow-hidden py-4">
      <motion.div
        className="flex min-w-full shrink-0 gap-12 whitespace-nowrap px-12"
        animate={{ x: "-100%" }}
        transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
      >
        {children}
        {children}
      </motion.div>
      <motion.div
        className="flex min-w-full shrink-0 gap-12 whitespace-nowrap px-12"
        animate={{ x: "-100%" }}
        transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

export default function ChangeStudiosClient({ content }: { content: SiteContent }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [hoveredPillar, setHoveredPillar] = useState<number | null>(null);

  const data = content.changeStudios || {
    hero: {
      titleLine1: "CHANGE",
      titleLine2: "STUDIOS",
      mission: "We bridge the gap between public health rigor and cinematic storytelling.",
      cta: "Start a Project"
    },
    marquee: {
      text1: "Not a marketing agency.",
      text2: "A narrative engine."
    },
    pillars: [
      {
        title: "Cinematic Storytelling",
        desc: "Documentary-style films that honor the subject.",
        tags: ["Impact Films", "Docu-Series", "Editorial"]
      },
      {
        title: "Digital Media",
        desc: "Short-form content for the algorithmic age.",
        tags: ["Social Strategy", "Podcasts", "Explainers"]
      },
      {
        title: "Narrative Strategy",
        desc: "Messaging frameworks grounded in ethics.",
        tags: ["Brand Identity", "Campaigns", "Research"]
      },
      {
        title: "Creative Partnerships",
        desc: "Collaborating with visionaries for change.",
        tags: ["Co-Production", "Talent", "Events"]
      }
    ],
    showcase: [
      { id: "1", title: "World Central Kitchen", category: "Docu-Series", year: "2024", image: "/uploads/wck.jpg" },
      { id: "2", title: "Planned Parenthood", category: "Campaign", year: "2023", image: "/uploads/pp.jpg" },
      { id: "3", title: "Harvard Public Health", category: "Brand Strategy", year: "2024", image: "/uploads/harvard.jpg" },
      { id: "4", title: "LA County Health", category: "Narrative", year: "2023", image: "/uploads/lac.jpg" }
    ]
  };

  // Use the first featured case image as hero background fallback
  const heroBg = content.featuredCases?.[0]?.imageUrl || "/uploads/studio-hero.jpg";

  return (
    <div 
      ref={containerRef} 
      className={`min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black ${serif.variable}`}
    >
      <div className="noise-bg fixed inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay"></div>
      
      <NavBar 
        links={[
          { label: "Work", href: "/work" },
          { label: "Studio", href: "/studio" },
          { label: "Journal", href: "/journal" },
          { label: "Contact", href: "/contact" }
        ]} 
        tone="dark"
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center px-4 md:px-8 pt-32 pb-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
           <Image
              src={heroBg}
              alt="Studio Background"
              fill
              className="object-cover opacity-40 blur-sm scale-105"
              priority
           />
           <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#050505]" />
        </div>

        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />
        
        <div className="max-w-[1800px] mx-auto w-full z-10">
          <FadeIn>
            <h1 className="font-serif text-[15vw] leading-[0.8] tracking-tighter mix-blend-difference text-white">
              {data.hero.titleLine1}
              <br />
              <span className="ml-[10vw] italic text-white/40">{data.hero.titleLine2}</span>
            </h1>
          </FadeIn>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-12 gap-8 items-end border-t border-white/10 pt-8">
            <div className="md:col-span-5">
              <p className="text-sm uppercase tracking-widest text-white/40 mb-4">Mission</p>
              <p className="text-xl md:text-2xl font-light leading-relaxed text-white/80">
                {data.hero.mission}
              </p>
            </div>
            <div className="md:col-span-7 flex justify-end">
               <Button variant="primary" className="rounded-full px-8 py-6 text-lg">
                  {data.hero.cta}
               </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-20 border-y border-white/5 bg-white/5 backdrop-blur-sm overflow-hidden">
        <Marquee>
          <span className="text-8xl font-serif italic text-white/20 mx-8">{data.marquee.text1}</span>
          <span className="text-8xl font-serif text-white mx-8">{data.marquee.text2}</span>
        </Marquee>
      </section>

      {/* Pillars List */}
      <section className="py-32 px-4 md:px-8 max-w-[1800px] mx-auto">
        <div className="mb-16">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Our Methodology</h2>
          <p className="text-4xl md:text-6xl font-serif max-w-3xl">
            Four pillars of <span className="italic text-white/60">impact</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.pillars.map((pillar, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="h-full"
              onMouseEnter={() => setHoveredPillar(index)}
              onMouseLeave={() => setHoveredPillar(null)}
            >
              <GradientShaderCard className="h-full rounded-2xl border-white/10 bg-white/5 backdrop-blur flex flex-col justify-between min-h-[400px]">
                <div>
                  <div className="flex items-center justify-between pb-6">
                    <span className="text-xs font-bold uppercase tracking-[0.32em] text-white/60">
                      0{index + 1}
                    </span>
                    <div className="h-px w-16 bg-white/20 group-hover:w-24 transition-all" />
                  </div>
                  <h3 className="font-serif text-3xl md:text-4xl text-white mb-4">
                    {pillar.title}
                  </h3>
                  <p className="text-base leading-relaxed text-white/60">
                    {pillar.desc}
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-2">
                  {pillar.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full border border-white/10 text-xs text-white/60 uppercase tracking-wider bg-black/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </GradientShaderCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Work / Proof Points */}
      <section className="py-32 bg-white/5 overflow-hidden">
        <div className="max-w-[1800px] mx-auto px-4 md:px-8 mb-12">
           <h2 className="font-serif text-5xl md:text-7xl mb-8">
             Selected<br/><span className="italic text-white/40">Works</span>
           </h2>
           <p className="text-white/60 max-w-md">
             From global health initiatives to local community advocacy, our work moves the needle.
           </p>
        </div>
        
        <ShowcaseSlider items={data.showcase} />
        
        <div className="max-w-[1800px] mx-auto px-4 md:px-8 mt-12 flex justify-end">
           <Button variant="ghost" className="group">
             View All Projects <span className="group-hover:translate-x-1 transition-transform">→</span>
           </Button>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-40 px-4 md:px-8 text-center">
        <FadeIn>
          <h2 className="font-serif text-6xl md:text-9xl mb-12 tracking-tight">
            Let's make<br/>
            <span className="italic text-white/40">history.</span>
          </h2>
          <Button variant="primary" className="text-xl px-10 py-6 rounded-full bg-white text-black hover:bg-neutral-200">
            Get in Touch
          </Button>
        </FadeIn>
      </section>
    </div>
  );
}
