'use client';

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });
  
  const heroY = useTransform(smoothProgress, [0, 0.5], [0, -400]);
  const heroScale = useTransform(smoothProgress, [0, 0.3], [1, 1.2]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.4], [1, 0]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const projects = [
    { 
      title: "Brand Campaign",
      category: "Commercial",
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80",
      color: "from-purple-500/20 to-pink-500/20"
    },
    { 
      title: "Editorial Series",
      category: "Photography",
      image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80",
      color: "from-cyan-500/20 to-blue-500/20"
    },
    { 
      title: "Product Launch",
      category: "Design",
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
      color: "from-orange-500/20 to-red-500/20"
    },
    { 
      title: "Lifestyle Campaign",
      category: "Video",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      color: "from-green-500/20 to-emerald-500/20"
    },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Custom cursor */}
      <motion.div
        className="fixed w-8 h-8 border border-purple-400/50 rounded-full pointer-events-none z-[100] mix-blend-difference hidden md:block"
        animate={{ x: mousePos.x - 16, y: mousePos.y - 16 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      {/* Floating Nav */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        className="fixed top-6 left-6 right-6 z-50 bg-neutral-900/20 backdrop-blur-2xl border border-white/10 rounded-full"
      >
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-light tracking-widest">
            CHANGE<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">®</span>
          </Link>
          <div className="hidden md:flex items-center gap-10 text-sm font-light">
            <Link href="#work" className="hover:text-purple-400 transition-colors relative group">
              Work
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-purple-400 transition-all group-hover:w-full" />
            </Link>
            <Link href="/change-studios" className="hover:text-purple-400 transition-colors relative group">
              Studios
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-purple-400 transition-all group-hover:w-full" />
            </Link>
            <Link href="/photography" className="hover:text-purple-400 transition-colors relative group">
              Photography
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-purple-400 transition-all group-hover:w-full" />
            </Link>
            <Link href="/why" className="hover:text-purple-400 transition-colors relative group">
              Why
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-purple-400 transition-all group-hover:w-full" />
            </Link>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-sm font-medium"
          >
            Let&apos;s talk
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=80"
            alt="Hero"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-pink-900/30" />
        </motion.div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
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
              Award-winning creative studio • Denver & Beyond
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-8xl md:text-[14rem] font-bold leading-[0.85] tracking-tighter mb-10"
          >
            <span className="block">Stories</span>
            <span className="block">That</span>
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              Change
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-2xl md:text-3xl text-neutral-300 font-light max-w-4xl mx-auto mb-14 leading-relaxed"
          >
            We craft cinematic films, stunning photography, and powerful brand experiences that move people and drive real impact
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex items-center justify-center gap-5"
          >
            <motion.a
              href="#work"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-12 py-5 rounded-full bg-white text-black font-medium text-lg overflow-hidden"
            >
              <span className="relative z-10">Explore our work</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
            <motion.a
              href="#services"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 rounded-full border border-white/30 hover:border-white/60 font-medium text-lg backdrop-blur-sm hover:bg-white/5 transition-all"
            >
              Our services
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-32 grid grid-cols-3 gap-16 max-w-3xl mx-auto"
          >
            {[
              { num: "200+", label: "Projects" },
              { num: "50+", label: "Clients" },
              { num: "10", label: "Awards" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.num}
                </div>
                <div className="text-sm text-neutral-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="flex flex-col items-center"
          >
            <span className="text-xs uppercase tracking-widest text-neutral-500 mb-3">Scroll</span>
            <div className="w-px h-16 bg-gradient-to-b from-purple-400/50 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Work */}
      <section id="work" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-7xl md:text-9xl font-bold tracking-tighter mb-6 leading-[0.9]">
              Featured{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                Work
              </span>
            </h2>
            <p className="text-2xl text-neutral-400 font-light">
              Selected projects that showcase our creative vision
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.8 }}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-3xl cursor-pointer"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                
                {/* Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className={`absolute inset-0 bg-gradient-to-t ${project.color} from-black/90 via-black/40 to-transparent flex flex-col justify-end p-10`}
                >
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <span className="text-sm text-purple-400 uppercase tracking-wider mb-2 block">
                      {project.category}
                    </span>
                    <h3 className="text-4xl font-bold mb-3">{project.title}</h3>
                    <div className="flex items-center gap-2 text-neutral-400">
                      <span>View case study</span>
                      <motion.span
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        →
                      </motion.span>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Link
              href="/photography"
              className="inline-block px-10 py-4 rounded-full border border-white/30 hover:border-purple-400/50 hover:bg-purple-400/5 font-medium transition-all"
            >
              View all work →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="relative py-32 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24 text-center"
          >
            <h2 className="text-7xl md:text-9xl font-bold tracking-tighter mb-8 leading-[0.9]">
              What We{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Create
              </span>
            </h2>
            <p className="text-2xl text-neutral-400 font-light max-w-3xl mx-auto">
              Full-spectrum creative services from concept to delivery
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎬",
                title: "Video Production",
                desc: "Cinematic storytelling that moves audiences",
                link: "/change-studios"
              },
              {
                icon: "📸",
                title: "Photography",
                desc: "Visual narratives that capture attention",
                link: "/photography"
              },
              {
                icon: "🎨",
                title: "Brand Design",
                desc: "Complete identities that stand out",
                link: "/change-studios"
              }
            ].map((service, i) => (
              <motion.a
                key={i}
                href={service.link}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group p-12 rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 backdrop-blur-xl hover:border-purple-400/30 transition-all duration-500"
              >
                <div className="text-6xl mb-6">{service.icon}</div>
                <h3 className="text-3xl font-bold mb-4">{service.title}</h3>
                <p className="text-neutral-400 text-lg leading-relaxed mb-6">
                  {service.desc}
                </p>
                <div className="flex items-center gap-2 text-purple-400">
                  <span>Learn more</span>
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    →
                  </motion.span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-40">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-20 rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 backdrop-blur-2xl text-center overflow-hidden"
          >
            {/* Animated gradient orbs */}
            <div className="absolute inset-0">
              <motion.div
                animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
              />
              <motion.div
                animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
                transition={{ duration: 15, repeat: Infinity }}
                className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
              />
            </div>

            <div className="relative z-10">
              <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
                Ready to create
                <br />
                something
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                  extraordinary?
                </span>
              </h2>
              <p className="text-2xl text-neutral-300 font-light mb-12 max-w-2xl mx-auto">
                Let&apos;s bring your vision to life with storytelling that moves people
              </p>
              <motion.button
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
              <h3 className="text-2xl font-bold mb-4">
                CHANGE<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">®</span>
              </h3>
              <p className="text-neutral-500 text-sm">
                Cinematic stories & visual impact
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium uppercase tracking-wider mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li><Link href="/change-studios" className="hover:text-white transition">Video Production</Link></li>
                <li><Link href="/photography" className="hover:text-white transition">Photography</Link></li>
                <li><Link href="/change-studios" className="hover:text-white transition">Brand Design</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li><Link href="/why" className="hover:text-white transition">Why</Link></li>
                <li><Link href="#work" className="hover:text-white transition">Work</Link></li>
                <li><Link href="#services" className="hover:text-white transition">Services</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium uppercase tracking-wider mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li><a href="#" className="hover:text-white transition">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition">Email</a></li>
                <li><a href="#" className="hover:text-white transition">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
            <div>© 2025 CHANGE Media • Denver, CO</div>
            <div className="flex items-center gap-8">
              <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

