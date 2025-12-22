"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Button from "./Button";

type NavLink = { label: string; href: string };

type NavBarProps = {
  links: NavLink[];
  cta?: { label: string; href: string };
  tone?: "light" | "dark";
  fixed?: boolean;
};

export default function NavBar({ links, cta, tone = "light", fixed = true }: NavBarProps) {
  const [open, setOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const textColor = tone === "dark" ? "text-white" : "text-neutral-900";
  const surface =
    tone === "dark"
      ? "bg-black/20 backdrop-blur-md border border-white/10 shadow-lg"
      : "bg-white/80 backdrop-blur-md border border-neutral-200 shadow-sm";

  return (
    <nav
      className={`${fixed ? "fixed" : "relative"} inset-x-0 top-0 z-[100] px-6 pt-6`}
    >
      <div
        className={`mx-auto flex max-w-[1400px] items-center justify-between rounded-full ${surface} backdrop-blur-xl px-6 py-4 shadow-sm transition-all duration-300`}
      >
        <Link href="/" className={`text-sm font-bold uppercase tracking-[0.2em] ${textColor} hover:opacity-70 transition-opacity`}>
          CHANGE<span className="opacity-40">®</span>
        </Link>
        <div className="hidden items-center gap-8 text-[11px] font-medium uppercase tracking-[0.2em] md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${textColor} opacity-60 transition hover:opacity-100`}
            >
              {link.label}
            </Link>
          ))}
          {cta && <Button href={cta.href} size="md" variant="primary" className="ml-4 !px-6">{cta.label}</Button>}
        </div>

        <button
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((prev) => !prev)}
          className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/40 ${textColor} md:hidden`}
        >
          <div className="space-y-1.5">
            <span className="block h-[2px] w-5 bg-current" />
            <span className="block h-[2px] w-4 bg-current" />
            <span className="block h-[2px] w-5 bg-current" />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
            className={`mx-auto mt-3 max-w-[1400px] rounded-3xl border border-white/40 bg-white/90 p-5 shadow-lg backdrop-blur-xl md:hidden`}
          >
            <div className="flex flex-col gap-3 text-[12px] font-semibold uppercase tracking-[0.24em] text-neutral-900">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-3 py-2 hover:bg-neutral-100"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {cta && (
                <Button href={cta.href} size="md" variant="primary" fullWidth className="mt-2">
                  {cta.label}
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
