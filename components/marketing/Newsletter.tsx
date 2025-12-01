"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Instrument_Serif } from "next/font/google";

const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-serif" });

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus("success");
    setEmail("");
  };

  return (
    <section className="relative border-t-2 border-neutral-900 bg-[#ccff00] py-24 overflow-hidden">
      {/* Background Noise */}
      <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className={`${serif.variable} font-serif text-6xl md:text-8xl text-neutral-900 leading-[0.9] mb-6 italic`}>
            don&apos;t be <br/> boring.
          </h2>
          <p className="text-xl font-bold lowercase tracking-tight text-neutral-900 max-w-md">
            join 5,000+ others getting our raw, unfiltered takes on digital culture, design, and breaking the internet.
          </p>
        </div>

        <div className="bg-white border-2 border-neutral-900 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-black uppercase tracking-widest mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ceo@boringcompany.com"
                className="w-full bg-neutral-100 border-2 border-neutral-900 p-4 text-lg font-medium focus:outline-none focus:bg-[#ccff00] transition-colors placeholder:text-neutral-400"
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="w-full bg-neutral-900 text-white border-2 border-neutral-900 p-4 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-neutral-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Sending..." : status === "success" ? "You're in." : "Subscribe"}
            </button>
            {status === "success" && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-bold text-neutral-900 text-center pt-2"
              >
                Welcome to the chaos. Check your inbox.
              </motion.p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
