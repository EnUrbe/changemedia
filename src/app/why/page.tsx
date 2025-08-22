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
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <p className="text-xs uppercase tracking-[0.28em] text-neutral-400">Why CHANGE Studios</p>
          <h1 className="mt-3 text-4xl md:text-6xl font-semibold tracking-tight">Evidence with a heartbeat</h1>
          <p className="mt-5 max-w-3xl text-neutral-300 text-lg">Because stories don’t just describe the world—they draft it.</p>
          <p className="mt-3 max-w-3xl text-neutral-300">We began with a simple observation: change rarely starts with a policy memo. It starts with a sentence that lodges in a heart, a scene someone can’t shake, a truth spoken by the people who lived it. At CHANGE Studios, we build those sentences and scenes with research-grade rigor and community authorship. We listen in kitchens and clinics, map the systems beneath the surface, and craft narratives designed to move from feeling to action to outcome.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="/#work" className="rounded-xl bg-white text-neutral-900 px-4 py-2 text-sm font-medium hover:bg-neutral-200">See work</a>
            <a href="/#contact" className="rounded-xl border border-white/20 px-4 py-2 text-sm hover:bg-white/5">Start a project</a>
          </div>
        </div>
      </section>

      {/* LOGO CLOUD */}
      <section className="border-b border-white/10 bg-white/5">
        <div className="mx-auto max-w-6xl px-4 py-8">
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
            <div key={s.k} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <div className="text-2xl font-semibold">{s.k}</div>
              <div className="text-xs text-neutral-400">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BELIEFS */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-16 grid gap-10 md:gap-16">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">What we believe</h2>
            <ul className="mt-4 space-y-3 text-neutral-300 text-sm md:text-base">
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-400"/>Story is an instrument. Tuned with data, played by lived experience, heard in the civic square.</li>
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-400"/>Beauty is persuasion with integrity. Aesthetics aren’t decoration; they are how truth travels.</li>
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-purple-400"/>Co-creation is accuracy. Nothing about us, without us—on and off camera.</li>
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/60"/>Impact is design, not afterthought. We prototype, test, and measure for real-world effect.</li>
            </ul>
          </div>

          {/* DIFFERENTIATORS */}
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">What makes us different</h2>
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              {[
                { t: "Interdisciplinary craft", d: "Field reporting + public‑health framing + behavioral science + cinematic production." },
                { t: "Community‑led narratives", d: "Storytellers and stakeholders at the same table from day one." },
                { t: "Evidence of effect", d: "Pre/post exposure testing, A/B message trials, qualitative resonance diaries." },
                { t: "From content to consequence", d: "Distribution tied to hearings, services, campaigns, and local action." },
              ].map((c) => (
                <div key={c.t} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="text-lg font-medium">{c.t}</div>
                  <p className="mt-2 text-sm text-neutral-300">{c.d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* PROCESS */}
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">How change happens here</h2>
            <p className="mt-3 max-w-3xl text-neutral-300">Listen → Distill → Co-Create → Test → Move</p>
            <div className="mt-6 grid gap-4 md:grid-cols-5">
              {[
                { n: 1, t: "Listen", d: "Kitchen tables, clinic rooms, council chambers." },
                { n: 2, t: "Distill", d: "Map systems, find leverage, cut to clarity." },
                { n: 3, t: "Co‑Create", d: "Participants as authors; consent and care." },
                { n: 4, t: "Test", d: "Pre/post reads, A/B messages, small pilots." },
                { n: 5, t: "Move", d: "Launch to hearings, services, and campaigns." },
              ].map((s) => (
                <div key={s.t} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs">{s.n}</span>
                    <div className="font-medium">{s.t}</div>
                  </div>
                  <p className="mt-2 text-sm text-neutral-300">{s.d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ACCOUNTABILITY */}
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">How we hold ourselves accountable</h2>
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              {[
                { t: "Resonance", d: "Recall and belief-shift indices in target audiences." },
                { t: "Behavior", d: "Sign-ups, service referrals, event turnout, volunteer actions." },
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

          {/* CLOSER */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-neutral-300">We don’t chase virality. We build durable narratives that help a public see itself—and its future—more clearly.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="/#contact" className="rounded-xl bg-white text-neutral-900 px-4 py-2 text-sm font-medium hover:bg-neutral-200">Book a call</a>
              <a href="/#work" className="rounded-xl border border-white/20 px-4 py-2 text-sm hover:bg-white/5">See work</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}