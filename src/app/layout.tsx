import React from "react";
import type { Metadata, Viewport } from "next";
import { Nunito, Inter, Poppins, Open_Sans, Lato } from "next/font/google";
import { GeistSans, GeistMono } from "geist/font";
import Navigation from "@/components/Navigation";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import PrismLoader from "@/components/PrismLoader";
import ScrollToTop from "@/components/ScrollToTop";
import "./globals.css";
// Import the Prism theme for syntax highlighting
import "prismjs/themes/prism-tomorrow.css"; // Basic theme
import "./styles/prism-theme.css"; // Our custom theme
import settings from "../../settings.json";

// Load all font options
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

// Use local Geist fonts
const geist = GeistSans;
const geistMono = GeistMono;

// Font mapping
const fontMap = {
  nunito,
  inter,
  poppins,
  openSans,
  lato,
  geist,
};

// Get current font based on settings
const currentBodyFont = fontMap[settings.fonts.bodyFont.current as keyof typeof fontMap] || nunito;

export const metadata: Metadata = {
  title: "Mohammed Ali | Tech Blog",
  description: "Personal site and tech blog by Mohammed Ali",
  keywords: "Mohammed Ali, tech blog, software engineering, DevOps, backend systems, cloud architecture, startup",
  authors: [{ name: "Mohammed Ali" }],
  other: {
    // Add preconnect hint for better background loading performance
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${currentBodyFont.variable} ${geistMono.variable} antialiased`}
      >
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Skip to main content
        </a>
        <BackgroundWrapper />
        <Navigation />
        <PrismLoader />
        <ScrollToTop />
        <main id="main-content" className="pt-20 pb-20 md:pb-0">
          {children}
        </main>
      </body>
    </html>
  );
}
