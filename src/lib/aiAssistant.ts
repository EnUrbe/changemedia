import "server-only";
import { ClientProject } from "./projectsSchema";

export interface AiInsightResponse {
  summary: string;
  nextSteps: string[];
  tone?: string;
}

export async function generateAiInsights(project: ClientProject): Promise<AiInsightResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return fallbackInsights(project);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "You summarize client video/photo production projects. Always return JSON with keys summary, nextSteps (array), tone.",
          },
          {
            role: "user",
            content: `Project data: ${JSON.stringify(project)}. Produce a concise status summary and 3 actionable next steps.`,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error", errorText);
      return fallbackInsights(project);
    }

    const json = await response.json();
    const content = json.choices?.[0]?.message?.content;
    if (content) {
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("AI integration failed", error);
  }

  return fallbackInsights(project);
}

function fallbackInsights(project: ClientProject): AiInsightResponse {
  const ready = project.deliverables.filter((d) => d.status === "ready").length;
  const needsReview = project.deliverables.filter((d) => d.status === "needs-review").length;
  const summary = `${project.projectTitle} is ${project.status} with ${ready} ready deliverables and ${needsReview} awaiting review.`;
  const nextSteps = project.checklist.slice(0, 3);
  return {
    summary,
    nextSteps,
    tone: "fallback",
  };
}
