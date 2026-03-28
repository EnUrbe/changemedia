"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SiteContent } from "@/lib/contentSchema";

type LandingProps = {
  content: SiteContent;
};

export default function ChangeMediaLanding({ content }: LandingProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formTsRef = useRef<number>(Date.now());

  // Use a cleaner, simpler hero image (abstract or architectural)
  const heroBg = "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=3000&auto=format&fit=crop";
  const featuredPractices = content.practices.slice(0, 2); 

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries()) as Record<string, FormDataEntryValue>;
    payload.ts = formTsRef.current as unknown as FormDataEntryValue;

    try {
      await new Promise(r => setTimeout(r, 1000)); // Mock for immediate feedback
      setSubmitted(true);
      form.reset();
    } catch {
      // Ignore error
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 font-sans">
      
      {/* ULTRA-MINIMAL NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 p-6 md:p-12 flex justify-between items-start text-white mix-blend-exclusion pointer-events-none">
         <Link href="/" className="font-semibold tracking-tight text-lg uppercase leading-none pointer-events-auto hover:opacity-50 transition-opacity">
            Change<br/>Media
         </Link>
         <a href="#contact" className="pointer-events-auto hidden md:inline-block font-mono text-xs uppercase tracking-widest hover:underline decoration-1 underline-offset-4">
            Get in touch
         </a>
      </nav>

      <main>
        
        {/* HERO */}
        <section className="h-screen w-full flex flex-col justify-end px-6 md:px-12 pb-12 box-border relative overflow-hidden">
           <div className="absolute inset-0 z-0">
              <Image 
                src={heroBg} 
                alt="Atmosphere" 
                fill 
                className="object-cover opacity-20 dark:opacity-40 grayscale contrast-125 scale-105" 
                priority 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
           </div>
           
           <div className="relative z-10 max-w-4xl space-y-8">
              <h1 className="text-6xl md:text-9xl font-serif tracking-tighter leading-[0.85]">
                 Creative for<br/>
                 <span className="italic text-muted-foreground/80">Movements.</span>
              </h1>
              <p className="text-lg md:text-xl font-light text-muted max-w-md leading-relaxed ml-2">
                 We build narrative infrastructure and portrait archives for organizations changing the world.
              </p>
           </div>
        </section>

        {/* ESSENTIALS GRID */}
        <section className="px-6 md:px-12 py-24 border-t border-border-soft">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
              
              {/* Column 1: Practices */}
              <div className="space-y-16">
                 <div className="space-y-4">
                    <span className="font-mono text-xs uppercase tracking-widest text-muted">01 — Practice</span>
                    <h2 className="text-3xl font-medium tracking-tight">One studio, two doors.</h2>
                    <p className="text-muted leading-relaxed max-w-sm">
                       We operate two distinct production models to serve the movement ecosystem.
                    </p>
                 </div>
                 
                 <div className="space-y-8">
                    {featuredPractices.map((p) => (
                       <div key={p.id} className="group border-b border-border-strong pb-8 cursor-pointer hover:border-foreground transition-colors">
                          <Link href={p.cta.href}>
                              <h3 className="text-2xl font-serif mb-2 flex items-center gap-4">
                                {p.title} <span className="opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-2 group-hover:translate-x-0">→</span>
                              </h3>
                              <p className="text-sm text-muted">{p.description}</p>
                          </Link>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Column 2: Expertise List */}
              <div className="space-y-16 md:pt-32">
                 <div className="space-y-4">
                    <span className="font-mono text-xs uppercase tracking-widest text-muted">02 — Expertise</span>
                    <ul className="space-y-3 text-lg md:text-xl">
                       <li className="flex items-baseline gap-4 border-b border-border-soft py-3">
                          <span className="w-4 h-4 rounded-full border border-border-strong"></span>
                          Documentary Production
                       </li>
                       <li className="flex items-baseline gap-4 border-b border-border-soft py-3">
                          <span className="w-4 h-4 rounded-full border border-border-strong bg-foreground"></span>
                          Executive Portraiture
                       </li>
                       <li className="flex items-baseline gap-4 border-b border-border-soft py-3">
                          <span className="w-4 h-4 rounded-full border border-border-strong"></span>
                          Campaign Strategy
                       </li>
                    </ul>
                 </div>
                 
                 <div className="group relative aspect-video w-full overflow-hidden rounded-sm bg-surface-strong">
                      <Image src={content.galleryCases[0]?.imageUrl || heroBg} alt="Featured" fill className="object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0" />
                      <Link href="/clients" className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 text-white font-mono text-xs uppercase tracking-widest">
                         View Archive
                      </Link>
                 </div>
              </div>

           </div>
        </section>

        {/* MINIMAL FOOTER & CONTACT */}
        <section id="contact" className="px-6 md:px-12 py-24 bg-surface-muted border-t border-border-soft min-h-[50vh] flex flex-col justify-between">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                 <h2 className="text-5xl md:text-7xl font-serif tracking-tighter mb-8">Start<br/>Here.</h2>
                 <div className="space-y-2 text-sm text-muted">
                    <p><a href={`mailto:${content.contact.email}`} className="hover:text-foreground transition-colors border-b border-transparent hover:border-foreground pb-0.5">{content.contact.email}</a></p>
                    <p>{content.contact.city}</p>
                 </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6 max-w-md md:ml-auto w-full">
                 <input 
                    name="email" 
                    type="email" 
                    required 
                    placeholder="Email address"
                    className="w-full bg-transparent border-b border-border-strong py-3 text-lg focus:outline-none focus:border-foreground transition-colors placeholder:text-muted/50"
                 />
                 <div className="flex justify-end">
                    <button disabled={submitting || submitted} className="text-xs font-mono uppercase tracking-widest hover:bg-foreground hover:text-background px-6 py-3 rounded-full border border-border-strong transition-all">
                       {submitted ? "Sent" : "Submit Inquiry"}
                    </button>
                 </div>
              </form>
           </div>

           <div className="pt-24 flex flex-col md:flex-row justify-between items-end md:items-center text-[10px] uppercase tracking-widest text-muted/60">
              <div className="flex gap-4 mb-4 md:mb-0">
                 <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
                 <Link href="/terms" className="hover:text-foreground">Terms</Link>
              </div>
              <div>© {new Date().getFullYear()} Change Media Studios</div>
           </div>
        </section>

      </main>
    </div>
  );
}