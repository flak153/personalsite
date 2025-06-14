"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import settings from "../../settings.json";
import BackgroundToggle from "./BackgroundToggle";

// Dynamically import components to reduce initial load time
const CircuitBoardBackground = dynamic(() => import("./CircuitBoardBackground"), { 
  ssr: false,
  loading: () => null
});


export default function CombinedBackground() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const pathname = usePathname();
  
  // Detect if we're on a route that needs intensive background
  const isHomePage = pathname === "/";
  
  // Removed debug logging
  
  // Stagger initialization to improve perceived performance
  useEffect(() => {
    // Only load background after a short delay to prioritize content
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Add debounce for window resize events globally
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;
    
    const handleResize = () => {
      document.body.classList.add("resize-animation-stopper");
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        document.body.classList.remove("resize-animation-stopper");
      }, 400);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Use reduced animations for non-home pages
  if (!isLoaded) {
    return (
      <div 
        className="fixed inset-0 z-0" 
        style={{ background: settings.theme.backgroundGradient }}
      />
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Static gradient background - always render as base layer */}
        <div 
          className="absolute inset-0 z-0"
          style={{ background: settings.theme.backgroundGradient }}
        />
        
        
        {/* Circuit board animation - controlled by settings and toggle */}
        {settings.animations.circuitBoard.enabled && 
         animationEnabled &&
         (!settings.animations.circuitBoard.homePageOnly || isHomePage) && (
          <div className="absolute inset-0 z-10 pointer-events-none opacity-40">
            <CircuitBoardBackground />
          </div>
        )}
      </div>
      
      {/* Background toggle control - outside the z-0 wrapper */}
      <BackgroundToggle onToggle={setAnimationEnabled} />
    </>
  );
}
