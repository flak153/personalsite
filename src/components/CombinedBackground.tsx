"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Dynamically import components to reduce initial load time
const CircuitBoardBackground = dynamic(() => import("./CircuitBoardBackground"), { 
  ssr: false,
  loading: () => null
});

const BackgroundRain = dynamic(() => import("./BackgroundRain"), { 
  ssr: false,
  loading: () => null
});

export default function CombinedBackground() {
  const [isLoaded, setIsLoaded] = useState(false);
  const pathname = usePathname();
  
  // Detect if we're on a route that needs intensive background
  const isHomePage = pathname === "/";
  
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
      <div className="fixed inset-0 z-0 bg-[linear-gradient(135deg,rgba(154,3,30,0.9),rgba(10,36,99,0.9))]" />
    );
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <BackgroundRain />
      </div>
      
      {/* Only render circuit board on the home page to improve performance on other pages */}
      {isHomePage && (
        <div className="absolute inset-0 z-10 pointer-events-none opacity-40">
          <CircuitBoardBackground />
        </div>
      )}
    </div>
  );
}