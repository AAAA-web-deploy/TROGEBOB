import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://trogebob.world"),
  title: "Trogebob — Vitalik+Anatoly+Raj",
  description: "Trogebob: Vitalik + Anatoly + Raj. Three faces. One mind—or Three?! Make a face, meet the meme, watch the fusion accident.",
  icons: { icon: "/assets/brand/trogebob-round.webp" },
  openGraph: {
    title: "Vitalik+Anatoly+Raj | $TROGEBOB",
    description: "Three faces. One mind—or Three?! The completely unofficial Trogebob fusion lab.",
    images: ["/assets/brand/trogebob-round.webp"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#17112e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/assets/brand/trogebob-cutout.webp" fetchPriority="high" />
      </head>
      <body>{children}</body>
    </html>
  );
}
