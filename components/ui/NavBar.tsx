"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type NavLink = { label: string; href: string };

type NavBarProps = {
  links: NavLink[];
  cta?: { label: string; href: string };
  tone?: "light" | "dark";
  fixed?: boolean;
};

export default function NavBar({ links, cta, fixed = true }: NavBarProps) {
  const [open, setOpen] = useState(false);

  // V3: Ultra-Minimal Text Only
  const containerClass = `w-full flex justify-between items-start text-foreground mix-blend-exclusion`;
  const linkClass = "font-mono text-xs uppercase tracking-widest hover:opacity-50 transition-opacity";

  return (
    <>
    <nav
      className={`${fixed ? "fixed" : "relative"} inset-x-0 top-0 z-[100] p-6 md:p-12 pointer-events-none`}
    >
      <div className={`${containerClass} pointer-events-auto`}>
        {/* LOGO - Minimal Stacked Text */}
        <Link href="/" className="font-semibold tracking-tight text-lg uppercase leading-none hover:opacity-50 transition-opacity">
           Change<br/>Media
        </Link>

        {/* DESKTOP MENU - Simple List */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass}
            >
              {link.label}
            </Link>
          ))}
          {cta && (
             <Link href={cta.href} className={`${linkClass} underline decoration-1 underline-offset-4`}>
                {cta.label}
             </Link>
          )}
        </div>

        {/* MOBILE TOGGLE - Text */}
        <button
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="md:hidden font-mono text-xs uppercase tracking-widest"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background flex flex-col justify-center items-center md:hidden pointer-events-auto"
          >
            <div className="flex flex-col items-center gap-8">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-2xl font-serif tracking-tight hover:opacity-50 transition-opacity"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {cta && (
                <Link
                   href={cta.href}
                   className="mt-8 text-xs font-mono uppercase tracking-widest border-b border-foreground pb-1"
                   onClick={() => setOpen(false)}
                >
                   {cta.label}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    </>
  );
}