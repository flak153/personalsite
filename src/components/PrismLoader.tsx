"use client";

import { useEffect } from "react";

// Define a global Prism type to avoid TypeScript errors
declare global {
  interface Window {
    Prism: {
      highlightAll: () => void;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        await import("prismjs");
        
        // Load JavaScript first as it's required by TypeScript and JSX
        await import("prismjs/components/prism-javascript");
        
        // Then, import TypeScript (needed for TSX)
        await import("prismjs/components/prism-typescript");
        
        // Then JSX (needed for TSX)
        await import("prismjs/components/prism-jsx");
        
        // Load remaining languages one-by-one in dependency order
        await import("prismjs/components/prism-c");      // C
        await import("prismjs/components/prism-cpp");    // C++ (depends on C)
        await import("prismjs/components/prism-csharp"); // C#
        await import("prismjs/components/prism-java");   // Java
        await import("prismjs/components/prism-python"); // Python
        await import("prismjs/components/prism-bash");   // Bash
        await import("prismjs/components/prism-json");   // JSON
        await import("prismjs/components/prism-rust");   // Rust
        await import("prismjs/components/prism-go");     // Go
        
        // Manually register the TSX language since there might be dependency issues
        if (typeof window !== 'undefined' && window.Prism && window.Prism.languages.typescript && window.Prism.languages.jsx) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const jsx = window.Prism.languages.jsx as any;
          window.Prism.languages.tsx = {
            ...window.Prism.languages.typescript,
            'tag': jsx.tag,
            'attr-value': jsx['attr-value'],
            'attr-name': jsx['attr-name'],
            'script': jsx.script
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