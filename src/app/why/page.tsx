import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Why CHANGE Studios — Evidence with a heartbeat",
  description:
    "Why CHANGE Studios: stories that move from feeling to action to outcome, built with research-grade rigor and community authorship.",
};

export default function WhyPage() {
  return (
    <main className="relative min-h-screen bg-neutral-950 text-neutral-50">
      {/* BACKDROP ART */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(16,185,129,0.12),transparent_60%)] blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(closest-side,rgba(56,189,248,0.12),transparent_60%)] blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgba(236,72,153,0.12),transparent_60%)] blur-3xl" />
      </div>

      {/* HERO */}
      <section className="border-b border-white/10 bg-white/5">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-neutral-400">
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">Why CHANGE Studios</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">Evidence‑driven</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">Community‑authored</span>
          </div>
          <h1 className="mt-5 text-4xl md:text-6xl font-semibold leading-tight">
            <span className="bg-gradient-to-br from-emerald-300 via-sky-300 to-purple-300 bg-clip-text text-transparent">Evidence with a heartbeat</span>
          </h1>
          <p className="mt-5 max-w-3xl text-neutral-300 text-lg">Because stories don’t just describe the world—they draft it.</p>
          <p className="mt-3 max-w-3xl text-neutral-300">We began with a simple observation: change rarely starts with a policy memo. It starts with a sentence that lodges in a heart, a scene someone can’t shake, a truth spoken by the people who lived it. At CHANGE Studios, we build those sentences and scenes with research‑grade rigor and community authorship. We listen in kitchens and clinics, map the systems beneath the surface, and craft narratives designed to move from feeling to action to outcome.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/#work" className="rounded-xl bg-white text-neutral-900 px-4 py-2 text-sm font-medium hover:bg-neutral-200">See work</a>
            <a href="/#contact" className="rounded-xl border border-white/20 px-4 py-2 text-sm hover:bg-white/5">Start a project</a>
          </div>
        </div>
      </section>

      {/* LOGO CLOUD */}
      <section className="border-b border-white/10 bg-white/5">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="text-center text-xs uppercase tracking-[0.22em] text-neutral-400">Trusted by teams who build for people</div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 items-center gap-6 opacity-80">
            {[
              { src: "/vercel.svg", alt: "Vercel" },
              { src: "/next.svg", alt: "Next.js" },
              { src: "/globe.svg", alt: "Globe" },
              { src: "/window.svg", alt: "Window" },
              { src: "/file.svg", alt: "File" },
              { src: "/vercel.svg", alt: "Vercel 2" },
            ].map((l) => (
              <div key={l.alt} className="flex items-center justify-center py-2">
                <Image src={l.src} alt={l.alt} width={100} height={28} className="h-7 w-auto opacity-70" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { k: "200+", v: "neighbors reached via direct care" },
            { k: "10+", v: "policy efforts documented" },
            { k: "72 hr", v: "typical event‑to‑edit" },
            { k: "6 mo", v: "recommended retainer" },
          ].map((s) => (
            <div key={s.k} className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-4 text-center">
              <div className="text-2xl font-semibold">{s.k}</div>
              <div className="text-xs text-neutral-400">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BELIEFS + DIFFERENTIATORS */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-16 grid gap-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">What we believe</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[
                { t: "Story is an instrument.", d: "Tuned with data, played by lived experience, heard in the civic square." },
                { t: "Beauty is persuasion with integrity.", d: "Aesthetics aren’t decoration; they are how truth travels." },
                { t: "Co‑creation is accuracy.", d: "Nothing about us, without us—on and off camera." },
                { t: "Impact is design, not afterthought.", d: "We prototype, test, and measure for real‑world effect." },
              ].map((b) => (
                <div key={b.t} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="text-lg font-medium">{b.t}</div>
                  <p className="mt-2 text-sm text-neutral-300">{b.d}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">What makes us different</h2>
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              {[
                { t: "Interdisciplinary craft", d: "Field reporting + public‑health framing + behavioral science + cinematic production." },
                { t: "Community‑led narratives", d: "Storytellers and stakeholders at the same table from day one." },
                { t: "Evidence of effect", d: "Pre/post exposure testing, A/B message trials, qualitative resonance diaries." },
                { t: "From content to consequence", d: "Distribution tied to hearings, services, campaigns, and local action." },
              ].map((c) => (
                <div key={c.t} className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6">
                  <div className="text-lg font-medium">{c.t}</div>
                  <p className="mt-2 text-sm text-neutral-300">{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="border-y border-white/10 bg-white/5">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-semibold">How change happens here</h2>
          <p className="mt-2 max-w-3xl text-neutral-300">Listen → Distill → Co‑Create → Test → Move</p>
          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {[
              { n: 1, t: "Listen", d: "Kitchen tables, clinic rooms, council chambers." },
              { n: 2, t: "Distill", d: "Map systems, find leverage, cut to clarity." },
              { n: 3, t: "Co‑Create", d: "Participants as authors; consent and care." },
              { n: 4, t: "Test", d: "Pre/post reads, A/B messages, small pilots." },
              { n: 5, t: "Move", d: "Launch to hearings, services, and campaigns." },
            ].map((s) => (
              <div key={s.t} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs">{s.n}</span>
                  <div className="font-medium">{s.t}</div>
                </div>
                <p className="mt-2 text-sm text-neutral-300">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-16">
          <blockquote className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 text-lg leading-relaxed">
            “Because policy without story is a map without a legend. We make the key—and we make it sing.”
            <footer className="mt-3 text-sm text-neutral-400">— CHANGE Studios</footer>
          </blockquote>
        </div>
      </section>

      {/* ACCOUNTABILITY */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-semibold">How we hold ourselves accountable</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {[
              { t: "Resonance", d: "Recall and belief‑shift indices in target audiences." },
              { t: "Behavior", d: "Sign‑ups, service referrals, event turnout, volunteer actions." },
              { t: "Systems", d: "Citations in hearings, partner adoption, earned media reframing." },
              { t: "Capacity", d: "Local storytellers trained; assets reused by community partners." },
            ].map((c) => (
              <div key={c.t} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="text-lg font-medium">{c.t}</div>
                <p className="mt-2 text-sm text-neutral-300">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="border-t border-white/10 bg-white/5">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-400/15 via-sky-400/15 to-purple-400/15 p-6">
            <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-lg font-medium">We don’t chase virality. We build durable narratives.</div>
                <div className="text-sm text-neutral-300">Ready to move people to act? Let’s make something that lasts.</div>
              </div>
              <div className="flex gap-2">
                <a href="/#contact" className="inline-flex items-center rounded-xl bg-white text-neutral-900 px-4 py-2 text-sm font-medium hover:bg-neutral-200">Book a call</a>
                <a href="/#work" className="inline-flex items-center rounded-xl border border-white/20 px-4 py-2 text-sm hover:bg-white/5">See work</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}