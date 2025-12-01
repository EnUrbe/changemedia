import "server-only";
import { ClientProject } from "./projectsSchema";

export interface AiInsightResponse {
  summary: string;
  nextSteps: string[];
  tone?: string;
  content?: string; // For briefs, emails, etc.
}

export type AiGenerationType = "insights" | "brief" | "email";

export async function generateAiContent(project: ClientProject, type: AiGenerationType = "insights"): Promise<AiInsightResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return fallbackInsights(project);
  }

  let systemPrompt = "";
  let userPrompt = "";

  switch (type) {
    case "brief":
      systemPrompt = `You are a Creative Director at CHANGE Media. Create a "Cinematic Creative Brief" for this project.
      Return JSON with:
      - summary: A 1-sentence high-concept logline.
      - nextSteps: 3 visual references or style keywords (e.g., "Verite", "High Contrast").
      - content: A markdown formatted brief including "Visual Style", "Narrative Arc", and "Key Emotions".`;
      userPrompt = `Create a brief for: ${JSON.stringify(project)}`;
      break;
    case "email":
      systemPrompt = `You are a Project Manager at CHANGE Media. Draft a client update email.
      Return JSON with:
      - summary: Subject line for the email.
      - nextSteps: 3 bullet points of what was just completed.
      - content: The full email body (polite, professional, concise).`;
      userPrompt = `Draft an update email for: ${JSON.stringify(project)}`;
      break;
    case "insights":
    default:
      systemPrompt = `You are an expert producer assistant for CHANGE Media.
      Analyze the project data provided. Return JSON with:
      - summary: A professional status update.
      - nextSteps: 3-5 actionable tasks specific to the project type.
      - tone: The recommended communication tone.`;
      userPrompt = `Project data: ${JSON.stringify(project)}. Produce a concise status summary and 3 actionable next steps.`;
      break;
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
        temperature: 0.4,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
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

export async function generateProjectConciergeResponse(project: ClientProject, question: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return "I'm sorry, I can't access my brain right now.";

  const systemPrompt = `You are "Change Assistant", a helpful, polite, and professional studio concierge for CHANGE Media.
  You are talking to the client of the project: "${project.projectTitle}".
  
  Project Details:
  - Status: ${project.status}
  - Due Date: ${project.dueDate}
  - Summary: ${project.summary}
  - Deliverables: ${project.deliverables.map(d => `${d.title} (${d.status})`).join(", ")}
  
  Your goal is to answer their question based on this data.
  If they ask about something not in the data (like "what should I wear?"), give general professional advice suitable for a high-end video/photo shoot (solid colors, avoid small patterns, bring options).
  Keep answers concise (under 3 sentences) unless asked for detail.
  Tone: Warm, professional, reassuring.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
      }),
    });

    if (!response.ok) return "I'm having trouble connecting to the studio server.";

    const json = await response.json();
    return json.choices?.[0]?.message?.content || "I didn't catch that.";
  } catch (error) {
    console.error("Concierge error", error);
    return "Something went wrong. Please try again later.";
  }
}

export interface MarketingContentResponse {
  title: string;
  content: string;
  hashtags?: string[];
  imagePrompt?: string;
}

export async function generateMarketingContent(topic: string, platform: string, tone: string): Promise<MarketingContentResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { title: "Error", content: "API Key missing" };
  }

  const isSales = ["Cold Email", "Discovery Call Script", "Follow-up Email", "Proposal Intro"].includes(platform);

  let systemPrompt = "";
  
  if (isSales) {
    systemPrompt = `You are a Senior Sales Director at CHANGE Media, a high-end creative studio.
    Create sales outreach content for: "${platform}".
    Tone: ${tone}.
    
    Return JSON with:
    - title: The Email Subject Line or Script Title.
    - content: The full email body or script (formatted with Markdown).
    - hashtags: [] (Empty array).
    - imagePrompt: null.`;
  } else {
    systemPrompt = `You are a Senior Marketing Manager at CHANGE Media, a high-end creative studio.
    Create content for the platform: "${platform}".
    Tone: ${tone}.
    
    Return JSON with:
    - title: A catchy headline or hook.
    - content: The full post body/caption (formatted with Markdown).
    - hashtags: Array of relevant hashtags (if applicable).
    - imagePrompt: A description for an image to accompany this post.`;
  }

  const userPrompt = `Create content about: "${topic}"`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error("AI API error");
    }

    const json = await response.json();
    const content = json.choices?.[0]?.message?.content;
    if (content) {
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Marketing AI error", error);
  }

  return { title: "Error", content: "Failed to generate content." };
}

export interface ProspectDossier {
  companyName: string;
  industry: string;
  keyPainPoints: string[];
  suggestedHook: string;
  sequence: {
    subject: string;
    body: string;
    type: "intro" | "follow-up" | "breakup";
  }[];
}

export async function researchAndGenerateSequence(url: string): Promise<ProspectDossier | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    // 1. Fetch the website content (simple text extraction)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
    
    const siteRes = await fetch(url, { 
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ChangeMediaBot/1.0)" }
    });
    clearTimeout(timeoutId);

    if (!siteRes.ok) throw new Error("Failed to fetch site");
    
    const html = await siteRes.text();
    // Very basic text extraction to avoid heavy deps
    const textContent = html
      .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "")
      .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gm, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .slice(0, 6000); // Limit context window

    // 2. Analyze and Generate Sequence in one go
    const systemPrompt = `You are an elite Sales Development Rep (SDR) for CHANGE Media (a premium video/photo studio).
    Analyze the provided website text from a prospect.
    
    Task 1: Create a "Prospect Dossier":
    - Identify Company Name & Industry.
    - Infer 3 key pain points they might have regarding branding/content.
    - Create a "Hook" (a specific observation to start a conversation).

    Task 2: Generate a 3-Email Sequence based on that dossier:
    - Email 1: Cold Outreach (Value-first, using the hook).
    - Email 2: Follow-up (Case study/Social proof focus).
    - Email 3: Break-up (Professional, leaving door open).

    Return JSON format:
    {
      "companyName": "...",
      "industry": "...",
      "keyPainPoints": ["...", "...", "..."],
      "suggestedHook": "...",
      "sequence": [
        { "type": "intro", "subject": "...", "body": "..." },
        { "type": "follow-up", "subject": "...", "body": "..." },
        { "type": "breakup", "subject": "...", "body": "..." }
      ]
    }`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Website Content: ${textContent}` },
        ],
        response_format: { type: "json_object" },
      }),
    });

    const json = await response.json();
    const content = json.choices?.[0]?.message?.content;
    if (content) return JSON.parse(content);

  } catch (error) {
    console.error("Research error", error);
  }
  return null;
}
