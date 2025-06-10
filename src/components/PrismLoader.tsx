"use client";

import { useEffect } from "react";

// Prism types are declared in src/types/global.d.ts

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
        
        // Additional language support
        await import("prismjs/components/prism-yaml");   // YAML
        await import("prismjs/components/prism-docker"); // Docker
        await import("prismjs/components/prism-sql");    // SQL
        await import("prismjs/components/prism-graphql"); // GraphQL
        await import("prismjs/components/prism-markdown"); // Markdown
        await import("prismjs/components/prism-diff");   // Diff
        await import("prismjs/components/prism-git");    // Git
        
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