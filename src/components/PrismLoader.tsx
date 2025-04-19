"use client";

import { useEffect } from "react";

// Define a global Prism type to avoid TypeScript errors
declare global {
  interface Window {
    Prism: {
      highlightAll: () => void;
      languages: Record<string, any>;
    };
  }
}

export default function PrismLoader() {
  useEffect(() => {
    // Import Prism and its components on the client side
    const loadPrism = async () => {
      try {
        // First, import Prism core
        const Prism = await import("prismjs");
        
        // Load JavaScript first as it's required by TypeScript and JSX
        await import("prismjs/components/prism-javascript");
        
        // Then, import TypeScript (needed for TSX)
        await import("prismjs/components/prism-typescript");
        
        // Then JSX (needed for TSX)
        await import("prismjs/components/prism-jsx");
        
        // Load remaining languages after TypeScript and JSX are registered
        await Promise.all([
          import("prismjs/components/prism-java"),
          import("prismjs/components/prism-python"),
          import("prismjs/components/prism-c"),
          import("prismjs/components/prism-cpp"),
          import("prismjs/components/prism-csharp"),
          import("prismjs/components/prism-bash"),
          import("prismjs/components/prism-json"),
          import("prismjs/components/prism-rust"),
          import("prismjs/components/prism-go"),
        ]);
        
        // Manually register the TSX language since there might be dependency issues
        if (typeof window !== 'undefined' && window.Prism && window.Prism.languages.typescript && window.Prism.languages.jsx) {
          window.Prism.languages.tsx = {
            ...window.Prism.languages.typescript,
            'tag': window.Prism.languages.jsx.tag,
            'attr-value': window.Prism.languages.jsx['attr-value'],
            'attr-name': window.Prism.languages.jsx['attr-name'],
            'script': window.Prism.languages.jsx.script
          };
        }
        
        // Manually highlight all code blocks
        if (typeof window !== 'undefined' && window.Prism) {
          window.Prism.highlightAll();
        }
      } catch (err) {
        console.error("Failed to load Prism:", err);
      }
    };
    
    loadPrism();
  }, []);
  
  // This component doesn't render anything visible
  return null;
}