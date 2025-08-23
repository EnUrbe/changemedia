import { NextResponse } from "next/server";

// Simple in-memory rate limit (best-effort per serverless instance)
const RL_WINDOW_MS = 60_000; // 1 minute
const RL_MAX = 5; // max 5 requests per window per IP
const rlStore: Map<string, number[]> = (globalThis as any).__cm_rl || new Map();
(globalThis as any).__cm_rl = rlStore;

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

    // Honeypot (bots tend to fill hidden field)
    const hp = String((body as any).hp || "").trim();
    if (hp) {
      // Silently accept to avoid tipping off bots
      return NextResponse.json({ success: true });
    }

    // Timestamp bot check (submissions too fast are likely bots)
    const tsRaw = (body as any).ts;
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

    const name = String((body as any).name || "").trim();
    const email = String((body as any).email || "").trim();
    const org = String((body as any).org || "").trim();
    const details = String((body as any).details || "").trim();

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

    const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
    const AIRTABLE_TABLE_INQUIRIES = process.env.AIRTABLE_TABLE_INQUIRIES || "Inquiries";

    if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID) {
      console.error("Airtable configuration missing. Set AIRTABLE_PAT and AIRTABLE_BASE_ID.");
      return NextResponse.json({ error: "Server not configured" }, { status: 500 });
    }

    const ua = req.headers.get("user-agent") || undefined;
    const referer = req.headers.get("referer") || undefined;

    const payload = {
      records: [
        {
          fields: {
            Name: name,
            Email: email,
            Organization: org || undefined,
            Details: details,
            SubmittedAt: new Date().toISOString(),
            UserAgent: ua,
            Page: referer,
            IP: ip,
          },
        },
      ],
    };

    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_INQUIRIES)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_PAT}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        const text = await res.text();
        console.error("Airtable error:", res.status, text);
        return NextResponse.json({ error: "Upstream error" }, { status: 502 });
      }
    } catch (e: any) {
      clearTimeout(timeout);
      if (e?.name === "AbortError") {
        console.error("Airtable request timed out");
        return NextResponse.json({ error: "Upstream timeout" }, { status: 504 });
      }
      throw e;
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
