"use client";

import { useState } from "react";
// import ReactMarkdown from "react-markdown"; // Removing direct import to avoid SSR issues
import dynamic from "next/dynamic";

const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });

const marketingPlatforms = ["Instagram", "LinkedIn", "Blog Post", "Newsletter", "Twitter/X"];
const salesPlatforms = ["Cold Email", "Discovery Call Script", "Follow-up Email", "Proposal Intro"];
const tones = ["Professional", "Cinematic", "Casual", "Excited", "Educational", "Persuasive", "Empathetic"];

export default function MarketingAgent() {
  const [mode, setMode] = useState<"marketing" | "sales" | "autonomous">("marketing");
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState(marketingPlatforms[0]);
  const [tone, setTone] = useState(tones[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const currentPlatforms = mode === "marketing" ? marketingPlatforms : salesPlatforms;

  async function handleGenerate() {
    if (!topic) return;
    setLoading(true);
    setResult(null);

    try {
      const endpoint = mode === "autonomous" ? "/api/ai/research" : "/api/ai/marketing";
      const body = mode === "autonomous" 
        ? { url: topic } 
        : { topic, platform, tone };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Campaign Setup</h2>
            <div className="flex rounded-lg bg-black/40 p-1">
              <button
                onClick={() => { setMode("marketing"); setPlatform(marketingPlatforms[0]); }}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${mode === "marketing" ? "bg-white text-black" : "text-white/60 hover:text-white"}`}
              >
                Marketing
              </button>
              <button
                onClick={() => { setMode("sales"); setPlatform(salesPlatforms[0]); }}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${mode === "sales" ? "bg-white text-black" : "text-white/60 hover:text-white"}`}
              >
                Sales
              </button>
              <button
                onClick={() => { setMode("autonomous"); setTopic(""); }}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${mode === "autonomous" ? "bg-emerald-400 text-black" : "text-emerald-400/60 hover:text-emerald-400"}`}
              >
                Auto-Research
              </button>
            </div>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                {mode === "marketing" ? "Topic / Key Message" : mode === "sales" ? "Prospect / Value Proposition" : "Prospect Website URL"}
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={
                  mode === "marketing" ? "e.g., Launching our new portrait studio..." : 
                  mode === "sales" ? "e.g., Reaching out to a luxury real estate firm..." :
                  "e.g., www.apple.com"
                }
                className={`${mode === "autonomous" ? "h-16" : "h-32"} w-full rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white placeholder:text-white/20 focus:border-white/20 focus:outline-none`}
              />
            </div>

            {mode !== "autonomous" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
                    {mode === "marketing" ? "Platform" : "Outreach Type"}
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-white/20 focus:outline-none"
                  >
                    {currentPlatforms.map((p) => (
                      <option key={p} value={p} className="bg-neutral-900">{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white focus:border-white/20 focus:outline-none"
                  >
                    {tones.map((t) => (
                      <option key={t} value={t} className="bg-neutral-900">{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading || !topic}
              className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 ${mode === "autonomous" ? "bg-emerald-400 text-black" : "bg-white text-black"}`}
            >
              {loading ? "Processing..." : mode === "autonomous" ? "Analyze & Generate Sequence" : "Generate Content"}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {result ? (
          mode === "autonomous" ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="font-semibold text-white">Prospect Intelligence</h3>
                </div>
                <div className="grid gap-4 text-sm text-white/80">
                  <div>
                    <span className="text-white/40 uppercase text-xs tracking-wider">Company:</span>
                    <p className="font-medium text-white">{result.companyName} <span className="text-white/40">({result.industry})</span></p>
                  </div>
                  <div>
                    <span className="text-white/40 uppercase text-xs tracking-wider">Identified Pain Points:</span>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {result.keyPainPoints.map((p: string, i: number) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span className="text-white/40 uppercase text-xs tracking-wider">Strategic Hook:</span>
                    <p className="mt-1 italic text-emerald-200/80">"{result.suggestedHook}"</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {result.sequence.map((email: any, i: number) => (
                  <div key={i} className="rounded-2xl border border-white/5 bg-black/20 p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/60 uppercase tracking-wider">
                        {email.type}
                      </span>
                      <button 
                        onClick={() => navigator.clipboard.writeText(email.body)}
                        className="text-xs text-white/40 hover:text-white transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                    <h4 className="mb-3 font-medium text-white">{email.subject}</h4>
                    <div className="prose prose-invert prose-sm max-w-none text-white/70">
                      <ReactMarkdown>{email.body}</ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="font-serif text-2xl text-white">{result.title}</h3>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/60">{platform}</span>
              </div>
              
              <div className="prose prose-invert prose-sm max-w-none text-white/80">
                <ReactMarkdown>{result.content}</ReactMarkdown>
              </div>

              {result.hashtags && result.hashtags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {result.hashtags.map((tag: string) => (
                    <span key={tag} className="text-xs text-emerald-400">#{tag.replace(/^#/, '')}</span>
                  ))}
                </div>
              )}

              {result.imagePrompt && (
                <div className="mt-6 rounded-xl border border-white/5 bg-black/20 p-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-white/40">AI Image Prompt</p>
                  <p className="text-sm italic text-white/60">{result.imagePrompt}</p>
                </div>
              )}
            </div>
          )
        ) : (
          <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 p-12 text-center">
            <div className="max-w-xs">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <p className="text-sm text-white/40">Select your parameters and enter a topic to generate marketing content.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
