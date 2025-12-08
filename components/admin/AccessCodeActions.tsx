"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

type Props = {
  accessCode: string;
  projectId: string;
};

export default function AccessCodeActions({ accessCode, projectId }: Props) {
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  async function copy(text: string, kind: "code" | "link") {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1500);
    } catch (error) {
      console.error("copy failed", error);
    }
  }

  const clientLink = `${typeof window !== "undefined" ? window.location.origin : "https://www.changemedia.studio"}/clients/${projectId}?key=${accessCode}`;

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="ghost"
        className="border border-neutral-200 text-neutral-700 hover:border-neutral-300"
        onClick={() => copy(accessCode, "code")}
      >
        {copied === "code" ? "Code copied" : "Copy access code"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="border border-neutral-200 text-neutral-700 hover:border-neutral-300"
        onClick={() => copy(clientLink, "link")}
      >
        {copied === "link" ? "Link copied" : "Copy client link"}
      </Button>
    </div>
  );
}
