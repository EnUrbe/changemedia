import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About — Our Story & Values",
  description:
    "About CHANGE Media, a Denver creative studio helping nonprofits, founders, schools, and mission-driven brands build trust with film and portraiture.",
};

export default function AboutPage() {
  return <AboutClient />;
}
