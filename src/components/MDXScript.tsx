"use client";

import { useEffect } from "react";

interface MDXScriptProps {
  children: string;
}

export default function MDXScript({ children }: MDXScriptProps) {
  useEffect(() => {
    // Create a new script element and run it
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.text = children;
    document.body.appendChild(script);
    
    // Cleanup function
    return () => {
      if (script && script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, [children]);
  
  // Return nothing in the DOM
  return null;
}