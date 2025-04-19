"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import backgrounds with ssr: false
const BackgroundRain = dynamic(() => import("@/components/BackgroundRain"), { ssr: false });
const CircuitBoardBackground = dynamic(() => import("@/components/CircuitBoardBackground"), { ssr: false });
const DataVizBackground = dynamic(() => import("@/components/DataVizBackground"), { ssr: false });

// This component is used in individual pages that need a background but don't use the global controller
export default function FullPageRain() {
  const [background, setBackground] = useState<string | null>(null);
  
  // Check local storage for preferred background
  useEffect(() => {
    const storedBackground = localStorage.getItem("preferredBackground") || "rain";
    setBackground(storedBackground);
  }, []);
  
  if (!background) return null;
  
  return (
    <div className="fixed inset-0 z-0 pointer-events-none w-full h-full">
      {background === "rain" && <BackgroundRain />}
      {background === "circuit" && <CircuitBoardBackground />}
      {background === "dataViz" && <DataVizBackground />}
      {background === "none" && (
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#2d0051] to-[#ffdb58]" />
      )}
    </div>
  );
}