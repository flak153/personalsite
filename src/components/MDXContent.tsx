"use client";

import { useState, useEffect } from "react";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import { components } from "./MDXComponents";
import rehypePrism from "rehype-prism-plus";

// Define a global Prism type to avoid TypeScript errors
declare global {
  interface Window {
    Prism: {
      highlightAll: () => void;
    };
  }
}

interface MDXContentProps {
  source: string;
}

export default function MDXContent({ source }: MDXContentProps) {
  const [mdxSource, setMdxSource] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // First useEffect: Prepare MDX content
  useEffect(() => {
    async function prepareMDX() {
      try {
        setIsLoading(true);
        // Serialize the MDX content on the client-side
        const serialized = await serialize(source, {
          parseFrontmatter: true,
          mdxOptions: {
            rehypePlugins: [
              [rehypePrism, { 
                showLineNumbers: true,
                ignoreMissing: true, // Don't throw errors for missing language definitions
                aliases: {
                  // Common language aliases
                  js: 'javascript',
                  py: 'python',
                  rb: 'ruby',
                  ts: 'typescript',
                  sh: 'bash',
                  zsh: 'bash',
                  'c++': 'cpp'
                }
              }]
            ]
          }
        });
        setMdxSource(serialized);
        setError(null);
      } catch (err) {
        console.error("Error serializing MDX:", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    }

    prepareMDX();
  }, [source]);

  // Second useEffect: Highlight code blocks after render
  // This MUST be called on every render to maintain the order of hooks
  useEffect(() => {
    // Only highlight if we have content to highlight and Prism is available
    if (mdxSource && typeof window !== 'undefined' && window.Prism) {
      // Slight delay to ensure content is properly mounted
      const timer = setTimeout(() => {
        window.Prism.highlightAll();
      }, 50);
      
      return () => clearTimeout(timer); // Cleanup
    }
  }, [mdxSource]);

  // Render loading state
  if (isLoading) {
    return <div className="text-white">Loading content...</div>;
  }

  // Render error state
  if (error) {
    return (
      <div className="text-white">
        <p className="text-lg text-red-300 mb-4">Error rendering MDX: {error}</p>
        <div className="p-4 bg-black/30 rounded-lg">
          <pre className="text-xs text-white/70 whitespace-pre-wrap">{source.slice(0, 500)}...</pre>
        </div>
      </div>
    );
  }

  // Render empty state
  if (!mdxSource) {
    return <div className="text-white">No content available.</div>;
  }

  // Render content
  return (
    <div className="text-white">
      <MDXRemote {...mdxSource} components={components} />
    </div>
  );
}