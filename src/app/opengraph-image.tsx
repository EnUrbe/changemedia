import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CHANGE Media — Short, cinematic stories";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const siteName = "CHANGE Media";
  const tagline = "Social impact media studio";
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          color: "white",
          padding: 48,
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(16,185,129,0.25), transparent 35%), radial-gradient(circle at 80% 70%, rgba(56,189,248,0.25), transparent 35%), radial-gradient(circle at 50% 100%, rgba(236,72,153,0.25), transparent 35%)",
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: -1 }}>{siteName}</div>
        <div style={{ fontSize: 36, opacity: 0.9 }}>{tagline}</div>
        <div style={{ fontSize: 18, color: "#cbd5e1" }}>Documentary • Reels • Campaigns</div>
      </div>
    ),
    {
      ...size,
    }
  );
}
