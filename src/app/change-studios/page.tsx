'use client';

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// Magnetic button component
function MagneticButton({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouse = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.3;
    const y = (clientY - (top + height / 2)) * 0.3;
    setPosition({ x, y });
  };

  return (
    <motion.button
      ref={buttonRef}
      className={className}
      onMouseMove={handleMouse}
      onMouseLeave={() => setPosition({ x: 0, y: 0 })}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.button>
  );
}

// Reveal text animation
function RevealText({ children, delay = 0 }: { children: string, delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <span ref={ref} className="inline-block overflow-hidden">
      <motion.span
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : { y: "100%" }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function ChangeStudiosPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const heroOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(smoothProgress, [0, 0.3], [1, 1.2]);
  const heroY = useTransform(smoothProgress, [0, 0.5], [0, -300]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMouse = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMouse);
    return () => window.removeEventListener('mousemove', updateMouse);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-neutral-950 text-white overflow-x-hidden">
      {/* Custom cursor */}
      <motion.div
        className="fixed w-6 h-6 border-2 border-cyan-400/50 rounded-full pointer-events-none z-[100] mix-blend-difference hidden md:block"
        animate={{ x: mousePosition.x - 12, y: mousePosition.y - 12 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      {/* Glassmorphic nav */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        className="fixed top-4 left-4 right-4 z-50 bg-neutral-900/30 backdrop-blur-2xl border border-white/10 rounded-2xl"
      >
        <div className="mx-auto max-w-7xl px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-medium tracking-tight hover:text-cyan-400 transition-colors">
            CHANGE<span className="text-cyan-400">®</span>
          </Link>
          <div className="hidden md:flex items-center gap-12 text-sm font-light">
            <Link href="/#work" className="hover:text-cyan-400 transition-all hover:tracking-wider duration-300">Work</Link>
            <Link href="/photography" className="hover:text-cyan-400 transition-all hover:tracking-wider duration-300">Photography</Link>
            <Link href="/why" className="hover:text-cyan-400 transition-all hover:tracking-wider duration-300">Why</Link>
          </div>
          <MagneticButton className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-2.5 text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-shadow">
            Get in touch
          </MagneticButton>
        </div>
      </motion.nav>

      {/* Hero with parallax */}
      <section ref={heroRef} className="relative h-[100vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="absolute inset-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=80"
            alt="Studio workspace"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/50 via-neutral-950/30 to-neutral-950" />
        </motion.div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/30 bg-cyan-400/5 backdrop-blur-sm text-sm text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Design Studio • Denver
            </span>
          </motion.div>

          <h1 className="text-7xl md:text-[10rem] font-bold leading-[0.9] tracking-tighter mb-8">
            <div className="overflow-hidden">
              <RevealText delay={0.2}>Create</RevealText>
            </div>
            <div className="overflow-hidden">
              <RevealText delay={0.3}>Impact</RevealText>
            </div>
            <div className="overflow-hidden bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              <RevealText delay={0.4}>Together</RevealText>
            </div>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-xl md:text-2xl text-neutral-400 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Webby-level design studio crafting digital experiences that don't just look beautiful—they change minds and move markets.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-12 flex items-center justify-center gap-4"
          >
            <MagneticButton className="group relative px-8 py-4 rounded-full bg-white text-neutral-950 font-medium overflow-hidden">
              <span className="relative z-10">Start a project</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </MagneticButton>
            <button className="px-8 py-4 rounded-full border border-white/20 hover:border-white/40 font-medium hover:bg-white/5 transition-all">
              View work
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
            >
              <motion.div className="w-1.5 h-1.5 rounded-full bg-white" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats with counter animation */}
      <section className="relative py-32 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { number: "150+", label: "Projects shipped" },
              { number: "95%", label: "Client satisfaction" },
              { number: "12", label: "Awards won" },
              { number: "8yr", label: "In business" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <motion.div
                  className="text-5xl md:text-7xl font-bold bg-gradient-to-br from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2"
                  whileHover={{ scale: 1.05 }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-sm text-neutral-500 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services with hover effects */}
      <section className="relative py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6">
              What we <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">create</span>
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl">
              Award-winning digital experiences across all touchpoints
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Brand Systems",
                desc: "Complete visual identities that scale",
                price: "$15,000+",
                features: ["Logo & Typography", "Color Systems", "Guidelines", "Asset Library"]
              },
              {
                title: "Web Experiences",
                desc: "Sites that convert and captivate",
                price: "$25,000+",
                features: ["UI/UX Design", "Development", "CMS Integration", "Performance"]
              },
              {
                title: "Digital Products",
                desc: "Apps and platforms users love",
                price: "$40,000+",
                features: ["Product Strategy", "User Research", "Design System", "Prototyping"]
              }
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 backdrop-blur-xl hover:border-cyan-400/50 transition-all duration-500"
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all duration-500" />
                
                <div className="relative z-10">
                  <div className="text-5xl font-bold text-cyan-400/20 group-hover:text-cyan-400/40 transition-colors mb-4">
                    0{i + 1}
                  </div>
                  <h3 className="text-3xl font-bold mb-3">{service.title}</h3>
                  <p className="text-neutral-400 mb-6">{service.desc}</p>
                  <div className="text-2xl font-bold text-cyan-400 mb-6">{service.price}</div>
                  <ul className="space-y-2 mb-8">
                    {service.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-neutral-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-3 rounded-full border border-white/20 group-hover:bg-white group-hover:text-neutral-950 font-medium transition-all duration-300">
                    Learn more
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-16 rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5" />
            <div className="relative z-10">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
                Ready to create something extraordinary?
              </h2>
              <p className="text-xl text-neutral-400 mb-8">
                Let's build your next award-winning project together
              </p>
              <MagneticButton className="px-10 py-5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-lg font-medium hover:shadow-2xl hover:shadow-cyan-500/30 transition-shadow">
                Start your project →
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="text-sm text-neutral-500">© 2025 CHANGE Media Studios</div>
          <div className="flex items-center gap-6 text-sm text-neutral-500">
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
