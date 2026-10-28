import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { EventProvider } from "@/lib/store/event-context";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Antigravity Celebrations | AI-Powered Event & Celebration Planner",
  description:
    "Turn simple ideas into complete, actionable event plans with intelligent budget tracking, vendor shortlisting, timelines, and personalized themes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <body className="font-sans min-h-screen bg-[#FAF8F4] text-[#222126] antialiased">
        <EventProvider>{children}</EventProvider>
      </body>
    </html>
  );
}
