import { NextResponse } from "next/server";

// Simple in-memory rate limit (best-effort per serverless instance)
const RL_WINDOW_MS = 60_000; // 1 minute
const RL_MAX = 5; // max 5 requests per window per IP

declare global {
  var __cm_rl: Map<string, number[]> | undefined;
}
const rlStore: Map<string, number[]> = globalThis.__cm_rl || new Map();
globalThis.__cm_rl = rlStore;

function getClientIp(req: Request) {
  // Try common proxy headers first
  const forwarded = req.headers.get("forwarded");
  if (forwarded) {
    // e.g. "for=203.0.113.195;proto=https;by=203.0.113.43"
    const m = forwarded.match(/for=([^;]+)/i);
    if (m) {
      const v = m[1].replace(/["\[\]]/g, "");
      if (v) return v;
    }
  }
  const candidates = [
    "x-forwarded-for",
    "x-real-ip",
    "cf-connecting-ip",
    "true-client-ip",
    "fly-client-ip",
  ];
  for (const h of candidates) {
    const v = req.headers.get(h);
    if (v) {
      const ip = v.split(",")[0].trim();
      if (ip) return ip;
    }
  }
  return "unknown";
}

function rateLimited(ip: string) {
  const now = Date.now();
  const arr = rlStore.get(ip) || [];
  // prune
  const recent = arr.filter((t) => now - t < RL_WINDOW_MS);
  if (recent.length >= RL_MAX) return true;
  recent.push(now);
  rlStore.set(ip, recent);
  return false;
}

function validEmail(email: string) {
  // basic RFC 5322-ish check, good enough for server-side guard
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

async function postToSlack(text: string) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return; // optional
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) {
      const t = await res.text();
      console.error("Slack webhook error:", res.status, t);
    }
  } catch (e) {
    clearTimeout(timeout);
    console.error("Slack webhook failed:", e);
  }
}

export async function POST(req: Request) {
  try {
    // Rate limit by IP (best effort)
    const ip = getClientIp(req);
    if (rateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again soon." }, { status: 429 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const data = body as Record<string, unknown>;

    // Honeypot (bots tend to fill hidden field)
    const hp = String(data.hp ?? "").trim();
    if (hp) {
      // Silently accept to avoid tipping off bots
      return NextResponse.json({ success: true });
    }

    // Timestamp bot check (submissions too fast are likely bots)
    const tsRaw = data.ts;
    const ts = Number(tsRaw);
    if (Number.isFinite(ts)) {
      const delta = Date.now() - ts;
      if (delta < 2000) {
        // too fast — likely automated; pretend success
        return NextResponse.json({ success: true });
      }
      if (delta > 1000 * 60 * 60 * 24 * 2) {
        return NextResponse.json({ error: "Invalid submission timestamp" }, { status: 400 });
      }
    }

    const name = String(data.name ?? "").trim();
    const email = String(data.email ?? "").trim();
    const org = String(data.org ?? "").trim();
    const phone = String((data as Record<string, unknown>).phone ?? "").trim();
    const details = String(data.details ?? "").trim();

    if (!name || !email || !details) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!validEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    // Field length constraints
    if (name.length > 120) {
      return NextResponse.json({ error: "Name too long" }, { status: 400 });
    }
    if (org.length > 160) {
      return NextResponse.json({ error: "Organization too long" }, { status: 400 });
    }
    if (details.length < 10) {
      return NextResponse.json({ error: "Please provide a bit more detail (min 10 chars)." }, { status: 400 });
    }
    if (details.length > 5000) {
      return NextResponse.json({ error: "Details too long" }, { status: 400 });
    }

    const AIRTABLE_PAT = (process.env.AIRTABLE_PAT || "").trim();
    const AIRTABLE_BASE_ID = (process.env.AIRTABLE_BASE_ID || "").trim();
    const AIRTABLE_TABLE_INQUIRIES = (process.env.AIRTABLE_TABLE_INQUIRIES || "Inquiries").trim();
    const AIRTABLE_TABLE_ID = (process.env.AIRTABLE_TABLE_ID || "").trim();

    const ua = req.headers.get("user-agent") || undefined;
    const referer = req.headers.get("referer") || undefined;

    // Configurable field names with sensible defaults
    const FIELD_MAP = {
      name: (process.env.AIRTABLE_FIELD_NAME || "Full Name").trim(),
      email: (process.env.AIRTABLE_FIELD_EMAIL || "Email Address").trim(),
      phone: (process.env.AIRTABLE_FIELD_PHONE || "Phone Number").trim(),
      org: (process.env.AIRTABLE_FIELD_ORG || "Company Name").trim(),
      details: (process.env.AIRTABLE_FIELD_DETAILS || "Details").trim(), // default to Details
    } as const;

    const LOCKED = {
      name: Boolean((process.env.AIRTABLE_FIELD_NAME || "").trim()),
      email: Boolean((process.env.AIRTABLE_FIELD_EMAIL || "").trim()),
      phone: Boolean((process.env.AIRTABLE_FIELD_PHONE || "").trim()),
      org: Boolean((process.env.AIRTABLE_FIELD_ORG || "").trim()),
      details: Boolean((process.env.AIRTABLE_FIELD_DETAILS || "").trim()),
    } as const;

    // Optional Source/Status mapping
    const srcField = (process.env.AIRTABLE_FIELD_SOURCE || "").trim();
    const srcValue = (process.env.AIRTABLE_DEFAULT_SOURCE || "").trim();
    const stField = (process.env.AIRTABLE_FIELD_STATUS || "").trim();
    const stValue = (process.env.AIRTABLE_DEFAULT_STATUS || "").trim();
    let includeSource = Boolean(srcField && srcValue);
    let includeStatus = Boolean(stField && stValue);

    // Common aliases to try automatically on 422 UNKNOWN_FIELD_NAME
    const CANDIDATES: Record<keyof typeof FIELD_MAP, string[]> = {
      name: [FIELD_MAP.name, "Full Name", "Name"],
      email: [FIELD_MAP.email, "Email Address", "Email"],
      phone: [FIELD_MAP.phone, "Phone Number", "Phone"],
      org: [FIELD_MAP.org, "Company Name", "Organization", "Company", "Org"],
      details: [FIELD_MAP.details, "Project Details", "Details", "Notes", "Message", "Description"],
    };

    const idx = { name: 0, email: 0, phone: 0, org: 0, details: 0 };

    function buildCoreFields() {
      const fields: Record<string, any> = {};
      fields[CANDIDATES.name[idx.name]] = name;
      fields[CANDIDATES.email[idx.email]] = email;
      if (phone) fields[CANDIDATES.phone[idx.phone]] = phone;
      if (org) fields[CANDIDATES.org[idx.org]] = org;
      fields[CANDIDATES.details[idx.details]] = details;

      // Optional: map default Source/Status if configured and not dropped
      if (includeSource) fields[srcField] = srcValue;
      if (includeStatus) fields[stField] = stValue;

      return fields;
    }

    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_ID || AIRTABLE_TABLE_INQUIRIES)}`;

    async function postToAirtable(body: unknown) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AIRTABLE_PAT}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        clearTimeout(timeout);
        return res;
      } catch (e) {
        clearTimeout(timeout);
        throw e;
      }
    }

    // Helper: only include upstream details when AIRTABLE_DEBUG=1
    function respondUpstream(status: number, message: string, hint?: string) {
      const allow = process.env.AIRTABLE_DEBUG === "1";
      const body = allow
        ? { error: "Upstream error", upstream: { status, message, hint } }
        : { error: "Upstream error" };
      return NextResponse.json(body, { status: 502 });
    }

    // Try posting with metadata first; on 422 for metadata fields, drop them; on 422 for unknown core fields, rotate aliases
    let useMetadata = true;
    for (let attempt = 0; attempt < 12; attempt++) {
      const coreFields = buildCoreFields();
      const records = [
        {
          fields: useMetadata
            ? { ...coreFields, SubmittedAt: new Date().toISOString(), UserAgent: ua, Page: referer, IP: ip }
            : coreFields,
        },
      ];

      const res = await postToAirtable({ records, typecast: true });
      if (res.ok) {
        break; // success
      }

      const text = await res.text();
      type AirtableError = { error?: { message?: string; type?: string } };
      let parsed: AirtableError | null = null;
      try { parsed = JSON.parse(text) as AirtableError; } catch {}
      const msg: string = parsed?.error?.message || text || "Unknown upstream error";

      // 422 handling: try dropping metadata or rotating field aliases
      if (res.status === 422) {
        const unknownMatch = msg.match(/Unknown field name: \"([^\"]+)\"/);
        const unknownField = unknownMatch?.[1];

        // If a metadata field is unknown, drop metadata and retry
        if (unknownField && ["SubmittedAt", "UserAgent", "Page", "IP"].includes(unknownField)) {
          useMetadata = false;
          continue;
        }

        // If a core field alias is unknown, rotate that logical field to the next candidate
        const rotate = (key: keyof typeof idx) => {
          if (idx[key] < CANDIDATES[key].length - 1) {
            idx[key]++;
            return true;
          }
          return false;
        };

        let rotated = false;
        if (unknownField) {
          // Drop optional Source/Status fields if they caused the error
          if (includeSource && unknownField === srcField) {
            includeSource = false;
            continue;
          }
          if (includeStatus && unknownField === stField) {
            includeStatus = false;
            continue;
          }

          if (CANDIDATES.name.includes(unknownField)) {
            if (LOCKED.name) {
              const hint = `Configured field name for Name (\"${FIELD_MAP.name}\") was not found in Airtable. Rename the column or update AIRTABLE_FIELD_NAME.`;
              return respondUpstream(res.status, msg, hint);
            }
            rotated = rotate("name") || rotated;
          }
          if (CANDIDATES.email.includes(unknownField)) {
            if (LOCKED.email) {
              const hint = `Configured field name for Email (\"${FIELD_MAP.email}\") was not found in Airtable. Rename the column or update AIRTABLE_FIELD_EMAIL.`;
              return respondUpstream(res.status, msg, hint);
            }
            rotated = rotate("email") || rotated;
          }
          if (CANDIDATES.phone.includes(unknownField)) {
            if (LOCKED.phone) {
              const hint = `Configured field name for Phone (\"${FIELD_MAP.phone}\") was not found in Airtable. Rename the column or update AIRTABLE_FIELD_PHONE.`;
              return respondUpstream(res.status, msg, hint);
            }
            rotated = rotate("phone") || rotated;
          }
          if (CANDIDATES.org.includes(unknownField)) {
            if (LOCKED.org) {
              const hint = `Configured field name for Company (\"${FIELD_MAP.org}\") was not found in Airtable. Rename the column or update AIRTABLE_FIELD_ORG.`;
              return respondUpstream(res.status, msg, hint);
            }
            rotated = rotate("org") || rotated;
          }
          if (CANDIDATES.details.includes(unknownField)) {
            if (LOCKED.details) {
              const hint = `Configured field name for Details (\"${FIELD_MAP.details}\") was not found in Airtable. Create that column or update AIRTABLE_FIELD_DETAILS. (Your form shows \"Project Details\".)`;
              return respondUpstream(res.status, msg, hint);
            }
            rotated = rotate("details") || rotated;
          }
        }

        if (rotated) {
          continue; // try again with next alias
        }

        // No idea which field; fallback by dropping metadata if still on, else give detailed debug
        if (useMetadata) {
          useMetadata = false;
          continue;
        }

        const hint = "Check field names in your Airtable table. Expected one of: " +
          `name=[${CANDIDATES.name.join(", ")}] ` +
          `email=[${CANDIDATES.email.join(", ")}] ` +
          `phone=[${CANDIDATES.phone.join(", ")}] ` +
          `org=[${CANDIDATES.org.join(", ")}] ` +
          `details=[${CANDIDATES.details.join(", ")}]`;
        return respondUpstream(res.status, msg, hint);
      }

      // non-422 error handling as before
      console.error("Airtable error:", res.status, msg);
      return respondUpstream(res.status, msg);
    }

    // Optional Slack notification (non-blocking)
    postToSlack(
      `New inquiry` +
        `\nName: ${name}` +
        `\nEmail: ${email}` +
        (org ? `\nOrg: ${org}` : "") +
        `\nIP: ${ip}` +
        (referer ? `\nPage: ${referer}` : "") +
        (ua ? `\nUA: ${ua}` : "") +
        `\n---\n${details}`
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
