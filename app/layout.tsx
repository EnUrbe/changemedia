import "./globals.css";

export const metadata = {
  title: "CHANGE Media — Short, cinematic stories",
  description:
    "Youth-led studio making micro-docs, reels, and campaign assets about health, community, and policy.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
