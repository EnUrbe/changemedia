import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Counter from "@/components/ui/Counter";
import SectionNav from "@/components/ui/SectionNav";

export const metadata: Metadata = {
  title: "Why CHANGE Studios — Evidence with a heartbeat",
  description:
    "Why CHANGE Studios: stories that move from feeling to action to outcome, built with research-grade rigor and community authorship.",
};

export default function WhyPage() {
  return (
    <main className="relative min-h-screen bg-[var(--background)] text-neutral-900">
      {/* BACKDROP ART */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,210,196,0.4),transparent_65%)] blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(closest-side,rgba(213,226,255,0.35),transparent_60%)] blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgba(232,201,255,0.35),transparent_60%)] blur-3xl" />
      </div>

      {/* HERO */}
      <section className="px-6 pt-20">
        <div className="mx-auto max-w-6xl rounded-[40px] border border-neutral-200/80 bg-white/90 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.08)] md:p-12">
          <div className="flex flex-wrap items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-neutral-500">
            <span className="rounded-full border border-neutral-200 px-3 py-1">Why CHANGE Studios</span>
            <span className="rounded-full border border-neutral-200 px-3 py-1">Evidence‑driven</span>
            <span className="rounded-full border border-neutral-200 px-3 py-1">Community‑authored</span>
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-neutral-900 md:text-6xl" style={{ fontFamily: "var(--font-family-serif)" }}>
            <span className="bg-gradient-to-br from-[#5ba5ff] via-[#8f60ff] to-[#ff909b] bg-clip-text text-transparent">Evidence with a heartbeat</span>
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-neutral-600">Because stories don’t just describe the world—they draft it.</p>
          <p className="mt-3 max-w-3xl text-neutral-600">
            We began with a simple observation: change rarely starts with a policy memo. It starts with a sentence that lodges in a heart, a scene someone can’t shake,
            a truth spoken by the people who lived it. At CHANGE Studios, we build those sentences and scenes with research‑grade rigor and community authorship. We
            listen in kitchens and clinics, map the systems beneath the surface, and craft narratives designed to move from feeling to action to outcome.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/#work"
              className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(15,23,42,0.2)] hover:-translate-y-0.5"
            >
              See work
            </Link>
            <Link
              href="/#contact"
              className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-700 hover:border-neutral-900 hover:text-neutral-900"
            >
              Start a project
            </Link>
          </div>
        </div>
      </section>

      {/* Sticky sub‑nav for page sections */}
      <SectionNav
        sections={[
          { id: "metrics", label: "Metrics" },
          { id: "beliefs", label: "Beliefs" },
          { id: "different", label: "Different" },
          { id: "process", label: "Process" },
          { id: "accountability", label: "Accountability" },
          { id: "cta", label: "Get in touch" },
        ]}
        variant="light"
        className="mt-8"
      />

      {/* LOGO CLOUD */}
      <section className="border-b border-neutral-200/80 bg-white/80">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="text-center text-xs uppercase tracking-[0.22em] text-neutral-500">Trusted by teams who build for people</div>
          <div className="mt-6 grid grid-cols-2 items-center gap-6 opacity-80 sm:grid-cols-3 md:grid-cols-6">
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
      <section id="metrics" className="px-6">
        <div className="mx-auto max-w-6xl grid grid-cols-2 gap-4 py-12 md:grid-cols-4">
          {[
            { val: 200, suffix: "+", v: "neighbors reached via direct care" },
            { val: 10, suffix: "+", v: "policy efforts documented" },
            { val: 72, suffix: " hr", v: "typical event‑to‑edit" },
            { val: 6, suffix: " mo", v: "recommended retainer" },
          ].map((s) => (
            <div key={s.v} className="rounded-3xl border border-neutral-200 bg-white/80 p-5 text-center shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <Counter value={s.val} suffix={s.suffix} className="text-3xl font-semibold text-neutral-900" />
              <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BELIEFS + DIFFERENTIATORS */}
      <section>
        <div className="mx-auto max-w-6xl grid gap-12 px-6 py-16">
          <div id="beliefs">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Beliefs</p>
            <h2 className="mt-2 text-3xl font-semibold text-neutral-900">What we believe</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                { t: "Story is an instrument.", d: "Tuned with data, played by lived experience, heard in the civic square." },
                { t: "Beauty is persuasion with integrity.", d: "Aesthetics aren’t decoration; they are how truth travels." },
                { t: "Co‑creation is accuracy.", d: "Nothing about us, without us—on and off camera." },
                { t: "Impact is design, not afterthought.", d: "We prototype, test, and measure for real‑world effect." },
              ].map((b) => (
                <div key={b.t} className="rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                  <div className="text-lg font-semibold text-neutral-900">{b.t}</div>
                  <p className="mt-2 text-sm text-neutral-600">{b.d}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="different">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Differentiators</p>
            <h2 className="mt-2 text-3xl font-semibold text-neutral-900">What makes us different</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {[
                { t: "Interdisciplinary craft", d: "Field reporting + public‑health framing + behavioral science + cinematic production." },
                { t: "Community‑led narratives", d: "Storytellers and stakeholders at the same table from day one." },
                { t: "Evidence of effect", d: "Pre/post exposure testing, A/B message trials, qualitative resonance diaries." },
                { t: "From content to consequence", d: "Distribution tied to hearings, services, campaigns, and local action." },
              ].map((c) => (
                <div
                  key={c.t}
                  className="rounded-3xl border border-neutral-200 bg-gradient-to-br from-white via-[#fdf8f2] to-[#f2f7ff] p-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)]"
                >
                  <div className="text-lg font-semibold text-neutral-900">{c.t}</div>
                  <p className="mt-2 text-sm text-neutral-600">{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="border-y border-neutral-200/80 bg-white/80">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Process</p>
          <h2 className="mt-2 text-3xl font-semibold text-neutral-900">How change happens here</h2>
          <p className="mt-2 max-w-3xl text-neutral-600">Listen → Distill → Co‑Create → Test → Move</p>
          <div className="mt-8 grid gap-4 md:grid-cols-5">
            {[
              { n: 1, t: "Listen", d: "Kitchen tables, clinic rooms, council chambers." },
              { n: 2, t: "Distill", d: "Map systems, find leverage, cut to clarity." },
              { n: 3, t: "Co‑Create", d: "Participants as authors; consent and care." },
              { n: 4, t: "Test", d: "Pre/post reads, A/B messages, small pilots." },
              { n: 5, t: "Move", d: "Launch to hearings, services, and campaigns." },
            ].map((s) => (
              <div key={s.t} className="rounded-2xl border border-neutral-200 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900/10 text-xs font-semibold text-neutral-900">{s.n}</span>
                  <div className="font-semibold text-neutral-900">{s.t}</div>
                </div>
                <p className="mt-2 text-sm text-neutral-600">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <blockquote className="rounded-[32px] border border-neutral-200 bg-gradient-to-br from-white via-[#f5f0ff] to-[#fff3eb] p-8 text-lg leading-relaxed text-neutral-700 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
            “Because policy without story is a map without a legend. We make the key—and we make it sing.”
            <footer className="mt-4 text-sm text-neutral-500">— CHANGE Studios</footer>
          </blockquote>
        </div>
      </section>

      {/* ACCOUNTABILITY */}
      <section id="accountability" className="px-6">
        <div className="mx-auto max-w-6xl py-16">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Accountability</p>
          <h2 className="mt-2 text-3xl font-semibold text-neutral-900">How we hold ourselves accountable</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {[
              { t: "Resonance", d: "Recall and belief‑shift indices in target audiences." },
              { t: "Behavior", d: "Sign‑ups, service referrals, event turnout, volunteer actions." },
              { t: "Systems", d: "Citations in hearings, partner adoption, earned media reframing." },
              { t: "Capacity", d: "Local storytellers trained; assets reused by community partners." },
            ].map((c) => (
              <div key={c.t} className="rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                <div className="text-lg font-semibold text-neutral-900">{c.t}</div>
                <p className="mt-2 text-sm text-neutral-600">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section id="cta" className="border-t border-neutral-200/80 bg-white/80">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="rounded-[32px] border border-neutral-200 bg-gradient-to-r from-[#fef4e7] via-[#eef3ff] to-[#f9e8ff] p-8 shadow-[0_30px_100px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Ready?</p>
                <div className="mt-2 text-2xl font-semibold text-neutral-900">We don’t chase virality. We build durable narratives.</div>
                <div className="mt-1 text-sm text-neutral-600">Ready to move people to act? Let’s make something that lasts.</div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/#contact" className="inline-flex items-center rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white">Book a call</Link>
                <Link
                  href="/#work"
                  className="inline-flex items-center rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-700 hover:border-neutral-900 hover:text-neutral-900"
                >
                  See work
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}