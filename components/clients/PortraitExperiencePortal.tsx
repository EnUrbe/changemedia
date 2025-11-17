"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
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

const inputClass = "w-full rounded-2xl border border-neutral-200 bg-white/70 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none";
const labelClass = "text-[0.65rem] uppercase tracking-[0.35em] text-neutral-500";

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

  const selectedPackage = useMemo(() => content.services?.find((svc) => svc.id === form.packageId), [content.services, form.packageId]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
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

  return (
    <div className="bg-[#f6f3ed] text-neutral-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#fef6eb] via-[#f3ecff] to-[#f5f9ff]" />
          <div className="absolute bottom-0 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-[#ffe7d9] via-[#f4edff] to-[#dff5ff] blur-[190px] opacity-70" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-24 pt-32 text-center">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mx-auto inline-flex items-center gap-3 rounded-full border border-neutral-200/60 bg-white/80 px-5 py-2 text-xs uppercase tracking-[0.4em] text-neutral-500">
            Portrait atelier • Denver
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-5xl md:text-7xl lg:text-8xl font-semibold leading-[1.05]" style={{ fontFamily: serifFont }}>
            Thoughtful portraits for people who value craft over convention.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mx-auto max-w-3xl text-lg text-neutral-600">
            Contemporary portrait sessions rooted in editorial technique and intentional direction. For milestones, personal branding, or simply creating heirloom imagery that reflects who you are right now.
          </motion.p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-neutral-600">
            <div className="rounded-full border border-neutral-200/80 bg-white/70 px-5 py-2">Intimate 1-on-1 sessions</div>
            <div className="rounded-full border border-neutral-200/80 bg-white/70 px-5 py-2">Curated locations & lighting</div>
            <div className="rounded-full border border-neutral-200/80 bg-white/70 px-5 py-2">Full digital gallery</div>
          </div>
        </div>
      </section>

      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className={labelClass}>Recent work</p>
            <h2 className="mt-4 text-4xl font-semibold" style={{ fontFamily: serifFont }}>
              A selection from the archive
            </h2>
            <p className="mt-3 text-base text-neutral-600">Each session is approached like an editorial commission—considered composition, intentional light, and imagery that feels both timeless and unmistakably you.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {content.portfolio.slice(0, 6).map((item) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="group overflow-hidden rounded-[32px] border border-neutral-200 bg-white shadow-[0_30px_70px_rgba(15,23,42,0.08)]">
                <div className="relative h-72 w-full">
                  <Image src={item.image.src ?? "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80"} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="space-y-2 px-6 py-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">{item.category}</p>
                  <h3 className="text-2xl font-semibold" style={{ fontFamily: serifFont }}>{item.title}</h3>
                  <p className="text-sm text-neutral-600">{item.summary ?? item.image.alt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-white/85 px-6 py-20" id="packages">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className={labelClass}>Session types</p>
              <h2 className="mt-3 text-4xl font-semibold" style={{ fontFamily: serifFont }}>
                How we work together
              </h2>
              <p className="mt-3 text-neutral-600">From focused headshot sessions to full creative collaborations with wardrobe, styling, and multiple locations—choose what feels right for your needs.</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white/70 px-5 py-4 text-sm text-neutral-600">
              Most clients choose the mid-tier option for variety and flexibility.
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {content.services.map((service) => (
              <div key={service.id} className={`relative rounded-[36px] border border-neutral-200 bg-gradient-to-br from-white via-white to-white/40 p-8 shadow-[0_25px_80px_rgba(15,23,42,0.08)] ${form.packageId === service.id ? "ring-2 ring-neutral-900" : ""}`}>
                <div className="text-6xl font-semibold text-neutral-200" style={{ fontFamily: serifFont }}>
                  {service.numeral}
                </div>
                <h3 className="mt-4 text-2xl font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm text-neutral-600">{service.description}</p>
                <div className="mt-6 text-xs uppercase tracking-[0.3em] text-neutral-500">{service.periodLabel}</div>
                <div className="text-3xl font-semibold text-neutral-900">{service.price}</div>
                <ul className="mt-6 space-y-2 text-sm text-neutral-600">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, packageId: service.id }))}
                  className="mt-6 w-full rounded-full border border-neutral-900/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-neutral-900 hover:bg-neutral-900 hover:text-white"
                >
                  {form.packageId === service.id ? "Selected" : service.buttonLabel}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-6 py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-5 top-10 h-64 w-64 rounded-full bg-gradient-to-br from-[#ffe1d3] via-[#fff5e4] to-[#dceeff] blur-[140px]" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-gradient-to-br from-[#e3f0ff] via-[#fae6ff] to-[#fff6df] blur-[140px]" />
        </div>
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[40px] border border-neutral-200 bg-white/90 p-8 shadow-[0_30px_100px_rgba(15,23,42,0.1)]">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className={labelClass}>Begin here</p>
                <h2 className="text-3xl font-semibold" style={{ fontFamily: serifFont }}>
                  Share your vision
                </h2>
              </div>
              <div className="text-xs text-neutral-500">3 minutes</div>
            </div>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-sm">
              <div className="grid gap-4 md:grid-cols-2">
                <input className={inputClass} placeholder="Your name" required value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} />
                <input className={inputClass} placeholder="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input className={inputClass} placeholder="Instagram handle (optional)" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
                <input className={inputClass} placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className={labelClass}>Preferred date</label>
                  <input type="date" className={`${inputClass} mt-2`} value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Time of day</label>
                  <select className={`${inputClass} mt-2`} value={form.timeWindow} onChange={(e) => setForm({ ...form, timeWindow: e.target.value })}>
                    <option value="">Select</option>
                    <option value="sunrise">Early morning</option>
                    <option value="midday">Midday</option>
                    <option value="golden-hour">Golden hour (sunset)</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Location ideas</label>
                  <input className={`${inputClass} mt-2`} placeholder="Park, urban, home, etc." value={form.locationNotes} onChange={(e) => setForm({ ...form, locationNotes: e.target.value })} />
                </div>
              </div>

              <div className="rounded-3xl border border-neutral-200 bg-white/70 p-5">
                <p className={labelClass}>Visual style preferences</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {vibeOptions.map((option) => (
                    <button
                      type="button"
                      key={option.id}
                      onClick={() => toggleVibe(option.id)}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${styleQuiz.vibes.has(option.id) ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 bg-white"}`}
                    >
                      <div className="text-sm font-semibold">{option.label}</div>
                      <p className="text-xs text-neutral-500">{option.description}</p>
                    </button>
                  ))}
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Lighting</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {lightingOptions.map((option) => (
                        <button
                          type="button"
                          key={option.id}
                          onClick={() => setStyleQuiz((prev) => ({ ...prev, lighting: option.id }))}
                          className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] ${styleQuiz.lighting === option.id ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200"}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Palette</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {paletteOptions.map((option) => (
                        <button
                          type="button"
                          key={option.id}
                          onClick={() => setStyleQuiz((prev) => ({ ...prev, palette: option.id }))}
                          className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] ${styleQuiz.palette === option.id ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200"}`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <textarea
                  className={`${inputClass} mt-4 min-h-[120px]`}
                  placeholder="Tell me about your vision—outfits, specific locations, props, or the vibe you're going for."
                  value={styleQuiz.inspirationNotes}
                  onChange={(e) => setStyleQuiz((prev) => ({ ...prev, inspirationNotes: e.target.value }))}
                />
              </div>

              <textarea className={`${inputClass} min-h-[120px]`} placeholder="What's the occasion or purpose? (Personal branding, milestone celebration, artist portfolio, dating apps, family gift, just because...)" value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} />

              <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/70 p-5 text-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Visual references (optional)</p>
                <p className="mt-2 text-neutral-600">Pinterest boards, magazine tears, photos you admire—anything that helps me understand your aesthetic. JPG, PNG, or PDF.</p>
                <label className="mt-4 inline-flex cursor-pointer items-center gap-3 rounded-full border border-neutral-900/10 px-5 py-3 text-xs uppercase tracking-[0.3em] text-neutral-900 hover:bg-neutral-900 hover:text-white">
                  Upload references
                  <input type="file" accept="image/*,.pdf" multiple className="hidden" onChange={handleFileChange} />
                </label>
                {files.length > 0 && (
                  <ul className="mt-3 space-y-2 text-neutral-600">
                    {files.map((file) => (
                      <li key={file.name + file.size} className="flex items-center justify-between text-xs">
                        <span>{file.name}</span>
                        <button type="button" onClick={() => setFiles((prev) => prev.filter((f) => f !== file))} className="text-neutral-400 hover:text-neutral-900">
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {error && <p className="text-xs text-rose-500">{error}</p>}
              {success && <p className="text-xs text-emerald-600">{success}</p>}

              <button disabled={submitting} className="w-full rounded-full bg-neutral-900 px-6 py-4 text-sm font-semibold uppercase tracking-[0.4em] text-white disabled:opacity-50">
                {submitting ? "Sending" : "Submit request"}
              </button>
            </form>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-[32px] border border-neutral-200 bg-white/85 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
              <p className={labelClass}>Your session</p>
              <h3 className="mt-3 text-2xl font-semibold" style={{ fontFamily: serifFont }}>
                {selectedPackage?.title ?? "Portrait session"}
              </h3>
              <p className="mt-2 text-sm text-neutral-600">{selectedPackage?.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-neutral-600">
                {selectedPackage?.features.slice(0, 4).map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-2xl border border-neutral-200 bg-white/70 p-4 text-sm">
                <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">Request status</div>
                <div className="text-lg font-semibold text-neutral-900">
                  {submission?.status ? submission.status.replace("-", " ") : "Not yet submitted"}
                </div>
                {submission?.trackingCode && (
                  <p className="text-xs text-neutral-500">Reference • {submission.trackingCode}</p>
                )}
              </div>
            </div>

            <div className="rounded-[32px] border border-neutral-200 bg-white/85 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
              <p className={labelClass}>Existing booking</p>
              <form onSubmit={handleLookup} className="mt-4 flex gap-3">
                <input className={`${inputClass}`} placeholder="Enter tracking code" value={lookupCode} onChange={(e) => setLookupCode(e.target.value)} />
                <button className="rounded-2xl bg-neutral-900 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white">View</button>
              </form>
              {lookupError && <p className="mt-2 text-xs text-rose-500">{lookupError}</p>}
            </div>

            <div className="rounded-[32px] border border-neutral-200 bg-white/90 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
              <p className={labelClass}>Updates</p>
              {submission?.updates?.length ? (
                <ul className="mt-4 space-y-4 text-sm text-neutral-700">
                  {submission.updates.map((update) => (
                    <li key={update.id} className="rounded-2xl border border-neutral-200 bg-white/70 p-4">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-neutral-500">
                        <span>{update.sender}</span>
                        <span>{new Date(update.sentAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="mt-2 text-base font-semibold">{update.title}</h4>
                      <p className="mt-2 text-sm text-neutral-600 whitespace-pre-line">{update.message}</p>
                      {update.attachments?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-neutral-500">
                          {update.attachments.map((attachment) => (
                            <a key={attachment.label} href={attachment.url} target="_blank" className="rounded-full border border-neutral-200 px-3 py-1 hover:border-neutral-900" rel="noreferrer">
                              {attachment.label}
                            </a>
                          ))}
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-neutral-500">Session details, scheduling, and sneak peeks will appear here once I&apos;ve reviewed your request.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl rounded-[48px] border border-neutral-200 bg-white/90 p-12 text-center shadow-[0_40px_120px_rgba(15,23,42,0.1)]">
          <p className={labelClass}>Still deciding?</p>
          <h2 className="mt-4 text-4xl font-semibold" style={{ fontFamily: serifFont }}>
            Let&apos;s talk through your ideas.
          </h2>
          <p className="mt-4 text-neutral-600">Send me a note, or check out my other creative work at Change Studios Media.</p>
          <div className="mt-6 flex flex-col gap-3 md:flex-row md:justify-center">
            <a href="mailto:portraits@changemedia.studio" className="rounded-full border border-neutral-900 px-6 py-4 text-sm font-semibold uppercase tracking-[0.35em] text-neutral-900">
              Get in touch
            </a>
            <a href="/change-studios" className="rounded-full bg-neutral-900 px-6 py-4 text-sm font-semibold uppercase tracking-[0.35em] text-white">
              View other work
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
