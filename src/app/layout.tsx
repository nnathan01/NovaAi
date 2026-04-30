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
  title: "Nova AI — Your Second Brain",
  description: "Nova is an AI Second Brain that helps you think, reflect, and organize your thoughts.",
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
      <body className="min-h-full bg-[#0b0b0c] text-white flex flex-col">

        {/* GLOBAL BACKGROUND EFFECT (optional but nice) */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_60%)]" />

        {children}
      </body>
    </html>
  );
}