"use client";

import React, { useState, useRef, useEffect } from "react";
import { Check, Copy, ChevronDown, ChevronUp, FileCode2, Terminal } from "lucide-react";

// Prism types are declared in src/types/global.d.ts

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  fileName?: string;
  collapsible?: boolean;
  startCollapsed?: boolean;
}

export default function CodeBlock({
  children,
  className = "",
  showLineNumbers = true,
  highlightLines = [],
  fileName,
  collapsible = false,
  startCollapsed = false
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(startCollapsed);
  const [isVisible, setIsVisible] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);

  // Extract language from className (e.g., "language-javascript" -> "javascript")
  const language = className?.replace("language-", "") || "text";
  
  // Get the raw code text
  const codeText = typeof children === "string" ? children : children?.toString() || "";
  
  // State for highlighted HTML
  const [highlightedHtml, setHighlightedHtml] = useState<string>("");

  // Get appropriate icon for file type
  const getFileIcon = () => {
    const ext = fileName?.split(".").pop()?.toLowerCase();
    const iconClass = "w-4 h-4 mr-2";
    
    switch (ext) {
      case "js":
      case "jsx":
      case "ts":
      case "tsx":
        return <FileCode2 className={iconClass} />;
      case "sh":
      case "bash":
      case "zsh":
        return <Terminal className={iconClass} />;
      default:
        return <FileCode2 className={iconClass} />;
    }
  };

  // Copy code to clipboard
  const handleCopy = async () => {
    try {
      let textToCopy = codeText;
      
      // For diff language, remove the +/- prefixes when copying
      if (language === 'diff') {
        textToCopy = codeLines
          .map(line => {
            // Remove leading + or - (but keep lines that start with ++ or -- as they're part of diff headers)
            if (line.match(/^[+-](?![+-])/)) {
              return line.substring(1);
            }
            return line;
          })
          .join('\n');
      }
      
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };
  
  // Apply syntax highlighting
  useEffect(() => {
    if (typeof window !== "undefined" && window.Prism && window.Prism.languages[language]) {
      // Get highlighted HTML
      const highlighted = window.Prism.highlight(codeText, window.Prism.languages[language], language);
      setHighlightedHtml(highlighted);
    } else {
      // No highlighting available, use plain text
      setHighlightedHtml(codeText);
    }
  }, [codeText, language]);

  // Intersection observer for fade-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (blockRef.current) {
      observer.observe(blockRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Split code into lines for processing
  const codeLines = codeText.split("\n");
  const shouldBeCollapsible = collapsible && codeLines.length > 14;
  
  // Render lines with highlighting
  const renderCodeWithLineNumbers = () => {
    // Use original code lines for structure, apply highlighting per line
    return codeLines.map((line, index) => {
      const lineNumber = index + 1;
      const isHighlighted = highlightLines.includes(lineNumber);
      
      // Apply syntax highlighting to this specific line
      let highlightedLine = line;
      if (typeof window !== "undefined" && window.Prism && window.Prism.languages[language]) {
        highlightedLine = window.Prism.highlight(line, window.Prism.languages[language], language);
      }
      
      return (
        <tr
          key={lineNumber}
          className={`${isHighlighted ? "bg-yellow-500/5 border-l-4 border-yellow-500/50" : ""}`}
        >
          {showLineNumbers && (
            <td 
              className="text-gray-500 select-none pr-4 pl-4 text-right align-top"
              style={{ 
                width: "1%", 
                whiteSpace: "nowrap",
                userSelect: "none",
                opacity: 0.7
              }}
            >
              {lineNumber}
            </td>
          )}
          <td className="pl-4" style={{ whiteSpace: "nowrap" }}>
            <code className={className} style={{ background: "transparent", whiteSpace: "pre" }}>
              <span dangerouslySetInnerHTML={{ __html: highlightedLine || "&nbsp;" }} />
            </code>
          </td>
        </tr>
      );
    });
  };

  return (
    <div
      ref={blockRef}
      className={`my-8 rounded-lg overflow-hidden shadow-lg max-w-4xl border border-gray-700/50 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* Header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          {fileName && (
            <>
              {getFileIcon()}
              <span className="text-sm text-gray-300 font-mono">{fileName}</span>
            </>
          )}
          {!fileName && (
            <span className="text-sm text-blue-300 font-mono font-bold">{language}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {shouldBeCollapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded hover:bg-gray-700 transition-colors"
              aria-label={isCollapsed ? "Expand code" : "Collapse code"}
            >
              {isCollapsed ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              )}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-gray-700 transition-colors group"
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-200" />
            )}
          </button>
        </div>
      </div>

      {/* Code content */}
      <div
        className={`relative overflow-hidden transition-all duration-300 ${
          isCollapsed ? "max-h-[300px]" : ""
        }`}
      >
        <pre
          ref={codeRef}
          className={`${className} overflow-x-auto ${showLineNumbers ? "pl-0" : ""}`}
          style={{
            margin: 0,
            borderRadius: 0,
            background: "#1e1e1e",
            padding: showLineNumbers ? "1em 1em 1em 0" : "1em",
            whiteSpace: "pre",
            overflowX: "auto"
          }}
        >
          {showLineNumbers || highlightLines.length > 0 ? (
            <table style={{ borderCollapse: "collapse", width: "auto" }}>
              <tbody>
                {renderCodeWithLineNumbers()}
              </tbody>
            </table>
          ) : (
            <code className={className} dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
          )}
        </pre>
        
        {/* Gradient overlay for collapsed state */}
        {isCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#1e1e1e] to-transparent pointer-events-none" />
        )}
      </div>

      {/* Copy feedback */}
      {copied && (
        <div className="absolute top-14 right-4 bg-gray-900 text-green-400 px-3 py-1 rounded text-sm font-medium shadow-lg animate-fade-in-out">
          Copied!
        </div>
      )}
    </div>
  );
}