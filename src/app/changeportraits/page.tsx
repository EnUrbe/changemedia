"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import NavBar from "@/components/ui/NavBar";
import Button from "@/components/ui/Button";
import { getServiceConfig } from "@/lib/portraitServices";

const HOW_IT_WORKS = [
  { title: "Submit a quick form", detail: "Share timing, vibe, and how you heard about us." },
  { title: "Confirm a time & pay a deposit", detail: "We send a shortlist of slots plus the Mercury deposit link." },
  { title: "Shoot day & gallery delivered", detail: "Arrive ready; receive selects in 5–7 days." },
];

const SESSION_PACKAGES = [
  {
    title: "Solo",
    description: "1 person, 30–45 minutes, up to 2 looks",
    bestFor: "Grads, founders, creatives",
  },
  {
    title: "Friends",
    description: "2–3 people, 45 minutes, mix of group + solo moments",
    bestFor: "Roommates, best friends, cofounders",
  },
  {
    title: "Couple",
    description: "2 people, 45–60 minutes, cinematic prompts",
    bestFor: "Partners, engagements, anniversaries",
  },
  {
    title: "Organization",
    description: "4+ people, custom duration, on-campus or on-site",
    bestFor: "Student orgs, teams, companies",
  },
] as const;

const SESSION_TYPES = ["Solo", "Friends", "Couple", "Organization"] as const;
const TIME_WINDOWS = ["Morning", "Afternoon", "Golden hour", "Flexible"] as const;
const HOW_HEARD_OPTIONS = ["Poster", "Instagram", "Friend", "Org", "Other"] as const;

const containerStyles = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

export default function ChangePortraitsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f2f0eb] text-sm text-neutral-500">
          Loading portrait flow…
        </div>
      }
    >
      <ChangePortraitsLanding />
    </Suspense>
  );
}

function ChangePortraitsLanding() {
  const searchParams = useSearchParams();
  const paramService = (searchParams.get("service") || "").trim();
  const { key: serviceKey, config: service } = getServiceConfig(paramService);
  const sourceParam = (searchParams.get("src") || "").trim() || "direct";
  const referralFrom = sourceParam.startsWith("referral_") ? sourceParam : "";

  const formRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const featuredUsesLabel = useMemo(() => service.featuredUses.join(" • "), [service.featuredUses]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      full_name: String(formData.get("full_name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      school: String(formData.get("school") || "").trim() || null,
      session_type: String(formData.get("session_type") || "Solo"),
      preferred_dates: String(formData.get("preferred_dates") || "").trim() || null,
      preferred_time_window: String(formData.get("preferred_time_window") || "Flexible"),
      how_heard: String(formData.get("how_heard") || "Other"),
      service_type: serviceKey,
      source: sourceParam,
      referral_from: referralFrom || null,
    };

    if (!payload.full_name || !payload.email || !payload.phone) {
      setStatus("error");
      setMessage("Please fill in your name, email, and phone so we can lock things in.");
      return;
    }

    setStatus("loading");
    setMessage("Sending your info…");

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Something went wrong. Try again.");
      }

      setStatus("success");
      setMessage("Got it – your inquiry was received. I’ll send times and a Mercury deposit link shortly.");
      event.currentTarget.reset();
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage(
        "Couldn’t send the form right now. Email me at portraits@changestudios.com or DM @change.photography."
      );
    }
  }

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black">
      <NavBar
        links={[
          { href: "/photography", label: "Photography" },
          { href: "/portraits", label: "Portraits" },
          { href: "/change-studios", label: "Studios" },
        ]}
        cta={{ href: "#form", label: "Book Session" }}
        tone="dark"
      />

      <main className="space-y-24 pb-32">
        {/* Hero Section */}
        <section className={containerStyles}>
          <div className="relative overflow-hidden rounded-[48px] bg-white/5 p-8 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.06)] md:p-16 border border-white/10">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
            <div className="relative z-10 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[0.6rem] uppercase tracking-[0.2em] text-white/40">{service.label}</span>
                </div>
                <h1 className="text-6xl leading-[0.9] tracking-tight md:text-8xl text-white" style={{ fontFamily: "var(--font-family-serif, 'Instrument Serif', Georgia, serif)" }}>
                  {service.headline}
                </h1>
                <p className="max-w-xl text-xl leading-relaxed text-white/60 md:text-2xl">{service.subheadline}</p>
              </div>
              
              <div className="flex flex-col gap-6 lg:items-end lg:text-right">
                <div className="space-y-1">
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Starting at</p>
                  <p className="text-3xl font-medium text-white" style={{ fontFamily: "var(--font-family-serif, 'Instrument Serif', Georgia, serif)" }}>
                    {service.defaultPriceLabel.replace("Sessions from ", "")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Perfect for</p>
                  <p className="text-sm text-white/60">{featuredUsesLabel}</p>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button href="#form" size="lg" variant="soft" onClick={scrollToForm} className="bg-white text-black hover:bg-neutral-200">
                    Book your session
                  </Button>
                  <Button href="/photography/portrait" size="lg" variant="ghost" className="text-white border-white/30 hover:bg-white/10">
                    View Gallery
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className={containerStyles}>
          <div className="grid gap-12 md:grid-cols-[0.4fr_1fr]">
            <div className="space-y-4">
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Process</p>
              <h2 className="text-4xl md:text-5xl text-white" style={{ fontFamily: "var(--font-family-serif, 'Instrument Serif', Georgia, serif)" }}>
                How it works
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {HOW_IT_WORKS.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative flex flex-col justify-between rounded-3xl bg-white/5 p-6 shadow-sm transition hover:shadow-md border border-white/10"
                >
                  <span className="text-5xl font-light text-white/10 transition group-hover:text-white/20" style={{ fontFamily: "var(--font-family-serif, 'Instrument Serif', Georgia, serif)" }}>
                    0{index + 1}
                  </span>
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-white">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">{step.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Packages */}
        <section className={containerStyles}>
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-4">
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Packages</p>
              <h2 className="text-4xl md:text-5xl text-white" style={{ fontFamily: "var(--font-family-serif, 'Instrument Serif', Georgia, serif)" }}>
                Select your format
              </h2>
            </div>
            <p className="max-w-xs text-sm text-white/60 text-right hidden md:block">
              All sessions include creative direction, location scouting, and high-res delivery.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {SESSION_PACKAGES.map((pkg, i) => (
              <motion.div
                key={pkg.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="flex flex-col justify-between rounded-[32px] border border-white/10 bg-white/5 p-8 transition hover:border-white/20 hover:shadow-lg"
              >
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.6rem] uppercase tracking-wider text-white/40">
                      {service.label.split(" ")[0]}
                    </span>
                  </div>
                  <h3 className="text-3xl text-white" style={{ fontFamily: "var(--font-family-serif, 'Instrument Serif', Georgia, serif)" }}>
                    {pkg.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/60">{pkg.description}</p>
                </div>
                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="text-[0.6rem] uppercase tracking-wider text-white/40">Best for</p>
                  <p className="mt-1 text-sm font-medium text-white">{pkg.bestFor}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Booking Form */}
        <section ref={formRef} className={containerStyles}>
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-[48px] bg-white/5 p-8 shadow-sm md:p-12 border border-white/10">
              <div className="mb-10 space-y-4">
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Inquiry</p>
                <h2 className="text-4xl md:text-5xl text-white" style={{ fontFamily: "var(--font-family-serif, 'Instrument Serif', Georgia, serif)" }}>
                  Let’s create something timeless.
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label className="ml-4 text-xs font-medium text-white/60">Full Name</label>
                  <input
                    name="full_name"
                    required
                    className="w-full rounded-2xl border-0 bg-white/5 px-6 py-4 text-white placeholder-white/40 ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-white"
                    placeholder="Jane Doe"
                    autoComplete="name"
                  />
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="ml-4 text-xs font-medium text-white/60">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full rounded-2xl border-0 bg-white/5 px-6 py-4 text-white placeholder-white/40 ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-white"
                      placeholder="jane@example.com"
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="ml-4 text-xs font-medium text-white/60">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full rounded-2xl border-0 bg-white/5 px-6 py-4 text-white placeholder-white/40 ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-white"
                      placeholder="(555) 000-0000"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="ml-4 text-xs font-medium text-white/60">School / Organization</label>
                  <input
                    name="school"
                    className="w-full rounded-2xl border-0 bg-white/5 px-6 py-4 text-white placeholder-white/40 ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-white"
                    placeholder="University, Company, or Group Name"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="ml-4 text-xs font-medium text-white/60">Session Type</label>
                    <div className="relative">
                      <select
                        name="session_type"
                        className="w-full appearance-none rounded-2xl border-0 bg-white/5 px-6 py-4 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-white"
                        defaultValue={SESSION_TYPES[0]}
                      >
                        {SESSION_TYPES.map((type) => (
                          <option key={type} value={type} className="bg-black text-white">
                            {type}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-6 flex items-center text-white/60">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="ml-4 text-xs font-medium text-white/60">Preferred Window</label>
                    <div className="relative">
                      <select
                        name="preferred_time_window"
                        className="w-full appearance-none rounded-2xl border-0 bg-white/5 px-6 py-4 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-white"
                        defaultValue={TIME_WINDOWS[3]}
                      >
                        {TIME_WINDOWS.map((window) => (
                          <option key={window} value={window} className="bg-black text-white">
                            {window}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-6 flex items-center text-white/60">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="ml-4 text-xs font-medium text-white/60">Preferred Dates & Notes</label>
                  <textarea
                    name="preferred_dates"
                    rows={3}
                    className="w-full rounded-2xl border-0 bg-white/5 px-6 py-4 text-white placeholder-white/40 ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-white"
                    placeholder="Any specific dates in mind? Any vibe requests?"
                  />
                </div>

                <div className="space-y-1">
                  <label className="ml-4 text-xs font-medium text-white/60">Source</label>
                  <div className="relative">
                    <select
                      name="how_heard"
                      className="w-full appearance-none rounded-2xl border-0 bg-white/5 px-6 py-4 text-white ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-white"
                      defaultValue={HOW_HEARD_OPTIONS[0]}
                    >
                      {HOW_HEARD_OPTIONS.map((option) => (
                        <option key={option} value={option} className="bg-black text-white">
                          {option}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-6 flex items-center text-white/60">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <input type="hidden" name="service_type" value={serviceKey} />
                <input type="hidden" name="source" value={sourceParam} />
                {referralFrom && <input type="hidden" name="referral_from" value={referralFrom} />}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full rounded-full bg-white px-8 py-5 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:opacity-70"
                  >
                    {status === "loading" ? "Sending..." : "Submit Inquiry"}
                  </button>
                </div>
                
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl p-4 text-center text-sm ${
                      status === "error" ? "bg-red-900/20 text-red-400" : "bg-green-900/20 text-green-400"
                    }`}
                  >
                    {message}
                  </motion.div>
                )}
              </form>
            </div>

            <div className="flex flex-col justify-between rounded-[48px] bg-white/10 p-8 text-white shadow-2xl md:p-12 border border-white/10">
              <div className="space-y-8">
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Next Steps</p>
                  <h3 className="mt-4 text-3xl" style={{ fontFamily: "var(--font-family-serif, 'Instrument Serif', Georgia, serif)" }}>
                    What happens after you submit?
                  </h3>
                </div>
                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/20 text-xs text-white/40">1</span>
                    <p className="text-sm text-white/60">I’ll review your request and send over available time slots within 24 hours.</p>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/20 text-xs text-white/40">2</span>
                    <p className="text-sm text-white/60">You’ll receive a secure Mercury deposit link to lock in your date (no Stripe fees).</p>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/20 text-xs text-white/40">3</span>
                    <p className="text-sm text-white/60">We shoot, and you get your high-res gallery in under a week.</p>
                  </li>
                </ul>
              </div>

              <div className="mt-12 rounded-3xl bg-white/10 p-6 backdrop-blur-sm">
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Deposit</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-medium" style={{ fontFamily: "var(--font-family-serif, 'Instrument Serif', Georgia, serif)" }}>
                    ${(service.depositCents / 100).toFixed(0)}
                  </span>
                  <span className="text-sm text-white/40">to reserve</span>
                </div>
                <p className="mt-2 text-xs text-white/40">Applied to your final balance. ACH preferred.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
