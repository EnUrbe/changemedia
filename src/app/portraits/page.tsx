import type { Metadata } from "next";
import PortraitsClient from "./PortraitsClient";

export const metadata: Metadata = {
  title: "Portrait Atelier — Editorial Portraiture",
  description:
    "Executive portraits, team headshots, and brand sessions in Denver for founders, schools, agencies, and mission-driven teams.",
};

export default function PortraitsPage() {
  return <PortraitsClient />;
}
