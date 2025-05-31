"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Dynamically import the CodeRain component with no SSR
const CodeRain = dynamic(() => import("@/components/CodeRain"), { ssr: false });

export default function AnimationWrapper() {
  const [textMeasurements, setTextMeasurements] = useState<{
    name: { width: number; height: number; position: { x: number; y: number } };
    subtitle: { width: number; height: number; position: { x: number; y: number } };
  } | null>(null);
  
  useEffect(() => {
    // Measure text elements after they render
    const measureTextElements = () => {
      const nameElement = document.getElementById('name-text');
      const subtitleElement = document.getElementById('subtitle-text');
      
      if (nameElement && subtitleElement) {
        const nameRect = nameElement.getBoundingClientRect();
        const subtitleRect = subtitleElement.getBoundingClientRect();
        
        setTextMeasurements({
          name: {
            width: nameRect.width + 40, // Add padding to make collision area wider
            height: nameRect.height + 20, // Add padding for better collision detection
            position: {
              x: nameRect.left + nameRect.width / 2,
              y: nameRect.top + nameRect.height / 2
            }
          },
          subtitle: {
            width: subtitleRect.width + 40, // Add padding to make collision area wider
            height: subtitleRect.height + 20, // Add padding for better collision detection
            position: {
              x: subtitleRect.left + subtitleRect.width / 2,
              y: subtitleRect.top + subtitleRect.height / 2
            }
          }
        });
      }
    };
    
    // Initial measurement with multiple attempts
    const initialMeasurement = () => {
      measureTextElements();
      
      // Schedule additional measurements to ensure text elements are measured correctly
      setTimeout(measureTextElements, 100);
      setTimeout(measureTextElements, 500);
      setTimeout(measureTextElements, 1000);
    };
    
    initialMeasurement();
    
    // Re-measure on resize
    window.addEventListener('resize', measureTextElements);
    
    return () => {
      window.removeEventListener('resize', measureTextElements);
    };
  }, []);
  
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <CodeRain textColliders={textMeasurements} />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <h1 
          id="name-text" 
          className="text-4xl md:text-6xl font-bold mb-6 text-white font-[family-name:var(--font-geist-sans)] px-8 py-4 drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] shadow-2xl"
        >
          Mohammed &quot;Flak&quot; Ali
        </h1>
        <p 
          id="subtitle-text" 
          className="text-xl md:text-2xl text-white mb-8 font-[family-name:var(--font-geist-mono)] px-6 py-3 drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] shadow-xl"
        >
          Tech Blog & Personal Site
        </p>
        <div className="animate-bounce mt-10">
          <p className="text-white text-sm drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]">Scroll to explore</p>
          <div className="mx-auto w-6 h-6 border-b-2 border-r-2 border-white transform rotate-45 mt-2 drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]"></div>
        </div>
      </div>
    </div>
  );
}