import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Just Paste Your Playlist — Spotify & Apple Music → YouTube",
  description:
    "Paste a Spotify or Apple Music playlist link and instantly get a YouTube playlist you can share with anyone. Free, no sign-up.",
  keywords: [
    "playlist converter",
    "spotify to youtube",
    "apple music to youtube",
    "playlist sharing",
    "music converter",
  ],
  openGraph: {
    title: "Just Paste Your Playlist",
    description:
      "Convert Spotify & Apple Music playlists to YouTube. Free, instant, no sign-up.",
    type: "website",
    siteName: "Just Paste Your Playlist",
  },
  twitter: {
    card: "summary_large_image",
    title: "Just Paste Your Playlist",
    description:
      "Convert Spotify & Apple Music playlists to YouTube. Free, instant, no sign-up.",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
