import type { Metadata } from "next";
import StudiosClient from "./StudiosClient";

export const metadata: Metadata = {
  title: "Change Studios — Film & Video Production",
  description:
    "Denver documentary filmmaker for nonprofits, founders, schools, and mission-driven brands. Campaign films, event recaps, retainers, and launch-ready video content.",
};

export default function StudiosPage() {
  return <StudiosClient />;
}
