"use client";

import dynamic from "next/dynamic";

// Import the combined background with no SSR to avoid hydration issues
const CombinedBackground = dynamic(
  () => import("@/components/CombinedBackground"),
  { ssr: false }
);

export default function BackgroundWrapper() {
  return (
    <div className="fixed inset-0 z-0">
      <CombinedBackground />
    </div>
  );
}