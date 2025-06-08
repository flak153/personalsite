"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BackgroundToggleProps {
  onToggle: (enabled: boolean) => void;
}

export default function BackgroundToggle({ onToggle }: BackgroundToggleProps) {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Read preference from cookie on mount
  useEffect(() => {
    const cookies = document.cookie.split(';');
    const backgroundCookie = cookies.find(cookie => cookie.trim().startsWith('backgroundEnabled='));
    if (backgroundCookie) {
      const value = backgroundCookie.split('=')[1];
      const enabled = value === 'true';
      setIsEnabled(enabled);
      onToggle(enabled);
    }
  }, [onToggle]);

  // Save preference to cookie when changed
  const handleToggle = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    onToggle(newValue);
    
    // Set cookie with 1 year expiry
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    document.cookie = `backgroundEnabled=${newValue}; expires=${date.toUTCString()}; path=/`;
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <motion.button
        aria-label={`Toggle background animation (currently ${isEnabled ? 'on' : 'off'})`}
        onClick={handleToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative group flex items-center gap-2 px-3 py-2 rounded-full
          backdrop-blur-md transition-all duration-300
          ${isEnabled 
            ? 'bg-white/10 hover:bg-white/20 border border-white/20' 
            : 'bg-black/20 hover:bg-black/30 border border-white/10'
          }
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Circuit icon */}
        <div className="relative w-5 h-5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={`w-5 h-5 transition-all duration-300 ${
              isEnabled ? 'text-purple-400' : 'text-gray-400'
            }`}
          >
            {/* Circuit board pattern icon */}
            <path
              d="M12 2v4m0 12v4M2 12h4m12 0h4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
            <circle cx="12" cy="6" r="1" fill="currentColor" />
            <circle cx="12" cy="18" r="1" fill="currentColor" />
            <circle cx="6" cy="12" r="1" fill="currentColor" />
            <circle cx="18" cy="12" r="1" fill="currentColor" />
          </svg>
          
          {/* Animated glow effect when enabled */}
          {isEnabled && (
            <motion.div
              className="absolute inset-0 rounded-full bg-purple-400/30 blur-md"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0.2, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </div>

        {/* Text label */}
        <AnimatePresence>
          {isHovered && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className={`text-xs font-medium overflow-hidden whitespace-nowrap ${
                isEnabled ? 'text-white' : 'text-gray-300'
              }`}
            >
              {isEnabled ? 'Animation On' : 'Animation Off'}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Toggle switch indicator */}
        <div
          className={`
            relative w-8 h-4 rounded-full transition-colors duration-300
            ${isEnabled ? 'bg-purple-400/30' : 'bg-gray-600/30'}
          `}
        >
          <motion.div
            className={`
              absolute top-0.5 w-3 h-3 rounded-full
              ${isEnabled ? 'bg-purple-400' : 'bg-gray-400'}
            `}
            animate={{ x: isEnabled ? 16 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </div>
      </motion.button>

      {/* Tooltip on first visit */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 mb-2 px-3 py-1.5 bg-black/80 backdrop-blur-sm rounded-md"
          >
            <p className="text-xs text-white whitespace-nowrap">
              Toggle background animation
            </p>
            <div className="absolute bottom-0 left-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-black/80" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
