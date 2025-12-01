"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instrument_Serif } from "next/font/google";

const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-serif" });

export default function LeadMagnetModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    // Open after 15 seconds if not already opened
    const timer = setTimeout(() => {
      if (!hasOpened) {
        setIsOpen(true);
        setHasOpened(true);
      }
    }, 15000);

    // Exit intent
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasOpened) {
        setIsOpen(true);
        setHasOpened(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasOpened]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[100] bg-neutral-900/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 z-[101] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 px-6"
          >
            <div className="relative overflow-hidden border-2 border-neutral-900 bg-white p-8 shadow-[16px_16px_0px_0px_#ccff00]">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 h-8 w-8 flex items-center justify-center rounded-full border-2 border-neutral-900 hover:bg-neutral-100 transition-colors"
              >
                ✕
              </button>

              <div className="mb-6">
                <span className="inline-block bg-[#ccff00] px-2 py-1 text-[0.6rem] font-bold uppercase tracking-widest border border-neutral-900 mb-4">
                  Free Resource
                </span>
                <h3 className={`${serif.variable} font-serif text-4xl md:text-5xl text-neutral-900 leading-none mb-4`}>
                  Steal our strategy.
                </h3>
                <p className="text-neutral-600 font-medium">
                  Get the exact 10-point checklist we use to launch 6-figure digital products. No fluff.
                </p>
              </div>

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsOpen(false); }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border-2 border-neutral-900 bg-neutral-50 p-4 text-sm font-bold focus:border-[#ccff00] focus:outline-none"
                />
                <button className="w-full bg-neutral-900 p-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-[#ccff00] hover:text-neutral-900 border-2 border-transparent hover:border-neutral-900 transition-all">
                  Get the Guide
                </button>
              </form>
              
              <p className="mt-4 text-center text-[0.6rem] uppercase tracking-widest text-neutral-400">
                We respect your inbox. No spam.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
