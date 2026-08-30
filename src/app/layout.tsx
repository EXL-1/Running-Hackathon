import type { Metadata } from "next";
import { Baloo_2, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

import { siteUrl } from "@/lib/site";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: "Peanut Butter — be your personal best",
  description:
    "A voice-led pace coach: your arch-enemy taunts you when you drift off pace, someone who loves you carries you when your PB is in sight.",
  openGraph: {
    title: "Peanut Butter — be your personal best",
    description:
      "A voice-led pace coach: your arch-enemy taunts you when you drift off pace, someone who loves you carries you when your PB is in sight.",
    url: siteUrl(),
    siteName: "Peanut Butter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Peanut Butter — be your personal best",
    description:
      "A voice-led pace coach: your arch-enemy taunts you when you drift off pace, someone who loves you carries you when your PB is in sight.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${baloo.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
