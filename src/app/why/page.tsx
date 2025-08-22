import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why CHANGE Studios — Evidence with a heartbeat",
  description:
    "Why CHANGE Studios: stories that move from feeling to action to outcome, built with research-grade rigor and community authorship.",
};

export default function WhyPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="border-b border-white/10 bg-white/5">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">Why CHANGE Studios</h1>
          <p className="mt-6 max-w-3xl text-neutral-300 text-lg">
            Because stories don’t just describe the world—they draft it.
          </p>
          <p className="mt-4 max-w-3xl text-neutral-300">
            We began with a simple observation: change rarely starts with a policy memo. It starts with a sentence that lodges in a heart, a scene someone can’t shake, a truth spoken by the people who lived it. At CHANGE Studios, we build those sentences and scenes with research-grade rigor and community authorship. We listen in kitchens and clinics, map the systems beneath the surface, and craft narratives designed to move from feeling to action to outcome. Evidence with a heartbeat—that’s our method, and our promise.
          </p>
        </div>
      </section>

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

          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">What makes us different</h2>
            <ul className="mt-4 space-y-3 text-neutral-300 text-sm md:text-base">
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-400"/>Interdisciplinary craft: field reporting + public-health framing + behavioral science + cinematic production.</li>
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-400"/>Community-led narratives: storytellers and stakeholders at the same table from day one.</li>
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-purple-400"/>Evidence of effect: pre/post exposure testing, A/B message trials, qualitative resonance diaries.</li>
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/60"/>From content to consequence: distribution tied to hearings, services, campaigns, and local action.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">How change happens here</h2>
            <p className="mt-4 max-w-3xl text-neutral-300">Listen → Distill → Co-Create → Test → Move</p>
            <p className="mt-3 max-w-3xl text-neutral-300">We translate complexity into clarity, launch stories into the wild, and track what shifts—beliefs, behaviors, and ultimately, systems.</p>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">How we hold ourselves accountable</h2>
            <ul className="mt-4 space-y-3 text-neutral-300 text-sm md:text-base">
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-400"/>Resonance: recall and belief-shift indices in target audiences.</li>
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-400"/>Behavior: sign-ups, service referrals, event turnout, volunteer actions.</li>
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-purple-400"/>Systems: citations in hearings, partner adoption, earned media reframing.</li>
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/60"/>Capacity: local storytellers trained; assets reused by community partners.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-neutral-300">We don’t chase virality. We build durable narratives that help a public see itself—and its future—more clearly.</p>
          </div>
        </div>
      </section>
    </main>
  );
}