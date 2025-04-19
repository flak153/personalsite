import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navigation from "@/components/Navigation";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import PrismLoader from "@/components/PrismLoader";
import "./globals.css";
// Import the Prism theme for syntax highlighting
import "prismjs/themes/prism-tomorrow.css"; // Basic theme
import "./styles/prism-theme.css"; // Our custom theme

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mohammed Ali | Tech Blog",
  description: "Personal site and tech blog by Mohammed Ali",
  other: {
    // Add preconnect hint for better background loading performance
    "http-equiv": {
      "Content-Security-Policy": "upgrade-insecure-requests"
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BackgroundWrapper />
        <Navigation />
        <PrismLoader />
        {children}
      </body>
    </html>
  );
}
