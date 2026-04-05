/* ─────────────────────────────────────────────
   CHANGE Media — Static Site Content
   All copy, links, and metadata in one place.
   ───────────────────────────────────────────── */

export const SITE = {
  name: "CHANGE Media",
  tagline: "Documentary storytelling for care-centered teams.",
  description:
    "An editorial documentary practice for nonprofits, coalitions, founders, and care-driven teams. Films, portraits, and campaign systems built to move people to trust and action.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://changemedia.org",
  email: "hello@changemedia.org",
  phone: "",
  city: "",
  calendlyUrl:
    "https://calendly.com/william-navarretemoreno-changemedia/30min?background_color=000000&text_color=ffffff&primary_color=c8a97e",
  socials: {
    instagram: "https://instagram.com/changemedia",
    youtube: "https://youtube.com/@changemedia",
    vimeo: "",
    linkedin: "",
  },
};

export const NAV_LINKS = [
  { label: "Change Studios", href: "/change-studios" },
  { label: "Photography", href: "/photography" },
  { label: "Portraits", href: "/photography/portrait" },
  { label: "Field Notes", href: "/field-notes" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/* ── HOME PAGE ── */

export const HOME = {
  hero: {
    videoUrl:
      "https://cdn.coverr.co/videos/coverr-aerial-view-of-city-lights-at-night-2559/1080p.mp4",
    posterUrl:
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1920&q=80",
    headline: "Documentary films\nand portraits\nthat build trust.",
    subheadline:
      "We help nonprofits, founders, schools, and mission-driven teams look credible on camera and communicate clearly with film, portraits, and campaign-ready content.",
    ctas: [
      { label: "Explore Change Studios", href: "/change-studios" },
      { label: "Book discovery call", href: "/contact" },
    ],
  },
  metrics: [
    { value: "150+", label: "Projects delivered" },
    { value: "40+", label: "Clients served" },
    { value: "72hr", label: "Fastest turnaround" },
    { value: "5", label: "Years running" },
  ],
  practices: [
    {
      id: "studios",
      label: "01",
      title: "Change Studios",
      description:
        "Documentary films, launch videos, event coverage, and recurring content systems for organizations that need more than random social posts.",
      href: "/change-studios",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    },
    {
      id: "portraits",
      label: "02",
      title: "Portrait Atelier",
      description:
        "Executive portraits, team headshots, and personal brand sessions that make people look trustworthy, polished, and human.",
      href: "/photography/portrait",
      image:
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
    },
  ],
  selectedWork: [
    {
      id: "1",
      title: "Community Health Campaign",
      category: "Impact film",
      year: "2026",
      image:
        "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=900&q=80",
    },
    {
      id: "2",
      title: "Founder Launch Series",
      category: "Brand storytelling",
      year: "2025",
      image:
        "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=900&q=80",
    },
    {
      id: "3",
      title: "Summit Recap Campaign",
      category: "Event coverage",
      year: "2025",
      image:
        "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=900&q=80",
    },
    {
      id: "4",
      title: "Neighborhood Voices",
      category: "Docu-short",
      year: "2025",
      image:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=80",
    },
    {
      id: "5",
      title: "Annual Report Story Package",
      category: "Campaign content",
      year: "2024",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80",
    },
  ],
  testimonials: [
    {
      quote:
        "They brought structure to a messy brief and gave us a film our board, donors, and community partners could all rally around.",
      name: "Marketing Director",
      role: "Regional nonprofit",
    },
    {
      quote:
        "Responsive, strategic, and easy to trust. We got a hero piece, clean cutdowns, and visuals we could keep using after launch week.",
      name: "Founder",
      role: "Early-stage company",
    },
    {
      quote:
        "The portraits felt elevated without feeling stiff. Our team finally has photos that actually match the level of our work.",
      name: "Operations Lead",
      role: "Creative agency",
    },
  ],
  offers: [
    {
      title: "Documentary Campaign",
      price: "1-2 day production",
      description:
        "An interview-led film with supporting stills and cutdowns designed to carry one clear idea across launch moments, fundraising, and public storytelling.",
      points: ["Interviews + b-roll", "Hero edit + supporting cutdowns", "Website, deck, and social-ready assets"],
      href: "/change-studios",
    },
    {
      title: "Ongoing Story Partnership",
      price: "Monthly rhythm",
      description:
        "A recurring production cadence for teams that need fresh films, stills, and rollout assets without losing consistency from one month to the next.",
      points: ["Monthly planning", "Short-form edits + stills", "Flexible campaign support"],
      href: "/change-studios",
    },
    {
      title: "Leadership + Team Portraits",
      price: "Half or full day",
      description:
        "Portrait sessions for leaders and teams who need images that feel current, trustworthy, and aligned with the rest of the brand language.",
      points: ["On-site setup", "Calm direction", "Web, press, and internal-use delivery"],
      href: "/photography/portrait",
    },
  ],
  leadMagnet: {
    title: "Request the planning guide",
    description:
      "Get a simple guide to typical timelines, story shapes, and starting scope ranges for films, recurring content, and portrait sessions.",
    href: "/contact",
  },
};

/* ── STUDIOS PAGE ── */

export const STUDIOS = {
  hero: {
    headline: "CHANGE\nSTUDIOS",
    mission:
      "Documentary films, event coverage, and campaign content for organizations that need trust, clarity, and assets their team can actually use.",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&q=80",
  },
  capabilities: [
    {
      title: "Documentary Film",
      description: "Short documentaries and interview-led films that explain the stakes, humanize your work, and move the right people to care.",
      services: ["Short docs", "Docu-series", "Impact films"],
    },
    {
      title: "Brand & Commercial",
      description: "Launch films, brand storytelling, and campaign assets that make your offer feel clear, polished, and credible.",
      services: ["Brand films", "Product videos", "Launch campaigns"],
    },
    {
      title: "Social & Digital",
      description: "Cutdowns, reels, and repeatable content systems that keep one shoot useful long after the first publish date.",
      services: ["Reels & shorts", "Social strategy", "Content systems"],
    },
    {
      title: "Event & Live",
      description: "Recaps, speaker clips, interviews, and fast-turnaround edits that help one event power weeks of follow-up marketing.",
      services: ["Event recaps", "Speaker reels", "Live coverage"],
    },
  ],
  packages: [
    {
      title: "Monthly Retainer",
      price: "From $3,500/mo",
      features: [
        "4 reels or short videos per month",
        "20 edited photos",
        "Creative planning session",
        "Monthly content roadmap",
      ],
    },
    {
      title: "Short Film",
      price: "From $6,000",
      features: [
        "1–2 shoot days",
        "Interviews + b-roll",
        "3 social cutdowns included",
        "3–5 min hero edit",
      ],
    },
    {
      title: "Event Package",
      price: "From $3,000",
      features: [
        "Up to 5 hours of coverage",
        "60–90s highlight reel",
        "3 reels + 20 photos",
        "72hr turnaround",
      ],
    },
  ],
  process: [
    {
      step: "01",
      title: "Discovery",
      description: "We clarify the audience, the message, and the assets you actually need before production starts.",
    },
    {
      step: "02",
      title: "Production",
      description: "Small, focused crews that move efficiently, direct confidently, and keep your team comfortable on camera.",
    },
    {
      step: "03",
      title: "Post",
      description: "Editing, color, sound, and cutdowns built for websites, decks, donor updates, social, and launch campaigns.",
    },
    {
      step: "04",
      title: "Delivery",
      description: "Final deliverables arrive organized, branded, and ready for the channels your team uses most.",
    },
  ],
  retainerTiers: [
    {
      name: "Core",
      price: "$3,500/mo",
      summary: "For small teams that need a reliable monthly stream of polished content.",
      features: ["1 production day", "4 short-form edits", "20 edited photos", "Monthly planning call"],
    },
    {
      name: "Growth",
      price: "$5,000/mo",
      summary: "For organizations running campaigns, events, launches, or active community storytelling.",
      features: ["1-2 production days", "8 short-form edits", "40 edited photos", "Priority editing queue"],
      featured: true,
    },
    {
      name: "Campaign",
      price: "$7,500+/mo",
      summary: "For teams that need film, stills, and campaign assets working together across multiple channels.",
      features: ["Multi-day coverage", "Hero cut + cutdowns", "Photo library updates", "Quarterly planning support"],
    },
  ],
  upsells: [
    "Additional social cutdowns",
    "Photography add-on for any film project",
    "72-hour rush edit",
    "Additional shoot day",
    "Speaker clip pack",
    "Homepage header / web asset export set",
  ],
};

/* ── PORTRAITS PAGE ── */

export const PORTRAITS = {
  hero: {
    headline: "Portrait\nAtelier",
    subheadline:
      "Executive portraits, team headshots, and brand sessions for people who need to look credible, current, and clearly at the level of their work.",
    image:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1920&q=80",
  },
  gallery: [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
  ],
  packages: [
    {
      title: "Brand Session",
      price: "$750",
      duration: "60-90 min",
      description: "For founders, speakers, and creatives who need portraits with range",
      features: [
        "Art direction & moodboard",
        "Multiple setups or looks",
        "25 edited selects",
        "Web + press-ready crops",
      ],
    },
    {
      title: "Leadership Portrait Day",
      price: "From $1,500",
      duration: "Half day",
      description: "For executive teams, school leadership, and small organizations",
      features: [
        "On-site setup",
        "Leadership + team portraits",
        "40 edited selects",
        "Consistent retouching and delivery",
      ],
      featured: true,
    },
    {
      title: "Team Headshot Day",
      price: "From $2,500",
      duration: "Full day",
      description: "For growing teams that need volume, consistency, and minimal disruption",
      features: [
        "Up to 25 people",
        "Headshots + environmental portraits",
        "Coordinator-friendly workflow",
        "Press, LinkedIn, and website-ready exports",
      ],
    },
  ],
  experience: [
    { step: "01", title: "Book & brief", detail: "Pick your package, share your vision, and we send a moodboard." },
    { step: "02", title: "Shoot day", detail: "Arrive camera-ready. We handle lighting, posing, and energy." },
    { step: "03", title: "Gallery delivered", detail: "Curated selects in your private gallery within 5–7 days." },
  ],
  upsells: [
    "Hair and makeup coordination",
    "Additional retouched hero images",
    "Team group photos",
    "Same-week rush delivery",
    "On-brand website crops and banner formats",
  ],
};

/* ── ABOUT PAGE ── */

export const ABOUT = {
  headline: "A practice for teams\nthat need trust,\nnot noise.",
  intro:
    "CHANGE Media helps nonprofits, founders, schools, and mission-driven brands communicate with care, precision, and momentum. We build documentary films, portraits, and campaign assets that feel human and strategic, so your story can do real work in public.",
  values: [
    {
      title: "Clarity before production",
      description:
        "We do the strategy work up front so the final film or portrait set is tied to a real objective, not just taste.",
    },
    {
      title: "Direction that puts people at ease",
      description:
        "Most clients are not professional talent. We guide interviews, portraits, and on-camera moments so people look confident without feeling staged.",
    },
    {
      title: "Assets that keep working",
      description:
        "One production should support your website, launch, donor deck, social channels, and internal communications wherever possible.",
    },
    {
      title: "Respect in every frame",
      description:
        "Whether we are filming community members, executives, students, or families, the work is shaped with care and dignity.",
    },
  ],
  stats: [
    { value: "150+", label: "Projects completed" },
    { value: "40+", label: "Clients served" },
    { value: "5", label: "Years in business" },
    { value: "3", label: "States covered" },
  ],
  equipment:
    "Sony cinema and hybrid camera systems · Professional portrait lighting · Wireless interview audio · Color-managed post-production · Web, social, and print-ready delivery.",
};

/* ── FAQ ── */

export const FAQS = [
  {
    question: "How fast can you turn around a project?",
    answer:
      "Event recaps can often be delivered within 72 hours. Most films and campaign edits land within 2 to 4 weeks depending on scope, interviews, and revision rounds.",
  },
  {
    question: "Do you travel for projects?",
    answer:
      "Yes. We regularly travel for productions across the country. If travel is involved, it is scoped and quoted up front.",
  },
  {
    question: "What if we only need one project, not an ongoing retainer?",
    answer:
      "That is common. Many clients start with one campaign film, event recap, or portrait session and expand into a longer-term relationship once the first project proves useful.",
  },
  {
    question: "Who do you work best with?",
    answer:
      "We are a strong fit for nonprofits, founders, schools, agencies, and mission-driven teams that need high-quality visuals and a partner who can help shape the message, not just capture footage.",
  },
  {
    question: "What&apos;s included in a portrait session?",
    answer:
      "Portrait sessions include planning, art direction, lighting, guided posing, and a private gallery with edited high-resolution downloads. Team and brand sessions can also include environmental portraits and web-ready crops.",
  },
  {
    question: "Do you help with strategy or only production?",
    answer:
      "Both. We can help with concepting, interview direction, scripting, shot planning, and distribution priorities, or plug into an existing team if you already have a strong brief.",
  },
];

export const FIELD_NOTES = [
  {
    slug: "why-most-brand-videos-dont-build-trust",
    tag: "Strategy",
    date: "2026-03-28",
    readTime: "6 min read",
    title: "Why most brand videos don't build trust",
    excerpt:
      "The issue usually isn't production value. It's that the piece never decides what the audience needs to believe by the end of it.",
    description:
      "A practical breakdown of why many brand films fail to build trust and how documentary structure, specificity, and restraint make commercial storytelling stronger.",
    content: [
      "A lot of brand videos fail for a simple reason: they try to sound finished before they sound true. The visuals are polished, the music swells, and everyone says the right things, but the audience never gets a reason to believe any of it.",
      "Trust usually comes from specificity. A stronger film is built around one clear tension, a few grounded details, and a point of view that feels earned. If the story sounds like it could belong to any company, the viewer treats it like any other piece of marketing.",
      "That is why documentary language works so well even in branded contexts. It gives people evidence. A face, a location, a real stake, a moment of uncertainty, a sentence that does not feel over-rehearsed. Those small choices create credibility faster than polish on its own.",
      "When we plan a film, we try to answer one question early: what needs to become more believable after someone watches this? That one decision changes the interviews, the b-roll, the pacing, and the final cut."
    ],
  },
  {
    slug: "how-we-plan-a-shoot-in-48-hours",
    tag: "Process",
    date: "2026-03-24",
    readTime: "5 min read",
    title: "How we plan a shoot in 48 hours",
    excerpt:
      "Fast turnarounds only work when the brief gets smaller and sharper, not when the team tries to do everything at once.",
    description:
      "An inside look at how CHANGE Media scopes and prepares a film or portrait production on a short timeline without sacrificing clarity or quality.",
    content: [
      "Planning quickly is mostly about subtraction. When a client comes in with a short runway, the first move is not to generate more ideas. It is to decide what matters enough to protect and what can be cut without damaging the story.",
      "In a fast timeline, the shoot plan has to stay readable. One document for the day, one list of must-have moments, one message that every interview and visual choice supports. Complexity slows people down more than lack of talent ever does.",
      "We also front-load the risks. Audio, permissions, weather, travel gaps, availability, and deliverable priorities get handled before the shoot because there is no room to discover those problems later.",
      "The result is not a smaller project so much as a clearer one. Most teams do not need more content. They need the right sequence of decisions so the work can move."
    ],
  },
  {
    slug: "the-case-for-editorial-portraits",
    tag: "Portraits",
    date: "2026-03-20",
    readTime: "4 min read",
    title: "The case for editorial portraits",
    excerpt:
      "People use portraits longer when the image feels like them on their best day, not like a generic corporate template.",
    description:
      "Why editorial portraiture often outperforms standard headshots for founders, leadership teams, and public-facing professionals.",
    content: [
      "A useful portrait has to do more than prove that someone was in front of a camera. It has to support how they want to be read. Credible, warm, precise, current, human. Most people can tell when a headshot technically works but emotionally says nothing.",
      "Editorial portraits tend to last longer because they leave room for character. The posture is cleaner, the light is more intentional, and the frame feels authored without becoming stiff. That balance is what makes the image usable across websites, press, speaking, and social.",
      "The best portrait sessions are not really about confidence in front of the lens. They are about direction. People relax when the set feels calm, the references are clear, and they understand what kind of image is being built.",
      "That is why we treat portraiture like a narrative problem. The question is not just how someone looks. It is what the image allows the audience to assume about them before they ever speak."
    ],
  },
] as const;
