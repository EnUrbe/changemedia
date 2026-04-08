import { z } from "zod";
import type { PortraitInquiryStatus } from "@/lib/supabaseAdmin";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PORTRAIT_SERVICE_TYPES = [
  "grad_portraits",
  "branding",
  "portrait_general",
  "family",
  "couples",
  "org",
] as const;

const VALID_STATUSES: PortraitInquiryStatus[] = [
  "NEW",
  "CONTACTED",
  "PAYMENT_PENDING",
  "DEPOSIT_PAID",
  "SCHEDULED",
  "SHOT_DONE",
  "GALLERY_SENT",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Trim + truncate, returning `undefined` for empty strings so Zod `.optional()` works. */
function trimMax(max: number) {
  return z.preprocess((val) => {
    if (typeof val !== "string") return undefined;
    const s = val.trim().slice(0, max);
    return s || undefined;
  }, z.string().optional());
}

/** Like trimMax but returns a guaranteed string with a fallback default. */
function trimMaxDefault(max: number, fallback: string) {
  return z.preprocess((val) => {
    if (typeof val !== "string") return fallback;
    const s = val.trim().slice(0, max);
    return s || fallback;
  }, z.string());
}

function statusEnum() {
  return z.preprocess((val) => {
    if (typeof val !== "string") return "NEW";
    return VALID_STATUSES.includes(val as PortraitInquiryStatus) ? val : "NEW";
  }, z.string().default("NEW")) as z.ZodType<PortraitInquiryStatus>;
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

/**
 * Zod schema for incoming inquiry POST bodies.
 *
 * Handles field aliasing (e.g. `name` → `full_name`, `school` → `organization`)
 * so forms with slightly different field names all work.
 */
export const inquirySchema = z
  .object({
    // Anti-spam
    hp: z.string().optional(),
    ts: z.number().optional(),

    // Core fields
    full_name: trimMax(160),
    name: trimMax(160), // alias
    email: trimMax(200),
    phone: trimMax(60),

    // Organization aliases
    organization: trimMax(160),
    school: trimMax(160),
    org: trimMax(160),

    // Session details
    session_type: trimMax(60),
    location: trimMax(160),
    timeline: trimMax(120),
    budget_range: trimMax(120),
    message: trimMax(1200),
    preferred_dates: trimMax(600),
    details: trimMax(600), // alias for preferred_dates
    preferred_time_window: trimMax(120),
    how_heard: trimMax(160),

    // Service / source
    service_type: trimMax(60),
    service: trimMax(60), // alias
    source: trimMaxDefault(120, "website_contact"),
    referral_from: trimMax(160),

    // Status
    status: statusEnum(),
  })
  .transform((raw) => {
    const fullName = raw.full_name ?? raw.name ?? "";
    const organization = raw.organization ?? raw.school ?? raw.org;
    const requestedService = raw.service_type ?? raw.service ?? "general_inquiry";
    const message = raw.message;
    const location = raw.location;
    const timeline = raw.timeline;
    const budgetRange = raw.budget_range;

    // Build composite fields
    const preferredDates =
      raw.preferred_dates ??
      raw.details ??
      buildNotes([
        message,
        location ? `Location: ${location}` : undefined,
        timeline ? `Timeline: ${timeline}` : undefined,
        budgetRange ? `Budget: ${budgetRange}` : undefined,
      ]);

    const preferredWindow =
      raw.preferred_time_window ??
      ([timeline, budgetRange].filter(Boolean).join(" · ").slice(0, 120) || undefined);

    const referralFrom =
      raw.referral_from ??
      (raw.source.startsWith("referral_") ? raw.source : undefined);

    return {
      fullName,
      email: raw.email ?? "",
      phone: raw.phone,
      organization,
      sessionType: raw.session_type,
      location,
      timeline,
      budgetRange,
      message,
      preferredDates,
      preferredWindow,
      howHeard: raw.how_heard,
      requestedService,
      source: raw.source,
      referralFrom,
      status: raw.status,

      // Anti-spam pass-through
      hp: raw.hp,
      ts: raw.ts,
    };
  });

export type InquiryInput = z.output<typeof inquirySchema>;

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email);
}

export function requiresPhone(serviceType: string): boolean {
  return (PORTRAIT_SERVICE_TYPES as readonly string[]).includes(serviceType);
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function buildNotes(parts: Array<string | undefined>): string | undefined {
  const joined = parts.filter(Boolean).join("\n").slice(0, 600);
  return joined || undefined;
}
