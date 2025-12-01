"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Instrument_Serif } from "next/font/google";

const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-serif" });

const TABS = ["Overview", "Sessions", "Gallery", "Settings"];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className={`min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black ${serif.variable}`}>
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* Navigation */}
      <header className="relative z-10 mx-auto flex max-w-[1400px] items-center justify-between px-6 py-8 text-[0.65rem] uppercase tracking-[0.2em] text-white/40">
        <Link href="/" className="text-sm font-bold tracking-widest text-white">
          CHANGE<span className="text-white/40">®</span>
        </Link>
        <div className="flex items-center gap-6">
          <span className="hidden md:inline-block">William Navarrete</span>
          <div className="h-8 w-8 rounded-full bg-white/10 overflow-hidden border border-white/20">
             <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="Profile" width={32} height={32} className="object-cover h-full w-full" />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1400px] px-6 pb-32">
        
        {/* Header */}
        <div className="py-12 md:py-20">
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40 mb-4">Member Since 2024</p>
          <h1 className="font-serif text-5xl md:text-7xl text-white">
            Hello, William.
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-white/10 mb-12 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm uppercase tracking-[0.2em] transition-colors relative whitespace-nowrap ${
                activeTab === tab ? "text-white font-medium" : "text-white/40 hover:text-white/60"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          
          {/* Main Column */}
          <div className="space-y-8">
            {/* Active Session Card */}
            <section className="rounded-[40px] bg-white/5 p-8 md:p-12 border border-white/10 shadow-sm">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="inline-block rounded-full bg-emerald-500/20 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-widest text-emerald-400 mb-4">
                    Upcoming
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl text-white">The Solo Session</h2>
                  <p className="text-white/60 mt-2">March 15, 2025 • 2:00 PM</p>
                </div>
                <div className="text-right hidden md:block">
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Location</p>
                  <p className="text-white mt-1">Change Atelier, Denver</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button className="rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-black transition-transform hover:scale-[1.02]">
                  View Details
                </button>
                <button className="rounded-full border border-white/20 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/10">
                  Reschedule
                </button>
              </div>
            </section>

            {/* Recent Gallery */}
            <section className="rounded-[40px] bg-white/5 p-8 md:p-12 text-white shadow-xl overflow-hidden relative border border-white/10">
              <div className="relative z-10">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40 mb-2">Latest Gallery</p>
                    <h2 className="font-serif text-3xl md:text-4xl">Graduation &apos;24</h2>
                  </div>
                  <button className="rounded-full bg-white text-black px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-transform hover:scale-[1.02]">
                    Open Gallery
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4 opacity-50 hover:opacity-100 transition-opacity duration-500">
                  {[1,2,3].map((i) => (
                    <div key={i} className="aspect-square bg-white/5 rounded-2xl overflow-hidden relative">
                       <Image 
                        src={`https://images.unsplash.com/photo-${i === 1 ? '1534528741775-53994a69daeb' : i === 2 ? '1517841905240-472988babdf9' : '1531746020798-e6953c6e8e04'}?w=400&q=80`}
                        alt="Gallery preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="rounded-[32px] bg-white/5 p-8 border border-white/10">
              <h3 className="font-serif text-2xl text-white mb-6">Quick Actions</h3>
              <ul className="space-y-4">
                <li>
                  <button className="w-full text-left flex items-center justify-between group">
                    <span className="text-sm text-white/60 group-hover:text-white transition-colors">Book new session</span>
                    <span className="text-white/40 group-hover:text-white transition-colors">→</span>
                  </button>
                </li>
                <li className="h-px bg-white/10 w-full" />
                <li>
                  <button className="w-full text-left flex items-center justify-between group">
                    <span className="text-sm text-white/60 group-hover:text-white transition-colors">Order prints</span>
                    <span className="text-white/40 group-hover:text-white transition-colors">→</span>
                  </button>
                </li>
                <li className="h-px bg-white/10 w-full" />
                <li>
                  <button className="w-full text-left flex items-center justify-between group">
                    <span className="text-sm text-white/60 group-hover:text-white transition-colors">Edit profile</span>
                    <span className="text-white/40 group-hover:text-white transition-colors">→</span>
                  </button>
                </li>
              </ul>
            </div>

            <div className="rounded-[32px] bg-white/5 p-8 border border-white/10">
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40 mb-2">Support</p>
              <p className="text-sm text-white/60 mb-4">Need help with your booking or gallery?</p>
              <a href="mailto:help@changemedia.com" className="text-sm font-bold underline underline-offset-4 decoration-white/20 hover:decoration-white transition-all">Contact Concierge</a>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
