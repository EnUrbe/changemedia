import type { Metadata } from "next";
import Image from "next/image";
import Counter from "@/components/ui/Counter";
import SectionNav from "@/components/ui/SectionNav";
import NavBar from "@/components/ui/NavBar";
import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";

const serifFont = "var(--font-family-serif, 'Instrument Serif', Georgia, serif)";

const heroFieldNotes = [
  {
    label: "Active retainers",
    value: "08",
    description: "Public health, climate resilience, civic innovation",
  },
  {
    label: "Portrait days",
    value: "24",
    description: "Leadership fly-ins booked this quarter",
  },
  {
    label: "Systems mapped",
    value: "14",
    description: "Service flows audited before we ever hit record",
  },
];

const impetusColumns = [
  {
    title: "Policy to porch",
    description: "We translate legislative intent into human stakes your neighbors can repeat at dinner."
      + " Every treatment is backed by qualitative research, not hunches.",
    tags: ["Field reporting", "Memory devices", "Mutual aid roots"],
  },
  {
    title: "Design + doctrine",
    description: "The studio is bilingual: art direction and evidence. We keep speakers, stylists, strategists,"
      + " and social scientists in the same sprint.",
    tags: ["Behavioral science", "Cohort testing", "Care rituals"],
  },
  {
    title: "Distribution with consequence",
    description: "Launches are paired with policy hearings, clinic openings, or votes. If the work doesn’t move"
      + " something concrete, we aren’t done yet.",
    tags: ["Campaign orchestration", "Partner coalitions", "Earned media plots"],
  },
];

const proofStats = [
  { value: 372, suffix: "+", label: "story intercepts", note: "Community intercepts logged in field diaries" },
  { value: 92, suffix: "%", label: "message lift", note: "Average belief-shift post studio intervention" },
  { value: 48, suffix: " hr", label: "edit turnaround", note: "Rapid response crews for urgent hearings" },
  { value: 11, suffix: "", label: "jurisdictions", note: "States & cities using our narrative kits" },
];

const methodStages = [
  {
    step: "01",
    title: "Field listening",
    detail: "Kitchen tables, clinic break rooms, council chambers—micro convenings with notebooks, not cameras.",
    deliverable: "Cultural ledger",
  },
  {
    step: "02",
    title: "System mapping",
    detail: "We build the before/after map, surface leverage, and scope ethics of depiction before scripts exist.",
    deliverable: "Pressure map",
  },
  {
    step: "03",
    title: "Co-creation lab",
    detail: "Participants carry authorship. We storyboard with them, prototype in Miro, and pay for the labor.",
    deliverable: "Narrative pilot",
  },
  {
    step: "04",
    title: "Measurement sprints",
    detail: "A/B audio cuts, resonance diaries, and policy brief trackers tell us what to ship wider.",
    deliverable: "Evidence packet",
  },
  {
    step: "05",
    title: "Consequent launch",
    detail: "Distribution plans pair with votes, service launches, or fundraising pushes so momentum isn’t wasted.",
    deliverable: "Action stack",
  },
];

const stewardshipRows = [
  {
    title: "Resonance",
    points: ["Belief-shift indices", "Recall journaling", "Sentiment tagging"],
  },
  {
    title: "Behavior",
    points: ["Service referrals", "Volunteer minutes", "Clicks-to-care"],
  },
  {
    title: "Systems",
    points: ["Hearing citations", "Partner adoption", "Press reframes"],
  },
  {
    title: "Capacity",
    points: ["Local storytellers trained", "Reused assets", "Open templates"],
  },
];

const carePractices = [
  {
    label: "Consent as choreography",
    detail: "Participants sign off on drafts at every milestone. No surprises, no retroactive fixes.",
  },
  {
    label: "Wellness barges",
    detail: "Traveling kits with hydration, grounding prompts, and stipend cards follow every shoot.",
  },
  {
    label: "Equitable ownership",
    detail: "Footage libraries are shared back through community drives with usage language already cleared.",
  },
];

export const metadata: Metadata = {
  title: "Why CHANGE Studios — Field-proven narrative systems",
  description:
    "Inside the WHY of CHANGE Studios: how we combine research-grade rigor, community authorship, and boutique production care to move people from feeling to action.",
};

export default function WhyPage() {
  return (
    <main className="relative min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <NavBar
        links={[
          { href: "/why", label: "Why" },
          { href: "/change-studios", label: "Studios" },
          { href: "/photography", label: "Photography" },
          { href: "/photography/portrait", label: "Executive" },
          { href: "/portraits", label: "Portraits" },
          { href: "/login", label: "Login" },
        ]}
        cta={{ href: "/#contact", label: "Start a project" }}
        tone="dark"
      />

      <Section id="overview" padTop={false} className="relative z-10 !px-0 min-h-[90vh] flex flex-col justify-center overflow-hidden -mt-24 pb-24">
        {/* Hero Background */}
        <div className="absolute inset-0 z-0">
           <Image
              src="https://picsum.photos/seed/why/1920/1080"
              alt="Why Background"
              fill
              className="object-cover brightness-[0.4]"
              priority
           />
           <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#050505]" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-[1400px] gap-12 px-6 md:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-3 text-[0.65rem] uppercase tracking-[0.2em] text-white/70">
              <span className="rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2">Why CHANGE Studios</span>
              <span className="rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2">Evidence x Aesthetic</span>
            </div>
            <h1 className="text-5xl leading-[1.1] text-white md:text-7xl lg:text-8xl drop-shadow-lg" style={{ fontFamily: serifFont }}>
              We turn field notes<br />
              into operating systems for change.
            </h1>
            <p className="text-lg text-white/80 md:text-xl leading-relaxed max-w-2xl drop-shadow-md">
              A story isn’t content—it’s a protocol. Our practice pairs research-grade listening with boutique production care so leaders, organizers, and institutions
              can move people from feeling to action without losing integrity.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button href="/#work" size="lg" className="!bg-white !text-black hover:!bg-neutral-200 border-none">
                See proof of work
              </Button>
              <Button href="/#contact" size="lg" variant="ghost" className="text-white border-white/30 hover:bg-white/10">
                Book the practice
              </Button>
            </div>
          </div>
          
          {/* Glass Card for Stats */}
          <div className="rounded-[32px] border border-white/10 bg-black/20 backdrop-blur-xl p-8 shadow-2xl h-fit text-white">
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/60 mb-8">Field ledger</p>
            <div className="space-y-4">
              {heroFieldNotes.map((note) => (
                <div key={note.label} className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10 hover:border-white/20">
                  <div className="text-[0.6rem] uppercase tracking-[0.2em] text-white/50">{note.label}</div>
                  <div className="mt-2 text-4xl text-white" style={{ fontFamily: serifFont }}>
                    {note.value}
                  </div>
                  <p className="mt-2 text-sm text-white/70 leading-relaxed">{note.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <SectionNav
        sections={[
          { id: "impetus", label: "Impetus" },
          { id: "proof", label: "Proof" },
          { id: "methods", label: "Methods" },
          { id: "stewardship", label: "Stewardship" },
          { id: "care", label: "Care" },
          { id: "cta", label: "Talk" },
        ]}
        variant="dark"
        className="mt-12 relative z-10"
      />

      <section id="impetus" className="relative z-10 px-6 py-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between mb-20">
            <div className="max-w-3xl space-y-6">
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Why we built this</p>
              <h2 className="text-5xl text-white md:text-7xl" style={{ fontFamily: serifFont }}>
                The practice exists to make evidence feel inevitable.
              </h2>
              <p className="text-lg text-white/60 md:text-xl leading-relaxed">
                Campaigns flame out when story, care, and consequence live on different calendars. Our practice braids them together so decision makers don’t just hear
                data—they feel obligated by it.
              </p>
            </div>
            <span className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40 rounded-full border border-white/10 bg-white/5 px-4 py-2">Policy rooms ↔ living rooms</span>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {impetusColumns.map((column) => (
              <div key={column.title} className="flex h-full flex-col rounded-[32px] border border-white/10 bg-white/5 p-8 transition-all hover:shadow-lg hover:shadow-white/5">
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">{column.title}</p>
                <h3 className="mt-6 text-3xl text-white" style={{ fontFamily: serifFont }}>
                  {column.title.replace(/^[a-z]/, (match) => match.toUpperCase())}
                </h3>
                <p className="mt-4 text-white/60 leading-relaxed flex-grow">{column.description}</p>
                <div className="mt-8 flex flex-wrap gap-2 text-[0.6rem] uppercase tracking-[0.1em] text-white/40">
                  {column.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="proof" className="relative z-10 border-y border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="mx-auto max-w-[1400px] px-6 py-32">
          <div className="flex flex-col gap-6 mb-20">
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Evidence stack</p>
            <h2 className="text-5xl text-white md:text-7xl" style={{ fontFamily: serifFont }}>
              Proof that the work lands.
            </h2>
            <p className="max-w-2xl text-lg text-white/60">
              We track every launch like a research study: intercepts, lift, reuse, and systems change. Here’s the short ledger.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            {proofStats.map((stat) => (
              <div key={stat.label} className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-center transition-transform hover:-translate-y-1">
                <Counter value={stat.value} suffix={stat.suffix} className="text-5xl text-white" style={{ fontFamily: serifFont }} />
                <div className="mt-4 text-[0.65rem] uppercase tracking-[0.2em] text-white/40">{stat.label}</div>
                <p className="mt-4 text-sm text-white/60 leading-relaxed">{stat.note}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 rounded-[32px] bg-white/10 p-8 text-lg text-white/60 leading-relaxed md:p-12">
            <span className="text-white">“We don’t chase virality. We engineer narrative systems that can be audited.</span> If a council member asks us to defend a line, we can—it’s cited, sourced, and
            consented.”
          </div>
        </div>
      </section>

      <section id="methods" className="relative z-10 px-6 py-32">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40 mb-6">Methodology</p>
          <h2 className="text-5xl text-white md:text-7xl mb-20" style={{ fontFamily: serifFont }}>
            How we move from first interview to lasting consequence.
          </h2>
          <div className="grid gap-6 md:grid-cols-5">
            {methodStages.map((stage) => (
              <div key={stage.title} className="group rounded-[32px] border border-white/10 bg-white/5 p-8 transition-all hover:shadow-lg hover:shadow-white/5">
                <div className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">{stage.step}</div>
                <div className="mt-6 text-2xl text-white" style={{ fontFamily: serifFont }}>
                  {stage.title}
                </div>
                <p className="mt-4 text-sm text-white/60 leading-relaxed min-h-[80px]">{stage.detail}</p>
                <div className="mt-6 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.1em] text-white/40 group-hover:bg-white group-hover:text-black group-hover:border-white transition-colors">
                  {stage.deliverable}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="stewardship" className="relative z-10 border-y border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="mx-auto max-w-[1400px] px-6 py-32">
          <div className="flex flex-col gap-6 mb-20">
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Stewardship</p>
            <h2 className="text-5xl text-white md:text-7xl" style={{ fontFamily: serifFont }}>
              Accountability dashboards we stand behind.
            </h2>
            <p className="max-w-2xl text-lg text-white/60">
              We don’t wait for funders to ask for proof. Every engagement ships with a living dashboard co-owned with the client team.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {stewardshipRows.map((row) => (
              <div key={row.title} className="rounded-[32px] border border-white/10 bg-white/5 p-10 transition-all hover:shadow-lg hover:shadow-white/5">
                <div className="text-3xl text-white" style={{ fontFamily: serifFont }}>
                  {row.title}
                </div>
                <ul className="mt-8 space-y-4 text-white/60">
                  {row.points.map((point) => (
                    <li key={point} className="flex items-center gap-4">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="care" className="relative z-10 px-6 py-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="rounded-[48px] border border-white/10 bg-white/5 p-8 md:p-16 shadow-sm">
            <div className="flex flex-col gap-12 md:flex-row md:items-center md:justify-between mb-16">
              <div className="max-w-2xl space-y-6">
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Care protocols</p>
                <h2 className="text-5xl text-white md:text-7xl" style={{ fontFamily: serifFont }}>
                  Protection is part of the deliverable.
                </h2>
              <p className="text-lg text-white/60 leading-relaxed">
                Portrait retainers and campaign crews share the same wellness barges, consent choreography, and archival guardrails. Nobody is asked to open their
                story without closing rituals.
              </p>
            </div>
            <Button href="/photography/portrait" variant="ghost" size="lg" className="text-white border-white/30 hover:bg-white/10">
              See portrait atelier →
            </Button>
          </div>
            <div className="grid gap-6 md:grid-cols-3">
              {carePractices.map((practice) => (
                <div key={practice.label} className="rounded-[32px] border border-white/10 bg-white/5 p-8 transition-colors hover:bg-white/10 hover:border-white/20 hover:shadow-sm">
                  <p className="text-lg font-medium text-white" style={{ fontFamily: serifFont }}>{practice.label}</p>
                  <p className="mt-4 text-sm text-white/60 leading-relaxed">{practice.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="cta" className="relative z-10 px-6 pb-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="rounded-[48px] border border-white/10 bg-white/5 p-10 md:p-20 text-white shadow-2xl">
            <div className="flex flex-col gap-12 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl space-y-6">
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Ready to move?</p>
                <h3 className="text-4xl md:text-6xl" style={{ fontFamily: serifFont }}>
                  Let’s architect the narrative layer inside your practice.
                </h3>
                <p className="text-lg text-white/40 leading-relaxed">Hold a discovery sprint or drop us into your existing runway—either way, we bring the care protocols with us.</p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button href="/#contact" size="lg" variant="primary" className="bg-white text-black hover:bg-neutral-200 border-none">
                  Schedule inquiry
                </Button>
                <Button
                  href="/#work"
                  size="lg"
                  variant="ghost"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                >
                  Browse client field notes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
