"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Instrument_Serif } from "next/font/google";
import NavBar from "@/components/ui/NavBar";
import Button from "@/components/ui/Button";
import { loginWithAccessCode } from "./actions";

const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-serif" });

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await loginWithAccessCode(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black ${serif.variable} flex flex-col`}>
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <NavBar
        links={[
          { href: "/why", label: "Why" },
          { href: "/change-studios", label: "Studios" },
          { href: "/photography", label: "Photography" },
          { href: "/photography/portrait", label: "Executive" },
          { href: "/portraits", label: "Portraits" },
        ]}
        cta={{ href: "/#contact", label: "Start" }}
        tone="dark"
      />

      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl border border-white/10 backdrop-blur-md"
          >
            <div className="text-center mb-10">
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40 mb-4">
                Client Portal
              </p>
              <h1 className="font-serif text-4xl md:text-5xl text-white">
                Access Workspace
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40 ml-2">Access Code</label>
                <input 
                  type="password" 
                  name="accessCode"
                  required 
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white focus:border-white/30 focus:outline-none transition-colors placeholder:text-white/20"
                  placeholder="Enter your project key"
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                fullWidth
                size="lg"
                variant="soft"
                className="mt-4"
              >
                {loading ? "Verifying..." : "Enter Workspace"}
              </Button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-xs text-white/40">
                Lost your access code? Contact your producer.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

