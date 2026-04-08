/**
 * Simple in-memory sliding-window rate limiter.
 *
 * Survives HMR by storing state on `globalThis`.
 * Automatically evicts stale entries to prevent memory leaks.
 */

const RL_WINDOW_MS = 60_000;
const RL_MAX_REQUESTS = 5;
const CLEANUP_INTERVAL_MS = 5 * 60_000; // purge stale IPs every 5 min

declare global {
  // eslint-disable-next-line no-var
  var __cm_rl: Map<string, number[]> | undefined;
  // eslint-disable-next-line no-var
  var __cm_rl_cleanup: ReturnType<typeof setInterval> | undefined;
}

const store: Map<string, number[]> = globalThis.__cm_rl ?? new Map();
globalThis.__cm_rl = store;

// Periodic cleanup so the map doesn't grow forever on long-lived instances
if (!globalThis.__cm_rl_cleanup) {
  globalThis.__cm_rl_cleanup = setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of store) {
      const recent = timestamps.filter((ts) => now - ts < RL_WINDOW_MS);
      if (recent.length === 0) {
        store.delete(ip);
      } else {
        store.set(ip, recent);
      }
    }
  }, CLEANUP_INTERVAL_MS);

  // Allow the process to exit cleanly (Node.js)
  if (typeof globalThis.__cm_rl_cleanup === "object" && "unref" in globalThis.__cm_rl_cleanup) {
    globalThis.__cm_rl_cleanup.unref();
  }
}

/**
 * Returns `true` when the IP has exceeded the rate limit.
 */
export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = store.get(ip) ?? [];
  const recent = timestamps.filter((ts) => now - ts < RL_WINDOW_MS);

  if (recent.length >= RL_MAX_REQUESTS) return true;

  recent.push(now);
  store.set(ip, recent);
  return false;
}

/**
 * Extract the most likely real client IP from standard proxy headers.
 */
export function getClientIp(req: Request): string {
  // RFC 7239 Forwarded header
  const forwarded = req.headers.get("forwarded");
  if (forwarded) {
    const match = forwarded.match(/for=([^;,]+)/i);
    if (match) {
      const ip = match[1].replace(/["[\]]/g, "").trim();
      if (ip) return ip;
    }
  }

  // De-facto standard headers (in priority order)
  const headers = [
    "x-forwarded-for",
    "x-real-ip",
    "cf-connecting-ip",
    "true-client-ip",
    "fly-client-ip",
  ] as const;

  for (const name of headers) {
    const value = req.headers.get(name);
    if (value) {
      const ip = value.split(",")[0].trim();
      if (ip) return ip;
    }
  }

  return "unknown";
}
