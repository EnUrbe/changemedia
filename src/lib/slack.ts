/**
 * Post a message to the configured Slack webhook.
 *
 * Silently swallows errors so callers don't need to handle Slack outages.
 */
export async function postToSlack(text: string): Promise<void> {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3_000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error("Slack webhook error:", res.status, await res.text());
    }
  } catch (err) {
    console.error("Slack webhook failed:", err);
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Build a formatted Slack message from key/value pairs.
 * Skips entries with falsy values.
 */
export function formatSlackMessage(
  title: string,
  fields: Record<string, string | null | undefined>,
): string {
  const lines = [title];
  for (const [label, value] of Object.entries(fields)) {
    if (value) lines.push(`${label}: ${value}`);
  }
  return lines.join("\n");
}
