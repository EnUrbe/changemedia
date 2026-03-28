"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { NAV_LINKS, SITE } from "@/lib/data";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Scroll progress bar */}
      <ScrollProgress />

      <motion.nav
        initial={false}
        animate={{
          backgroundColor: scrolled ? "rgba(9, 9, 7, 0.85)" : "rgba(0, 0, 0, 0.2)",
          borderColor: scrolled ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.04)",
        }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl border-b"
      >
        <div className="container-wide flex items-center justify-between h-20">
          <Link
            href="/"
            className="group font-serif text-base leading-none tracking-[-0.05em] text-white transition-all duration-300 hover:text-[var(--accent)]"
          >
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">Change</span>
            <br />
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">Media</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 ${
                    isActive ? "text-[var(--accent)]" : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-2 -bottom-0.5 h-px bg-[var(--accent)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden relative z-50 w-8 h-8 flex flex-col justify-center gap-1.5"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="block w-6 h-[1.5px] bg-white origin-center"
            />
            <motion.span
              animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2 }}
              className="block w-6 h-[1.5px] bg-white origin-left"
            />
            <motion.span
              animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="block w-6 h-[1.5px] bg-white origin-center"
            />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-[var(--bg)] flex flex-col justify-between"
          >
            {/* Background atmosphere */}
            <div className="absolute right-[-10%] top-[15%] h-[400px] w-[400px] rounded-full bg-[var(--accent)]/8 blur-[180px] pointer-events-none" />
            <div className="absolute left-[-5%] bottom-[20%] h-[300px] w-[300px] rounded-full bg-white/4 blur-[140px] pointer-events-none" />

            <div className="flex-1 flex flex-col justify-center px-8">
              <div className="space-y-0">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: 0.05 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`block text-5xl font-serif py-3 transition-colors duration-300 ${
                        pathname === link.href
                          ? "text-[var(--accent)]"
                          : "text-white hover:text-[var(--accent)]"
                      }`}
                    >
                      <span className="inline-flex items-baseline gap-4">
                        <span className="text-xs font-mono text-[var(--text-dim)] tabular-nums">
                          0{i + 1}
                        </span>
                        {link.label}
                      </span>
                    </Link>
                    {i < NAV_LINKS.length - 1 && (
                      <div className="h-px bg-[var(--border)] ml-10" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="px-8 pb-10 flex items-end justify-between"
            >
              <div className="text-sm text-[var(--text-muted)] space-y-1">
                <p className="link-underline w-fit">
                  <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                </p>
                <p>{SITE.city}</p>
              </div>
              <div className="flex gap-4">
                {SITE.socials.instagram && (
                  <a
                    href={SITE.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs uppercase tracking-wider text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors"
                  >
                    Ig
                  </a>
                )}
                {SITE.socials.youtube && (
                  <a
                    href={SITE.socials.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs uppercase tracking-wider text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors"
                  >
                    Yt
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Scroll progress indicator ─── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
