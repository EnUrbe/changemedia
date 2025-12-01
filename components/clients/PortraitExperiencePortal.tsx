"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { PhotographyContent } from "@/lib/photographySchema";

const serifFont = "var(--font-family-serif, 'Instrument Serif', Georgia, serif)";

interface PortraitUpdate {
  id: string;
  title: string;
  message: string;
  sentAt: string;
  sender: string;
  status?: string;
  attachments?: { label: string; url: string }[];
}

interface PortraitSubmissionResponse {
  id: string;
  trackingCode: string;
  status: string;
  packageId: string;
  preferredDate?: string;
  timeWindow?: string;
  comments?: string;
  uploads: { id: string; url: string; originalName: string }[];
  updates: PortraitUpdate[];
}

type Props = {
  content: PhotographyContent;
};

const vibeOptions = [
  { id: "luminous", label: "Luminous & light", description: "Soft natural light, airy feel." },
  { id: "editorial", label: "Editorial vibe", description: "Magazine-style, polished look." },
  { id: "documentary", label: "Candid & relaxed", description: "Natural moments, authentic." },
  { id: "noir", label: "Moody & dramatic", description: "Bold contrast, timeless." },
];

const lightingOptions = [
  { id: "studio", label: "Studio setup" },
  { id: "location", label: "Outdoor/on-location" },
  { id: "hybrid", label: "Mix of both" },
];

const paletteOptions = [
  { id: "pastel", label: "Light & airy" },
  { id: "neutral", label: "Classic neutrals" },
  { id: "bold", label: "Bold & vibrant" },
];

const inputClass = "w-full rounded-xl border-0 bg-neutral-50 px-5 py-4 text-neutral-900 placeholder-neutral-400 ring-1 ring-inset ring-neutral-200 focus:ring-2 focus:ring-neutral-900 transition-all";
const labelClass = "ml-1 text-[0.65rem] uppercase tracking-[0.2em] text-neutral-400 font-medium";

export default function PortraitExperiencePortal({ content }: Props) {
  const defaultPackage = content.services?.[0]?.id ?? "signature";
  const [form, setForm] = useState({
    clientName: "",
    email: "",
    phone: "",
    brand: "",
    preferredDate: "",
    timeWindow: "",
    locationNotes: "",
    comments: "",
    packageId: defaultPackage,
  });
  const [styleQuiz, setStyleQuiz] = useState({
    vibes: new Set<string>(["luminous"]),
    lighting: "studio",
    palette: "neutral",
    inspirationNotes: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submission, setSubmission] = useState<PortraitSubmissionResponse | null>(null);
  const [lookupCode, setLookupCode] = useState("");
  const [lookupError, setLookupError] = useState<string | null>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const incoming = Array.from(event.target.files ?? []);
    if (incoming.length) {
      setFiles((prev) => [...prev, ...incoming].slice(0, 6));
    }
  }

  function toggleVibe(id: string) {
    setStyleQuiz((prev) => {
      const next = new Set(prev.vibes);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      if (next.size === 0) {
        next.add(id);
      }
      return { ...prev, vibes: next };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) body.append(key, value);
      });
      body.append(
        "styleQuiz",
        JSON.stringify({
          vibes: Array.from(styleQuiz.vibes),
          lighting: styleQuiz.lighting,
          palette: styleQuiz.palette,
          inspirationNotes: styleQuiz.inspirationNotes,
        }),
      );
      files.forEach((file) => body.append("references", file));

      const res = await fetch("/api/photography/portrait-experience", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "Unable to book");
      }
      setSubmission(data.submission);
      setSuccess(`Reserved. Tracking code ${data.submission.trackingCode}`);
      setFiles([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    const trackingCode = submission?.trackingCode;
    if (!trackingCode) return;
    const controller = new AbortController();
    async function refresh() {
      const res = await fetch(`/api/photography/portrait-experience?trackingCode=${trackingCode}`, { signal: controller.signal });
      if (!res.ok) return;
      const data = await res.json();
      setSubmission(data.submission);
    }
    refresh();
    return () => controller.abort();
  }, [submission?.trackingCode]);

  async function handleLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLookupError(null);
    if (!lookupCode.trim()) {
      setLookupError("Enter your code");
      return;
    }
    try {
      const res = await fetch(`/api/photography/portrait-experience?trackingCode=${lookupCode.trim()}`);
      const data = await res.json();
      if (!res.ok) {
        setLookupError(data?.error ?? "Not found");
        return;
      }
      setSubmission(data.submission);
      setSuccess(`Welcome back, code ${data.submission.trackingCode}`);
    } catch (err) {
      setLookupError(err instanceof Error ? err.message : "Unable to fetch submission");
    }
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } }
  };

  return (
    <div className="min-h-screen bg-[#f2f0eb] text-neutral-900 selection:bg-neutral-900 selection:text-white">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        className="mx-auto max-w-[1400px] p-4 sm:p-6 lg:p-8"
      >
        
        {/* Header / Hero */}
        <motion.header variants={fadeIn} className="relative overflow-hidden rounded-[48px] bg-white p-8 shadow-sm md:p-20">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
           <div className="relative z-10">
             <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
               <div className="space-y-8">
                 <div className="inline-flex items-center gap-3 rounded-full border border-neutral-100 bg-white/50 px-4 py-2 backdrop-blur-md">
                   <span className="flex h-2 w-2">
                     <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                     <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                   </span>
                   <span className="text-[0.65rem] uppercase tracking-[0.2em] text-neutral-400">Atelier Portal</span>
                 </div>
                 <h1 className="text-7xl leading-[0.9] tracking-tight md:text-9xl" style={{ fontFamily: serifFont }}>
                   The Portrait<br />Atelier.
                 </h1>
               </div>
               <div className="max-w-md space-y-6">
                 <p className="text-lg leading-relaxed text-neutral-500">
                   High-touch commissions for founders and artists. Calibrated lighting, bespoke direction, and museum-grade retouching.
                 </p>
                 <div className="flex gap-4 text-[0.65rem] uppercase tracking-[0.2em] text-neutral-400">
                   <span>Est. 2024</span>
                   <span className="text-neutral-200">|</span>
                   <span>Denver / Boulder</span>
                 </div>
               </div>
             </div>
           </div>
        </motion.header>

        <main className="mt-8 grid gap-8 lg:grid-cols-12">
          
          {/* Left Column: Form & Packages (8 cols) */}
          <div className="space-y-8 lg:col-span-8">
            
            {/* Packages */}
            <motion.section variants={fadeIn} className="rounded-[48px] bg-white p-8 md:p-12">
              <div className="mb-12 flex items-end justify-between border-b border-neutral-100 pb-8">
                <div>
                  <p className={labelClass}>Formats</p>
                  <h2 className="mt-2 text-4xl md:text-5xl" style={{ fontFamily: serifFont }}>Select your session.</h2>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {content.services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setForm((prev) => ({ ...prev, packageId: service.id }))}
                    className={`group relative flex flex-col items-start text-left rounded-[32px] border p-8 transition-all duration-500 ${
                      form.packageId === service.id 
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-2xl scale-[1.02]" 
                        : "bg-neutral-50 border-transparent hover:bg-neutral-100 hover:scale-[1.01]"
                    }`}
                  >
                    <div className="mb-auto w-full">
                      <div className="flex justify-between items-start">
                        <span className={`text-5xl transition-colors duration-500 ${form.packageId === service.id ? "text-neutral-700" : "text-neutral-200"}`} style={{ fontFamily: serifFont }}>
                          {service.numeral}
                        </span>
                        {form.packageId === service.id && (
                          <motion.span layoutId="selected-pill" className="rounded-full bg-white/20 px-3 py-1 text-[0.6rem] uppercase tracking-wider text-white">Selected</motion.span>
                        )}
                      </div>
                      <h3 className="mt-6 text-2xl font-medium" style={{ fontFamily: serifFont }}>{service.title}</h3>
                      <p className={`mt-2 text-sm transition-colors duration-500 ${form.packageId === service.id ? "text-neutral-400" : "text-neutral-500"}`}>
                        {service.description}
                      </p>
                    </div>
                    <div className="mt-8 w-full border-t border-white/10 pt-6">
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl">{service.price}</span>
                        <span className={`text-xs uppercase tracking-widest ${form.packageId === service.id ? "text-neutral-500" : "text-neutral-400"}`}>
                          {service.periodLabel}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.section>

            {/* Booking Form */}
            <motion.section variants={fadeIn} className="rounded-[48px] bg-white p-8 md:p-12">
              <div className="mb-10 border-b border-neutral-100 pb-8">
                <p className={labelClass}>Inquiry</p>
                <h2 className="mt-2 text-4xl md:text-5xl" style={{ fontFamily: serifFont }}>Reserve the studio.</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className={labelClass}>Full Name</label>
                    <input className={inputClass} placeholder="Jane Doe" required value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Email</label>
                    <input className={inputClass} placeholder="jane@example.com" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className={labelClass}>Brand / Social</label>
                    <input className={inputClass} placeholder="@username" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Phone</label>
                    <input className={inputClass} placeholder="(555) 000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className={labelClass}>Preferred Date</label>
                    <input type="date" className={inputClass} value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Time Window</label>
                    <div className="relative">
                      <select className={`${inputClass} appearance-none`} value={form.timeWindow} onChange={(e) => setForm({ ...form, timeWindow: e.target.value })}>
                        <option value="">Select...</option>
                        <option value="sunrise">Early Morning</option>
                        <option value="midday">Midday</option>
                        <option value="golden-hour">Golden Hour</option>
                        <option value="evening">Evening</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-neutral-500">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Location</label>
                    <input className={inputClass} placeholder="Studio, Park, etc." value={form.locationNotes} onChange={(e) => setForm({ ...form, locationNotes: e.target.value })} />
                  </div>
                </div>

                {/* Style Quiz */}
                <div className="rounded-3xl bg-neutral-50 p-6 md:p-8">
                  <p className={labelClass}>Aesthetic Direction</p>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {vibeOptions.map((option) => (
                      <button
                        type="button"
                        key={option.id}
                        onClick={() => toggleVibe(option.id)}
                        className={`flex items-center justify-between rounded-2xl px-6 py-4 text-left transition-all duration-300 ${
                          styleQuiz.vibes.has(option.id) 
                            ? "bg-neutral-900 text-white shadow-lg scale-[1.02]" 
                            : "bg-white text-neutral-600 hover:bg-neutral-200"
                        }`}
                      >
                        <span className="font-medium">{option.label}</span>
                        {styleQuiz.vibes.has(option.id) && <span className="text-xs uppercase tracking-widest opacity-60">Selected</span>}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <p className={labelClass}>Lighting</p>
                      <div className="grid gap-2 sm:grid-cols-3">
                        {lightingOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setStyleQuiz((prev) => ({ ...prev, lighting: option.id }))}
                            className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                              styleQuiz.lighting === option.id
                                ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                                : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className={labelClass}>Palette</p>
                      <div className="grid gap-2 sm:grid-cols-3">
                        {paletteOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setStyleQuiz((prev) => ({ ...prev, palette: option.id }))}
                            className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                              styleQuiz.palette === option.id
                                ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                                : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    <label className={labelClass}>Vision Notes</label>
                    <textarea
                      className={`${inputClass} min-h-[100px] bg-white`}
                      placeholder="Describe the mood, outfits, or specific shots you need..."
                      value={styleQuiz.inspirationNotes}
                      onChange={(e) => setStyleQuiz((prev) => ({ ...prev, inspirationNotes: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Project Context</label>
                  <textarea 
                    className={`${inputClass} min-h-[100px]`} 
                    placeholder="What are we announcing? Where will these live?" 
                    value={form.comments} 
                    onChange={(e) => setForm({ ...form, comments: e.target.value })} 
                  />
                </div>

                <div className="space-y-3">
                  <label className={labelClass}>Reference Uploads</label>
                  <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-4 text-sm text-neutral-600 hover:border-neutral-500">
                    <span>Attach inspiration (up to 6)</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                    <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">Upload</span>
                  </label>
                  {files.length > 0 && (
                    <ul className="space-y-1 text-sm text-neutral-600">
                      {files.map((file) => (
                        <li key={file.name} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pt-4">
                  <button 
                    disabled={submitting} 
                    className="group relative w-full overflow-hidden rounded-full bg-neutral-900 py-5 text-white transition hover:bg-neutral-800 disabled:opacity-70"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.3em]">
                      {submitting ? "Processing..." : "Submit Request"}
                    </span>
                  </button>
                  {error && <p className="mt-4 text-center text-sm text-red-500">{error}</p>}
                  {success && <p className="mt-4 text-center text-sm text-emerald-600">{success}</p>}
                </div>
              </form>
            </motion.section>
          </div>

          {/* Right Column: Status & Portfolio (4 cols) */}
          <div className="space-y-8 lg:col-span-4">
            
            {/* Status Card */}
            <motion.div variants={fadeIn} className="sticky top-8 space-y-8">
              <section className="rounded-[40px] bg-neutral-900 p-8 text-white shadow-2xl">
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-neutral-400">Client Portal</p>
                <h3 className="mt-4 text-3xl" style={{ fontFamily: serifFont }}>Check Status</h3>
                
                <form onSubmit={handleLookup} className="mt-6 space-y-4">
                  <div className="relative">
                    <input 
                      className="w-full rounded-xl border-0 bg-white/10 px-5 py-4 text-white placeholder-neutral-500 focus:bg-white/20 focus:outline-none focus:ring-0" 
                      placeholder="Tracking Code" 
                      value={lookupCode} 
                      onChange={(e) => setLookupCode(e.target.value)} 
                    />
                    <button className="absolute right-2 top-2 rounded-lg bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-900 hover:bg-neutral-200">
                      Go
                    </button>
                  </div>
                  {lookupError && <p className="text-xs text-red-400">{lookupError}</p>}
                </form>

                {submission && (
                  <div className="mt-8 border-t border-white/10 pt-8">
                    <div className="mb-6">
                      <p className="text-xs text-neutral-400">Status</p>
                      <p className="text-2xl font-medium capitalize text-emerald-400">{submission.status.replace("-", " ")}</p>
                    </div>
                    {submission.updates?.length > 0 ? (
                      <div className="space-y-4">
                        {submission.updates.map((update) => (
                          <div key={update.id} className="rounded-2xl bg-white/10 p-4">
                            <div className="flex justify-between text-[0.6rem] uppercase tracking-wider text-neutral-400">
                              <span>{update.sender}</span>
                              <span>{new Date(update.sentAt).toLocaleDateString()}</span>
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-neutral-200">{update.message}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-neutral-500">No updates yet.</p>
                    )}
                  </div>
                )}
              </section>

              {/* Mini Portfolio Grid */}
              <section className="grid gap-4">
                {content.portfolio.slice(0, 4).map((item) => (
                  <div key={item.id} className="group relative aspect-[4/5] overflow-hidden rounded-[32px] bg-neutral-200">
                    <Image 
                      src={item.image.src ?? ""} 
                      alt={item.title} 
                      fill 
                      className="object-cover transition duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100"></div>
                    <div className="absolute bottom-0 left-0 p-6 text-white opacity-0 transition duration-500 group-hover:opacity-100">
                      <p className="text-[0.6rem] uppercase tracking-widest">{item.category}</p>
                      <p className="font-serif text-xl">{item.title}</p>
                    </div>
                  </div>
                ))}
              </section>
            </motion.div>
          </div>

        </main>
      </motion.div>
    </div>
  );
}
