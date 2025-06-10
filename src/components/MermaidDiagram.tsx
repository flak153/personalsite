"use client";

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  code: string; // The Mermaid code string, passed as a prop
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ code }) => {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const idRef = useRef<string | null>(null);
  
  // Generate unique ID only once per component instance
  if (!idRef.current) {
    idRef.current = `mermaid-diagram-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false, // We will manually trigger rendering
      theme: 'default', // Changed to default for better readability
      themeVariables: {
        primaryColor: '#f3f4f6',
        primaryTextColor: '#111827',
        primaryBorderColor: '#d1d5db',
        lineColor: '#6b7280',
        secondaryColor: '#e5e7eb',
        tertiaryColor: '#f9fafb',
        background: '#ffffff',
        mainBkg: '#f3f4f6',
        secondBkg: '#e5e7eb',
        tertiaryBkg: '#f9fafb',
        darkMode: false,
        fontSize: '16px'
      },
      // securityLevel: 'loose', // If you have complex diagrams or need more features
      // logLevel: 'debug', // For debugging
    });
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const renderDiagram = async () => {
      if (mermaidRef.current && code && isMounted) {
        mermaidRef.current.innerHTML = ''; // Clear previous render

        const mermaidCode = code.trim();
        const diagramSvgId = idRef.current + '-svg';

        try {
          const { svg, bindFunctions } = await mermaid.render(diagramSvgId, mermaidCode);
          
          if (mermaidRef.current && isMounted) {
            mermaidRef.current.innerHTML = svg;
            if (bindFunctions && typeof bindFunctions === 'function') {
              bindFunctions(mermaidRef.current);
            }
          }
        } catch (error) {
          console.error(`Error rendering Mermaid diagram (ID: ${diagramSvgId}):`, error);
          if (mermaidRef.current && isMounted) {
            mermaidRef.current.innerHTML = `<pre>Error rendering diagram: ${error instanceof Error ? error.message : String(error)}\n${mermaidCode}</pre>`;
          }
        }
      }
    };

    renderDiagram();
    
    return () => {
      isMounted = false;
    };
  }, [code]); // Depend on code prop

  // The div that will contain the rendered SVG.
  // We don't put the mermaid code directly here.
  // Instead, mermaid.render will populate this div with the SVG.
  return (
    <div className="my-8 p-6 bg-white rounded-lg shadow-lg border border-gray-200 overflow-x-auto">
      <div ref={mermaidRef} id={idRef.current} className="mermaid-diagram-container" />
    </div>
  );
};

export default MermaidDiagram;
