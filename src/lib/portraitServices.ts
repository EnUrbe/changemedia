export const SERVICES = {
  grad_portraits: {
    label: "Graduation Portraits",
    headline: "Your degree is expensive. Your photos shouldn’t look cheap.",
    subheadline: "Editorial-style grad portraits at student-friendly prices.",
    defaultPriceLabel: "Sessions from $225",
    featuredUses: ["Announcements", "LinkedIn", "Family prints"],
    depositCents: 10000,
  },
  branding: {
    label: "Branding & Creator Shoots",
    headline: "Content that looks as serious as your goals.",
    subheadline: "High-end portraits for founders, creators, and professionals.",
    defaultPriceLabel: "Branding sessions from $450",
    featuredUses: ["Websites", "Campaigns", "Social media"],
    depositCents: 20000,
  },
  portrait_general: {
    label: "Portrait Sessions",
    headline: "Cinematic portraits, without the awkward energy.",
    subheadline: "Clean, editorial imagery for grads, couples, families, and pros.",
    defaultPriceLabel: "Sessions from $300",
    featuredUses: ["Social", "Portfolios", "Gifts"],
    depositCents: 15000,
  },
  family: {
    label: "Family Sessions",
    headline: "Family portraits that feel lived-in, not staged.",
    subheadline: "Editorial storytelling for every generation in one frame.",
    defaultPriceLabel: "Family sessions from $325",
    featuredUses: ["Holiday cards", "Albums", "Wall art"],
    depositCents: 15000,
  },
  couples: {
    label: "Couples",
    headline: "Cinematic stills for the two of you.",
    subheadline: "From proposals to anniversaries, keep it intentional.",
    defaultPriceLabel: "Couple sessions from $260",
    featuredUses: ["Save the dates", "Announcements", "Keepsakes"],
    depositCents: 12000,
  },
  org: {
    label: "Organizations",
    headline: "Keep your team looking like the budget you fought for.",
    subheadline: "Systemized portrait days for student orgs, startups, and internal comms.",
    defaultPriceLabel: "Org sessions from $500",
    featuredUses: ["Teams", "Leadership", "Board decks"],
    depositCents: 20000,
  },
} as const;

export type PortraitServiceKey = keyof typeof SERVICES;
export const DEFAULT_SERVICE_KEY: PortraitServiceKey = "portrait_general";

export const SERVICE_DEPOSITS: Record<string, number> = Object.fromEntries(
  Object.entries(SERVICES).map(([key, value]) => [key, value.depositCents])
);

export function resolveServiceKey(raw?: string | null): PortraitServiceKey {
  if (!raw) return DEFAULT_SERVICE_KEY;
  const candidate = raw.trim() as PortraitServiceKey;
  return candidate in SERVICES ? candidate : DEFAULT_SERVICE_KEY;
}

export function getServiceConfig(key?: string | null) {
  const resolved = resolveServiceKey(key);
  return { key: resolved, config: SERVICES[resolved] } as const;
}

export function getDepositForService(key?: string | null) {
  const resolved = resolveServiceKey(key);
  return SERVICES[resolved].depositCents;
}
