"use client";

import { useState, useEffect } from "react";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import { components } from "./MDXComponents";
import { remarkCodeMeta } from "@/lib/remark-code-meta";
import { rehypeCodeMeta } from "@/lib/rehype-code-meta";
// Removed rehype-prism-plus - now handled by CodeBlock component

// Prism types are declared in src/types/global.d.ts

interface MDXContentProps {
  source: string;
}

export default function MDXContent({ source }: MDXContentProps) {
  const [mdxSource, setMdxSource] = useState<unknown>(null);
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
            remarkPlugins: [remarkCodeMeta],
            rehypePlugins: [rehypeCodeMeta],
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
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <MDXRemote {...(mdxSource as any)} components={components} />
    </div>
  );
}