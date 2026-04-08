import type { Metadata } from "next";
import GradClient from "./GradClient";
import { getGradContent } from "@/lib/gradStore";

export const metadata: Metadata = {
  title: "Graduation Portraits in Denver & Boulder | Change Media Studio",
  description:
    "Editorial-style grad portraits for CU Boulder, CU Denver, MSU Denver, and metro area grads. Sessions from $49 — cap & gown to full signature shoots. Spring 2026 slots are limited. Book before commencement.",
  keywords: [
    "graduation portraits Denver",
    "graduation photographer Boulder",
    "CU Boulder grad photos",
    "CU Denver graduation portraits",
    "MSU Denver grad photographer",
    "senior portraits Colorado",
    "graduation photography Class of 2026",
    "Change Media Studio",
  ],
  openGraph: {
    title: "Graduation Portraits in Denver & Boulder | Change Media Studio",
    description:
      "Editorial-style grad portraits for CU Boulder, CU Denver, MSU Denver, and metro area grads. Sessions from $49. Spring 2026 slots are limited.",
    type: "website",
    siteName: "Change Media Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Graduation Portraits in Denver & Boulder | Change Media Studio",
    description:
      "Editorial-style grad portraits for CU Boulder, CU Denver, MSU Denver, and metro area grads. Sessions from $49. Book before commencement.",
  },
};

export const dynamic = "force-dynamic";

export default async function GradPage() {
  const content = await getGradContent();
  return <GradClient content={content} />;
}
