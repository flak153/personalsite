"use client";

import { useState, useEffect } from "react";
import BackgroundRain from "./BackgroundRain";
import CircuitBoardBackground from "./CircuitBoardBackground";
import DataVizBackground from "./DataVizBackground";

type BackgroundType = "rain" | "circuit" | "dataViz" | "none";

export default function BackgroundController() {
  const [activeBackground, setActiveBackground] = useState<BackgroundType>("rain");
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  
  // Get stored preference if available
  useEffect(() => {
    const storedBackground = localStorage.getItem("preferredBackground");
    if (storedBackground) {
      setActiveBackground(storedBackground as BackgroundType);
    }
  }, []);
  
  // Store preference when changed
  useEffect(() => {
    localStorage.setItem("preferredBackground", activeBackground);
  }, [activeBackground]);
  
  return (
    <>
      {/* Background components */}
      {activeBackground === "rain" && <BackgroundRain />}
      {activeBackground === "circuit" && <CircuitBoardBackground />}
      {activeBackground === "dataViz" && <DataVizBackground />}
      {activeBackground === "none" && (
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#2d0051] to-[#ffdb58]" />
      )}
      
      {/* Background controls */}
      <div className="fixed bottom-5 right-5 z-50">
        <div className="relative">
          {/* Toggle button */}
          <button
            onClick={() => setIsControlsVisible(!isControlsVisible)}
            className="bg-black/30 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/50 transition-colors"
            aria-label="Toggle background controls"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 8l4 4-4 4M3 12h18"></path>
            </svg>
          </button>
          
          {/* Control panel */}
          {isControlsVisible && (
            <div className="absolute bottom-14 right-0 bg-black/50 backdrop-blur-md p-4 rounded-lg text-white w-52">
              <h3 className="text-sm font-medium mb-3">Background Animation</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="background"
                    checked={activeBackground === "rain"}
                    onChange={() => setActiveBackground("rain")}
                    className="text-yellow-400 focus:ring-yellow-400"
                  />
                  <span>Particle Rain</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="background"
                    checked={activeBackground === "circuit"}
                    onChange={() => setActiveBackground("circuit")}
                    className="text-yellow-400 focus:ring-yellow-400"
                  />
                  <span>Circuit Board</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="background"
                    checked={activeBackground === "dataViz"}
                    onChange={() => setActiveBackground("dataViz")}
                    className="text-yellow-400 focus:ring-yellow-400"
                  />
                  <span>Data Visualization</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="background"
                    checked={activeBackground === "none"}
                    onChange={() => setActiveBackground("none")}
                    className="text-yellow-400 focus:ring-yellow-400"
                  />
                  <span>Gradient Only</span>
                </label>
              </div>
              
              <p className="text-xs text-white/70 mt-3">
                Background preference will be saved for your next visit.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}