"use client";

import { useState, useEffect, useRef } from 'react';
import settings from '../../settings.json';

export default function TypewriterTagline() {
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  
  const taglines = settings.hero.taglines;
  const { typingSpeed, deletionSpeed, pauseAfterTyping, cursorBlinkSpeed } = settings.hero.typewriter;
  
  const currentCharIndex = useRef<number>(0);
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, cursorBlinkSpeed);

    return () => clearInterval(cursorInterval);
  }, [cursorBlinkSpeed]);

  // Typing and deletion effect
  useEffect(() => {
    const currentTagline = taglines[currentTaglineIndex];
    
    const typeCharacter = () => {
      if (currentCharIndex.current < currentTagline.length) {
        setDisplayText(currentTagline.substring(0, currentCharIndex.current + 1));
        currentCharIndex.current++;
        
        // Add slight randomness to typing speed for natural effect
        const randomDelay = typingSpeed + Math.random() * 50 - 25;
        typingTimeoutRef.current = setTimeout(typeCharacter, randomDelay);
      } else {
        // Finished typing, pause then start deleting
        pauseTimeoutRef.current = setTimeout(() => {
          deleteCharacter();
        }, pauseAfterTyping);
      }
    };

    const deleteCharacter = () => {
      if (currentCharIndex.current > 0) {
        currentCharIndex.current--;
        setDisplayText(currentTagline.substring(0, currentCharIndex.current));
        
        typingTimeoutRef.current = setTimeout(deleteCharacter, deletionSpeed);
      } else {
        // Finished deleting, move to next tagline
        setCurrentTaglineIndex((prev) => (prev + 1) % taglines.length);
      }
    };

    // Clear any existing timeouts
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);

    // Reset character index for new tagline
    currentCharIndex.current = 0;
    setDisplayText('');
    
    // Start typing animation
    typeCharacter();

    // Cleanup
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, [currentTaglineIndex, taglines, typingSpeed, deletionSpeed, pauseAfterTyping]);

  return (
    <div className="relative h-[36px] md:h-[40px] mb-8 overflow-hidden">
      <p 
        className="text-xl md:text-2xl text-white font-[family-name:var(--font-geist-mono)]"
        aria-live="polite"
        aria-label={`Current role: ${taglines[currentTaglineIndex]}`}
      >
        <span className="relative">
          {/* Main text */}
          <span className="relative">
            {displayText}
            {/* Cursor */}
            <span 
              className={`inline-block w-[3px] h-[1.2em] bg-white ml-[2px] align-middle transition-opacity duration-100 ${
                showCursor ? 'opacity-100' : 'opacity-0'
              }`}
              aria-hidden="true"
            />
          </span>
        </span>
      </p>
    </div>
  );
}
