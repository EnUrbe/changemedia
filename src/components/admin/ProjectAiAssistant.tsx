"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { generateProjectInsightsAction } from "@/src/app/admin/projects/actions";
import { AiGenerationType } from "@/lib/aiAssistant";

export default function ProjectAiAssistant({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<AiGenerationType>("insights");
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    const res = await generateProjectInsightsAction(projectId, activeTab);
    if (res.success) {
      setResult(res.data);
    }
    setLoading(false);
  };

  const tabs: { id: AiGenerationType; label: string }[] = [
    { id: "insights", label: "Insights" },
    { id: "brief", label: "Creative Brief" },
    { id: "email", label: "Draft Email" },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Studio Intelligence</h2>
        <span className="rounded-full bg-purple-500/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-300 border border-purple-500/30">Beta</span>
      </div>

      <div className="mb-6 flex gap-2 rounded-lg bg-white/5 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setResult(null); }}
            className={`flex-1 rounded-md py-2 text-xs font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white text-black shadow-sm"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <p className="mb-6 text-sm text-white/60">
        {activeTab === "insights" && "Generate a project summary and actionable next steps."}
        {activeTab === "brief" && "Create a cinematic creative brief with visual references."}
        {activeTab === "email" && "Draft a professional status update email for the client."}
      </p>

      <Button 
        onClick={handleAnalyze} 
        disabled={loading}
        className="w-full !bg-white !text-black hover:!bg-neutral-200"
      >
        {loading ? "Generating..." : `Generate ${tabs.find(t => t.id === activeTab)?.label}`}
      </Button>

      {result && (
        <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-white/40">Output</div>
            <div className="prose prose-invert prose-sm max-w-none">
              {result.summary && <p className="font-medium text-white">{result.summary}</p>}
              
              {result.content && (
                <div className="mt-4 whitespace-pre-wrap text-white/80 font-mono text-xs bg-white/5 p-3 rounded-lg border border-white/5">
                  {result.content}
                </div>
              )}

              {result.nextSteps && result.nextSteps.length > 0 && (
                <ul className="mt-4 space-y-1 text-white/60">
                  {result.nextSteps.map((step: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-purple-400 shrink-0" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
