import type { Metadata } from "next";
import GradClient from "./GradClient";
import { getGradContent } from "@/lib/gradStore";

export const metadata: Metadata = {
  title: "Graduation Portraits — Class of 2026 | Change Media Studio",
  description:
    "Professional grad portraits for CU Denver and CU Boulder seniors. Five session tiers from quick snaps to the full legacy experience. Book your spring session before slots fill.",
};

export default async function GradPage() {
  const content = await getGradContent();
  return <GradClient content={content} />;
}
